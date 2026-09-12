# Bubble Safari TV — Project Roadmap

هذا الملف هو المرجع الحالي لقرار الانتقال من WebView إلى Native 2D واختبار Defold داخل نفس المستودع.

## القرار التقني الحالي

- المسار الأول: **Defold Native 2D**.
- الخطة B: **Godot Compatibility**.
- الخطة C: **libGDX**.
- لا يتم نقل اللعبة كاملة قبل إثبات جدوى Defold على جهاز Xiaomi TV Stick الحقيقي.
- نسخة WebView الحالية تبقى سليمة ولا يتم استبدالها أثناء مرحلة الـPrototype.
- تطوير Defold يتم على الفرع `defold-native-prototype` وليس على `main`.

## حالة الـPrototype الحالية

المجلد: `defold-prototype/`

الحزمة: `com.bubblesafari.tv.defold`

الغرض من اختلاف الحزمة هو السماح بتثبيت Defold ونسخة WebView معًا على نفس جهاز Android TV للمقارنة A/B.

تم بناء APK فعلي بنجاح عبر GitHub Actions:

`defold-prototype/dist/bubble-safari-defold-prototype.apk`

SHA-256 الحالي:

`8ba34a78c1aca0f4dd8d28e33cffb06c43324570acbc4b576cd373d44e476ad3`

هذا يعني أن مرحلة **التجميع/build** نجحت. هذا لا يعني أن اختبار الجهاز الحقيقي أو اختبار الأداء قد تم.

## ماذا يجب أن يظهر عند تشغيل APK الحالي

الـAPK الحالي هو **شريحة اختبار Native لعالم البحر فقط**، وليس اللعبة الكاملة.

عند التشغيل المتوقع:

1. يفتح التطبيق في Landscape/Fullscreen كتطبيق Android TV مستقل.
2. تظهر شاشة Defold Native داكنة بعنوان `BUBBLE SAFARI - OCEAN NATIVE`.
3. يظهر سؤال واحد في الأعلى مع عداد مثل `1 / 3`.
4. تظهر ثلاث فقاعات اختيار كبيرة في منتصف الشاشة.
5. تبدأ الفقاعة الأولى في حالة Focus واضحة ومكبرة قليلًا.
6. الريموت:
   - Left / Up: الانتقال إلى الاختيار السابق.
   - Right / Down: الانتقال إلى الاختيار التالي.
   - OK / Enter: اعتماد الاختيار.
   - Back: فتح/إغلاق Settings البسيطة.
7. عند الإجابة الصحيحة:
   - تظهر طبقة `أحسنت!`.
   - يظهر Confetti خفيف Native.
   - يعمل صوت `feedback_welldone.wav` إذا كان الصوت مفعّلًا.
   - بعد حوالي 0.85 ثانية ينتقل للسؤال التالي.
8. عند الإجابة الخاطئة:
   - تهتز الفقاعة المحددة حركة قصيرة.
   - يبقى السؤال نفسه بدون تقدم.
9. بعد السؤال الثالث يعود التسلسل إلى السؤال الأول؛ لا توجد شاشة نهاية في هذا الـPrototype.

## الأسئلة الثلاثة الحالية

### 1. Animal

السؤال: `اختر السمكة`

الخيارات:
- سمكة — الصحيح.
- سلحفاة.
- سلطعون.

### 2. Size

السؤال: `اختر الكبير`

الخيارات:
- صغير.
- كبير — الصحيح.
- صغير.

### 3. Color

السؤال: `اختر الأزرق`

الخيارات:
- أصفر.
- أحمر.
- أزرق — الصحيح.

## الصوت — الحالة الفعلية الآن

تم تجهيز وضم موارد صوتية للسؤال والاختيارات التالية:

- fish / turtle / crab
- big / small
- blue / red / yellow
- prompt_choose_picture
- feedback_welldone

لكن **منطق الشاشة الحالي يشغّل صوت النجاح `feedback_welldone` فقط**.

أصوات السؤال والاختيارات موجودة كموارد داخل مشروع Defold، لكنها لم تُوصل بعد إلى `main.gui_script`. يجب عدم اعتبار قراءة السؤال بصوت Leda مكتملة حتى يتم توصيل هذا المنطق.

## Settings الحالية

زر Back يفتح Overlay بسيط للإعدادات.

الخيار الوحيد حاليًا هو Sound ON/OFF، ويتم تبديله بزر OK.

هذه ليست شاشة إعدادات اللعبة النهائية.

## Telemetry الموجودة داخل الـPrototype

الكود يطبع أحداثًا تبدأ بـ `BS_METRIC` لتسهيل القياس لاحقًا، ومنها:

- `native_ready`
- `focus_changed`
- `question_visible`
- `question_transition`
- `answer`
- `input`
- `slow_frame`
- `runtime_sample`
- `session_end`

هذه Telemetry جاهزة للاستخدام في الاختبار لاحقًا، لكنها لا تعني أن الأرقام قد جُمعت من Xiaomi حتى الآن.

## ما ليس موجودًا في APK الحالي

