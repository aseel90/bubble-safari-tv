# Bubble Safari — Story Production Roadmap

> المرجع الرسمي لإنتاج القصص المصورة والمسموعة في Bubble Safari.
>
> الهدف: تكرار الطريقة التي نجحت في قصة **أرين والثعلب**، وتجنب أخطاء ثبات الشخصيات، توليد الصور، تقطيع الصوت، تضخم حجم التطبيق، عدم تزامن الصورة والصوت، ونسيان ملفات القصة داخل APK/OTA.

---

## 1. قاعدة العمل الأساسية

إنتاج أي قصة جديدة يمر بهذا التسلسل فقط:

**Script → Scene Plan → Character Masters in ChatGPT → Scene Images in ChatGPT → Story Audio in Google AI Studio / Leda → Per-scene Runtime Assets → WebP Optimization → Integration → Full QA → APK/OTA Validation**

لا نبدأ الصور قبل تثبيت النص والمشاهد، ولا نبدأ الدمج داخل اللعبة قبل اعتماد الصور والصوت.

---

## 2. ما استُخدم فعليًا في قصة أرين والثعلب

### الصور

- مولد الصور: **ChatGPT**.
- Google AI Studio **لم يُستخدم لتوليد الصور**.
- تم أولًا إنشاء واعتماد Master Character Reference Sheets للشخصيات المتكررة.
- بعد اعتماد الـMaster Sheets تم توليد المشاهد واحدًا واحدًا داخل ChatGPT.
- كل مشهد نهائي Landscape 16:9 ومصمم ليُعرض كصورة قصة كاملة على Android TV.
- عند حدوث Character Drift، كان التصحيح يعتمد على الـcanonical master sheet فقط، مع أمر صريح بتجاهل التصميم الخاطئ السابق.

### الصوت

- منصة التوليد: **Google AI Studio**.
- المحرك: Gemini TTS / Text-to-Speech.
- الصوت المعتمد: **Leda**.
- اللغة: العربية الفصحى الواضحة والمناسبة للأطفال.
- لم تُولد القصة كتسجيل صوتي واحد ضخم.
- قُسمت النصوص إلى **دفعات قصيرة من مشاهد متتابعة تكمل بعضها** حتى يحافظ الصوت على الاستمرارية والنبرة، وتكون إعادة التوليد سهلة عند وجود مشكلة.
- بعد التوليد يُحفظ **Master WAV مستقل لكل مشهد**. وبعد نجاح QA يمكن اشتقاق نسخة Runtime مضغوطة منه.

### Runtime الحالي عند توثيق هذه المرحلة

- 27 مشهدًا.
- 27 صورة WebP مستخدمة في Runtime.
- Production الحالية ما زالت تستخدم 27 ملف WAV، واحدًا لكل مشهد، إلى أن يتم تنفيذ ترحيل MP3 على `main`.
- تم اعتماد **MP3 96 kbps mono** كهدف Runtime للقصة بعد نجاح اختبار Android TV كامل 1→27 على الجهاز الفعلي.
- ملفات WAV الأصلية تبقى **Master/rollback** ولا تُحذف.
- PNG الأصلية محفوظة كـsource/rollback، لكنها لا تدخل APK أو OTA.
- Runtime story data موجود حاليًا في `stories-v12.js`.
- التصميم البصري للمشغل موجود في `stories-v12.css`.

---

## 3. المرحلة A — تثبيت القصة قبل الإنتاج

قبل توليد صورة واحدة أو صوت واحد:

1. اكتب القصة كاملة.
2. حدد الفئة العمرية ونبرة القصة والرسالة التربوية.
3. قسم القصة إلى مشاهد مرقمة من `01` إلى `NN`.
4. لكل مشهد ثبّت:
   - عنوان المشهد / Chapter.
   - النص المنطوق النهائي.
   - الشخصيات الموجودة.
   - المكان.
   - الحدث البصري.
   - الحالة العاطفية.
   - أي Props مهمة مثل السلة أو الزهرة.
5. اقرأ التسلسل كاملًا وتأكد أن الانتقال بين المشاهد طبيعي.
6. **Freeze للنص** قبل الصور والصوت.

### قاعدة مهمة

لا تغيّر النص بعد بدء إنتاج الصور والصوت إلا عند وجود سبب حقيقي. أي تغيير متأخر قد يفرض إعادة:
- الصوت،
- المشهد البصري،
- التوقيت،
- QA.

---

