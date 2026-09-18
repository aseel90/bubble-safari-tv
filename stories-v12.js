const $=(selector,root=document)=>root.querySelector(selector);
const STORY_AUDIO_BASE='./audio/stories/arin-fox/';
const STORY_AUDIO_VERSION='v37';
const STORY_AUTO_NOTE='تعمل القصة تلقائيًا من البداية إلى النهاية.';

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
  {file:'arin-fox-23-fox-apology-v2.wav',chapter:'اعتذار الثعلب',caption:'اعتذر الثعلب، وذكّرته الجدة أن يتعلم من خطئه، فوعد ألا يخيف أحدًا مرة أخرى.',theme:'garden',actors:['arin','grandma','fox'],autoAdvanceDelayMs:900},
  {file:'arin-fox-24-return.wav',chapter:'طريق العودة',caption:'حان وقت العودة، فرافق الحارس أَرين في جزء من الطريق.',theme:'return',actors:['arin','ranger'],basket:true},
  {file:'arin-fox-25-mother-final.wav',chapter:'في البيت',caption:'عادت أَرين إلى أمها وحكت لها عن المغامرة.',theme:'home',actors:['arin','mother']},
  {file:'arin-fox-26-moral.wav',chapter:'ما تعلمته أَرين',caption:'تعلمت أَرين أن اللطف لا يعني الثقة بكل شخص، وأن طلب المساعدة تصرف شجاع.',theme:'ending',actors:['arin','mother']},
  {file:'arin-fox-27-ending.wav',chapter:'النهاية',caption:'أما الثعلب، ففي المرة التالية لوّح من بعيد وقال: صباح الخير! ثم أكمل طريقه.',theme:'ending',actors:['arin','fox']}
];

const STORIES=[{id:'arin-fox',title:'أرين والثعلب',typeLabel:'استمع وشاهد',durationLabel:'8 دقائق',description:'حكاية مصورة بصوت راوية، تعمل تلقائيًا من البداية إلى النهاية.',segments:ARIN_FOX_SEGMENTS}];
const player={story:null,index:0,partIndex:0,finished:false,token:0,partBoundaryHandled:false};
const audio=new Audio();audio.preload='auto';
let nextAudio=null;
let autoAdvanceTimer=null;
let storySvgSeq=0;

const STORY_SPRITES_URL='./story-sprites.svg?v=1';

async function ensureStorySprites(){
  if(document.getElementById('storySpriteBank'))return;
  const response=await fetch(STORY_SPRITES_URL,{cache:'force-cache'});
  if(!response.ok)throw new Error(`Story sprites ${response.status}`);
  const xml=await response.text();
  const parsed=new DOMParser().parseFromString(xml,'image/svg+xml');
  if(parsed.querySelector('parsererror'))throw new Error('Invalid story sprite SVG');
  const sprite=document.importNode(parsed.documentElement,true);
  sprite.id='storySpriteBank';
  sprite.setAttribute('aria-hidden','true');
  sprite.setAttribute('focusable','false');
  sprite.style.cssText='position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  document.body.prepend(sprite);
}

