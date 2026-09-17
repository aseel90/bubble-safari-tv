const $=(selector,root=document)=>root.querySelector(selector);
const STORY_AUDIO_BASE='./audio/stories/arin-fox/';

const ARIN_FOX_SEGMENTS=[
  {file:'arin-fox-01-intro.wav',chapter:'صباح جميل',caption:'في قرية صغيرة عاشت طفلة لطيفة اسمها أَرين.',theme:'village',actors:['arin']},
  {file:'arin-fox-02-basket.wav',chapter:'هدية للجدة',caption:'جهزت الأم سلة صغيرة لتأخذها أَرين إلى جدتها.',theme:'home',actors:['arin','mother'],basket:true},
  {file:'arin-fox-03-advice.wav',chapter:'نصيحة الأم',caption:'ذكّرت الأم أَرين أن تبقى على الطريق وألا تتبع شخصًا لا تعرفه.',theme:'home',actors:['arin','mother'],basket:true},
  {file:'arin-fox-04-leave-home.wav',chapter:'بداية الرحلة',caption:'حملت أَرين سلتها ولوّحت لأمها وبدأت رحلتها.',theme:'village',actors:['arin'],basket:true},
  {file:'arin-fox-05-forest-road.wav',chapter:'طريق الغابة',caption:'كان الطريق جميلًا والطيور تغرد بين الأشجار.',theme:'forest',actors:['arin'],basket:true},
  {file:'arin-fox-06-fox-appears.wav',chapter:'ضيف بين الأشجار',caption:'فجأة خرج ثعلب من خلف شجرة كبيرة.',theme:'fox',actors:['arin','fox'],basket:true},
  {file:'arin-fox-07-where-going.wav',chapter:'سؤال الثعلب',caption:'سأل الثعلب أَرين إلى أين تذهب، فتذكرت نصيحة أمها.',theme:'fox',actors:['arin','fox'],basket:true},
  {file:'arin-fox-08-basket-smell.wav',chapter:'رائحة السلة',caption:'لاحظ الثعلب السلة، لكن أَرين لم تخبره أين تسكن جدتها.',theme:'fox',actors:['arin','fox'],basket:true},
  {file:'arin-fox-09-shortcut.wav',chapter:'الطريق الأقصر',caption:'فكر الثعلب في طريق أقصر وركض بين الأشجار.',theme:'forest',actors:['fox']},
  {file:'arin-fox-10-flower.wav',chapter:'زهرة للجدة',caption:'اختارت أَرين زهرة قريبة من الطريق ثم تابعت سيرها.',theme:'garden',actors:['arin'],basket:true},
  {file:'arin-fox-11-grandma-door.wav',chapter:'عند بيت الجدة',caption:'وصل الثعلب أولًا وطرق الباب.',theme:'grandma',actors:['fox','grandma']},
  {file:'arin-fox-12-tail.wav',chapter:'الجدة الذكية',caption:'رأت الجدة طرف ذيل الثعلب وعرفت أنه ليس زائرًا تعرفه.',theme:'grandma',actors:['fox','grandma']},
  {file:'arin-fox-13-waiting-fox.wav',chapter:'الثعلب ينتظر',caption:'أغلقت الجدة الباب جيدًا، فجلس الثعلب قرب البيت.',theme:'grandma',actors:['fox']},
  {file:'arin-fox-14-arin-arrives.wav',chapter:'وصول أَرين',caption:'وصلت أَرين ولاحظت أن المكان هادئ جدًا.',theme:'grandma',actors:['arin','fox'],basket:true},
  {file:'arin-fox-15-arin-refuses.wav',chapter:'قرار شجاع',caption:'شعرت أَرين أن شيئًا غير صحيح ورفضت الاقتراب.',theme:'grandma',actors:['arin','fox'],basket:true},
  {file:'arin-fox-16-grandma-calls.wav',chapter:'صوت الجدة',caption:'سمعت أَرين صوت جدتها من داخل البيت فعرفت أنها بخير.',theme:'grandma',actors:['arin','grandma']},
  {file:'arin-fox-17-ranger-arrives.wav',chapter:'حارس الغابة',caption:'وصل حارس الغابة بعدما سمع الأصوات قرب البيت.',theme:'forest',actors:['arin','fox','ranger']},
  {file:'arin-fox-18-ranger-talks.wav',chapter:'حديث هادئ',caption:'شرح الحارس للثعلب أنه لا يجوز إخافة الناس أو دخول بيوتهم.',theme:'forest',actors:['fox','ranger']},
  {file:'arin-fox-19-fox-admits.wav',chapter:'الثعلب يعترف',caption:'اعترف الثعلب أنه كان فضوليًا وأراد معرفة ما في السلة.',theme:'forest',actors:['fox','ranger']},
  {file:'arin-fox-20-lesson.wav',chapter:'درس مهم',caption:'قال الحارس: عندما تريد شيئًا، اسأل بأدب ولا تتبع الآخرين.',theme:'forest',actors:['fox','ranger']},
  {file:'arin-fox-21-grandma-opens.wav',chapter:'الباب يفتح',caption:'عندما أصبح المكان آمنًا، فتحت الجدة الباب وعانقت أَرين.',theme:'garden',actors:['arin','grandma','ranger'],basket:true},
  {file:'arin-fox-22-gift.wav',chapter:'الهدية',caption:'وضعت أَرين السلة على الطاولة وقدمت لجدتها الزهرة الجميلة.',theme:'garden',actors:['arin','grandma'],basket:true},
  {file:'arin-fox-23-fox-apology.wav',chapter:'اعتذار الثعلب',caption:'اقترب الثعلب من بعيد واعتذر عما فعله.',theme:'garden',actors:['arin','grandma','fox']},
  {file:'arin-fox-24-return.wav',chapter:'طريق العودة',caption:'حان وقت العودة، فرافق الحارس أَرين في جزء من الطريق.',theme:'return',actors:['arin','ranger'],basket:true},
  {file:'arin-fox-25-mother-final.wav',chapter:'في البيت',caption:'عادت أَرين إلى أمها وحكت لها عن المغامرة.',theme:'home',actors:['arin','mother']},
  {file:'arin-fox-26-moral.wav',chapter:'ما تعلمته أَرين',caption:'تعلمت أَرين أن اللطف لا يعني الثقة بكل شخص، وأن طلب المساعدة تصرف شجاع.',theme:'ending',actors:['arin','mother']},
  {file:'arin-fox-27-ending.wav',chapter:'النهاية',caption:'أما الثعلب، ففي المرة التالية لوّح من بعيد وقال: صباح الخير! ثم أكمل طريقه.',theme:'ending',actors:['arin','fox']}
];