## 4. المرحلة B — إنشاء Master Sheets للشخصيات في ChatGPT

قبل توليد المشاهد، كل شخصية متكررة تحتاج مرجعًا بصريًا معتمدًا.

### للشخصيات الموجودة أصلًا في اللعبة

استخدم Screenshot أو artwork اللعبة كـidentity source، واطلب من ChatGPT الحفاظ على:
- شكل الوجه،
- الشعر،
- لون البشرة،
- الملابس،
- الألوان،
- النسب العامة،
- العمر البصري.

لا تطلب إعادة تصميم الشخصية من الصفر.

### قالب Master Character Prompt

```text
Create an IMAGE, not a text response.

MASTER CHARACTER REFERENCE SHEET — [CHARACTER NAME]

This character will be used in a [TOTAL]-scene children's illustrated story for Android TV.

Use the uploaded Bubble Safari reference ONLY as the identity/reference source for this character.
Preserve the recognizable identity, proportions, face, hair silhouette, skin tone,
clothing colors, shoes, and age.

Do not redesign the character into a different person.

Visual style:
- premium children's storybook illustration
- polished 2D / 2.5D cinematic style
- soft rounded shapes
- clean edges
- gentle texture
- expressive friendly face
- warm child-friendly lighting
- preschool storybook quality
- not photorealistic
- not anime
- not plastic 3D

Create one professional model sheet on a neutral background:
- full-body front view
- 3/4 front view
- right-side profile
- back view
- expression row
- important hand / prop / walking pose studies
- small color palette reference

This approved sheet will become the canonical identity for all story scenes.
```

### اعتماد الماستر

لا تبدأ المشاهد مباشرة بعد أول نتيجة.

افحص:
- الوجه،
- الشعر،
- الملابس،
- الألوان،
- الطول والنسب،
- اليدين،
- Props الثابتة.

بعد الموافقة، اعتبر النسخة **CANONICAL MASTER**.

### قاعدة إلزامية للمستقبل

لا تعتمد فقط على وجود الـMaster Sheet في محادثة ChatGPT.

يجب حفظ:
- نسخة من الصورة المعتمدة،
- اسم الشخصية،
- النص الكامل للـMaster Prompt،
- قائمة الصفات الممنوع تغييرها،

في أرشيف إنتاج القصة، حتى نستطيع الرجوع إليها بعد أشهر.

---

## 5. المرحلة C — توليد مشاهد القصة في ChatGPT

تولد المشاهد **واحدًا واحدًا**، وليس دفعة كبيرة بدون مراجعة.

### قالب Scene Prompt

```text
Create an IMAGE, not a text response.

SCENE [NN] / [TOTAL] — “[SCENE TITLE]”

Create the final TRUE LANDSCAPE 16:9 story illustration.

Use the canonical master sheets already approved for:
[CHARACTERS IN THIS SCENE]

CRITICAL:
The canonical master sheet for each character is the ONLY valid identity reference.
Do not redesign, age-up, stylize differently, or replace any character.

Story moment:
“[EXACT VISUAL MOMENT]”

Location:
[LOCATION]

Character action / emotion:
[ACTION AND EXPRESSION]

Continuity requirements:
[PROPS / CLOTHING / POSITION / IMPORTANT CONTINUITY]

Style:
- premium children's storybook
- soft polished 2D / 2.5D cinematic illustration
- warm friendly lighting
- expressive but gentle
- clean readable silhouettes
- suitable for preschool / young children
- not photorealistic
- not anime
- not plastic 3D

Composition:
- true landscape 16:9
- one complete story illustration
- keep faces and important actions safely inside frame
- no UI
- no text inside the illustration
- no narration panel inside the image
- no cropping of important characters

FORBIDDEN:
[LIST ALL KNOWN CHARACTER-DRIFT RISKS]
```

### عند إعادة توليد مشهد به Character Drift

اكتب بشكل صريح:

```text
Ignore the incorrect character design from the previous generated scene.
The canonical master sheet is the ONLY valid identity.
```

ثم أعد كتابة الصفات الحساسة والـFORBIDDEN list.

### مثال حقيقي من أرين والثعلب

حارس الغابة انجرف بصريًا في بعض المحاولات إلى تصميم غير صحيح.

لذلك تمت إعادة تثبيت هويته صراحة:
- clean-shaven،
- لا لحية،
- لا شارب،
- قبعة Ranger خضراء بسيطة،
- قميص أخضر،
- بنطال أخضر،
- مظهر شبابي ودود،
- لا beige/khaki redesign،
- لا wide-brim campaign hat،
- لا backpack،
- لا rugged adult redesign.