const STORY_VISUALS={
  'arin-fox-01-intro.wav':{shot:'solo',actors:['arin-stand']},
  'arin-fox-02-basket.wav':{shot:'duo',actors:['arin-basket','mother-stand']},
  'arin-fox-03-advice.wav':{shot:'duo',actors:['arin-basket','mother-point']},
  'arin-fox-04-leave-home.wav':{shot:'duo',actors:['arin-wave-basket','mother-wave']},
  'arin-fox-05-forest-road.wav':{shot:'solo',actors:[{id:'arin-walk-basket',anim:'walk'}]},
  'arin-fox-06-fox-appears.wav':{shot:'duo',actors:['arin-worried-basket','fox-stand']},
  'arin-fox-07-where-going.wav':{shot:'duo',actors:['arin-worried-basket','fox-stand']},
  'arin-fox-08-basket-smell.wav':{shot:'duo',actors:['arin-worried-basket','fox-stand']},
  'arin-fox-09-shortcut.wav':{shot:'solo',actors:[{id:'fox-run',anim:'walk'}]},
  'arin-fox-10-flower.wav':{shot:'solo-left',actors:['arin-basket'],extras:[{id:'prop-flower',x:520,y:438,s:.82}]},
  'arin-fox-11-grandma-door.wav':{shot:'house-window',actors:['fox-stand','grandma-window']},
  'arin-fox-12-tail.wav':{shot:'house-window',actors:['fox-stand','grandma-window']},
  'arin-fox-13-waiting-fox.wav':{shot:'solo-left',actors:['fox-sorry']},
  'arin-fox-14-arin-arrives.wav':{shot:'duo',actors:['arin-worried-basket','fox-stand']},
  'arin-fox-15-arin-refuses.wav':{shot:'duo',actors:['arin-worried-basket','fox-sorry']},
  'arin-fox-16-grandma-calls.wav':{shot:'house-window',actors:['arin-basket','grandma-window']},
  'arin-fox-17-ranger-arrives.wav':{shot:'trio',actors:['arin-worried-basket','ranger-stop','fox-stand']},
  'arin-fox-18-ranger-talks.wav':{shot:'duo',actors:['ranger-stop','fox-stand']},
  'arin-fox-19-fox-admits.wav':{shot:'duo',actors:['ranger-stand','fox-sorry']},
  'arin-fox-20-lesson.wav':{shot:'duo',actors:['ranger-stop','fox-sorry']},
  'arin-fox-21-grandma-opens.wav':{shot:'house-trio',actors:['arin-stand','grandma-stand','ranger-stand'],houseX:625},
  'arin-fox-22-gift.wav':{shot:'gift',actors:['arin-stand','grandma-stand'],extras:[{id:'prop-table',x:620,y:438,s:.88},{id:'prop-basket',x:592,y:372,s:.58},{id:'prop-flower',x:642,y:365,s:.47}],houseX:630},
  'arin-fox-23-fox-apology-v2.wav':{shot:'house-trio',actors:['fox-sorry','arin-stand','grandma-stand'],houseX:625},
  'arin-fox-24-return.wav':{shot:'duo',actors:['ranger-wave',{id:'arin-walk-basket',anim:'walk'}],house:false,path:true},
  'arin-fox-25-mother-final.wav':{shot:'duo',actors:['arin-stand','mother-stand']},
  'arin-fox-26-moral.wav':{shot:'duo',actors:['arin-stand','mother-stand']},
  'arin-fox-27-ending.wav':{shot:'duo',actors:['arin-stand','fox-wave'],house:false,path:true}
};

const STORY_SHOTS={
  solo:[{x:450,y:438,s:1}],
  'solo-left':[{x:360,y:438,s:1}],
  duo:[{x:300,y:438,s:1},{x:600,y:438,s:1}],
  trio:[{x:210,y:438,s:.93},{x:450,y:438,s:.93},{x:690,y:438,s:.9}],
  'house-window':[{x:300,y:438,s:.96},{x:621,y:326,s:1}],
  'house-trio':[{x:190,y:438,s:.9},{x:365,y:438,s:.9},{x:520,y:438,s:.86}],
  gift:[{x:275,y:438,s:.96},{x:455,y:438,s:.94}]
};
const STORY_CHARACTER_SCALE={arin:.9,fox:.86,grandma:.92,ranger:.9,mother:.92};

