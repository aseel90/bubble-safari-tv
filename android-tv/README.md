# Bubble Safari — Android TV

هذا المجلد يحتوي Wrapper أصلي خفيف لتشغيل Bubble Safari كتطبيق Android TV مستقل وOffline.

## المواصفات

- Application ID: `com.bubblesafari.tv`
- Version: `0.8.0-tv1`
- minSdk: 26
- targetSdk / compileSdk: 36
- Java 17
- Android Gradle Plugin 9.4.0
- Gradle 9.6
- AndroidX WebKit + `WebViewAssetLoader`

اللعبة لا تُفتح من الإنترنت داخل التطبيق. مهمة Gradle `syncWebAssets` تنسخ ملفات اللعبة الحالية من جذر المستودع إلى أصول APK عند كل Build.

## Android TV

`AndroidManifest.xml` يعلن:

- `android.software.leanback` مطلوب.
- `android.hardware.touchscreen` غير مطلوب.
- `LEANBACK_LAUNCHER`.
- Landscape orientation.
- TV banner + launcher icon.

`MainActivity` يحول D-pad / OK / Back إلى نفس أحداث لوحة المفاتيح التي تستخدمها نسخة الويب، ويشغّل WebView بملء الشاشة مع إبقاء الشاشة مستيقظة أثناء اللعب.

## Build

من جذر المستودع، مع Android SDK 36 وGradle 9.6:

```bash
gradle -p android-tv :app:assembleDebug
```

الملف الناتج:

```text
android-tv/app/build/outputs/apk/debug/app-debug.apk
```

## CI Verification

Workflow `Android TV APK` يبني الـAPK ويفحص metadata والأصول المدمجة قبل رفع Artifact. آخر Build موثق ناجح للحزمة الحالية هو commit `333d95f`.

## Install

بعد توصيل جهاز Android TV عبر ADB:

```bash
adb install -r android-tv/app/build/outputs/apk/debug/app-debug.apk
```

أو استخدم Artifact من GitHub Actions، فك الضغط ثم ثبّت `app-debug.apk` يدويًا على التلفزيون.

## ما يجب اختباره على Xiaomi TV Stick

- ظهور التطبيق في TV launcher.
- تشغيل Home screen بملء الشاشة.
- الأسهم وOK في كل الشاشات.
- Back: Game → World → Age → Home، ثم الخروج من Home.
- 12 جولة لعمر 2–3 و15 جولة لعمر 4–5.
- الصوت وكتمه وإعادة السماع عند توفر الملف.
- Pause/Resume وإعادة فتح التطبيق.
- عدم وجود Scroll أو قص على دقة التلفزيون الفعلية.