**الدرس:** الشخصية التي بدأت تنحرف تحتاج Negative Constraints صريحة في كل مشهد حساس، وليس الاعتماد على عبارة “same character” فقط.

---

## 6. Image QA — اعتماد كل مشهد

قبل الانتقال للمشهد التالي، افحص:

- هوية كل شخصية تطابق الـMaster Sheet.
- الشعر والوجه لم يتغيرا.
- الملابس والألوان صحيحة.
- لا Beard/Moustache أو Accessories غير معتمدة.
- اليدان والأصابع مقبولتان.
- Props المطلوبة موجودة.
- لا Props عشوائية.
- تعبير الشخصية يناسب النص.
- المكان يناسب التسلسل.
- الصورة Landscape 16:9.
- لا Text داخل الصورة.
- لا Crop لوجه أو شخصية مهمة.
- لا تصميم UI داخل الرسم.
- المشهد يطابق النص فعلًا، وليس مجرد صورة جميلة.

إذا فشل بند أساسي، أعد **المشهد نفسه فقط**.

---

## 7. المرحلة D — خطة الصوت قبل فتح Google AI Studio

بعد Freeze النص واعتماد ترتيب المشاهد، جهّز **Audio Batch Plan**.

### لماذا لا نولد القصة كلها مرة واحدة؟

لأن التسجيل الطويل جدًا يجعل:
- إعادة مشهد واحد مكلفة،
- تحديد القطع أصعب،
- احتمالية تغير النبرة أعلى،
- اكتشاف جملة ناقصة أصعب،
- المزامنة مع الصور أصعب.

### الطريقة التي نعتمدها

قسم المشاهد إلى **دفعات قصيرة من مشاهد متتابعة تكمل بعضها سرديًا**.

الدفعة ليست لها قيمة ثابتة بعدد المشاهد. اختر حدودًا طبيعية حسب:
- استمرار المكان،
- استمرار الحوار،
- استمرار النبرة العاطفية،
- طول النص.

الهدف هو أن يسمع Leda عدة لحظات مترابطة في جلسة توليد واحدة، لكن بدون تحويل القصة كلها إلى ملف ضخم واحد.

### الناتج النهائي

حتى لو تم توليد عدة مشاهد في دفعة واحدة:

**Master النهائي = ملف WAV مستقل لكل مشهد.**

بعد اعتماد الـMaster وإكمال QA يمكن إنشاء **Runtime MP3 96 kbps mono مستقل لكل مشهد**. لا تعتمد MP3 كـMaster ولا تحذف WAV الأصلي.

مثال:

```text
Batch A:
Scene 01
Scene 02
Scene 03

→ بعد المراجعة والتقسيم:

arin-fox-01-intro.wav
arin-fox-02-basket.wav
arin-fox-03-advice.wav
```

---

## 8. المرحلة E — توليد الصوت في Google AI Studio

### الإعداد الرسمي

- Platform: **Google AI Studio**
- TTS: **Gemini TTS**
- Voice: **Leda**
- Language: Arabic
- Delivery: warm, youthful, friendly, clear, child-safe.
- Production master format: WAV PCM, 24 kHz, mono, 16-bit.

### Story Batch Prompt

```text
Use the Leda voice.

Narrate the following consecutive Arabic story scenes as one coherent,
warm children's storytelling session.

Voice direction:
- clear Modern Standard Arabic
- warm, youthful, friendly narrator
- gentle and safe for young children
- natural storytelling, not an announcer
- slightly slower than normal conversation
- clear pronunciation of every word
- consistent voice identity and loudness
- preserve emotional continuity across the consecutive scenes
- no shouting
- no whispering
- no exaggerated acting

Important:
- Do not add, remove, repeat, paraphrase, or change any word.
- Do not read the SCENE labels.
- Keep a clean natural pause between scene blocks so each scene can be separated afterward.
- Finish every scene completely; do not cut the final word or syllable.

SCENE [NN]
[EXACT APPROVED ARABIC TEXT]

SCENE [NN+1]
[EXACT APPROVED ARABIC TEXT]

SCENE [NN+2]
[EXACT APPROVED ARABIC TEXT]
```

### بعد التوليد

