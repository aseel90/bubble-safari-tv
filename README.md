# Bubble Safari TV | سفاري الفقاعات

لعبة عربية تعليمية للأطفال من عمر 2 إلى 5 سنوات، مصممة لشاشات Android TV والتحكم بالريموت، مع نسخة Web/PWA منشورة على GitHub Pages.

## الحالة الحالية

المشروع الآن في مرحلة **Release Candidate** بعد اكتمال مراحل الاستقرار، القصة، الهوية والتنظيف التقني. إصدار Android الحالي داخل المشروع هو:

- Package: `com.bubblesafari.tv`
- Version: `0.9.1-tv4`
- minSdk: 26
- targetSdk / compileSdk: 36

النسخة المنشورة على الويب:
`https://aseel90.github.io/bubble-safari-tv/`

## المحتوى

- مستويان عمريان:
  - 2–3 سنوات: 12 جولة.
  - 4–5 سنوات: 15 جولة.
- 4 عوالم: الغابة، المزرعة، البحر، ومدينة الفقاعات.
- تحديات الحيوانات، الألوان، الأشكال، الأرقام، الأحجام، المطابقة، والعنصر المختلف.
- نجوم، سلسلة إجابات صحيحة، أفضل نتيجة محفوظة محليًا، وشريط تقدم.
- رسومات SVG مخصصة للحيوانات والعوالم والواجهة.
- تحكم كامل بالأسهم / D-pad وOK / Enter وBack / Escape.

## قصة أرين والثعلب

القصة مكتملة من **27 مشهدًا ثابتًا** مع رواية صوتية عربية مستقلة لكل مشهد.

المشغل الحالي يستخدم **Split Layout متجاوب**:
- الصورة الكاملة في جهة مستقلة بدون قص.
- لوحة الراوية منفصلة.
- Pause / Resume.
- Replay Segment.
- Replay Story.
- العودة إلى مكتبة القصص.

تم تنفيذ QA متسلسل للمشاهد 1→27، مع فحص إضافي للمشاهد 2 و17 و18 و23 و27.

Scene 23 يستخدم الملف النهائي:
`arin-fox-23-fox-apology-v2.wav`

## الصوت

ملفات WAV العربية المستخدمة في اللعبة والقصة مدمجة مع نسخة Android TV، وتشمل:
- الحيوانات.
- الألوان.
- الأشكال.
- الأرقام.
- الأحجام.
- التعليمات والتغذية الراجعة.
- رواية القصة 27/27.

## Web / PWA / Offline

نسخة الويب Static ولا تحتاج build step للتشغيل.

Service Worker:
- يضع ملفات الواجهة الأساسية في Cache واضح الإصدار.
- يستخدم Network First للملفات الأساسية.
- يستخدم Cache First لصور القصة.
- يخزن الصوت عند الطلب.
- ينظف فقط كاشات Bubble Safari القديمة ولا يلمس كاشات مشاريع أخرى على نفس origin.

## Android TV

الـAndroid wrapper موجود داخل `android-tv/` ويشغّل ملفات اللعبة المدمجة داخل APK، لذلك النسخة الأساسية تعمل دون الاعتماد على GitHub Pages بعد التثبيت.

الخصائص:
- `LEANBACK_LAUNCHER`.
- Landscape + Immersive fullscreen.
- Touchscreen غير مطلوب.
- D-pad / OK / Back عبر WebView.
- App Icon وAndroid TV Banner مخصصان للعبة.
- أصول اللعبة والصوت والقصة مدمجة في APK.

## التحديث الداخلي OTA

تطبيق Android TV يفحص تلقائيًا:
`updates/manifest.json`

وعند وجود إصدار لعبة أحدث:
1. ينزّل `game-bundle.zip`.
2. يتحقق من SHA-256.
3. يفك الحزمة داخل staging نظيف.
4. يجهزها كتحديث pending.
5. عند إعادة فتح التطبيق يستبدل مجلد التحديث السابق بالكامل بالمجلد الجديد.

هذا يسمح بتحديث ملفات Web/game/story بدون حذف التطبيق أو إعادة تثبيته، ويحافظ على إعدادات المستخدم المخزنة محليًا.

التغييرات الأصلية الخاصة بالـAPK نفسه، مثل `MainActivity` أو Android Manifest أو App Icon/TV Banner، تحتاج APK أحدث يتم تثبيته فوق النسخة الحالية.

## بناء APK

GitHub Actions يحتوي على:
- **Android TV APK** لبناء وفحص `app-debug.apk`.
- **Publish Latest Android TV APK** لنشر أحدث APK اختبار.
- **Deploy Bubble Safari TV** لنشر نسخة GitHub Pages وحزمة OTA.

الـAPK المنشور حاليًا هو **Debug/Release Candidate للاختبار** وليس Final signed production release بعد.

للتثبيت عبر ADB:

```bash
adb install -r app-debug.apk
```

الخيار `-r` يحدث التطبيق فوق النسخة الموجودة ويحافظ على بياناته.

## تشغيل الويب محليًا

```bash
python -m http.server 8080
```

ثم افتح:
`http://localhost:8080`

## حالة الـRoadmap

- Phase 1 — Regression & integrity: ✅
- Phase 2 — Responsive story Split Layout: ✅
- Phase 3 — Story QA 1→27: ✅
- Phase 4 — Android TV branding: ✅
- Phase 5 — Conservative cleanup: ✅
- Phase 6 — Final technical cleanup: ✅
- Phase 7 — Final release validation/signing: ⏳