function spriteKind(id=''){return id.split('-')[0]||'prop'}
function spriteUse(id,x,y,scale=1,{flip=false,anim='bob',prop=false}={}){
  const kind=spriteKind(id),base=prop?1:(STORY_CHARACTER_SCALE[kind]||.9),sx=(flip?-1:1)*base*scale,sy=base*scale;
  if(prop)return `<g class="story-prop story-${id}" transform="translate(${x} ${y}) scale(${sx} ${sy})"><use href="#${id}"/></g>`;
  return `<g class="actor actor-${kind}" transform="translate(${x} ${y}) scale(${sx} ${sy})"><g class="story-actor-motion actor-motion-${anim}"><use href="#${id}"/></g></g>`;
}
function storyHouse(x=565,y=190,scale=1){return `<g class="story-house" transform="translate(${x} ${y}) scale(${scale})"><ellipse cx="110" cy="214" rx="122" ry="12" fill="#335744" opacity=".1"/><rect x="0" y="40" width="220" height="170" rx="12" fill="#fff5e0" stroke="#c99d69" stroke-width="5"/><path d="M-28 58 L110 -42 L248 58Z" fill="#d67257"/><rect x="96" y="118" width="56" height="92" rx="8" fill="#9b7552"/><rect x="28" y="84" width="56" height="52" rx="8" fill="#bfe4ef" stroke="#8cb8c7" stroke-width="4"/></g>`}
function normalizeActor(entry){return typeof entry==='string'?{id:entry}:entry}
function storyLayout(segment={}){
  const theme=segment.theme||'forest';
  const fallbackActors=(segment.actors||['arin']).map(id=>id==='arin'?'arin-stand':id==='fox'?'fox-stand':id==='grandma'?'grandma-stand':id==='ranger'?'ranger-stand':id==='mother'?'mother-stand':'arin-stand');
  const cfg=STORY_VISUALS[segment.file]||{shot:fallbackActors.length>=3?'trio':fallbackActors.length===2?'duo':'solo',actors:fallbackActors};
  const slots=STORY_SHOTS[cfg.shot]||STORY_SHOTS.duo;
  const house=cfg.house??['village','home','grandma','garden'].includes(theme);
  const path=cfg.path??['village','forest','fox','return','ending'].includes(theme);
  const actors=(cfg.actors||fallbackActors).map((raw,index)=>{const a=normalizeActor(raw),slot=slots[Math.min(index,slots.length-1)];return{...slot,...a}});
  return{house,houseX:cfg.houseX??565,houseY:cfg.houseY??190,houseScale:cfg.houseScale??1,path,actors,extras:cfg.extras||[]};
}
function sceneSvg(segment={}){
  const theme=segment.theme||'forest',night=theme==='grandma',layout=storyLayout(segment),svgKey=++storySvgSeq,skyId=`storySky-${svgKey}`,groundId=`storyGround-${svgKey}`;
  const actors=layout.actors.map(a=>spriteUse(a.id,a.x,a.y,a.s,{flip:!!a.flip,anim:a.anim||'bob'})).join('');
  const extras=layout.extras.map(p=>spriteUse(p.id,p.x,p.y,p.s||1,{prop:true,flip:!!p.flip})).join('');
  return `<svg class="story-svg" viewBox="0 0 900 520" aria-hidden="true"><defs><linearGradient id="${skyId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night?'#a7d1e3':'#bfeaf4'}"/><stop offset="1" stop-color="${night?'#edf4df':'#f4f7d2'}"/></linearGradient><linearGradient id="${groundId}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a9d97d"/><stop offset="1" stop-color="#74ba67"/></linearGradient></defs><rect width="900" height="520" fill="url(#${skyId})"/><circle cx="106" cy="90" r="46" fill="#ffd963" opacity="${night?'.55':'1'}"/><g class="story-cloud-svg" fill="#fff" opacity=".88"><ellipse cx="320" cy="90" rx="60" ry="25"/><ellipse cx="360" cy="84" rx="40" ry="30"/><ellipse cx="399" cy="94" rx="52" ry="23"/></g><path d="M0 330 C130 255 250 290 360 324 C500 258 650 264 900 320 L900 520 L0 520Z" fill="#95ce78"/><path d="M0 382 C170 330 320 348 470 380 C630 330 760 344 900 376 L900 520 L0 520Z" fill="url(#${groundId})"/>${layout.path?'<path d="M362 520 C382 453 420 413 468 384 C516 356 548 330 564 298" fill="none" stroke="#efdaa7" stroke-width="76" stroke-linecap="round" opacity=".92"/>':''}<g class="story-tree-svg"><rect x="88" y="220" width="36" height="176" rx="16" fill="#8a613c"/><circle cx="106" cy="198" r="74" fill="#5fa95a"/><circle cx="63" cy="216" r="50" fill="#6fba63"/><circle cx="148" cy="214" r="52" fill="#6fba63"/></g><g class="story-tree-svg"><rect x="738" y="224" width="34" height="172" rx="16" fill="#8a613c"/><circle cx="756" cy="204" r="70" fill="#5b9f55"/><circle cx="716" cy="220" r="45" fill="#70b866"/><circle cx="796" cy="217" r="47" fill="#70b866"/></g>${layout.house?storyHouse(layout.houseX,layout.houseY,layout.houseScale):''}${extras}${actors}<g class="story-sparkles-svg" fill="#fff6a5"><circle cx="250" cy="164" r="5"/><circle cx="670" cy="130" r="4"/><circle cx="440" cy="225" r="3"/></g></svg>`;
}