1. استمع إلى الدفعة كاملة.
2. تأكد أن Leda هي نفس الهوية الصوتية المعتمدة.
3. افحص الكلمات الصعبة والأسماء.
4. تأكد أن كل مشهد كامل.
5. قسم/صدّر الدفعة إلى ملف نهائي مستقل لكل مشهد.
6. لا تقص بداية حرف أو نهاية كلمة.
7. لا تضف Silence مبالغًا فيه.
8. احتفظ بمستوى Loudness قريب بين الملفات.

---

## 9. تسمية صوت القصة

الصيغة:

```text
<story-id>-<scene-number>-<short-slug>.wav
```

مثال:

```text
arin-fox-01-intro.wav
arin-fox-02-basket.wav
arin-fox-17-ranger-arrives.wav
arin-fox-23-fox-apology-v2.wav
```

### عند تصحيح ملف

إذا احتاج ملف Production إلى إعادة توليد قبل اعتماد البديل:

```text
...-v2.wav
```

بعد نجاح QA يمكن حذف النسخة القديمة غير المستخدمة.

---

## 10. Audio QA — لا تعتمد الملف من الاسم فقط

لكل مشهد:

- استمع من الثانية 0 حتى النهاية.
- قارن الصوت بالنص المعتمد كلمة بكلمة.
- لا توجد كلمة ناقصة.
- لا توجد كلمة مضافة.
- لا توجد إعادة غير مطلوبة.
- نهاية الجملة كاملة.
- لا يوجد Cut في آخر syllable.
- لا يوجد click أو glitch.
- الصوت هو Leda.
- النبرة متسقة مع المشاهد المجاورة.
- مستوى الصوت متقارب.
- الملف يفتح ويعمل في Runtime.

### حادثة Scene 23

النسخة الأصلية من مشهد 23 انتهت قبل اكتمال النص.

الإصلاح الصحيح كان:
- إعادة إنتاج Scene 23،
- اعتماد `arin-fox-23-fox-apology-v2.wav`,
- إبقاء Scene 24 مستقلة،
- حذف الملف المقطوع بعد التحقق.

**القاعدة:** لا نعالج ملف Production ناقصًا بسرقة نهاية من المشهد التالي.

Runtime يدعم تقنيًا audio parts / stitching للحالات الخاصة، لكن لا يجب استخدام ذلك كبديل عن أصل صوتي نهائي نظيف.

---

## 11. المرحلة F — مطابقة الصورة والصوت

الترقيم هو العقد بين الأصول.

```text
Scene 01 image ↔ Scene 01 audio ↔ Scene 01 caption
Scene 02 image ↔ Scene 02 audio ↔ Scene 02 caption
...
Scene NN image ↔ Scene NN audio ↔ Scene NN caption
```

لا تعتمد على أسماء بشرية فقط. افحص عدد العناصر وترتيبها.

### Current Arin & Fox contract

- Image list: 27 entries.
- Segment list: 27 entries.
- Final story audio files: 27.
- Index `0` في الكود = Scene 01.
- Index `26` = Scene 27.

أي اختلاف في العدد يعتبر Build/QA failure.

---

## 12. Current Arin & Fox scene map