const STORIES=[{id:'arin-fox',title:'أرين والثعلب',typeLabel:'استمع وشاهد',durationLabel:'8 دقائق',description:'حكاية مصورة بصوت راوية، تعمل تلقائيًا من البداية إلى النهاية.',segments:ARIN_FOX_SEGMENTS}];
const player={story:null,index:0,finished:false,token:0};
const audio=new Audio();audio.preload='auto';
let nextAudio=null;

function storyActor(id,x,y,scale=1,facing='right',mood='smile',pose='stand'){
  const flip=facing==='left'?-scale:scale;
  const wrap=(inner,extra='')=>`<g class="actor actor-${id} ${extra}" transform="translate(${x} ${y}) scale(${flip} ${scale})">${inner}</g>`;
  if(id==='arin'){
    const mouth=mood==='worried'?'M-7 43 Q0 37 7 43':mood==='surprised'?'M-3 40 Q0 47 3 40':'M-8 40 Q0 48 8 40';
    const leftArm=pose==='wave'?'M-34 94 Q-62 74 -67 48':'M-34 94 Q-54 108 -50 130';
    const rightArm=pose==='hold'?'M34 94 Q50 105 42 126':'M34 94 Q54 108 51 130';
    return wrap(`<ellipse cx="0" cy="176" rx="45" ry="10" fill="#335744" opacity=".13"/><path d="${leftArm}" fill="none" stroke="#f3c7aa" stroke-width="14" stroke-linecap="round"/><path d="${rightArm}" fill="none" stroke="#f3c7aa" stroke-width="14" stroke-linecap="round"/><path d="M-46 78 Q0 54 46 78 L54 151 L-54 151Z" fill="#d96678"/><path d="M-18 80 Q0 91 18 80 L15 128 L-15 128Z" fill="#fff1df"/><circle cx="0" cy="34" r="31" fill="#f3c7aa"/><path d="M-32 26 Q-25 -8 0 -10 Q25 -8 32 26 L29 2 Q0 -18 -29 2Z" fill="#5a4036"/><g class="actor-eyes"><circle cx="-11" cy="33" r="4.3" fill="#253646"/><circle cx="11" cy="33" r="4.3" fill="#253646"/><circle cx="-10" cy="32" r="1.2" fill="#fff"/><circle cx="12" cy="32" r="1.2" fill="#fff"/></g><path d="M-2 37 Q0 40 2 37" fill="none" stroke="#d49a83" stroke-width="2"/><path d="${mouth}" fill="none" stroke="#8a4e5b" stroke-width="2.7" stroke-linecap="round"/><circle cx="-18" cy="43" r="4" fill="#ef9aad" opacity=".48"/><circle cx="18" cy="43" r="4" fill="#ef9aad" opacity=".48"/><path d="M-19 151 L-19 176" stroke="#f3c7aa" stroke-width="12" stroke-linecap="round"/><path d="M19 151 L19 176" stroke="#f3c7aa" stroke-width="12" stroke-linecap="round"/><path d="M-29 176 h22" stroke="#755046" stroke-width="9" stroke-linecap="round"/><path d="M7 176 h22" stroke="#755046" stroke-width="9" stroke-linecap="round"/>`,pose==='walk'?'actor-walk':'actor-bob');
  }
  if(id==='mother'){
    const rightArm=pose==='point'?'M42 98 Q70 84 86 64':pose==='wave'?'M42 98 Q72 75 76 49':'M42 98 Q60 110 64 132';
    return wrap(`<ellipse cx="0" cy="187" rx="49" ry="10" fill="#335744" opacity=".12"/><path d="M-42 98 Q-58 112 -50 132" fill="none" stroke="#efc3a5" stroke-width="15" stroke-linecap="round"/><path class="${pose==='wave'?'actor-arm-wave':''}" d="${rightArm}" fill="none" stroke="#efc3a5" stroke-width="15" stroke-linecap="round"/><path d="M-52 82 Q0 55 52 82 L60 168 L-60 168Z" fill="#71b39d"/><circle cx="0" cy="36" r="32" fill="#efc3a5"/><path d="M-33 27 Q-26 -10 0 -12 Q26 -10 33 27 L31 2 Q0 -17 -31 2Z" fill="#4f4038"/><g class="actor-eyes"><circle cx="-11" cy="35" r="4" fill="#293b48"/><circle cx="11" cy="35" r="4" fill="#293b48"/></g><path d="M-8 50 Q0 57 8 50" fill="none" stroke="#895766" stroke-width="2.8" stroke-linecap="round"/><path d="M-20 168 L-20 193" stroke="#efc3a5" stroke-width="12" stroke-linecap="round"/><path d="M20 168 L20 193" stroke="#efc3a5" stroke-width="12" stroke-linecap="round"/><path d="M-30 192 h23" stroke="#547d70" stroke-width="10" stroke-linecap="round"/><path d="M7 192 h23" stroke="#547d70" stroke-width="10" stroke-linecap="round"/>`,'actor-bob');
  }
  if(id==='grandma'){
    if(pose==='window') return `<g class="actor actor-grandma"><circle cx="${x}" cy="${y}" r="28" fill="#e8c3a8"/><path d="M${x-27} ${y-11} Q${x} ${y-44} ${x+27} ${y-11}" fill="none" stroke="#edf0ef" stroke-width="15" stroke-linecap="round"/><circle cx="${x-10}" cy="${y}" r="10" fill="none" stroke="#5b6068" stroke-width="3"/><circle cx="${x+10}" cy="${y}" r="10" fill="none" stroke="#5b6068" stroke-width="3"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y}" stroke="#5b6068" stroke-width="3"/><g class="actor-eyes"><circle cx="${x-10}" cy="${y}" r="3" fill="#283946"/><circle cx="${x+10}" cy="${y}" r="3" fill="#283946"/></g><path d="M${x-7} ${y+14} Q${x} ${y+20} ${x+7} ${y+14}" fill="none" stroke="#845b65" stroke-width="2.5"/></g>`;
    return wrap(`<ellipse cx="0" cy="178" rx="44" ry="10" fill="#335744" opacity=".12"/><path d="M-39 94 Q-54 109 -46 130" fill="none" stroke="#e8c3a8" stroke-width="13" stroke-linecap="round"/><path d="M39 94 Q55 108 59 130" fill="none" stroke="#e8c3a8" stroke-width="13" stroke-linecap="round"/><path d="M-47 84 Q0 60 47 84 L55 158 L-55 158Z" fill="#9d90d8"/><circle cx="0" cy="39" r="30" fill="#e8c3a8"/><path d="M-29 28 Q0 -7 29 28" fill="none" stroke="#edf0ef" stroke-width="16" stroke-linecap="round"/><circle cx="-11" cy="39" r="11" fill="none" stroke="#5b6068" stroke-width="3"/><circle cx="11" cy="39" r="11" fill="none" stroke="#5b6068" stroke-width="3"/><g class="actor-eyes"><circle cx="-11" cy="39" r="3" fill="#283946"/><circle cx="11" cy="39" r="3" fill="#283946"/></g><path d="M-7 53 Q0 59 7 53" fill="none" stroke="#845b65" stroke-width="2.5"/><path d="M-18 158 L-18 182" stroke="#e8c3a8" stroke-width="11" stroke-linecap="round"/><path d="M18 158 L18 182" stroke="#e8c3a8" stroke-width="11" stroke-linecap="round"/>`,'actor-bob');
  }
  if(id==='fox'){
    const mouth=mood==='sorry'?'M-9 59 Q0 53 9 59':mood==='thinking'?'M-8 58 Q0 55 8 58':'M-10 56 Q0 65 10 56';
    const ears=mood==='sorry'?8:0;
    return wrap(`<ellipse cx="8" cy="147" rx="64" ry="11" fill="#335744" opacity=".12"/><ellipse cx="18" cy="107" rx="56" ry="39" fill="#e78b47"/><circle cx="-22" cy="50" r="34" fill="#ed9550"/><path d="M-49 29 L-35 ${-6+ears} L-17 23Z" fill="#ed9550"/><path d="M-2 23 L14 ${-7+ears} L24 31Z" fill="#ed9550"/><path d="M-42 27 L-35 5 L-21 22Z" fill="#f3cab0"/><path d="M1 21 L14 4 L18 27Z" fill="#f3cab0"/><g class="actor-eyes"><ellipse cx="-34" cy="49" rx="5" ry="6" fill="#233846"/><ellipse cx="-10" cy="49" rx="5" ry="6" fill="#233846"/></g><ellipse cx="-24" cy="65" rx="20" ry="14" fill="#f8e4ce"/><circle cx="-39" cy="62" r="4" fill="#3b3532"/><path d="${mouth}" fill="none" stroke="#9d6049" stroke-width="3" stroke-linecap="round"/><path class="fox-tail" d="M60 105 Q123 72 154 111 Q148 139 118 148 Q91 155 56 133Z" fill="#e78b47"/><path d="M123 118 Q143 111 154 122 Q147 136 128 139Z" fill="#f6e2c7"/><path d="M-10 136 Q5 124 20 136" fill="none" stroke="#ce7139" stroke-width="11" stroke-linecap="round"/><path d="M18 137 Q33 124 48 136" fill="none" stroke="#ce7139" stroke-width="11" stroke-linecap="round"/>`,pose==='run'?'actor-walk':'actor-fox-body');
  }
  if(id==='ranger'){
    const arm=pose==='stop'?'M43 101 Q70 80 91 72':'M43 101 Q61 113 63 134';
    return wrap(`<ellipse cx="0" cy="192" rx="50" ry="10" fill="#335744" opacity=".12"/><path d="M-43 101 Q-60 114 -51 135" fill="none" stroke="#c9946e" stroke-width="14" stroke-linecap="round"/><path d="${arm}" fill="none" stroke="#c9946e" stroke-width="14" stroke-linecap="round"/><rect x="-54" y="84" width="108" height="91" rx="23" fill="#638c6e"/><circle cx="0" cy="40" r="31" fill="#c9946e"/><path d="M-37 30 L37 30 L27 8 L-27 8Z" fill="#4e7657"/><path d="M-27 27 Q0 -2 27 27" fill="none" stroke="#4a4038" stroke-width="12" stroke-linecap="round"/><g class="actor-eyes"><circle cx="-11" cy="40" r="3.6" fill="#293946"/><circle cx="11" cy="40" r="3.6" fill="#293946"/></g><path d="M-7 54 Q0 60 7 54" fill="none" stroke="#80594e" stroke-width="2.8"/><path d="M-20 175 L-20 199" stroke="#c9946e" stroke-width="12" stroke-linecap="round"/><path d="M20 175 L20 199" stroke="#c9946e" stroke-width="12" stroke-linecap="round"/>`,'actor-bob');
  }
  return '';
}
function storyBasket(x,y,scale=1){return `<g class="story-basket" transform="translate(${x} ${y}) scale(${scale})"><path d="M-25 8 Q0 -9 25 8 L21 36 L-21 36Z" fill="#c79247" stroke="#8b6538" stroke-width="3"/><path d="M-15 8 Q0 -18 15 8" fill="none" stroke="#8b6538" stroke-width="4" stroke-linecap="round"/></g>`}
function storyHouse(x=565,y=190,scale=1){return `<g class="story-house" transform="translate(${x} ${y}) scale(${scale})"><ellipse cx="110" cy="214" rx="122" ry="12" fill="#335744" opacity=".1"/><rect x="0" y="40" width="220" height="170" rx="12" fill="#fff5e0" stroke="#c99d69" stroke-width="5"/><path d="M-28 58 L110 -42 L248 58Z" fill="#d67257"/><rect x="96" y="118" width="56" height="92" rx="8" fill="#9b7552"/><rect x="28" y="84" width="56" height="52" rx="8" fill="#bfe4ef" stroke="#8cb8c7" stroke-width="4"/></g>`}
function storyLayout(segment={}){
  const f=segment.file||'cover',theme=segment.theme||'forest';
  const out={house:['village','home','grandma','garden'].includes(theme),path:['village','forest','fox','return','ending'].includes(theme),actors:[],basket:!!segment.basket,extras:''};
  const add=(id,x,y,s=1,face='right',mood='smile',pose='stand')=>out.actors.push({id,x,y,s,face,mood,pose});
  switch(f){
    case 'arin-fox-01-intro.wav':add('arin',360,238,1.05);break;
    case 'arin-fox-02-basket.wav':add('arin',305,240,1,'right','smile','hold');add('mother',500,222,1.06,'left');break;
    case 'arin-fox-03-advice.wav':add('arin',305,240,1,'right','smile','hold');add('mother',500,222,1.06,'left','smile','point');break;
    case 'arin-fox-04-leave-home.wav':add('arin',330,240,1,'right','smile','walk');add('mother',650,222,.94,'left','smile','wave');break;
    case 'arin-fox-05-forest-road.wav':add('arin',370,240,1.02,'right','smile','walk');break;
    case 'arin-fox-06-fox-appears.wav':add('arin',270,242,1,'right','surprised','hold');add('fox',610,287,1.02,'left');break;
    case 'arin-fox-07-where-going.wav':add('arin',275,242,1,'right','smile','hold');add('fox',610,287,1.02,'left');break;
    case 'arin-fox-08-basket-smell.wav':add('arin',270,242,1,'right','worried','hold');add('fox',610,287,1.02,'left','thinking');break;
    case 'arin-fox-09-shortcut.wav':add('fox',470,288,1.05,'right','thinking','run');break;
    case 'arin-fox-10-flower.wav':add('arin',360,242,1,'right','smile','hold');out.extras='<g><path d="M305 430V395" stroke="#5ca867" stroke-width="4"/><circle cx="305" cy="389" r="9" fill="#ff8f8f"/><circle cx="296" cy="394" r="8" fill="#ffd75b"/><circle cx="314" cy="394" r="8" fill="#a98be6"/></g>';break;
    case 'arin-fox-11-grandma-door.wav':add('grandma',615,286,1,'left','smile','window');add('fox',475,303,.98,'right');break;
    case 'arin-fox-12-tail.wav':add('grandma',615,286,1,'left','smile','window');add('fox',475,303,.98,'right','thinking');break;
    case 'arin-fox-13-waiting-fox.wav':add('fox',500,305,1,'right','thinking');break;
    case 'arin-fox-14-arin-arrives.wav':add('arin',240,244,1,'right','surprised','hold');add('fox',520,306,.96,'right');break;
    case 'arin-fox-15-arin-refuses.wav':add('arin',230,245,1,'right','worried','hold');add('fox',525,306,.96,'right');break;
    case 'arin-fox-16-grandma-calls.wav':add('arin',260,244,1,'right','smile','hold');add('grandma',615,286,1,'left','smile','window');break;
    case 'arin-fox-17-ranger-arrives.wav':add('arin',205,245,.95,'right','worried','hold');add('ranger',430,222,1,'right','smile','stop');add('fox',625,307,.92,'left','thinking');break;
    case 'arin-fox-18-ranger-talks.wav':add('ranger',385,222,1.02,'right','smile','stop');add('fox',610,307,.95,'left','thinking');break;
    case 'arin-fox-19-fox-admits.wav':add('ranger',385,222,1.02,'right');add('fox',610,307,.95,'left','sorry');break;
    case 'arin-fox-20-lesson.wav':add('ranger',385,222,1.02,'right','smile','stop');add('fox',610,307,.95,'left','sorry');break;
    case 'arin-fox-21-grandma-opens.wav':add('arin',420,245,1,'right','smile');add('grandma',560,228,1,'left');add('ranger',735,225,.88,'left');break;
    case 'arin-fox-22-gift.wav':add('arin',420,245,1,'right','smile','hold');add('grandma',560,228,1,'left');break;
    case 'arin-fox-23-fox-apology.wav':add('fox',275,309,.86,'right','sorry');add('arin',445,245,1,'left');add('grandma',585,228,.98,'left');break;
    case 'arin-fox-24-return.wav':add('arin',325,245,1,'right','smile','walk');add('ranger',480,223,1,'right');break;
    case 'arin-fox-25-mother-final.wav':add('arin',355,242,1,'right','smile');add('mother',525,222,1.05,'left');break;
    case 'arin-fox-26-moral.wav':add('arin',355,242,1,'right','smile');add('mother',525,222,1.05,'left');break;
    case 'arin-fox-27-ending.wav':add('arin',280,245,.96,'right','smile');add('fox',620,307,.94,'left');out.house=false;break;
    default:add('arin',300,242,1,'right','smile','hold');add('fox',590,305,.96,'left');out.house=false;out.path=true;
  }
  return out;
}
function sceneSvg(segment={}){
  const theme=segment.theme||'forest',night=theme==='grandma',layout=storyLayout(segment);
  const actors=layout.actors.map(a=>storyActor(a.id,a.x,a.y,a.s,a.face,a.mood,a.pose)).join('');
  const basket=layout.basket?storyBasket(layout.actors.find(a=>a.id==='arin')?.x+44||405,375,.82):'';
  return `<svg class="story-svg" viewBox="0 0 900 520" aria-hidden="true"><defs><linearGradient id="storySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night?'#a7d1e3':'#bfeaf4'}"/><stop offset="1" stop-color="${night?'#edf4df':'#f4f7d2'}"/></linearGradient><linearGradient id="storyGround" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a9d97d"/><stop offset="1" stop-color="#74ba67"/></linearGradient></defs><rect width="900" height="520" fill="url(#storySky)"/><circle cx="106" cy="90" r="46" fill="#ffd963" opacity="${night?'.55':'1'}"/><g class="story-cloud-svg" fill="#fff" opacity=".88"><ellipse cx="320" cy="90" rx="60" ry="25"/><ellipse cx="360" cy="84" rx="40" ry="30"/><ellipse cx="399" cy="94" rx="52" ry="23"/></g><path d="M0 330 C130 255 250 290 360 324 C500 258 650 264 900 320 L900 520 L0 520Z" fill="#95ce78"/><path d="M0 382 C170 330 320 348 470 380 C630 330 760 344 900 376 L900 520 L0 520Z" fill="url(#storyGround)"/>${layout.path?'<path d="M362 520 C382 453 420 413 468 384 C516 356 548 330 564 298" fill="none" stroke="#efdaa7" stroke-width="76" stroke-linecap="round" opacity=".92"/>':''}<g class="story-tree-svg"><rect x="88" y="220" width="36" height="176" rx="16" fill="#8a613c"/><circle cx="106" cy="198" r="74" fill="#5fa95a"/><circle cx="63" cy="216" r="50" fill="#6fba63"/><circle cx="148" cy="214" r="52" fill="#6fba63"/></g><g class="story-tree-svg"><rect x="738" y="224" width="34" height="172" rx="16" fill="#8a613c"/><circle cx="756" cy="204" r="70" fill="#5b9f55"/><circle cx="716" cy="220" r="45" fill="#70b866"/><circle cx="796" cy="217" r="47" fill="#70b866"/></g>${layout.house?storyHouse():''}${layout.extras}${actors}${basket}<g class="story-sparkles-svg" fill="#fff6a5"><circle cx="250" cy="164" r="5"/><circle cx="670" cy="130" r="4"/><circle cx="440" cy="225" r="3"/></g></svg>`;
}