function installScreens(){
  $('#storyScreen')?.remove();
  if($('#storyLibraryScreen'))return;
  ($('.stage')||document.body).insertAdjacentHTML('beforeend',`<section id="storyLibraryScreen" class="screen story-library-screen" aria-hidden="true"><div class="story-library-shell"><div class="story-library-topbar"><button id="storyLibraryBackButton" class="back-button focusable story-library-back" data-focusable type="button" aria-label="العودة">←</button><div class="story-library-heading"><span class="eyebrow">استمع وشاهد</span><h2>القصص</h2><p>اختر قصة لتعمل تلقائيًا من البداية حتى النهاية.</p></div><div class="story-library-count"><span>1</span><small>قصة</small></div></div><div id="storyLibraryGrid" class="story-library-grid"></div></div></section><section id="storyNarratedScreen" class="screen story-screen" aria-hidden="true"><div class="story-player-shell"><div class="story-player-topbar"><button id="storyBackButton" class="back-button focusable story-back" data-focusable type="button" aria-label="العودة للقصص">←</button><div class="story-player-heading"><span class="eyebrow">قصة مسموعة</span><h2 id="storyTitle">أرين والثعلب</h2><p id="storyChapterTitle">صباح جميل</p></div><div id="storyProgress" class="story-progress" role="progressbar" aria-valuemin="1" aria-valuemax="27" aria-valuenow="1"><strong id="storyProgressText">1 / 27</strong><span class="story-progress-track"><span id="storyProgressFill"></span></span></div></div><div class="story-stage-card"><div id="storyVisual" class="story-visual"></div><div class="story-caption-panel"><span class="story-kicker">الراوية</span><p id="storyNarration"></p><span id="storyPathNote" class="story-path-note">تعمل القصة تلقائيًا من البداية إلى النهاية.</span></div></div><div id="storyControls" class="story-controls"><button id="storyPlayPauseButton" class="story-control focusable" data-focusable data-autofocus type="button"><span id="storyPlayPauseIcon" class="story-control-icon">Ⅱ</span><span id="storyPlayPauseText">إيقاف مؤقت</span></button><button id="storyReplaySegmentButton" class="story-control focusable" data-focusable type="button"><span class="story-control-icon">↺</span><span>إعادة الجزء</span></button></div><div id="storyEnding" class="story-ending hidden" aria-hidden="true"><strong>أحسنت!</strong><span>انتهت القصة ولن تبدأ قصة أخرى تلقائيًا.</span><div class="story-ending-actions"><button id="storyReplayStoryButton" class="story-control focusable" data-focusable type="button">إعادة القصة</button><button id="storyChooseAnotherButton" class="story-control focusable" data-focusable type="button">اختيار قصة أخرى</button></div></div></div></section>`);
}
function renderLibrary(){const grid=$('#storyLibraryGrid');if(!grid)return;grid.innerHTML='';STORIES.forEach((story,index)=>{const card=document.createElement('button');card.type='button';card.className='story-cover-card focusable';card.dataset.focusable='';if(index===0)card.dataset.autofocus='';card.innerHTML=`<span class="story-cover-art">${sceneSvg({theme:'forest',actors:['arin','fox'],basket:true})}<span class="story-cover-play">▶</span></span><span class="story-cover-copy"><span class="story-type-badge">${story.typeLabel}</span><strong>${story.title}</strong><small>${story.description}</small><span class="story-duration">◷ ${story.durationLabel}</span></span>`;card.addEventListener('click',()=>openStory(story.id));grid.appendChild(card)});
}
function setFocus(el){if(!el)return;document.querySelectorAll('.tv-focus').forEach(node=>node.classList.remove('tv-focus'));try{el.focus({preventScroll:true})}catch{el.focus()}el.classList.add('tv-focus')}
function setActiveScreen(id){document.activeElement?.blur();document.querySelectorAll('.screen').forEach(screen=>{const active=screen.id===id;screen.classList.toggle('screen-active',active);screen.setAttribute('aria-hidden',active?'false':'true')});$('#hud')?.classList.add('hidden');$('#settingsButton')?.classList.add('hidden');$('#soundButton')?.classList.add('hidden');setTimeout(()=>setFocus($(`#${id} [data-autofocus]`)||$(`#${id} [data-focusable]`)),60)}
function returnHome(){stopAudio();document.activeElement?.blur();document.querySelectorAll('.screen').forEach(screen=>{const active=screen.id==='homeScreen';screen.classList.toggle('screen-active',active);screen.setAttribute('aria-hidden',active?'false':'true')});$('#settingsButton')?.classList.remove('hidden');$('#soundButton')?.classList.remove('hidden');setTimeout(()=>setFocus($('#startButton')),60)}
function openLibrary(){stopAudio();renderLibrary();setActiveScreen('storyLibraryScreen')}
function segmentAudioParts(segment){if(!segment)return[];return segment.audioParts?.length?segment.audioParts:[{file:segment.file,startAt:segment.startAt,endAt:segment.endAt}]}
function audioPath(item){const file=typeof item==='string'?item:item?.file;return `${STORY_AUDIO_BASE}${file}?v=${STORY_AUDIO_VERSION}`}
const stitchedAudioUrls=new Map();
function wavChunk(view,name){for(let i=12;i<=view.byteLength-8;){const id=String.fromCharCode(view.getUint8(i),view.getUint8(i+1),view.getUint8(i+2),view.getUint8(i+3)),size=view.getUint32(i+4,true);if(id===name)return{offset:i+8,size};i+=8+size+(size&1)}return null}
async function stitchedAudioPath(segment){const key=segment.stitchParts.map(part=>`${part.file}:${part.startAt||0}:${part.endAt??''}`).join('|');if(stitchedAudioUrls.has(key))return stitchedAudioUrls.get(key);const chunks=[];let sampleRate=24000,channels=1,bits=16;for(const part of segment.stitchParts){const response=await fetch(audioPath(part),{cache:'force-cache'});if(!response.ok)throw new Error(`audio ${response.status}`);const bytes=await response.arrayBuffer(),view=new DataView(bytes),fmt=wavChunk(view,'fmt '),data=wavChunk(view,'data');if(!fmt||!data)throw new Error('Unsupported WAV');channels=view.getUint16(fmt.offset+2,true);sampleRate=view.getUint32(fmt.offset+4,true);bits=view.getUint16(fmt.offset+14,true);const blockAlign=channels*(bits/8),start=Math.max(0,Math.floor(Number(part.startAt||0)*sampleRate)*blockAlign),end=part.endAt==null?data.size:Math.min(data.size,Math.floor(Number(part.endAt)*sampleRate)*blockAlign);chunks.push(new Uint8Array(bytes,data.offset+start,Math.max(0,end-start)))}const dataSize=chunks.reduce((n,c)=>n+c.byteLength,0),buffer=new ArrayBuffer(44+dataSize),view=new DataView(buffer),out=new Uint8Array(buffer);const text=(o,t)=>[...t].forEach((c,i)=>view.setUint8(o+i,c.charCodeAt(0)));text(0,'RIFF');view.setUint32(4,36+dataSize,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);view.setUint32(24,sampleRate,true);const byteRate=sampleRate*channels*(bits/8);view.setUint32(28,byteRate,true);view.setUint16(32,channels*(bits/8),true);view.setUint16(34,bits,true);text(36,'data');view.setUint32(40,dataSize,true);let offset=44;for(const chunk of chunks){out.set(chunk,offset);offset+=chunk.byteLength}const url=URL.createObjectURL(new Blob([buffer],{type:'audio/wav'}));stitchedAudioUrls.set(key,url);return url}
function clearAutoAdvanceTimer(){if(autoAdvanceTimer){clearTimeout(autoAdvanceTimer);autoAdvanceTimer=null}}
function stopAudio(){clearAutoAdvanceTimer();player.token++;player.partIndex=0;player.partBoundaryHandled=false;audio.pause();audio.removeAttribute('src');audio.load();nextAudio=null;player.finished=false}
function preloadNext(){const segment=player.story?.segments?.[player.index],parts=segmentAudioParts(segment);let next=parts[player.partIndex+1],nextSegment=null;if(!next){nextSegment=player.story?.segments?.[player.index+1];next=segmentAudioParts(nextSegment)[0]}if(nextSegment?.stitchParts?.length){nextAudio=null;void stitchedAudioPath(nextSegment).catch(()=>{});return}if(!next){nextAudio=null;return}nextAudio=new Audio();nextAudio.preload='auto';nextAudio.src=audioPath(next)}
function setStoryPathNote(text=STORY_AUTO_NOTE){const note=$('#storyPathNote');if(note)note.textContent=text}
function storyMuted(){return localStorage.getItem('bubbleSafariMuted')==='1'}
function setStoryMuted(muted){const value=!!muted;localStorage.setItem('bubbleSafariMuted',value?'1':'0');audio.muted=value;try{window.dispatchEvent(new CustomEvent('bubbleSafari:setMuted',{detail:{muted:value}}))}catch{}}
function syncControls(){const paused=audio.paused||player.finished,muted=storyMuted();const text=$('#storyPlayPauseText'),icon=$('#storyPlayPauseIcon'),button=$('#storyPlayPauseButton');if(!button)return;button.disabled=player.finished;if(text)text.textContent=paused?(muted?'تشغيل الصوت':'متابعة'):'إيقاف مؤقت';if(icon)icon.textContent=paused?(muted?'🔊':'▶'):'Ⅱ'}
function renderSegment(){const story=player.story,segment=story?.segments?.[player.index];if(!story||!segment)return;setStoryPathNote();$('#storyChapterTitle').textContent=segment.chapter;$('#storyNarration').textContent=segment.caption;const visual=$('#storyVisual');visual.className=`story-visual story-theme-${segment.theme}`;visual.innerHTML=`<div class="story-scene-enter">${sceneSvg(segment)}</div>`;const current=player.index+1,total=story.segments.length;$('#storyProgressText').textContent=`${current} / ${total}`;$('#storyProgressFill').style.transform=`scaleX(${current/total})`;$('#storyProgress').setAttribute('aria-valuenow',String(current));$('#storyEnding').classList.add('hidden');$('#storyEnding').setAttribute('aria-hidden','true');$('#storyControls').classList.remove('hidden');player.finished=false;syncControls()}
async function playCurrentAudioPart({render=false}={}){const segment=player.story?.segments?.[player.index],parts=segmentAudioParts(segment),part=parts[player.partIndex];if(!segment||!part)return;clearAutoAdvanceTimer();const token=++player.token;player.partBoundaryHandled=false;if(render)renderSegment();let source=audioPath(part),start=Number(part.startAt||0);if(segment.stitchParts?.length&&player.partIndex===0){try{source=await stitchedAudioPath(segment);start=0}catch{source=audioPath(part)}}if(token!==player.token)return;const target=source.startsWith('blob:')?source:new URL(source,location.href).href;const sourceChanged=audio.src!==target;if(sourceChanged){audio.src=source;audio.load()}audio.muted=storyMuted();preloadNext();if(audio.muted){audio.pause();syncControls();setStoryPathNote('الصوت مكتوم. اضغط تشغيل الصوت لبدء القصة.');return}if(start<=0){try{await audio.play();if(token===player.token)syncControls()}catch{if(token===player.token){syncControls();setStoryPathNote('اضغط متابعة لبدء صوت الراوية.')}}return}if(audio.readyState<1)await new Promise(resolve=>audio.addEventListener('loadedmetadata',resolve,{once:true}));if(Math.abs((audio.currentTime||0)-start)>.12)audio.currentTime=start;try{await audio.play();if(token===player.token)syncControls()}catch{if(token===player.token){syncControls();setStoryPathNote('اضغط متابعة لبدء صوت الراوية.')}}}
async function playSegment(restart=true){const segment=player.story?.segments?.[player.index];if(!segment)return;if(restart)player.partIndex=0;await playCurrentAudioPart({render:true})}
function completeAudioPart(){if(player.finished||!player.story||player.partBoundaryHandled)return;player.partBoundaryHandled=true;const segment=player.story.segments[player.index],parts=segmentAudioParts(segment);if(player.partIndex<parts.length-1){player.partIndex++;playCurrentAudioPart({render:false});return}const delay=segment?.autoAdvanceDelayMs??350;clearAutoAdvanceTimer();autoAdvanceTimer=setTimeout(()=>{if(player.finished||!player.story)return;if(player.index>=player.story.segments.length-1){finishStory();return}player.index++;player.partIndex=0;playSegment(true)},delay)}
function openStory(id){const story=STORIES.find(item=>item.id===id)||STORIES[0];stopAudio();player.story=story;player.index=0;player.finished=false;$('#storyTitle').textContent=story.title;setStoryPathNote();setActiveScreen('storyNarratedScreen');playSegment(true)}
function finishStory(){clearAutoAdvanceTimer();player.finished=true;audio.pause();syncControls();$('#storyControls').classList.add('hidden');$('#storyEnding').classList.remove('hidden');$('#storyEnding').setAttribute('aria-hidden','false');setStoryPathNote('انتهت القصة. لن تبدأ قصة أخرى تلقائيًا.');setTimeout(()=>setFocus($('#storyReplayStoryButton')),70)}
function togglePlayback(){if(player.finished)return;if(audio.paused){if(storyMuted())setStoryMuted(false);audio.muted=false;audio.play().then(()=>{setStoryPathNote();syncControls()}).catch(()=>{syncControls();setStoryPathNote('اضغط متابعة لبدء صوت الراوية.')})}else{audio.pause();syncControls()}}
function replaySegment(){if(!player.story)return;player.partIndex=0;playSegment(true)}
function replayStory(){player.index=0;player.partIndex=0;player.finished=false;$('#storyControls').classList.remove('hidden');playSegment(true);setTimeout(()=>setFocus($('#storyPlayPauseButton')),70)}