| # | Chapter | Characters | Runtime image | Runtime audio |
|---:|---|---|---|---|
| 01 | صباح جميل | Arin | `arinfox_scene_01_2026-09-18T18-53-29-720Z.webp` | `arin-fox-01-intro.wav` |
| 02 | هدية للجدة | Arin, Mother | `arinfox_scene_02_v02.webp` | `arin-fox-02-basket.wav` |
| 03 | نصيحة الأم | Arin, Mother | `arinfox_scene_03_2026-09-18T17-58-25-364Z.webp` | `arin-fox-03-advice.wav` |
| 04 | بداية الرحلة | Arin | `arinfox_scene_04_2026-09-18T17-58-35-275Z.webp` | `arin-fox-04-leave-home.wav` |
| 05 | طريق الغابة | Arin | `arinfox_scene_05_2026-09-18T17-58-45-622Z.webp` | `arin-fox-05-forest-road.wav` |
| 06 | ضيف بين الأشجار | Arin, Fox | `arinfox_scene_06_2026-09-18T17-58-55-686Z.webp` | `arin-fox-06-fox-appears.wav` |
| 07 | سؤال الثعلب | Arin, Fox | `arinfox_scene_07_2026-09-18T17-59-05-062Z.webp` | `arin-fox-07-where-going.wav` |
| 08 | رائحة السلة | Arin, Fox | `arinfox_scene_08_2026-09-18T17-59-15-467Z.webp` | `arin-fox-08-basket-smell.wav` |
| 09 | الطريق الأقصر | Fox | `arinfox_scene_09_2026-09-18T18-55-35-944Z.webp` | `arin-fox-09-shortcut.wav` |
| 10 | زهرة للجدة | Arin | `arinfox_scene_10_2026-09-18T17-59-33-781Z.webp` | `arin-fox-10-flower.wav` |
| 11 | عند بيت الجدة | Fox, Grandma | `arinfox_scene_11_2026-09-18T17-59-43-414Z.webp` | `arin-fox-11-grandma-door.wav` |
| 12 | الجدة الذكية | Fox, Grandma | `arinfox_scene_12_2026-09-18T17-59-53-209Z.webp` | `arin-fox-12-tail.wav` |
| 13 | الثعلب ينتظر | Fox | `arinfox_scene_13_2026-09-18T18-00-03-610Z.webp` | `arin-fox-13-waiting-fox.wav` |
| 14 | وصول أرين | Arin, Fox | `arinfox_scene_14_2026-09-18T18-00-14-038Z.webp` | `arin-fox-14-arin-arrives.wav` |
| 15 | قرار شجاع | Arin, Fox | `arinfox_scene_15_2026-09-18T18-00-24-296Z.webp` | `arin-fox-15-arin-refuses.wav` |
| 16 | صوت الجدة | Arin, Grandma | `arinfox_scene_16_2026-09-18T18-00-41-496Z.webp` | `arin-fox-16-grandma-calls.wav` |
| 17 | حارس الغابة | Arin, Fox, Ranger | `arinfox_scene_17_v03_2026-09-18T20-27-40-404Z.webp` | `arin-fox-17-ranger-arrives.wav` |
| 18 | حديث هادئ | Fox, Ranger | `arinfox_scene_18_v02_2026-09-18T20-25-47-534Z.webp` | `arin-fox-18-ranger-talks.wav` |
| 19 | الثعلب يعترف | Fox, Ranger | `arinfox_scene_19_2026-09-18T18-01-27-385Z.webp` | `arin-fox-19-fox-admits.wav` |
| 20 | درس مهم | Fox, Ranger | `arinfox_scene_20_2026-09-18T18-01-37-914Z.webp` | `arin-fox-20-lesson.wav` |
| 21 | الباب يفتح | Arin, Grandma, Ranger | `arinfox_scene_21_2026-09-18T18-01-48-087Z.webp` | `arin-fox-21-grandma-opens.wav` |
| 22 | الهدية | Arin, Grandma | `arinfox_scene_22_2026-09-18T18-02-06-303Z.webp` | `arin-fox-22-gift.wav` |
| 23 | اعتذار الثعلب | Arin, Grandma, Fox | `arinfox_scene_23_2026-09-18T18-02-16-052Z.webp` | `arin-fox-23-fox-apology-v2.wav` |
| 24 | طريق العودة | Arin, Ranger | `arinfox_scene_24_2026-09-18T18-02-26-179Z.webp` | `arin-fox-24-return.wav` |
| 25 | في البيت | Arin, Mother | `arinfox_scene_25_2026-09-18T18-02-36-134Z.webp` | `arin-fox-25-mother-final.wav` |
| 26 | ما تعلمته أرين | Arin, Mother | `arinfox_scene_26_2026-09-18T18-02-46-671Z.webp` | `arin-fox-26-moral.wav` |
| 27 | النهاية | Arin, Fox | `arinfox_scene_27_2026-09-18T18-02-56-244Z.webp` | `arin-fox-27-ending.wav` |

Scene 23 لديها حاليًا `autoAdvanceDelayMs: 900`، بينما بقية المشاهد تستخدم الانتقال الافتراضي للمشغل.

---

## 13. المرحلة G — تحسين صوت القصة قبل Runtime

لا نحذف أو نستبدل ملفات WAV الأصلية التي خرجت من Google AI Studio بعد اعتمادها. هذه الملفات هي **Production Masters**.

### القرار المعتمد بعد اختبار Android TV الفعلي

تمت مقارنة عدة صيغ صوتية للقصة، ثم اختبار MP3 96 kbps على Android TV بطريقتين:

1. اختبار قصير منفصل للمشاهد **22 → 23 → 24**، ويتضمن Scene 23 الحساسة.
2. اختبار منفصل للقصة كاملة **1 → 27** باستخدام نفس صور WebP ونفس منطق المشغل والانتقالات.

