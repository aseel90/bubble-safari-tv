const $=(selector,root=document)=>root.querySelector(selector);
const STORY_AUTO_NOTE='تعمل القصة تلقائيًا من البداية إلى النهاية.';

const ARIN_FOX_AUDIO_BASE='./audio/stories/arin-fox/';
const ARIN_FOX_AUDIO_VERSION='v39-mp3-ota-blob';
const ARIN_FOX_IMAGE_BASE='./assets/stories/arin-fox/';
const ARIN_FOX_IMAGE_VERSION='v51-webp-q95';
const USAYD_AUDIO_BASE='./audio/stories/usayd-three-bears/';
const USAYD_AUDIO_VERSION='v1-leda-96k';
const USAYD_IMAGE_BASE='./assets/stories/usayd-three-bears/';
const USAYD_IMAGE_VERSION='v1-webp-1600x900';
const AWWAB_AUDIO_BASE='./audio/stories/awwab-lost-duck/';
const AWWAB_AUDIO_VERSION='v1-leda-96k';
const AWWAB_IMAGE_BASE='./assets/stories/awwab-lost-duck/';
const AWWAB_IMAGE_VERSION='v1-webp-q95';
const ARIN_FOX_SCENE_IMAGES=[
  'arinfox_scene_01_2026-09-18T18-53-29-720Z.webp',
  'arinfox_scene_02_v02.webp',
  'arinfox_scene_03_2026-09-18T17-58-25-364Z.webp',
  'arinfox_scene_04_2026-09-18T17-58-35-275Z.webp',
  'arinfox_scene_05_2026-09-18T17-58-45-622Z.webp',
  'arinfox_scene_06_2026-09-18T17-58-55-686Z.webp',
  'arinfox_scene_07_2026-09-18T17-59-05-062Z.webp',
  'arinfox_scene_08_2026-09-18T17-59-15-467Z.webp',
  'arinfox_scene_09_2026-09-18T18-55-35-944Z.webp',
  'arinfox_scene_10_2026-09-18T17-59-33-781Z.webp',
  'arinfox_scene_11_2026-09-18T17-59-43-414Z.webp',
  'arinfox_scene_12_2026-09-18T17-59-53-209Z.webp',
  'arinfox_scene_13_2026-09-18T18-00-03-610Z.webp',
  'arinfox_scene_14_2026-09-18T18-00-14-038Z.webp',
  'arinfox_scene_15_2026-09-18T18-00-24-296Z.webp',
  'arinfox_scene_16_2026-09-18T18-00-41-496Z.webp',
  'arinfox_scene_17_v03_2026-09-18T20-27-40-404Z.webp',
  'arinfox_scene_18_v02_2026-09-18T20-25-47-534Z.webp',
  'arinfox_scene_19_2026-09-18T18-01-27-385Z.webp',
  'arinfox_scene_20_2026-09-18T18-01-37-914Z.webp',
  'arinfox_scene_21_2026-09-18T18-01-48-087Z.webp',
  'arinfox_scene_22_2026-09-18T18-02-06-303Z.webp',
  'arinfox_scene_23_2026-09-18T18-02-16-052Z.webp',
  'arinfox_scene_24_2026-09-18T18-02-26-179Z.webp',
  'arinfox_scene_25_2026-09-18T18-02-36-134Z.webp',
  'arinfox_scene_26_2026-09-18T18-02-46-671Z.webp',
  'arinfox_scene_27_2026-09-18T18-02-56-244Z.webp'
];
const USAYD_SCENE_IMAGES=Array.from({length:17},(_,index)=>`usayd-three-bears-scene-${String(index+1).padStart(2,'0')}.webp`);
const AWWAB_SCENE_IMAGES=[
  'awwab-lost-duck-01-morning.webp',
  'awwab-lost-duck-02-park-path.webp',
  'awwab-lost-duck-03-small-sound.webp',
  'awwab-lost-duck-04-lost-duckling.webp',
  'awwab-lost-duck-05-promise-help.webp',
  'awwab-lost-duck-06-looking-for-clue.webp',
  'awwab-lost-duck-07-footprints.webp',
  'awwab-lost-duck-08-following-trail.webp',
  'awwab-lost-duck-09-flowers.webp',
  'awwab-lost-duck-10-crossroads.webp',
  'awwab-lost-duck-11-new-tracks.webp',
  'awwab-lost-duck-12-tracks-fade.webp',
  'awwab-lost-duck-13-tracks-disappear.webp',
  'awwab-lost-duck-14-stream.webp',
  'awwab-lost-duck-15-along-bank.webp',
  'awwab-lost-duck-16-small-bridge.webp',
  'awwab-lost-duck-17-safe-crossing.webp',
  'awwab-lost-duck-18-distant-call.webp',
  'awwab-lost-duck-19-follow-sound.webp',
  'awwab-lost-duck-20-short-rest.webp',
  'awwab-lost-duck-21-clearer-call.webp',
  'awwab-lost-duck-22-pond-family.webp',
  'awwab-lost-duck-23-mother-recognizes.webp',
  'awwab-lost-duck-24-reunion.webp',
  'awwab-lost-duck-25-thank-you.webp',
  'awwab-lost-duck-26-family-together.webp',
  'awwab-lost-duck-27-home.webp'
];
const preloadedSceneImages=new Map();
let storyVisualToken=0;
function sceneImagePath(story,index){const file=story?.sceneImages?.[index];return file?story.imageBase+file+'?v='+story.imageVersion:''}
function preloadSceneImage(story,index,retry=false){
  const baseSrc=sceneImagePath(story,index);if(!baseSrc)return Promise.resolve(null);
  const cached=preloadedSceneImages.get(baseSrc);if(cached)return cached.ready;
  const image=new Image();image.decoding='async';image.alt='';image.setAttribute('aria-hidden','true');image.draggable=false;try{image.fetchPriority='low'}catch{}
  const requestSrc=retry?baseSrc+(baseSrc.includes('?')?'&':'?')+'retry='+Date.now():baseSrc;
  const ready=new Promise((resolve,reject)=>{
    image.addEventListener('load',async()=>{try{if(image.decode)await image.decode()}catch{}resolve(image)},{once:true});
    image.addEventListener('error',()=>{
      preloadedSceneImages.delete(baseSrc);
      if(!retry){preloadSceneImage(story,index,true).then(resolve,reject);return}
      reject(new Error('scene image failed'))
    },{once:true});
  });
  preloadedSceneImages.set(baseSrc,{image,ready});image.src=requestSrc;return ready
}

