# Bubble Safari TV — Project Roadmap

هذا الملف هو المرجع الحالي لقرار الانتقال من WebView إلى Native 2D واختبار Defold داخل نفس المستودع.

## القرار التقني الحالي

- المسار الأول: **Defold Native 2D**.
- الخطة B: **Godot Compatibility**.
- الخطة C: **libGDX**.
- لا يتم نقل اللعبة كاملة قبل إثبات جدوى Defold على جهاز Xiaomi TV Stick الحقيقي.
- نسخة WebView الحالية تبقى سليمة ولا يتم استبدالها أثناء مرحلة الـPrototype.
- تطوير Defold يتم على الفرع `defold-native-prototype` وليس على `main`.

## حالة الـPrototype

المجلد: `defold-prototype/`

الحزمة: `com.bubblesafari.tv.defold`

الحزمة مختلفة عن WebView حتى يمكن تثبيت النسختين معًا على Android TV للمقارنة.

النسخة الحالية بعد دمج Telemetry المباشرة:

- Defold project version: `0.1.1`
- Android `versionCode`: `2`
- APK: `defold-prototype/dist/bubble-safari-defold-prototype.apk`
- SHA-256: `81d12e0e02795da73d41196e8447a53baf5b16d5293ae6b753fbc03f2f8e20df`

تم بناء الـAPK بنجاح عبر GitHub Actions. نجاح البناء لا يعني أن اختبار Xiaomi الفعلي قد تم.

## هدف هذه النسخة

هذه ليست اللعبة الكاملة. هدفها الإجابة عن سؤال واحد:

**هل Defold Native أفضل عمليًا من WebView لهذه اللعبة على Xiaomi TV Stick ضعيف؟**

نريد قياس:

- سلاسة Frame pacing.
- frame P50/P95/P99.
- slow-frame spikes.
- استجابة D-pad/OK داخل التطبيق.
- سرعة انتقال السؤال.
- startup الداخلي.
- Lua heap/GC.
- استقرار التطبيق أثناء الاستخدام.

ثم نقرر Go/No-Go قبل نقل بقية اللعبة.

## ماذا يظهر داخل الـPrototype

- شاشة Native لعالم البحر فقط.
- 3 فقاعات اختيار.
- سؤال حيوان: `اختر السمكة`.
- سؤال حجم: `اختر الكبير`.
- سؤال لون: `اختر الأزرق`.
- D-pad للتنقل.
- OK للاختيار.
- Back لفتح Settings البسيطة.
- Focus animation.
- `أحسنت!` + Confetti عند الإجابة الصحيحة.
- صوت النجاح الحالي.

لا توجد Home الكاملة أو اختيار العمر أو جميع العوالم أو جميع أنواع الأسئلة في هذه المرحلة.

## Direct Cloudflare Telemetry — بدون كمبيوتر

تم إلغاء الاعتماد على الكمبيوتر/ADB كمسار أساسي لجمع تقارير Defold.

الـAPK نفسه يرسل تقارير Cumulative عبر HTTPS مباشرة من Xiaomi TV Stick إلى Cloudflare Worker:

`https://bubble-safari-benchmark-ingest.aseelsalah266.workers.dev/report`

Worker الحالي:

`bubble-safari-benchmark-ingest`

قاعدة البيانات:

`bubble-safari-benchmarks` على Cloudflare D1.

المسار:

**Xiaomi TV Stick → Defold APK → HTTPS → Cloudflare Worker → D1**

لا يحتاج المستخدم إلى فتح ملفات أو JSON أو تشغيل ADB أو استخدام كمبيوتر.

### توقيت الإرسال

- تقرير بعد بداية الجلسة بحوالي ثانية.
- تقرير Cumulative كل 15 ثانية.
- محاولة best-effort عند نهاية الجلسة.
- إذا فشل الإنترنت، يحتفظ التطبيق بآخر تقرير فاشل محليًا ويحاول إرساله في التشغيل التالي.

### البيانات المرسلة

- session/install pseudonymous IDs لا تعتمد على Android hardware ID.
- Manufacturer / device model.
- Android system/API version.
- لغة الجهاز/المنطقة.
- Defold engine version.
- app/package version.
- internal startup time.
- frame count / average / P50 / P95 / P99 / max.
- estimated FPS.
- slow frames فوق 16.67ms و25ms.
- input handler average/P95/max.
- question-transition average/P95/max.
- answer counts.
- focus changes / questions visible / settings opens.
- Lua heap/GC start/current/peak/delta.