الاختبار الكامل على التلفزيون الفعلي نجح:
- القصة عملت 1 → 27 بدون مشاكل.
- الصوت كان واضحًا.
- الانتقال بين المشاهد عمل طبيعيًا.
- Scene 23 اكتملت بدون قطع.
- لم يتم الإبلاغ عن مشكلة في Pause / Resume أو Replay أثناء الاختبار الكامل.
- التطبيق الاختباري كان Package منفصلًا ولم يلمس Production.

### Benchmark المعتمد

قصة أرين والثعلب:
- WAV masters: **22,902,948 bytes** ≈ **21.84 MiB**
- MP3 96 kbps runtime target: **5,752,863 bytes** ≈ **5.49 MiB**
- التوفير: **74.88%**

### سياسة Runtime الصوتية للقصص

للـstory narration فقط:

1. احتفظ بـWAV PCM 24 kHz mono 16-bit كـMaster.
2. بعد اكتمال Audio QA، حوّل كل Scene إلى:
   - MP3
   - 96 kbps
   - mono
   - نفس ترتيب وأسماء المشاهد
3. افحص أن عدد MP3 = عدد المشاهد.
4. اختبر Scene 01، Scene حساسة مثل 23، وآخر Scene.
5. اختبر القصة كاملة على Android TV الفعلي.
6. إذا نجح الاختبار، APK وOTA يشحنان MP3 الخاصة بالقصة فقط.
7. WAV masters تبقى في المستودع للرجوع وإعادة الترميز، لكنها لا تدخل Runtime package.
8. **لا تحوّل أصوات اللعبة/UI القصيرة إلى MP3 تلقائيًا.** تبقى WAV ما لم تحصل على Benchmark واختبار مستقل خاص بها.

### قاعدة التراجع

إذا ظهر على أي جهاز مستهدف:
- فشل تشغيل،
- تأخير ملحوظ،
- تقطيع،
- فقدان بداية أو نهاية،
- مشكلة Replay / Pause،
- اختلاف سلوك WebView،

نعود فورًا إلى WAV Runtime لذلك الإصدار. تقليل الحجم لا يبرر أي مخاطرة باستقرار اللعبة.

### ملاحظة مهمة

نجاح المتصفح وحده غير كافٍ. اعتماد MP3 تم فقط بعد نجاح **القصة الكاملة على Android TV الفعلي**.

---

## 14. المرحلة H — تحسين الصور قبل Runtime

لا نشحن PNG الأصلية الثقيلة داخل APK.

### الطريقة المعتمدة بعد تجربة أرين والثعلب

1. احتفظ بالـPNG الأصلية كـsource/rollback.
2. حوّل الصور المعتمدة إلى **WebP Q95**.
3. لا تغيّر Resolution أثناء التحويل.
4. افحص الصور الناتجة.
5. تحقق أن العدد يساوي عدد المشاهد.
6. Runtime وAPK وOTA تستخدم WebP فقط.

### نتيجة قصة أرين والثعلب

- PNG sources: **47,924,617 bytes**
- WebP Q95 runtime: **7,858,980 bytes**
- التوفير: **40,065,637 bytes**
- التوفير النسبي: **83.60%**

بعد التحويل:
- OTA أصبح تقريبًا 30.8 MB بدل ~70.8 MB.
- APK أصبح تقريبًا 37.9 MB بدل ~78 MB.

### قاعدة

الجودة أولًا، ثم الحجم.

لا تستخدم Quality منخفضة لمجرد تقليل الحجم.

---

## 15. المرحلة I — دمج القصة في Runtime

### الملفات الأساسية الحالية

```text
stories-v12.js
stories-v12.css
assets/stories/arin-fox/
audio/stories/arin-fox/
service-worker.js
android-tv/app/build.gradle
.github/workflows/pages.yml
.github/workflows/android-tv-apk.yml
.github/workflows/android-tv-release.yml
```

### Story data

حاليًا `stories-v12.js` يحتوي:
- `STORY_AUDIO_BASE`
- `STORY_IMAGE_BASE`
- image file list
- segment list
- captions
- chapters
- actors
- special delays

### صورة المشهد

المشغل:
- يعمل preload،
- يستخدم `image.decode()`,
- يحتفظ بالصورة الحالية حتى تصبح التالية جاهزة،
- يعمل Crossfade،
- يجهز المشهد التالي والذي بعده.