const ARIN_FOX_SEGMENTS=[
  {file:'arin-fox-01-intro.mp3',chapter:'صباح جميل',caption:'في قرية صغيرة عاشت طفلة لطيفة اسمها أَرين.',theme:'village',actors:['arin']},
  {file:'arin-fox-02-basket.mp3',chapter:'هدية للجدة',caption:'جهزت الأم سلة صغيرة لتأخذها أَرين إلى جدتها.',theme:'home',actors:['arin','mother'],basket:true},
  {file:'arin-fox-03-advice.mp3',chapter:'نصيحة الأم',caption:'ذكّرت الأم أَرين أن تبقى على الطريق وألا تتبع شخصًا لا تعرفه.',theme:'home',actors:['arin','mother'],basket:true},
  {file:'arin-fox-04-leave-home.mp3',chapter:'بداية الرحلة',caption:'حملت أَرين سلتها ولوّحت لأمها وبدأت رحلتها.',theme:'village',actors:['arin'],basket:true},
  {file:'arin-fox-05-forest-road.mp3',chapter:'طريق الغابة',caption:'كان الطريق جميلًا والطيور تغرد بين الأشجار.',theme:'forest',actors:['arin'],basket:true},
  {file:'arin-fox-06-fox-appears.mp3',chapter:'ضيف بين الأشجار',caption:'فجأة خرج ثعلب من خلف شجرة كبيرة.',theme:'fox',actors:['arin','fox'],basket:true},
  {file:'arin-fox-07-where-going.mp3',chapter:'سؤال الثعلب',caption:'سأل الثعلب أَرين إلى أين تذهب، فتذكرت نصيحة أمها.',theme:'fox',actors:['arin','fox'],basket:true},
  {file:'arin-fox-08-basket-smell.mp3',chapter:'رائحة السلة',caption:'لاحظ الثعلب السلة، لكن أَرين لم تخبره أين تسكن جدتها.',theme:'fox',actors:['arin','fox'],basket:true},
  {file:'arin-fox-09-shortcut.mp3',chapter:'الطريق الأقصر',caption:'فكر الثعلب في طريق أقصر وركض بين الأشجار.',theme:'forest',actors:['fox']},
  {file:'arin-fox-10-flower.mp3',chapter:'زهرة للجدة',caption:'اختارت أَرين زهرة قريبة من الطريق ثم تابعت سيرها.',theme:'garden',actors:['arin'],basket:true},
  {file:'arin-fox-11-grandma-door.mp3',chapter:'عند بيت الجدة',caption:'وصل الثعلب أولًا وطرق الباب.',theme:'grandma',actors:['fox','grandma']},
  {file:'arin-fox-12-tail.mp3',chapter:'الجدة الذكية',caption:'رأت الجدة طرف ذيل الثعلب وعرفت أنه ليس زائرًا تعرفه.',theme:'grandma',actors:['fox','grandma']},
  {file:'arin-fox-13-waiting-fox.mp3',chapter:'الثعلب ينتظر',caption:'أغلقت الجدة الباب جيدًا، فجلس الثعلب قرب البيت.',theme:'grandma',actors:['fox']},
  {file:'arin-fox-14-arin-arrives.mp3',chapter:'وصول أَرين',caption:'وصلت أَرين ولاحظت أن المكان هادئ جدًا.',theme:'grandma',actors:['arin','fox'],basket:true},
  {file:'arin-fox-15-arin-refuses.mp3',chapter:'قرار شجاع',caption:'شعرت أَرين أن شيئًا غير صحيح ورفضت الاقتراب.',theme:'grandma',actors:['arin','fox'],basket:true},
  {file:'arin-fox-16-grandma-calls.mp3',chapter:'صوت الجدة',caption:'سمعت أَرين صوت جدتها من داخل البيت فعرفت أنها بخير.',theme:'grandma',actors:['arin','grandma']},
  {file:'arin-fox-17-ranger-arrives.mp3',chapter:'حارس الغابة',caption:'وصل حارس الغابة بعدما سمع الأصوات قرب البيت.',theme:'forest',actors:['arin','fox','ranger']},
  {file:'arin-fox-18-ranger-talks.mp3',chapter:'حديث هادئ',caption:'شرح الحارس للثعلب أنه لا يجوز إخافة الناس أو دخول بيوتهم.',theme:'forest',actors:['fox','ranger']},
  {file:'arin-fox-19-fox-admits.mp3',chapter:'الثعلب يعترف',caption:'اعترف الثعلب أنه كان فضوليًا وأراد معرفة ما في السلة.',theme:'forest',actors:['fox','ranger']},
  {file:'arin-fox-20-lesson.mp3',chapter:'درس مهم',caption:'قال الحارس: عندما تريد شيئًا، اسأل بأدب ولا تتبع الآخرين.',theme:'forest',actors:['fox','ranger']},
  {file:'arin-fox-21-grandma-opens.mp3',chapter:'الباب يفتح',caption:'عندما أصبح المكان آمنًا، فتحت الجدة الباب وعانقت أَرين.',theme:'garden',actors:['arin','grandma','ranger'],basket:true},
  {file:'arin-fox-22-gift.mp3',chapter:'الهدية',caption:'وضعت أَرين السلة على الطاولة وقدمت لجدتها الزهرة الجميلة.',theme:'garden',actors:['arin','grandma'],basket:true},
  {file:'arin-fox-23-fox-apology-v2.mp3',chapter:'اعتذار الثعلب',caption:'اعتذر الثعلب، وذكّرته الجدة أن يتعلم من خطئه، فوعد ألا يخيف أحدًا مرة أخرى.',theme:'garden',actors:['arin','grandma','fox'],autoAdvanceDelayMs:900},
  {file:'arin-fox-24-return.mp3',chapter:'طريق العودة',caption:'حان وقت العودة، فرافق الحارس أَرين في جزء من الطريق.',theme:'return',actors:['arin','ranger'],basket:true},
  {file:'arin-fox-25-mother-final.mp3',chapter:'في البيت',caption:'عادت أَرين إلى أمها وحكت لها عن المغامرة.',theme:'home',actors:['arin','mother']},
  {file:'arin-fox-26-moral.mp3',chapter:'ما تعلمته أَرين',caption:'تعلمت أَرين أن اللطف لا يعني الثقة بكل شخص، وأن طلب المساعدة تصرف شجاع.',theme:'ending',actors:['arin','mother']},
  {file:'arin-fox-27-ending.mp3',chapter:'النهاية',caption:'أما الثعلب، ففي المرة التالية لوّح من بعيد وقال: صباح الخير! ثم أكمل طريقه.',theme:'ending',actors:['arin','fox']}
];

