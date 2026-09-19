# أرين والثعلب — Story Audio

المسار يحتوي على ملفات Runtime النهائية لرواية قصة **أرين والثعلب** بصوت **Leda**.

## Production method

- التوليد يتم يدويًا في **Google AI Studio / Gemini TTS**.
- الصوت المعتمد: **Leda**.
- لا يتم توليد القصة كلها كتسجيل واحد طويل.
- يتم تجميع **مشاهد متتابعة تكمل بعضها** في دفعات توليد قصيرة للحفاظ على استمرارية النبرة والسرد.
- بعد مراجعة الدفعة، يتم تقسيم/تصدير الناتج إلى **ملف WAV نهائي مستقل لكل مشهد**.

## Runtime rule

**One scene = one final runtime audio asset.**

مثال:

```text
Scene 01 → arin-fox-01-intro.wav
Scene 02 → arin-fox-02-basket.wav
...
Scene 23 → arin-fox-23-fox-apology-v2.wav
...
Scene 27 → arin-fox-27-ending.wav
```

لا تستخدم صوت المشهد التالي لإكمال ملف مقطوع. إذا كان المشهد ناقصًا، أعد توليده واعتمد ملفًا كاملًا.

التعليمات الكاملة، Story Batch Prompt، QA، الصور ودمج Runtime موثقة في:
[`../../../STORY_PRODUCTION_ROADMAP.md`](../../../STORY_PRODUCTION_ROADMAP.md).