function installScreens(){
  $('#storyScreen')?.remove();
  const stage=$('.stage');if(!stage)return;
  const library=document.createElement('section');library.id='storyLibraryScreen';library.className='screen story-library-screen';library.setAttribute('aria-hidden','true');library.innerHTML=`<div class="story-library-shell"><div class="story-library-topbar"><button class="back-button focusable story-library-back" id="storyLibraryBackButton" type="button" data-focusable aria-label="العودة للرئيسية">←</button><div class="story-library-heading"><span class="eyebrow">استمع وشاهد</span><h2>مكتبة القصص</h2><p>اختر الغلاف، وستبدأ الحكاية بصوت الراوية.</p></div></div><div class="story-library-grid" id="storyLibraryGrid"></div></div>`;
  const playerScreen=document.createElement('section');playerScreen.id='storyNarratedScreen';playerScreen.className='screen story-screen';playerScreen.setAttribute('aria-hidden','true');playerScreen.innerHTML=`<div class="story-player-shell"><div class="story-player-topbar"><button class="back-button focusable story-back" id="storyBackButton" type="button" data-focusable aria-label="العودة لمكتبة القصص">←</button><div class="story-player-heading"><span class="eyebrow">قصة مسموعة مصورة</span><h2 id="storyTitle">أرين والثعلب</h2><p id="storyChapterTitle">بداية الحكاية</p></div><div class="story-progress" id="storyProgress" role="progressbar" aria-valuemin="1" aria-valuemax="27" aria-valuenow="1"><strong id="storyProgressText">1 / 27</strong><span class="story-progress-track"><span id="storyProgressFill"></span></span></div></div><div class="story-stage-card"><div class="story-visual" id="storyVisual"></div><div class="story-caption-panel"><span class="story-kicker">الراوية</span><p id="storyNarration">كان يا ما كان...</p><span class="story-path-note" id="storyPathNote">تعمل القصة تلقائيًا من البداية إلى النهاية.</span></div></div><div class="story-controls" id="storyControls"><button class="story-control focusable" id="storyPlayPauseButton" type="button" data-focusable data-autofocus><span class="story-control-icon" id="storyPlayPauseIcon">Ⅱ</span><span id="storyPlayPauseText">إيقاف مؤقت</span></button><button class="story-control focusable" id="storyReplaySegmentButton" type="button" data-focusable><span class="story-control-icon">↻</span><span>إعادة الجزء</span></button></div><div class="story-ending hidden" id="storyEnding" aria-hidden="true"><strong>انتهت الحكاية ✨</strong><span>هل نسمعها مرة أخرى؟</span><div class="story-ending-actions"><button class="story-control focusable" id="storyReplayStoryButton" type="button" data-focusable><span class="story-control-icon">↻</span><span>مرة أخرى</span></button><button class="story-control focusable" id="storyChooseAnotherButton" type="button" data-focusable><span class="story-control-icon">▦</span><span>مكتبة القصص</span></button></div></div></div>`;
  stage.insertBefore(library,$('#gameScreen'));stage.insertBefore(playerScreen,$('#gameScreen'));
}