const USAYD_SEGMENTS=[
  {file:'usayd-three-bears-01-walk.mp3',chapter:'نزهة جميلة',caption:'خرج أُسيد مع أمه في نزهة قرب الغابة.',theme:'forest',actors:['usayd','mother']},
  {file:'usayd-three-bears-02-butterfly.mp3',chapter:'فراشة ملونة',caption:'تبع أُسيد فراشةً ملوّنة وابتعد قليلًا.',theme:'forest',actors:['usayd','mother']},
  {file:'usayd-three-bears-03-lost.mp3',chapter:'أين أمي؟',caption:'نظر أُسيد حوله ولم يجد أمه.',theme:'forest',actors:['usayd']},
  {file:'usayd-three-bears-04-rain.mp3',chapter:'المطر',caption:'بدأ المطر، فبحث أُسيد عن مأوى.',theme:'forest',actors:['usayd']},
  {file:'usayd-three-bears-05-cottage.mp3',chapter:'بيت بين الأشجار',caption:'وجد أُسيد بيتًا دافئًا بين الأشجار.',theme:'home',actors:['usayd']},
  {file:'usayd-three-bears-06-enter.mp3',chapter:'دخول البيت',caption:'دخل أُسيد البيت من دون إذن.',theme:'home',actors:['usayd']},
  {file:'usayd-three-bears-07-three-bowls.mp3',chapter:'ثلاثة أطباق',caption:'رأى أُسيد ثلاثة أطباق بأحجام مختلفة.',theme:'home',actors:['usayd']},
  {file:'usayd-three-bears-08-porridge.mp3',chapter:'ساخن وبارد ومناسب',caption:'جرّب الأطباق حتى وجد الصغير مناسبًا.',theme:'home',actors:['usayd']},
  {file:'usayd-three-bears-09-three-chairs.mp3',chapter:'ثلاثة كراسٍ',caption:'رأى أُسيد ثلاثة كراسٍ بأحجام مختلفة.',theme:'home',actors:['usayd']},
  {file:'usayd-three-bears-10-broken-chair.mp3',chapter:'طَق!',caption:'انكسر الكرسي الصغير، فحزن أُسيد.',theme:'home',actors:['usayd']},
  {file:'usayd-three-bears-11-three-beds.mp3',chapter:'ثلاثة أسرّة',caption:'نام أُسيد في السرير الصغير.',theme:'home',actors:['usayd']},
  {file:'usayd-three-bears-12-bears-return.mp3',chapter:'عودة الدببة',caption:'عادت عائلة الدببة الثلاثة إلى البيت.',theme:'forest',actors:['father-bear','mother-bear','baby-bear']},
  {file:'usayd-three-bears-13-empty-bowl.mp3',chapter:'من أكل طعامي؟',caption:'وجد الدب الصغير طبقه فارغًا.',theme:'home',actors:['father-bear','mother-bear','baby-bear']},
  {file:'usayd-three-bears-14-chair-found.mp3',chapter:'والكرسي أيضًا!',caption:'وجد الدب الصغير كرسيه مكسورًا.',theme:'home',actors:['father-bear','mother-bear','baby-bear']},
  {file:'usayd-three-bears-15-found-usayd.mp3',chapter:'وجدوا أُسيد',caption:'وجدت الدببة أُسيد نائمًا في السرير.',theme:'home',actors:['usayd','father-bear','mother-bear','baby-bear']},
  {file:'usayd-three-bears-16-apology.mp3',chapter:'الاعتذار',caption:'قال أُسيد الحقيقة واعتذر عن أخطائه.',theme:'home',actors:['usayd','father-bear','mother-bear','baby-bear']},
  {file:'usayd-three-bears-17-reunion.mp3',chapter:'العودة إلى أمي',caption:'عاد أُسيد إلى أمه وتعلّم درسًا مهمًا.',theme:'ending',actors:['usayd','mother','father-bear','mother-bear','baby-bear'],autoAdvanceDelayMs:900}
];