Frame percentiles تُحسب بهيستوغرام بدقة `0.5ms` لتقليل تكلفة القياس وتأثيره على الأداء.

### ما لا تدعي Telemetry الداخلية قياسه

التقرير الداخلي الحالي لا يدعي قياس:

- Android process PSS/RAM الكامل.
- CPU process average/peak من مستوى النظام.
- GPU counters/SurfaceFlinger.
- input-to-photon latency الحقيقي.

هذه تحتاج Android native/OS instrumentation أعمق أو ADB. يمكن إضافتها لاحقًا إذا احتجنا دقة أعلى، لكن المسار الحالي يكفي لبدء تقييم Defold من الجهاز نفسه بلا كمبيوتر.

## Cloudflare — الحالة الحالية

- Worker منشور على `workers.dev`.
- D1 database موجودة.
- جدول `reports` موجود.
- عند آخر تحقق قبل اختبار الجهاز: عدد التقارير `0`.

بالتالي أول تقارير تظهر لاحقًا يمكن نسبها بسهولة إلى تشغيل الـAPK على الجهاز الحقيقي.

## الصوت — الحالة الحالية

موارد Leda التالية موجودة في المشروع:

- fish / turtle / crab
- big / small
- blue / red / yellow
- prompt_choose_picture
- feedback_welldone

لكن الموصول فعليًا بمنطق اللعب حاليًا هو صوت `feedback_welldone` فقط. توصيل قراءة السؤال والاختيارات ما زال ضمن Phase 1.

## Android TV

Manifest الخاص بالـPrototype يحتوي على:

- `LEANBACK_LAUNCHER`.
- touchscreen غير مطلوب.
- Internet permission لإرسال Telemetry.
- package مستقل لنسخة Defold.

## Build pipeline

تم تجهيز:

- `defold-prototype/build_android.sh`
- GitHub Actions build.
- build report JSON/HTML.
- APK universal يحتوي armv7 + arm64.
- نشر الـAPK الناتج إلى `defold-prototype/dist/` على فرع الـPrototype.

## ADB benchmark

أدوات ADB القديمة تبقى موجودة كمسار قياس أعمق اختياري:

- `benchmark_tv.sh`
- `benchmark/parse_run.py`
- `benchmark/aggregate.py`
- `benchmark/compare.py`

لكنها **ليست مطلوبة** لجمع Telemetry الأساسية من Defold الآن.

قد نستخدمها لاحقًا فقط إذا احتجنا PSS/CPU/GPU/cold-start النظامية بدقة أعلى.

## Phase 1 — إكمال Slice

- توصيل صوت Leda للسؤال والاختيار.
- Texture/Atlas حقيقي للحيوانات بدل النصوص فقط.
- تثبيت خط عربي مناسب والتحقق من shaping/rendering.
- حفظ Settings بشكل دائم.
- إبقاء بيانات اللعبة خارج Lua قدر الإمكان.

## Phase 2 — Xiaomi validation

عند تثبيت النسخة الحالية على Xiaomi:

1. فتح التطبيق واللعب طبيعيًا بالريموت.
2. إبقاءه مفتوحًا مدة كافية لتصل عدة تقارير دورية.
3. لا حاجة لكمبيوتر أو ADB.
4. قراءة تقارير D1 وتحليلها.
5. تكرار الجلسات حتى نحصل على عينة مستقرة.

اختبار WebView يحتاج لاحقًا Telemetry مماثلة أو مسار ADB حتى تكون المقارنة A/B عادلة.

## Phase 3 — Go / No-Go

نستمر في Defold إذا ظهر تحسن عملي واضح في الأداء والاستقرار والاستجابة مع عدم وجود blockers كبيرة في Android TV أو العربية أو الصوت.

إذا كانت النتيجة متقاربة أو أسوأ من WebView، لا ننقل اللعبة كاملة ونقيّم Godot Compatibility ثم libGDX.

## قاعدة المشروع

`main` يبقى النسخة الحالية المستقرة.

كل عمل خاص بالـPrototype Native يبقى على `defold-native-prototype` حتى اكتمال التقييم واتخاذ قرار واضح.