### مزامنة الصوت

عند بدء Scene:
- تُعرض/تفك الصورة أولًا،
- ينتظر المشغل حتى تصبح الصورة مرئية،
- بعدها يبدأ Audio الخاص بنفس Scene.

لا تسمح للصوت بأن يسبق الصورة.

### Layout

على TV:
- الصورة كاملة على اليسار.
- Narrator panel على اليمين.
- `object-fit: contain`.
- لا crop للصورة.

على Aspect Ratio ضيق:
- يتحول المشغل إلى stacked layout.

لذلك **لا تضع نص الراوية داخل الصورة نفسها**.

---

## 16. مهم جدًا قبل القصة الثانية — Current hard-coded paths

رغم وجود `STORIES` array، بنية الإنتاج الحالية لا تزال single-story oriented في عدة نقاط.

مسارات `arin-fox` موجودة حاليًا بشكل مباشر في:
- `STORY_AUDIO_BASE`
- `STORY_IMAGE_BASE`
- Service Worker story-scene matcher
- Android Gradle Web assets include
- Pages workflow
- Android APK workflow
- Android Release workflow

### قبل إضافة Story #2

لا تكتفِ بإنشاء:

```text
assets/stories/new-story/
audio/stories/new-story/
```

وتتوقع أن تعمل تلقائيًا.

يجب أولًا عمل Story Platform Generalization أو تحديث كل integration point بوضوح.

### Gate إلزامي

قبل إنتاج assets القصة الثانية داخل Production:

- راجع مسارات Runtime.
- اجعل story metadata تحمل image/audio base الخاصة بها، أو أضف دعمًا واضحًا لكل قصة.
- اجعل Service Worker يتعرف على كل `/assets/stories/`.
- اجعل Android packaging يشمل story runtime assets الجديدة.
- اجعل Pages / OTA packaging يشملها.
- أضف verification لأول وآخر Scene في build workflow.
- اختبر story library مع أكثر من قصة.

هذه خطوة هندسية مستقلة، ولا يجب خلطها مع توليد الصور والصوت.

---

## 17. المرحلة J — Story QA الكامل

لا يكفي فحص عدة مشاهد.

### Content QA

- عدد الصور = عدد Segments.
- عدد ملفات الصوت النهائية = عدد Segments.
- Caption يطابق Audio.
- Image يطابق Scene.
- Chapter صحيح.
- Characters صحيحة.

### Image QA

- افحص 1 → NN.
- افحص وجوه الشخصيات المتكررة.
- افحص المشاهد التي أُعيد توليدها بشكل خاص.
- لا Character Drift.
- لا Crop.
- لا Text داخل الصور.

### Audio QA

- استمع لكل ملف كاملًا.
- افحص boundaries بين كل مشهد والذي يليه.
- لا clip في البداية أو النهاية.
- لا كلمة مفقودة.
- لا voice change.
- لا loudness jump.

### Runtime QA

- Story Library.
- Open Story.
- Automatic playback.
- Pause / Resume.
- Replay Segment.
- Back to Library.
- Replay Story.
- Ending actions.
- Remote D-pad / OK / Back.
- Sound muted / unmuted.
- Console = 0 errors / exceptions.

### Physical Android TV QA

يجب تشغيل القصة كاملة على الجهاز الفعلي.

Browser QA لا يغني عن:
- WebView decode performance،
- TV GPU،
- Remote input،
- Audio behavior،
- OTA asset activation.

---

## 18. APK / OTA Validation Gate

قبل اعتماد القصة:

### APK

تحقق أن:
- story JS/CSS موجودة،
- صور Runtime موجودة،
- Audio موجود،
- عدد Story MP3 يساوي عدد المشاهد عند اعتماد MP3 Runtime،
- لا توجد Story WAV داخل APK بعد نجاح ترحيل MP3؛ WAV تبقى Masters خارج الحزمة،
- أصوات اللعبة/UI الأخرى يمكن أن تبقى WAV،
- Source PNG غير موجودة إذا كانت WebP هي Runtime format،
- أول وآخر Scene موجودان،
- Game content version صحيح.

### OTA

تحقق أن:
- Bundle يحتوي runtime assets فقط،
- manifest size/hash صحيحان،
- update ينزل ويتفعل،
- القصة تعمل بعد cold restart.

---

## 19. ماذا لا نكرر من تجربة أرين والثعلب

### 1. Character Drift