const AWWAB_SEGMENTS=[
  {file:"awwab-lost-duck-01-morning.mp3",chapter:"صباح جميل",caption:"في صباحٍ جميل، خرج أَوّابْ من بيته ليستمتع بنزهةٍ هادئة في الحديقة.",theme:"home",actors:['awwab']},
  {file:"awwab-lost-duck-02-park-path.mp3",chapter:"طريق الحديقة",caption:"سار أَوّابْ بين الأشجار والزهور، متجهًا نحو البركة.",theme:"garden",actors:['awwab']},
  {file:"awwab-lost-duck-03-small-sound.mp3",chapter:"صوت صغير",caption:"فجأة، سمع أَوّابْ صوتًا صغيرًا يأتي من بين الأعشاب.",theme:"garden",actors:['awwab']},
  {file:"awwab-lost-duck-04-lost-duckling.mp3",chapter:"البطّة الضائعة",caption:"اقترب أَوّابْ بحذر، فوجد بطّةً صغيرةً ضائعةً تبدو قلقة.",theme:"garden",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-05-promise-help.mp3",chapter:"لا تخف",caption:"قال أَوّابْ بلطف: لا تقلقي، سأساعدكِ في العثور على عائلتكِ.",theme:"garden",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-06-looking-for-clue.mp3",chapter:"أين أمك؟",caption:"نظر أَوّابْ حوله يبحث عن أثرٍ يقودهما إلى الطريق الصحيح.",theme:"garden",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-07-footprints.mp3",chapter:"سنبحث معًا",caption:"ظهرت آثار أقدامٍ صغيرة في التراب، فتبعها أَوّابْ والبطّة.",theme:"garden",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-08-following-trail.mp3",chapter:"بين الزهور",caption:"قادتهما الآثار بين الأشجار، والبطّة تسير قريبةً منه.",theme:"garden",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-09-flowers.mp3",chapter:"عند البركة الصغيرة",caption:"مرّا بجانب أزهارٍ كثيرة، لكن عائلة البط لم تكن هناك.",theme:"garden",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-10-crossroads.mp3",chapter:"الجسر الخشبي",caption:"وصلا إلى مفترقٍ صغير، فتوقف أَوّابْ ليفكر أين يذهبان.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-11-new-tracks.mp3",chapter:"آثار صغيرة",caption:"لاحظ أَوّابْ آثارًا جديدة قرب الصخور، فعادا إلى تتبّعها.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-12-tracks-fade.mp3",chapter:"نتبع الآثار",caption:"استمرا في السير حتى بدأت الآثار تضعف شيئًا فشيئًا.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-13-tracks-disappear.mp3",chapter:"اختفت الآثار",caption:"عند بقعةٍ من الحصى الجاف، اختفت الآثار تمامًا.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-14-stream.mp3",chapter:"عند الماء",caption:"وصل أَوّابْ والبطّة إلى جدولٍ صغير، وبدآ يبحثان على ضفتيه.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-15-along-bank.mp3",chapter:"على طول الضفة",caption:"سار أَوّابْ والبطّة بمحاذاة ضفة الجدول، يبحثان عن أثرٍ جديد.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-16-small-bridge.mp3",chapter:"الجسر الصغير",caption:"لمح أَوّابْ جسرًا خشبيًا صغيرًا، ورأى قربه آثار أقدام البط من جديد.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-17-safe-crossing.mp3",chapter:"عبور آمن",caption:"عبر أَوّابْ الجسر بحذر، وبقيت البطّة الصغيرة قريبةً منه.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-18-distant-call.mp3",chapter:"صوت بعيد",caption:"على الضفة الأخرى، سمعا نداء بطٍّ بعيد، فامتلأ قلبهما بالأمل.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-19-follow-sound.mp3",chapter:"نتبع الصوت",caption:"تبع أَوّابْ والبطّة الصغيرة اتجاه الصوت عبر الممر الأخضر.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-20-short-rest.mp3",chapter:"استراحة قصيرة",caption:"تعبت البطّة قليلًا، فتوقف أَوّابْ معها ليستريحا لحظةً قصيرة.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-21-clearer-call.mp3",chapter:"الصوت أوضح",caption:"ثم سمعا نداءً أوضح، فنهضت البطّة بحماس، وعرف أَوّابْ أنهما اقتربا.",theme:"forest",actors:['awwab','duckling']},
  {file:"awwab-lost-duck-22-pond-family.mp3",chapter:"ظهرت البحيرة",caption:"خرج أَوّابْ والبطّة من بين الأشجار، فرأيا البركة وعائلة البط في الجهة المقابلة.",theme:"garden",actors:['awwab','duckling','mother-duck','duck-siblings']},
  {file:"awwab-lost-duck-23-mother-recognizes.mp3",chapter:"عرفتها أمّها",caption:"تعرفت الأم إلى صغيرتها، فأسرعت البطّة نحو عائلتها بسعادة.",theme:"garden",actors:['awwab','duckling','mother-duck','duck-siblings']},
  {file:"awwab-lost-duck-24-reunion.mp3",chapter:"لمّ الشمل",caption:"اجتمعت البطّة الصغيرة بأمّها وإخوتها، وامتلأ المكان بالفرح.",theme:"garden",actors:['awwab','duckling','mother-duck','duck-siblings']},
  {file:"awwab-lost-duck-25-thank-you.mp3",chapter:"شكرًا يا أَوّابْ",caption:"نظرت الأم إلى أَوّابْ بامتنان، فابتسم ولوّح لها بلطف.",theme:"garden",actors:['awwab','duckling','mother-duck','duck-siblings']},
  {file:"awwab-lost-duck-26-family-together.mp3",chapter:"العائلة معًا",caption:"سبحت عائلة البط معًا في البركة، بينما وقف أَوّابْ على الضفة يلوّح لهم مودعًا.",theme:"garden",actors:['awwab','duckling','mother-duck','duck-siblings']},
  {file:"awwab-lost-duck-27-home.mp3",chapter:"العودة إلى البيت",caption:"ومع غروب الشمس، عاد أَوّابْ إلى بيته سعيدًا وفخورًا لأنه ساعد البطّة الضائعة على العودة إلى عائلتها.",theme:"ending",actors:['awwab'],autoAdvanceDelayMs:900}
];