function renderLibrary(){
  const grid=$('#storyLibraryGrid');if(!grid)return;grid.innerHTML='';
  STORIES.forEach((story,index)=>{const card=document.createElement('button');card.type='button';card.className='story-cover-card focusable';card.dataset.focusable='';if(index===0)card.dataset.autofocus='';card.innerHTML=`<span class="story-cover-art">${sceneSvg({theme:'forest',actors:['arin','fox'],basket:true})}<span class="story-cover-play">▶</span></span><span class="story-cover-copy"><span class="story-type-badge">${story.typeLabel}</span><strong>${story.title}</strong><small>${story.description}</small><span class="story-duration">◷ ${story.durationLabel}</span></span>`;card.addEventListener('click',()=>openStory(story.id));grid.appendChild(card)});
}

function setFocus(el){if(!el)return;document.querySelectorAll('.tv-focus').forEach(node=>node.classList.remove('tv-focus'));try{el.focus({preventScroll:true})}catch{el.focus()}el.classList.add('tv-focus')}
function setActiveScreen(id){document.querySelectorAll('.screen').forEach(screen=>{const active=screen.id===id;screen.classList.toggle('screen-active',active);screen.setAttribute('aria-hidden',active?'false':'true')});$('#hud')?.classList.add('hidden');$('#settingsButton')?.classList.add('hidden');$('#soundButton')?.classList.add('hidden');setTimeout(()=>setFocus($(`#${id} [data-autofocus]`)||$(`#${id} [data-focusable]`)),60)}
function returnHome(){stopAudio();document.querySelectorAll('.screen').forEach(screen=>{const active=screen.id==='homeScreen';screen.classList.toggle('screen-active',active);screen.setAttribute('aria-hidden',active?'false':'true')});$('#settingsButton')?.classList.remove('hidden');$('#soundButton')?.classList.remove('hidden');setTimeout(()=>setFocus($('#startButton')),60)}
function openLibrary(){stopAudio();renderLibrary();setActiveScreen('storyLibraryScreen')}
function audioPath(segment){return `${STORY_AUDIO_BASE}${segment.file}`}
function stopAudio(){player.token++;audio.pause();audio.removeAttribute('src');audio.load();nextAudio=null;player.finished=false}
function preloadNext(){const next=player.story?.segments?.[player.index+1];if(!next){nextAudio=null;return}nextAudio=new Audio();nextAudio.preload='auto';nextAudio.src=audioPath(next)}
function syncControls(){const paused=audio.paused||player.finished;const text=$('#storyPlayPauseText'),icon=$('#storyPlayPauseIcon'),button=$('#storyPlayPauseButton');if(!button)return;button.disabled=player.finished;if(text)text.textContent=paused?'متابعة':'إيقاف مؤقت';if(icon)icon.textContent=paused?'▶':'Ⅱ'}
function renderSegment(){const story=player.story,segment=story?.segments?.[player.index];if(!story||!segment)return;$('#storyChapterTitle').textContent=segment.chapter;$('#storyNarration').textContent=segment.caption;const visual=$('#storyVisual');visual.className=`story-visual story-theme-${segment.theme}`;visual.innerHTML=`<div class="story-scene-enter">${sceneSvg(segment)}</div>`;const current=player.index+1,total=story.segments.length;$('#storyProgressText').textContent=`${current} / ${total}`;$('#storyProgressFill').style.transform=`scaleX(${current/total})`;$('#storyProgress').setAttribute('aria-valuenow',String(current));$('#storyEnding').classList.add('hidden');$('#storyEnding').setAttribute('aria-hidden','true');$('#storyControls').classList.remove('hidden');player.finished=false;syncControls()}
async function playSegment(restart=true){const segment=player.story?.segments?.[player.index];if(!segment)return;const token=++player.token;renderSegment();if(restart||audio.src!==new URL(audioPath(segment),location.href).href){audio.src=audioPath(segment);audio.load()}audio.muted=localStorage.getItem('bubbleSafariMuted')==='1';preloadNext();try{await audio.play();if(token===player.token)syncControls()}catch{if(token===player.token){syncControls();$('#storyPathNote').textContent='اضغط متابعة لبدء صوت الراوية.'}}}
function openStory(id){const story=STORIES.find(item=>item.id===id)||STORIES[0];stopAudio();player.story=story;player.index=0;player.finished=false;$('#storyTitle').textContent=story.title;$('#storyPathNote').textContent='تعمل القصة تلقائيًا من البداية إلى النهاية.';setActiveScreen('storyNarratedScreen');playSegment(true)}
function finishStory(){player.finished=true;audio.pause();syncControls();$('#storyControls').classList.add('hidden');$('#storyEnding').classList.remove('hidden');$('#storyEnding').setAttribute('aria-hidden','false');$('#storyPathNote').textContent='انتهت القصة. لن تبدأ قصة أخرى تلقائيًا.';setTimeout(()=>setFocus($('#storyReplayStoryButton')),70)}
function togglePlayback(){if(player.finished)return;if(audio.paused){audio.play().then(syncControls).catch(()=>{syncControls();$('#storyPathNote').textContent='اضغط متابعة لبدء صوت الراوية.'})}else{audio.pause();syncControls()}}
function replaySegment(){if(!player.story)return;audio.currentTime=0;audio.play().then(syncControls).catch(()=>{syncControls();$('#storyPathNote').textContent='اضغط متابعة لبدء صوت الراوية.'})}
function replayStory(){player.index=0;player.finished=false;$('#storyControls').classList.remove('hidden');playSegment(true);setTimeout(()=>setFocus($('#storyPlayPauseButton')),70)}