function wire(){
  const homeCard=$('[data-home-section="stories"]');if(homeCard){homeCard.id='storiesButton';const badge=$('.mode-badge',homeCard),title=$('.mode-copy strong',homeCard),copy=$('.mode-copy small',homeCard);if(badge)badge.textContent='جديد';if(title)title.textContent='القصص';if(copy)copy.textContent='قصص مسموعة ومصورة للأطفال'}
  window.addEventListener('click',event=>{const card=event.target.closest?.('[data-home-section="stories"]');if(card){event.preventDefault();event.stopImmediatePropagation();openLibrary()}},true);
  $('#storyLibraryBackButton')?.addEventListener('click',returnHome);$('#storyBackButton')?.addEventListener('click',()=>{stopAudio();setActiveScreen('storyLibraryScreen')});$('#storyPlayPauseButton')?.addEventListener('click',togglePlayback);$('#storyReplaySegmentButton')?.addEventListener('click',replaySegment);$('#storyReplayStoryButton')?.addEventListener('click',replayStory);$('#storyChooseAnotherButton')?.addEventListener('click',()=>{stopAudio();setActiveScreen('storyLibraryScreen')});
  window.addEventListener('keydown',event=>{if(!$('#storyLibraryScreen')?.classList.contains('screen-active')&&!$('#storyNarratedScreen')?.classList.contains('screen-active'))return;const back=['Escape','BrowserBack','GoBack'].includes(event.key)||[4,27,461,10009].includes(event.keyCode||event.which);if(!back)return;event.preventDefault();event.stopImmediatePropagation();if($('#storyNarratedScreen').classList.contains('screen-active')){stopAudio();setActiveScreen('storyLibraryScreen')}else returnHome()},true);
  audio.addEventListener('timeupdate',()=>{const segment=player.story?.segments?.[player.index],part=segmentAudioParts(segment)[player.partIndex];if(!part?.endAt||player.partBoundaryHandled)return;if(audio.currentTime>=Number(part.endAt)-.04){audio.pause();completeAudioPart()}});audio.addEventListener('ended',completeAudioPart);audio.addEventListener('play',()=>{player.partBoundaryHandled=false;setStoryPathNote();syncControls()});audio.addEventListener('pause',syncControls);audio.addEventListener('error',()=>{clearAutoAdvanceTimer();setStoryPathNote('تعذر تشغيل هذا الجزء الآن. اختر إعادة الجزء للمحاولة.');syncControls()});
}

async function init(){try{await ensureStorySprites()}catch(error){console.error('Story sprite load failed',error)}installScreens();renderLibrary();wire()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>void init(),0),{once:true});else setTimeout(()=>void init(),0);