const STORIES=[
  {id:'arin-fox',title:'أرين والثعلب',typeLabel:'استمع وشاهد',durationLabel:'8 دقائق',description:'تذهب أرين لزيارة جدتها، فتقابل ثعلبًا فضوليًا وتتعلم أن تكون لطيفة وحذرة وتطلب المساعدة عند الحاجة.',audioBase:ARIN_FOX_AUDIO_BASE,audioVersion:ARIN_FOX_AUDIO_VERSION,imageBase:ARIN_FOX_IMAGE_BASE,imageVersion:ARIN_FOX_IMAGE_VERSION,sceneImages:ARIN_FOX_SCENE_IMAGES,segments:ARIN_FOX_SEGMENTS},
  {id:'usayd-three-bears',title:'أُسيد وبيت الدببة الثلاثة',typeLabel:'استمع وشاهد',durationLabel:'5 دقائق',description:'يبتعد أُسيد عن أمه، فيجد بيت الدببة الثلاثة ويتعلم الاستئذان وقول الحقيقة وإصلاح الخطأ والبقاء قريبًا من والديه.',audioBase:USAYD_AUDIO_BASE,audioVersion:USAYD_AUDIO_VERSION,imageBase:USAYD_IMAGE_BASE,imageVersion:USAYD_IMAGE_VERSION,sceneImages:USAYD_SCENE_IMAGES,segments:USAYD_SEGMENTS},
  {id:'awwab-lost-duck',title:'أَوّابْ والبطّة الضائعة',typeLabel:'استمع وشاهد',durationLabel:'4 دقائق',description:'يساعد أَوّابْ بطّةً صغيرةً ضائعة على تتبّع الطريق والعودة بأمان إلى أمّها وإخوتها.',audioBase:AWWAB_AUDIO_BASE,audioVersion:AWWAB_AUDIO_VERSION,imageBase:AWWAB_IMAGE_BASE,imageVersion:AWWAB_IMAGE_VERSION,sceneImages:AWWAB_SCENE_IMAGES,segments:AWWAB_SEGMENTS}
];
const player={story:null,index:0,partIndex:0,finished:false,token:0,partBoundaryHandled:false};
const audio=new Audio();audio.preload='auto';
const STORY_AUDIO_BLOB_MODE=location.hostname==='appassets.androidplatform.net'&&location.pathname.startsWith('/update/');
const storyAudioBlobUrls=new Map();
async function resolvedStoryAudioPath(item,story=player.story){
  const direct=audioPath(item,story);
  if(!STORY_AUDIO_BLOB_MODE)return direct;
  const cached=storyAudioBlobUrls.get(direct);if(cached)return cached;
  const pending=(async()=>{
    const response=await fetch(direct,{cache:'no-store'});
    if(!response.ok)throw new Error(`audio ${response.status}`);
    const bytes=await response.arrayBuffer();if(!bytes.byteLength)throw new Error('empty audio');
    return URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}))
  })();
  storyAudioBlobUrls.set(direct,pending);
  try{return await pending}catch(error){storyAudioBlobUrls.delete(direct);throw error}
}
let nextAudio=null;
let autoAdvanceTimer=null;
function storyIcon(name){
  const paths={
    back:'<path d="M15 6l-6 6 6 6"/><path d="M9 12h10"/>',
    play:'<path d="M8.5 6.5v11l9-5.5-9-5.5z"/>',
    pause:'<path d="M8 6v12M16 6v12"/>',
    replay:'<path d="M7.2 7.2A7 7 0 1 1 6 16.5"/><path d="M7.2 3.8v4.4H2.8"/>',
    library:'<path d="M4.5 6.5h6.5v11H4.5zM13 6.5h6.5v11H13z"/><path d="M7.8 9.3h0M16.3 9.3h0"/>'
  };
  return '<svg class="story-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round">'+(paths[name]||paths.play)+'</svg>'
}