function wire(){
  const homeCard=$('[data-home-section="stories"]');if(homeCard){homeCard.id='storiesButton';const badge=$('.mode-badge',homeCard),title=$('.mode-copy strong',homeCard),copy=$('.mode-copy small',homeCard);if(badge)badge.textContent='جديد';if(title)title.textContent='القصص';if(copy)copy.textContent='قصص مسموعة ومصورة للأطفال'}
  window.addEventListener('click',event=>{const card=event.target.closest?.('[data-home-section="stories"]');if(card){event.preventDefault();event.stopImmediatePropagation();openLibrary()}},true);
  $('#storyLibraryBackButton').addEventListener('click',returnHome);$('#storyBackButton').addEventListener('click',()=>{stopAudio();setActiveScreen('storyLibraryScreen')});$('#storyPlayPauseButton').addEventListener('click',togglePlayback);$('#storyReplaySegmentButton').addEventListener('click',replaySegment);$('#storyReplayStoryButton').addEventListener('click',replayStory);$('#storyChooseAnotherButton').addEventListener('click',()=>{stopAudio();setActiveScreen('storyLibraryScreen')});
  window.addEventListener('keydown',event=>{if(!$('#storyLibraryScreen')?.classList.contains('screen-active')&&!$('#storyNarratedScreen')?.classList.contains('screen-active'))return;const back=['Escape','BrowserBack','GoBack'].includes(event.key)||[4,27,461,10009].includes(event.keyCode||event.which);if(!back)return;event.preventDefault();event.stopImmediatePropagation();if($('#storyNarratedScreen').classList.contains('screen-active')){stopAudio();setActiveScreen('storyLibraryScreen')}else returnHome()},true);
  audio.addEventListener('ended',()=>{if(player.finished||!player.story)return;if(player.index>=player.story.segments.length-1){finishStory();return}player.index++;playSegment(true)});audio.addEventListener('play',syncControls);audio.addEventListener('pause',syncControls);audio.addEventListener('error',()=>{$('#storyPathNote').textContent='تعذر تشغيل هذا الجزء الآن. اختر إعادة الجزء للمحاولة.';syncControls()});
}

function init(){installScreens();renderLibrary();wire()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});else setTimeout(init,0);
