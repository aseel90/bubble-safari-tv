package com.bubblesafari.tv;

import android.app.Activity;
import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;

import androidx.webkit.WebViewAssetLoader;

import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public final class MainActivity extends Activity {
    private static final String TAG = "BubbleSafariTV";
    private static final String ASSET_HOST = "appassets.androidplatform.net";
    private static final String BUNDLED_URL = "https://" + ASSET_HOST + "/assets/index.html";
    private static final String UPDATED_URL = "https://" + ASSET_HOST + "/update/index.html";
    private static final String UPDATE_MANIFEST_URL = "https://aseel90.github.io/bubble-safari-tv/updates/manifest.json";
    private static final String UPDATE_BUNDLE_URL = "https://aseel90.github.io/bubble-safari-tv/updates/game-bundle.zip";
    private static final String ACTIVE_DIR = "game-update-active";
    private static final String PENDING_DIR = "game-update-pending";
    private static final String STAGING_DIR = "game-update-staging";
    private static final String BACKUP_DIR = "game-update-backup";
    private static final String VERSION_FILE = ".bubble-safari-version";
    private static final long MAX_MANIFEST_BYTES = 64 * 1024L;
    private static final long MAX_ZIP_BYTES = 50 * 1024 * 1024L;
    private static final long MAX_UNPACKED_BYTES = 100 * 1024 * 1024L;

    private final ExecutorService updateExecutor = Executors.newSingleThreadExecutor();
    private WebView webView;
    private WebViewAssetLoader assetLoader;
    private OnBackInvokedCallback backCallback;
    private File activeUpdateDir;
    private volatile boolean updateCheckStarted;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        enterImmersiveMode();
        prepareUpdateDirectories();
        activatePendingUpdate();
        createWebView();
        checkForGameUpdateAsync();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            backCallback = this::handleBack;
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                    backCallback
            );
        }
    }

    private void prepareUpdateDirectories() {
        activeUpdateDir = new File(getFilesDir(), ACTIVE_DIR);
        if (!activeUpdateDir.exists() && !activeUpdateDir.mkdirs()) {
            Log.w(TAG, "Could not create active update directory");
        }
    }

    private void activatePendingUpdate() {
        File pending = new File(getFilesDir(), PENDING_DIR);
        if (!isValidGameDirectory(pending)) return;
        File backup = new File(getFilesDir(), BACKUP_DIR);
        deleteRecursively(backup);
        File[] activeFiles = activeUpdateDir.listFiles();
        boolean hadActive = activeFiles != null && activeFiles.length > 0;
        if (hadActive && !activeUpdateDir.renameTo(backup)) return;
        if (!pending.renameTo(activeUpdateDir)) {
            if (hadActive && backup.exists()) backup.renameTo(activeUpdateDir);
            return;
        }
        deleteRecursively(backup);
        Log.i(TAG, "Activated game update " + readVersion(activeUpdateDir));
    }

    private void createWebView() {
        assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .addPathHandler("/update/", new WebViewAssetLoader.InternalStoragePathHandler(this, activeUpdateDir))
                .build();

        webView = new WebView(this);
        webView.setBackgroundColor(Color.BLACK);
        webView.setFocusable(true);
        webView.setFocusableInTouchMode(true);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString(settings.getUserAgentString() + " BubbleSafariTV/0.8-ota");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) settings.setSafeBrowsingEnabled(true);
        boolean debuggable = (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        WebView.setWebContentsDebuggingEnabled(debuggable);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                return !ASSET_HOST.equalsIgnoreCase(uri.getHost());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                view.requestFocus();
                enterImmersiveMode();
            }

            @Override
            public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                view.post(MainActivity.this::recreate);
                return true;
            }
        });
        setContentView(webView);
        webView.loadUrl(isValidGameDirectory(activeUpdateDir) ? UPDATED_URL : BUNDLED_URL);
    }

    private void checkForGameUpdateAsync() {
        if (updateCheckStarted) return;
        updateCheckStarted = true;
        updateExecutor.execute(() -> {
            try {
                UpdateManifest manifest = fetchManifest();
                String activeVersion = readVersion(activeUpdateDir);
                File pending = new File(getFilesDir(), PENDING_DIR);
                if (manifest.version.equals(activeVersion) || manifest.version.equals(readVersion(pending))) return;
                downloadAndStageUpdate(manifest);
                Log.i(TAG, "Game update downloaded for next launch: " + manifest.version);
            } catch (Exception error) {
                Log.w(TAG, "Game update check failed; current game remains available", error);
            }
        });
    }

    private UpdateManifest fetchManifest() throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(
                UPDATE_MANIFEST_URL + "?t=" + System.currentTimeMillis()).openConnection();
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(8000);
        connection.setUseCaches(false);
        connection.setRequestProperty("Cache-Control", "no-cache");
        connection.setRequestProperty("Accept", "application/json");
        try {
            if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) throw new IOException("Manifest HTTP error");
            JSONObject json = new JSONObject(new String(
                    readLimited(connection.getInputStream(), MAX_MANIFEST_BYTES), StandardCharsets.UTF_8));
            String version = json.getString("version").trim();
            String sha256 = json.getString("sha256").trim().toLowerCase(Locale.US);
            if (version.isEmpty() || !sha256.matches("[0-9a-f]{64}")) throw new IOException("Invalid update manifest");
            return new UpdateManifest(version, sha256);
        } finally {
            connection.disconnect();
        }
    }

    private void downloadAndStageUpdate(UpdateManifest manifest) throws Exception {
        File zipFile = new File(getCacheDir(), "bubble-safari-update.zip");
        File staging = new File(getFilesDir(), STAGING_DIR);
        File pending = new File(getFilesDir(), PENDING_DIR);
        deleteRecursively(staging);
        if (!staging.mkdirs()) throw new IOException("Could not create staging directory");
        try {
            downloadFile(UPDATE_BUNDLE_URL + "?v=" + manifest.version, zipFile, MAX_ZIP_BYTES);
            if (!manifest.sha256.equals(sha256(zipFile))) throw new IOException("Update checksum mismatch");
            unzipSafely(zipFile, staging, MAX_UNPACKED_BYTES);
            if (!isValidGameDirectory(staging)) throw new IOException("Update bundle is incomplete");
            writeVersion(staging, manifest.version);
            deleteRecursively(pending);
            if (!staging.renameTo(pending)) throw new IOException("Could not stage pending update");
        } finally {
            zipFile.delete();
            deleteRecursively(staging);
        }
    }

    private static void downloadFile(String urlString, File target, long maxBytes) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(urlString).openConnection();
        connection.setConnectTimeout(7000);
        connection.setReadTimeout(15000);
        connection.setUseCaches(false);
        connection.setRequestProperty("Cache-Control", "no-cache");
        try {
            if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) throw new IOException("Bundle HTTP error");
            long declaredLength = connection.getContentLengthLong();
            if (declaredLength > maxBytes) throw new IOException("Update bundle is too large");
            long total = 0;
            byte[] buffer = new byte[32 * 1024];
            try (InputStream input = new BufferedInputStream(connection.getInputStream());
                 BufferedOutputStream output = new BufferedOutputStream(new FileOutputStream(target))) {
                int read;
                while ((read = input.read(buffer)) != -1) {
                    total += read;
                    if (total > maxBytes) throw new IOException("Update bundle exceeded size limit");
                    output.write(buffer, 0, read);
                }
            }
        } finally {
            connection.disconnect();
        }
    }

    private static void unzipSafely(File zipFile, File destination, long maxUnpackedBytes) throws Exception {
        String destinationPath = destination.getCanonicalPath() + File.separator;
        long total = 0;
        byte[] buffer = new byte[32 * 1024];
        try (ZipInputStream input = new ZipInputStream(new BufferedInputStream(new FileInputStream(zipFile)))) {
            ZipEntry entry;
            while ((entry = input.getNextEntry()) != null) {
                File outFile = new File(destination, entry.getName());
                if (!outFile.getCanonicalPath().startsWith(destinationPath)) throw new IOException("Unsafe update path");
                if (entry.isDirectory()) {
                    if (!outFile.exists() && !outFile.mkdirs()) throw new IOException("Could not create update directory");
                } else {
                    File parent = outFile.getParentFile();
                    if (parent != null && !parent.exists() && !parent.mkdirs()) throw new IOException("Could not create parent");
                    try (BufferedOutputStream output = new BufferedOutputStream(new FileOutputStream(outFile))) {
                        int read;
                        while ((read = input.read(buffer)) != -1) {
                            total += read;
                            if (total > maxUnpackedBytes) throw new IOException("Unpacked update exceeded size limit");
                            output.write(buffer, 0, read);
                        }
                    }
                }
                input.closeEntry();
            }
        }
    }

    private static String sha256(File file) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] buffer = new byte[32 * 1024];
        try (InputStream input = new BufferedInputStream(new FileInputStream(file))) {
            int read;
            while ((read = input.read(buffer)) != -1) digest.update(buffer, 0, read);
        }
        StringBuilder result = new StringBuilder(64);
        for (byte value : digest.digest()) result.append(String.format(Locale.US, "%02x", value));
        return result.toString();
    }

    private static byte[] readLimited(InputStream inputStream, long maxBytes) throws IOException {
        try (InputStream input = new BufferedInputStream(inputStream); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            long total = 0;
            int read;
            while ((read = input.read(buffer)) != -1) {
                total += read;
                if (total > maxBytes) throw new IOException("Response exceeded size limit");
                output.write(buffer, 0, read);
            }
            return output.toByteArray();
        }
    }

    private static boolean isValidGameDirectory(File directory) {
        return directory != null && new File(directory, "index.html").isFile()
                && new File(directory, "game-v3.js").isFile()
                && new File(directory, "tv-nav.js").isFile();
    }

    private static String readVersion(File directory) {
        if (directory == null) return "";
        File versionFile = new File(directory, VERSION_FILE);
        if (!versionFile.isFile()) return "";
        try (InputStream input = new FileInputStream(versionFile)) {
            return new String(readLimited(input, 512), StandardCharsets.UTF_8).trim();
        } catch (Exception ignored) {
            return "";
        }
    }

    private static void writeVersion(File directory, String version) throws IOException {
        try (FileOutputStream output = new FileOutputStream(new File(directory, VERSION_FILE))) {
            output.write(version.getBytes(StandardCharsets.UTF_8));
        }
    }

    private static void deleteRecursively(File file) {
        if (file == null || !file.exists()) return;
        if (file.isDirectory()) {
            File[] children = file.listFiles();
            if (children != null) for (File child : children) deleteRecursively(child);
        }
        file.delete();
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (event.getAction() == KeyEvent.ACTION_DOWN && webView != null) {
            switch (event.getKeyCode()) {
                case KeyEvent.KEYCODE_DPAD_UP: sendWebKey("ArrowUp", 38); return true;
                case KeyEvent.KEYCODE_DPAD_DOWN: sendWebKey("ArrowDown", 40); return true;
                case KeyEvent.KEYCODE_DPAD_LEFT: sendWebKey("ArrowLeft", 37); return true;
                case KeyEvent.KEYCODE_DPAD_RIGHT: sendWebKey("ArrowRight", 39); return true;
                case KeyEvent.KEYCODE_DPAD_CENTER:
                case KeyEvent.KEYCODE_ENTER:
                case KeyEvent.KEYCODE_NUMPAD_ENTER:
                case KeyEvent.KEYCODE_BUTTON_A: sendWebKey("Enter", 13); return true;
                case KeyEvent.KEYCODE_BACK:
                    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) { handleBack(); return true; }
                    break;
                default: break;
            }
        }
        return super.dispatchKeyEvent(event);
    }

    private void sendWebKey(String key, int legacyCode) {
        if (webView == null) return;
        String script = "document.dispatchEvent(new KeyboardEvent('keydown',{key:'" + key
                + "',code:'" + key + "',keyCode:" + legacyCode + ",which:" + legacyCode
                + ",bubbles:true,cancelable:true}));";
        webView.evaluateJavascript(script, null);
    }

    private void handleBack() {
        if (webView == null) { finish(); return; }
        String script = "(function(){const s=document.querySelector('.screen.screen-active');const id=s&&s.id;"
                + "if(!id||id==='homeScreen')return 'exit';"
                + "document.dispatchEvent(new KeyboardEvent('keydown',{key:'BrowserBack',code:'BrowserBack',keyCode:4,which:4,bubbles:true,cancelable:true}));return id;})()";
        webView.evaluateJavascript(script, result -> {
            if ("\"exit\"".equals(result)) finish();
            else if (webView != null) webView.postDelayed(webView::requestFocus, 40);
        });
    }

    private void enterImmersiveMode() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) enterImmersiveMode();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
        enterImmersiveMode();
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        updateExecutor.shutdownNow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && backCallback != null) {
            getOnBackInvokedDispatcher().unregisterOnBackInvokedCallback(backCallback);
        }
        if (webView != null) {
            webView.stopLoading();
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    private static final class UpdateManifest {
        final String version;
        final String sha256;
        UpdateManifest(String version, String sha256) {
            this.version = version;
            this.sha256 = sha256;
        }
    }
}