function installScreens(){
  if($('#storyLibraryScreen'))return;
  ($('.stage')||document.body).insertAdjacentHTML('beforeend',`<section id="storyLibraryScreen" class="screen story-library-screen" aria-hidden="true"><div class="story-library-shell"><div class="story-library-topbar"><button id="storyLibraryBackButton" class="back-button focusable story-library-back" data-focusable type="button" aria-label="العودة">${storyIcon('back')}</button><div class="story-library-heading"><span class="eyebrow">استمع وشاهد</span><h2>القصص</h2><p>اختر قصة لتعمل تلقائيًا من البداية حتى النهاية.</p></div><div class="story-library-count"><span id="storyLibraryCountValue">4</span><small id="storyLibraryCountLabel">2 متاحة • 2 قريبًا</small></div></div><div id="storyLibraryGrid" class="story-library-grid"></div></div></section><section id="storyNarratedScreen" class="screen story-screen" aria-hidden="true"><div class="story-player-shell"><div class="story-player-topbar"><button id="storyBackButton" class="back-button focusable story-back" data-focusable type="button" aria-label="العودة للقصص">${storyIcon('back')}</button><div class="story-player-heading"><span class="eyebrow">قصة مسموعة</span><h2 id="storyTitle">أرين والثعلب</h2><p id="storyChapterTitle">صباح جميل</p></div><div id="storyProgress" class="story-progress" role="progressbar" aria-valuemin="1" aria-valuemax="27" aria-valuenow="1"><strong id="storyProgressText">1 / 27</strong><span class="story-progress-track"><span id="storyProgressFill"></span></span></div></div><div class="story-stage-card"><div id="storyVisual" class="story-visual"></div><div class="story-caption-panel"><span class="story-kicker">الراوية</span><p id="storyNarration"></p><span id="storyPathNote" class="story-path-note">تعمل القصة تلقائيًا من البداية حتى النهاية.</span></div></div><div id="storyControls" class="story-controls"><button id="storyPlayPauseButton" class="story-control focusable" data-focusable data-autofocus type="button"><span id="storyPlayPauseIcon" class="story-control-icon">${storyIcon('pause')}</span><span id="storyPlayPauseText">إيقاف مؤقت</span></button><button id="storyReplaySegmentButton" class="story-control focusable" data-focusable type="button"><span class="story-control-icon">${storyIcon('replay')}</span><span>إعادة الجزء</span></button></div><div id="storyEnding" class="story-ending hidden" aria-hidden="true" aria-label="خيارات نهاية القصة"><div class="story-ending-actions"><button id="storyReplayStoryButton" class="story-control focusable" data-focusable type="button"><span class="story-control-icon">${storyIcon('replay')}</span><span>إعادة القصة</span></button><button id="storyChooseAnotherButton" class="story-control focusable" data-focusable type="button"><span class="story-control-icon">${storyIcon('library')}</span><span>العودة للقصص</span></button></div></div></div></section>`);
}
function renderLibrary(){
  const grid=$('#storyLibraryGrid');if(!grid)return;
  grid.innerHTML='';
  STORIES.forEach((story,index)=>{
    preloadSceneImage(story,0).catch(()=>{});
    const card=document.createElement('button');card.type='button';card.className='story-cover-card focusable';card.dataset.focusable='';if(index===0)card.dataset.autofocus='';
    const coverSrc=sceneImagePath(story,0);
    card.innerHTML=`<span class="story-cover-art"><img class="story-cover-image" src="${coverSrc}" alt="" aria-hidden="true" draggable="false"><span class="story-cover-play">${storyIcon('play')}</span></span><span class="story-cover-copy"><span class="story-type-badge">${story.typeLabel}</span><strong>${story.title}</strong><small>${story.description}</small><span class="story-duration">◷ ${story.durationLabel}</span></span>`;
    card.addEventListener('click',()=>openStory(story.id));grid.appendChild(card)
  });
  const comingSoon=[
    {title:'مغامرة جديدة',copy:'قصة مصورة ومسموعة جديدة قيد الإعداد.'},
    {title:'حكاية جديدة',copy:'شخصيات وأحداث جديدة ستنضم إلى مكتبة القصص.'}
  ];
  comingSoon.forEach((item,index)=>{
    const coming=document.createElement('button');
    coming.type='button';coming.className='story-cover-card story-coming-soon-card focusable';coming.dataset.focusable='';coming.dataset.comingSlot=String(index+1);coming.setAttribute('aria-disabled','true');coming.setAttribute('aria-label',item.title+' قريبًا');
    coming.innerHTML=`<span class="story-cover-art story-coming-soon-art"><span class="story-coming-soon-glow" aria-hidden="true"></span><span class="story-coming-soon-book" aria-hidden="true">${storyIcon('library')}</span><span class="story-coming-soon-ribbon">قريبًا</span></span><span class="story-cover-copy"><span class="story-type-badge story-coming-soon-type">قصة جديدة</span><strong>${item.title}</strong><small>${item.copy}</small><span class="story-duration">ستتوفر قريبًا</span></span>`;
    coming.addEventListener('click',event=>{event.preventDefault();event.stopPropagation()});
    grid.appendChild(coming)
  });
  const countValue=$('#storyLibraryCountValue'),countLabel=$('#storyLibraryCountLabel');
  const total=STORIES.length+comingSoon.length;
  if(countValue)countValue.textContent=String(total);
  if(countLabel)countLabel.textContent=STORIES.length+' متاحة • '+comingSoon.length+' قريبًا'
}
function setFocus(el){if(!el)return;document.querySelectorAll('.tv-focus').forEach(node=>node.classList.remove('tv-focus'));try{el.focus({preventScroll:true})}catch{el.focus()}el.classList.add('tv-focus')}
function setActiveScreen(id){document.activeElement?.blur();$('#app')?.classList.add('story-mode');document.querySelectorAll('.screen').forEach(screen=>{const active=screen.id===id;screen.classList.toggle('screen-active',active);screen.setAttribute('aria-hidden',active?'false':'true')});$('#hud')?.classList.add('hidden');$('#settingsButton')?.classList.add('hidden');$('#soundButton')?.classList.add('hidden');setTimeout(()=>setFocus($(`#${id} [data-autofocus]`)||$(`#${id} [data-focusable]`)),60)}
function returnHome(){stopAudio();document.activeElement?.blur();$('#app')?.classList.remove('story-mode');document.querySelectorAll('.screen').forEach(screen=>{const active=screen.id==='homeScreen';screen.classList.toggle('screen-active',active);screen.setAttribute('aria-hidden',active?'false':'true')});$('#settingsButton')?.classList.remove('hidden');$('#soundButton')?.classList.remove('hidden');setTimeout(()=>setFocus($('#startButton')),60)}
function openLibrary(){stopAudio();renderLibrary();setActiveScreen('storyLibraryScreen')}
function segmentAudioParts(segment){if(!segment)return[];return segment.audioParts?.length?segment.audioParts:[{file:segment.file,startAt:segment.startAt,endAt:segment.endAt}]}
function audioPath(item,story=player.story){const file=typeof item==='string'?item:item?.file;const base=story?.audioBase||ARIN_FOX_AUDIO_BASE,version=story?.audioVersion||ARIN_FOX_AUDIO_VERSION;return `${base}${file}?v=${version}`}
const stitchedAudioUrls=new Map();
function wavChunk(view,name){for(let i=12;i<=view.byteLength-8;){const id=String.fromCharCode(view.getUint8(i),view.getUint8(i+1),view.getUint8(i+2),view.getUint8(i+3)),size=view.getUint32(i+4,true);if(id===name)return{offset:i+8,size};i+=8+size+(size&1)}return null}
async function stitchedAudioPath(segment,story=player.story){const key=(story?.id||'story')+'|'+segment.stitchParts.map(part=>`${part.file}:${part.startAt||0}:${part.endAt??''}`).join('|');if(stitchedAudioUrls.has(key))return stitchedAudioUrls.get(key);const chunks=[];let sampleRate=24000,channels=1,bits=16;for(const part of segment.stitchParts){const response=await fetch(audioPath(part,story),{cache:'force-cache'});if(!response.ok)throw new Error(`audio ${response.status}`);const bytes=await response.arrayBuffer(),view=new DataView(bytes),fmt=wavChunk(view,'fmt '),data=wavChunk(view,'data');if(!fmt||!data)throw new Error('Unsupported WAV');channels=view.getUint16(fmt.offset+2,true);sampleRate=view.getUint32(fmt.offset+4,true);bits=view.getUint16(fmt.offset+14,true);const blockAlign=channels*(bits/8),start=Math.max(0,Math.floor(Number(part.startAt||0)*sampleRate)*blockAlign),end=part.endAt==null?data.size:Math.min(data.size,Math.floor(Number(part.endAt)*sampleRate)*blockAlign);chunks.push(new Uint8Array(bytes,data.offset+start,Math.max(0,end-start)))}const dataSize=chunks.reduce((n,c)=>n+c.byteLength,0),buffer=new ArrayBuffer(44+dataSize),view=new DataView(buffer),out=new Uint8Array(buffer);const text=(o,t)=>[...t].forEach((c,i)=>view.setUint8(o+i,c.charCodeAt(0)));text(0,'RIFF');view.setUint32(4,36+dataSize,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);view.setUint32(24,sampleRate,true);const byteRate=sampleRate*channels*(bits/8);view.setUint32(28,byteRate,true);view.setUint16(32,channels*(bits/8),true);view.setUint16(34,bits,true);text(36,'data');view.setUint32(40,dataSize,true);let offset=44;for(const chunk of chunks){out.set(chunk,offset);offset+=chunk.byteLength}const url=URL.createObjectURL(new Blob([buffer],{type:'audio/wav'}));stitchedAudioUrls.set(key,url);return url}
function clearAutoAdvanceTimer(){if(autoAdvanceTimer){clearTimeout(autoAdvanceTimer);autoAdvanceTimer=null}}
function stopAudio(){clearAutoAdvanceTimer();player.token++;player.partIndex=0;player.partBoundaryHandled=false;audio.pause();audio.removeAttribute('src');audio.load();nextAudio=null;player.finished=false}
function preloadNext(){const segment=player.story?.segments?.[player.index],parts=segmentAudioParts(segment);let next=parts[player.partIndex+1],nextSegment=null;if(!next){nextSegment=player.story?.segments?.[player.index+1];next=segmentAudioParts(nextSegment)[0]}if(nextSegment?.stitchParts?.length){nextAudio=null;void stitchedAudioPath(nextSegment,player.story).catch(()=>{});return}if(!next){nextAudio=null;return}void resolvedStoryAudioPath(next,player.story).then(source=>{nextAudio=new Audio();nextAudio.preload='auto';nextAudio.src=source}).catch(()=>{nextAudio=null})}
function setStoryPathNote(text=STORY_AUTO_NOTE){const note=$('#storyPathNote');if(note)note.textContent=text}
function storyMuted(){return localStorage.getItem('bubbleSafariMuted')==='1'}
function setStoryMuted(muted){const value=!!muted;localStorage.setItem('bubbleSafariMuted',value?'1':'0');audio.muted=value;try{window.dispatchEvent(new CustomEvent('bubbleSafari:setMuted',{detail:{muted:value}}))}catch{}}
function syncControls(){
  const paused=audio.paused||player.finished,muted=storyMuted();
  const text=$('#storyPlayPauseText'),icon=$('#storyPlayPauseIcon'),button=$('#storyPlayPauseButton');
  if(!button)return;
  button.disabled=player.finished;
  if(text)text.textContent=paused?(muted?'تشغيل الصوت':'متابعة'):'إيقاف مؤقت';
  if(icon)icon.innerHTML=storyIcon(paused?'play':'pause');
}
async function waitForSceneVisual(index,token,timeoutMs=20000){
  const visual=$('#storyVisual');if(!visual)return true;
  const started=performance.now();
  while(performance.now()-started<timeoutMs){
    if(token!==player.token||player.index!==index)return false;
    const frame=visual.querySelector('.story-static-scene[data-scene-index="'+index+'"]');
    if(frame?.classList.contains('story-scene-error'))return true;
    const image=frame?.querySelector('img');
    if(image?.complete&&image.naturalWidth>0&&(frame.classList.contains('story-scene-visible')||frame.classList.contains('story-scene-current')))return true;
    await new Promise(resolve=>setTimeout(resolve,40))
  }
  return true
}
function renderSegment(){
  const story=player.story,segment=story?.segments?.[player.index];if(!story||!segment)return;
  setStoryPathNote();$('#storyChapterTitle').textContent=segment.chapter;$('#storyNarration').textContent=segment.caption;
  const visual=$('#storyVisual');visual.className='story-visual story-theme-'+segment.theme;
  const sceneIndex=player.index;
  const existing=visual.querySelector('.story-static-scene[data-scene-index="'+sceneIndex+'"]');
  if(!existing){
    const token=++storyVisualToken;
    const oldFrames=[...visual.querySelectorAll('.story-static-scene')];
    const firstFrame=oldFrames.length===0;
    let loadingFrame=null;
    if(firstFrame){loadingFrame=document.createElement('div');loadingFrame.className='story-static-scene story-scene-loading';loadingFrame.dataset.sceneIndex=String(sceneIndex);visual.appendChild(loadingFrame)}
    void preloadSceneImage(story,sceneIndex).then(image=>{
      if(token!==storyVisualToken||player.index!==sceneIndex)return;
      const frame=loadingFrame||document.createElement('div');
      frame.className='story-static-scene story-scene-enter story-scene-ready';frame.dataset.sceneIndex=String(sceneIndex);
      image.className='story-scene-image';image.alt='';image.setAttribute('aria-hidden','true');image.draggable=false;try{image.fetchPriority='high'}catch{}
      frame.replaceChildren(image);if(!frame.isConnected)visual.appendChild(frame);
      requestAnimationFrame(()=>{if(token!==storyVisualToken)return;frame.classList.add('story-scene-visible');oldFrames.forEach(old=>old.classList.add('story-scene-exit'))});
      setTimeout(()=>{if(token!==storyVisualToken)return;oldFrames.forEach(old=>old.remove());frame.classList.remove('story-scene-enter','story-scene-visible');frame.classList.add('story-scene-current')},240)
    }).catch(()=>{
      if(token!==storyVisualToken||player.index!==sceneIndex)return;
      const frame=loadingFrame||document.createElement('div');frame.className='story-static-scene story-scene-error';frame.dataset.sceneIndex=String(sceneIndex);
      const error=document.createElement('div');error.className='story-scene-error-message';error.textContent='تعذر تحميل صورة المشهد.';frame.replaceChildren(error);if(!frame.isConnected)visual.appendChild(frame)
    })
  }
  preloadSceneImage(story,sceneIndex+1).catch(()=>{});preloadSceneImage(story,sceneIndex+2).catch(()=>{});
  const current=player.index+1,total=story.segments.length;$('#storyProgressText').textContent=current+' / '+total;$('#storyProgressFill').style.transform='scaleX('+(current/total)+')';$('#storyProgress').setAttribute('aria-valuenow',String(current));$('#storyEnding').classList.add('hidden');$('#storyEnding').setAttribute('aria-hidden','true');$('#storyControls').classList.remove('hidden');player.finished=false;syncControls()
}
async function playCurrentAudioPart({render=false,forceSeek=false}={}){
  const segment=player.story?.segments?.[player.index],parts=segmentAudioParts(segment),part=parts[player.partIndex];
  if(!segment||!part)return;
  clearAutoAdvanceTimer();
  const token=++player.token;
  player.partBoundaryHandled=false;
  if(render)renderSegment();
  const visualIndex=player.index;
  let source=audioPath(part,player.story),start=Number(part.startAt||0);
  if(segment.stitchParts?.length&&player.partIndex===0){
    try{source=await stitchedAudioPath(segment,player.story);start=0}catch{source=audioPath(part,player.story)}
  }else{
    try{source=await resolvedStoryAudioPath(part,player.story)}catch{if(token===player.token){syncControls();setStoryPathNote('تعذر تحميل صوت هذا الجزء الآن. اختر إعادة الجزء للمحاولة.')}return}
  }
  if(token!==player.token)return;
  const target=source.startsWith('blob:')?source:new URL(source,location.href).href;
  const sourceChanged=audio.src!==target;
  if(sourceChanged){audio.src=source;audio.load()}
  audio.muted=storyMuted();
  preloadNext();
  if(sourceChanged||forceSeek||start>0){
    if(audio.readyState<1)await new Promise(resolve=>audio.addEventListener('loadedmetadata',resolve,{once:true}));
    if(token!==player.token)return;
    try{if(Math.abs((audio.currentTime||0)-start)>.06)audio.currentTime=start}catch{}
  }
  if(render){await waitForSceneVisual(visualIndex,token);if(token!==player.token)return}
  if(audio.muted){
    audio.pause();syncControls();setStoryPathNote('الصوت مكتوم. اضغط تشغيل الصوت لبدء القصة.');return
  }
  try{
    await audio.play();
    if(token===player.token)syncControls()
  }catch{
    if(token===player.token){syncControls();setStoryPathNote('اضغط متابعة لبدء صوت الراوية.')}
  }
}
async function playSegment(restart=true,{forceSeek=false}={}){
  const segment=player.story?.segments?.[player.index];
  if(!segment)return;
  if(restart)player.partIndex=0;
  await playCurrentAudioPart({render:true,forceSeek})
}
function completeAudioPart(){if(player.finished||!player.story||player.partBoundaryHandled)return;player.partBoundaryHandled=true;const segment=player.story.segments[player.index],parts=segmentAudioParts(segment);if(player.partIndex<parts.length-1){player.partIndex++;playCurrentAudioPart({render:false});return}const delay=segment?.autoAdvanceDelayMs??350;clearAutoAdvanceTimer();autoAdvanceTimer=setTimeout(()=>{if(player.finished||!player.story)return;if(player.index>=player.story.segments.length-1){finishStory();return}player.index++;player.partIndex=0;playSegment(true)},delay)}
function openStory(id){const story=STORIES.find(item=>item.id===id)||STORIES[0];stopAudio();player.story=story;player.index=0;player.finished=false;$('#storyTitle').textContent=story.title;$('#storyProgress')?.setAttribute('aria-valuemax',String(story.segments.length));setStoryPathNote();setActiveScreen('storyNarratedScreen');playSegment(true)}
function finishStory(){
  clearAutoAdvanceTimer();
  player.finished=true;
  audio.pause();
  syncControls();
  $('#storyControls').classList.add('hidden');
  $('#storyEnding').classList.remove('hidden');
  $('#storyEnding').setAttribute('aria-hidden','false');
  setStoryPathNote('');
  setTimeout(()=>setFocus($('#storyReplayStoryButton')),70)
}
function togglePlayback(){if(player.finished)return;if(audio.paused){if(storyMuted())setStoryMuted(false);audio.muted=false;audio.play().then(()=>{setStoryPathNote();syncControls()}).catch(()=>{syncControls();setStoryPathNote('اضغط متابعة لبدء صوت الراوية.')})}else{audio.pause();syncControls()}}
function replaySegment(){
  if(!player.story)return;
  clearAutoAdvanceTimer();
  audio.pause();
  player.partIndex=0;
  player.finished=false;
  void playSegment(true,{forceSeek:true})
}
function replayStory(){
  player.index=0;
  player.partIndex=0;
  player.finished=false;
  $('#storyEnding').classList.add('hidden');
  $('#storyEnding').setAttribute('aria-hidden','true');
  $('#storyControls').classList.remove('hidden');
  void playSegment(true,{forceSeek:true});
  setTimeout(()=>setFocus($('#storyPlayPauseButton')),70)
}