هذا مهم حتى لا نخلط الـPrototype مع اللعبة النهائية:

- لا توجد شاشة Home الكاملة.
- لا يوجد اختيار العمر.
- لا يوجد اختيار العوالم.
- لا توجد العوالم الأربعة.
- لا توجد جميع أنواع الأسئلة.
- لا توجد الحيوانات كرسومات/Textures نهائية بعد؛ الواجهة الحالية تستخدم GUI primitives ونصوصًا بسيطة.
- لا يوجد نظام النجوم/السلسلة/أفضل نتيجة الكامل.
- لا توجد شاشة Finish النهائية.
- لا يوجد حفظ تقدم اللعبة الكامل.
- لا يوجد Port كامل لـWebView.
- أصوات السؤال والاختيارات لم تُربط بالمنطق بعد.
- دعم وعرض العربية على الخط المدمج يحتاج تحققًا بصريًا على الجهاز الحقيقي.

## Android TV

تمت إضافة Manifest merge خاص بالـTV بدل استبدال Manifest Defold الأساسي بالكامل.

المقصود منه:

- `LEANBACK_LAUNCHER`.
- عدم اشتراط Touchscreen.
- Landscape.
- ظهور التطبيق كتطبيق TV مستقل.

البناء نجح، لكن الظهور الفعلي في Launcher وسلوك Back/DPAD على Xiaomi يبقيان ضمن اختبار الجهاز الحقيقي المؤجل.

## مرحلة البناء

تمت إضافة:

- `defold-prototype/build_android.sh`
- GitHub Actions workflow لبناء الـPrototype.
- Build reports بصيغة JSON/HTML.
- إخراج APK مستقل.
- دعم `armv7-android` و`arm64-android` في البناء الحالي.

أثناء أول build تم إصلاح مشكلتين فعليتين:

1. عدم استخدام مجلد Defold الداخلي `build/` كوجهة للـAPK.
2. تحديث مرجع الخط المدمج إلى `/builtins/fonts/default.font` المتوافق مع Defold الحالي.

## Benchmark — مؤجل حاليًا

تم تجهيز البنية، لكن **لم يتم تشغيلها على Xiaomi TV Stick بعد**.

الأوامر المخطط لها لاحقًا:

```bash
bash ./benchmark_tv.sh webview
bash ./benchmark_tv.sh defold
python3 benchmark/compare.py
```

المخرجات:

- `benchmark-results/webview/`
- `benchmark-results/defold/`
- `benchmark-results/comparison/`

المقاييس المستهدفة:

- Cold startup.
- Warm startup.
- Frame P50/P95/P99.
- FPS / slow / janky frames.
- Frame pacing.
- CPU average/peak.
- RAM/PSS average/peak.
- GC/spikes.
- Question transition.
- Defold internal telemetry.
- GPU metrics إن كان الجهاز/Android يوفرها بشكل موثوق.

اختبار input-to-photon الحقيقي لا يتم الادعاء بقياسه من `BS_METRIC input`؛ القياس الحالي هو وقت handler داخل التطبيق فقط.

## بوابة Go / No-Go

لا يبدأ نقل اللعبة كاملة إلى Defold إلا بعد الاختبار الفعلي على Xiaomi TV Stick.

نستمر في Defold إذا أثبت تحسنًا واضحًا في مجموعة من:

- ثبات Frame pacing.
- Startup.
- CPU.
- RAM/PSS.
- الاستجابة بالريموت.
- عدم وجود مشاكل TV-specific أو Arabic/audio blockers كبيرة.

إذا لم يظهر تحسن عملي واضح مقارنة بالـWebView، لا ننقل اللعبة كاملة وننتقل لتقييم الخطة B بدل إكمال Migration مكلف بلا فائدة.

## المراحل التالية بعد الـPrototype

### Phase 1 — إكمال Slice قبل القياس

- توصيل صوت Leda للسؤال والاختيار.
- إضافة Texture/Atlas حقيقي لثلاثة حيوانات بحرية بدل النص فقط.
- تثبيت خط عربي مناسب والتأكد من shaping/rendering.
- تحسين Settings البسيطة.
- إبقاء البيانات خارج Lua قدر الإمكان.

### Phase 2 — Xiaomi validation

مؤجلة حاليًا بطلب صاحب المشروع.

عند البدء بها:

- تثبيت WebView وDefold جنبًا إلى جنب.
- فحص Launcher وD-pad/OK/Back والصوت والعربية.
- تشغيل 5 cold + 5 warm على كل نسخة.
- إخراج مقارنة موحدة.

### Phase 3 — قرار المحرك

- Defold ينجح: نخطط لنقل اللعبة على مراحل.
- النتيجة متقاربة أو أسوأ: نوقف النقل ونقيّم Godot Compatibility ثم libGDX.

## قاعدة المشروع أثناء هذه المرحلة

`main` يمثل النسخة الحالية المستقرة.

أي عمل خاص بالـPrototype Native يبقى على `defold-native-prototype` حتى اكتمال التقييم واتخاذ قرار واضح.