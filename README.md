# Bubble Safari TV | سفاري الفقاعات

لعبة عربية تعليمية خفيفة للأطفال من عمر 2 إلى 5 سنوات، مصممة من البداية لشاشات Smart TV والتحكم بالريموت فقط.

> **Defold Native Prototype:** قرارات الانتقال إلى Native 2D، حالة الـAPK الحالية، ما يعمل وما لم يكتمل، وخطة المقارنة مع WebView موثقة في [`ROADMAP.md`](ROADMAP.md) على فرع `defold-native-prototype`.

## النسخة الحالية — v0.8

اللعبة منشورة مباشرة على GitHub Pages:
`https://aseel90.github.io/bubble-safari-tv/`

### التحكم

- الأسهم: التنقل المكاني بين العناصر.
- OK / Enter: اختيار.
- Back / Escape: رجوع للشاشة السابقة.
- التركيز ينتقل تلقائيًا بعد فتح اللعبة، الاختيار، الإجابة والرجوع.

### المحتوى

- مستويان عمريان:
  - 2–3 سنوات: 12 جولة في المغامرة.
  - 4–5 سنوات: 15 جولة في المغامرة.
- 4 عوالم: الغابة، المزرعة، البحر، ومدينة الفقاعات.
- أنواع تحديات متعددة: الحيوانات، الألوان، الأشكال، الأرقام، الأحجام، المطابقة، والعنصر المختلف.
- نجوم، سلسلة إجابات صحيحة، أفضل نتيجة محفوظة محليًا، وشريط تقدم بصري.
- رسومات SVG مخصصة داخل الكود بدون صور ثقيلة أو Emoji للنظام.
- واجهة 10-foot UI مناسبة للتلفزيون ودقات 960×540 و1280×720 و1920×1080.

### الأداء وOffline

- نسخة الويب Static بالكامل ولا تحتاج Build step.
- ملفات الواجهة واللعبة الأساسية صغيرة ويتم تحميل Modules بالتوازي عبر `modulepreload`.
- Service Worker بإصدارات Cache واضحة ويستخدم Cache-First لملفات اللعبة الثابتة.
- بعد أول تحميل، ملفات JavaScript/CSS الأساسية تعمل من الكاش مباشرة.
- PWA + Offline cache لملفات اللعبة الأساسية.

### الصوت

توجد حاليًا ملفات WAV عربية للحيوانات والألوان والأشكال والأرقام والأحجام وبعض رسائل التشجيع. العمل على الصوت لم يكتمل بعد وهو مؤجل لمرحلة لاحقة. أسئلة المطابقة و"العنصر المختلف" لا تطلب ملفات صوت غير موجودة حاليًا، لتجنب أخطاء 404 والتحميل غير الضروري.

## Android TV APK

يوجد الآن Wrapper أصلي لـ Android TV داخل `android-tv/` ويضم اللعبة نفسها داخل الـAPK، لذلك اللعب لا يعتمد على GitHub Pages أو اتصال إنترنت بعد التثبيت.

خصائص نسخة Android TV:

- Package: `com.bubblesafari.tv`
- Version: `0.8.0-tv1`
- minSdk: 26
- targetSdk / compileSdk: 36
- Landscape + Immersive fullscreen.
- `LEANBACK_LAUNCHER` وتطبيق مصنف كتطبيق TV حقيقي.
- شاشة لمس غير مطلوبة.
- دعم D-pad / OK / Back الأصلي عبر WebView.
- أصول اللعبة وملفات الصوت الحالية مدمجة داخل APK.

### بناء APK

GitHub Actions workflow باسم **Android TV APK** يبني `app-debug.apk` ثم يفحص تلقائيًا:

- package الصحيح.
- Leanback support.
- touchscreen غير مطلوب.
- `MainActivity` قابلة للإطلاق من Android TV launcher.
- وجود `index.html`, `game-v3.js`, `tv-nav.js` وملف صوت أساسي داخل APK.

آخر APK تم بناؤه وفحصه بنجاح في commit `333d95f`.

### تثبيت نسخة الاختبار

نزّل Artifact باسم `bubble-safari-tv-debug-apk` من آخر Workflow ناجح ثم فك الضغط. ستجد `app-debug.apk`.

بعد توصيل جهاز Android TV عبر ADB يمكنك تثبيته بـ:

```bash
adb install -r app-debug.apk
```

أو انقل `app-debug.apk` إلى Xiaomi TV Stick وثبته بعد السماح لتطبيق مدير الملفات بتثبيت التطبيقات غير المعروفة.

> هذه Debug APK للاختبار على الجهاز الحقيقي. التوقيع النهائي/Release يأتي بعد اختبار Xiaomi TV Stick.

## تشغيل نسخة الويب محليًا

افتح المشروع عبر أي static web server، مثل:

```bash
python -m http.server 8080
```

ثم افتح `http://localhost:8080`.

## النشر

نسخة الويب منشورة من فرع `main` على GitHub Pages. Android TV APK يُبنى تلقائيًا عبر GitHub Actions عند تغيير ملفات اللعبة أو `android-tv/`.

## الخطوات القادمة

1. بالنسبة للمسار الحالي Defold Native، اتبع [`ROADMAP.md`](ROADMAP.md) على فرع `defold-native-prototype`؛ اختبار Xiaomi والـbenchmark مؤجل حاليًا.
2. لا يتم نقل اللعبة كاملة قبل قرار Go/No-Go المبني على مقارنة الجهاز الحقيقي.
3. نسخة WebView الحالية تبقى baseline سليمة للمقارنة.