function wire(){
  const homeCard=$('[data-home-section="stories"]');if(homeCard){homeCard.id='storiesButton';const badge=$('.mode-badge',homeCard),title=$('.mode-copy strong',homeCard),copy=$('.mode-copy small',homeCard);if(badge)badge.textContent='جديد';if(title)title.textContent='القصص';if(copy)copy.textContent='قصص مسموعة ومصورة للأطفال'}
  window.addEventListener('click',event=>{const card=event.target.closest?.('[data-home-section="stories"]');if(card){event.preventDefault();event.stopImmediatePropagation();openLibrary()}},true);
  $('#storyLibraryBackButton')?.addEventListener('click',returnHome);$('#storyBackButton')?.addEventListener('click',()=>{stopAudio();setActiveScreen('storyLibraryScreen')});$('#storyPlayPauseButton')?.addEventListener('click',togglePlayback);$('#storyReplaySegmentButton')?.addEventListener('click',replaySegment);$('#storyReplayStoryButton')?.addEventListener('click',replayStory);$('#storyChooseAnotherButton')?.addEventListener('click',()=>{stopAudio();setActiveScreen('storyLibraryScreen')});
  window.addEventListener('keydown',event=>{if(!$('#storyLibraryScreen')?.classList.contains('screen-active')&&!$('#storyNarratedScreen')?.classList.contains('screen-active'))return;const back=['Escape','BrowserBack','GoBack'].includes(event.key)||[4,27,461,10009].includes(event.keyCode||event.which);if(!back)return;event.preventDefault();event.stopImmediatePropagation();if($('#storyNarratedScreen').classList.contains('screen-active')){stopAudio();setActiveScreen('storyLibraryScreen')}else returnHome()},true);
  audio.addEventListener('timeupdate',()=>{const segment=player.story?.segments?.[player.index],part=segmentAudioParts(segment)[player.partIndex];if(!part?.endAt||player.partBoundaryHandled)return;if(audio.currentTime>=Number(part.endAt)-.04){audio.pause();completeAudioPart()}});audio.addEventListener('ended',completeAudioPart);audio.addEventListener('play',()=>{player.partBoundaryHandled=false;setStoryPathNote();syncControls()});audio.addEventListener('pause',syncControls);audio.addEventListener('error',()=>{clearAutoAdvanceTimer();setStoryPathNote('تعذر تشغيل هذا الجزء الآن. اختر إعادة الجزء للمحاولة.');syncControls()});
}

async function init(){installScreens();renderLibrary();wire()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>void init(),0),{once:true});else setTimeout(()=>void init(),0);