**الخطأ:** الاعتماد على ذاكرة المشهد السابق بدل Canonical Master.

**الحل:** Master Sheet + explicit identity constraints + FORBIDDEN list.

### 2. Ranger redesign

**الخطأ:** ظهور تصميم adult/rugged/khaki أو beard/moustache.

**الحل:** إعادة ذكر السمات الثابتة والممنوعة في المشاهد الحساسة.

### 3. Scene 23 truncated audio

**الخطأ:** اعتماد ملف قبل سماع النهاية كاملة.

**الحل:** listen-to-end + text comparison + regenerate failed scene/batch.

### 4. محاولة ربط صوت ناقص بمشهد مجاور

**الخطأ:** تعقيد Runtime لتعويض أصل Production سيئ.

**الحل:** Final runtime audio asset مستقل ونظيف لكل Scene.

### 5. PNG داخل Runtime

**الخطأ:** جودة صحيحة لكن حجم ضخم.

**الحل:** source PNG + runtime WebP Q95.

### 6. إزالة الصورة القديمة قبل جاهزية الجديدة

**الخطأ:** Flash / hitch في الانتقال.

**الحل:** preload + decode + double buffer + crossfade.

### 7. بدء الصوت قبل ظهور الصورة

**الخطأ:** Narration تتقدم بصريًا.

**الحل:** wait for decoded/visible Scene قبل `audio.play()`.

---

## 20. Definition of Done لأي قصة جديدة

القصة لا تعتبر Production Ready إلا إذا كانت كل البنود التالية ✅:

- [ ] Story script frozen.
- [ ] Scene plan frozen.
- [ ] Canonical Master Sheets approved and archived.
- [ ] Scene prompt set archived.
- [ ] All final images approved.
- [ ] All image filenames locked.
- [ ] Google AI Studio audio batch plan documented.
- [ ] Leda used consistently.
- [ ] Every batch listened to completely.
- [ ] Final master audio split one WAV file per scene.
- [ ] Every final master audio matched word-for-word to approved script.
- [ ] Story Runtime audio encoded to MP3 96 kbps mono only after master QA.
- [ ] Runtime MP3 count matches Scene count.
- [ ] Full MP3 story playback verified on physical Android TV.
- [ ] Runtime images converted to WebP Q95 or currently approved format.
- [ ] Source masters kept out of APK/OTA.
- [ ] Story data count matches assets.
- [ ] Image preload/decode works.
- [ ] Audio waits for current visual.
- [ ] Full story played 1 → NN.
- [ ] Remote controls verified.
- [ ] Console clean.
- [ ] APK contents verified.
- [ ] OTA contents verified.
- [ ] Physical Android TV playback verified.
- [ ] Final version/hash recorded.

---

## 21. الملفات التي يجب حفظها لكل قصة مستقبلية

بالإضافة إلى Runtime assets، احتفظ بتوثيق Production:

```text
Story script
Scene breakdown
Character master prompts
Approved master character sheets
Scene prompts
Regeneration notes / forbidden traits
Google AI Studio audio batch plan
Exact narration text
Audio naming map
Approved WAV masters
Runtime MP3 derivatives and encoding settings
Image naming map
QA report
Release version / commit / checksum
```

الهدف أن نستطيع بعد أشهر إعادة Scene واحدة أو Audio واحدة **بنفس الهوية والطريقة** بدون محاولة إعادة اكتشاف ما فعلناه.

---

## 22. Source of truth hierarchy

عند وجود تعارض بين ملف قديم وملاحظة قديمة:

1. Approved final script.
2. Canonical character master sheet.
3. Approved scene image.
4. Final per-scene audio.
5. Runtime mapping in `stories-v12.js`.
6. This production roadmap.

لا تستخدم نتيجة توليد سابقة مرفوضة كمرجع لشخصية أو مشهد جديد.

---

## 23. Production rule summary

### Images

**ChatGPT → Canonical Master Sheets → one scene at a time → QA → source PNG → WebP Q95 runtime**

### Audio

**Google AI Studio → Gemini TTS → Leda → short batches of connected scenes → full batch QA → one WAV master per scene → per-scene QA → MP3 96 kbps mono runtime derivative → full Android TV 1→NN validation**

### Integration

**Image + Audio + Caption share the same Scene index → preload/decode image → show image → start audio → full 1→NN QA → APK/OTA verification**

هذا هو الـPipeline المرجعي للقصص القادمة في Bubble Safari.
