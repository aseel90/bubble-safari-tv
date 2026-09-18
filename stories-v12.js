const $=(selector,root=document)=>root.querySelector(selector);
const STORY_AUDIO_BASE='./audio/stories/arin-fox/';
const STORY_AUDIO_VERSION='v37';
const STORY_AUTO_NOTE='تعمل القصة تلقائيًا من البداية إلى النهاية.';

const STORY_IMAGE_BASE='./assets/stories/arin-fox/';
const STORY_IMAGE_VERSION='v49';
const ARIN_FOX_SCENE_IMAGES=[
  'arinfox_scene_01_2026-09-18T18-53-29-720Z.png',
  'arinfox_scene_02_2026-09-18T17-57-24-516Z.png',
  'arinfox_scene_03_2026-09-18T17-58-25-364Z.png',
  'arinfox_scene_04_2026-09-18T17-58-35-275Z.png',
  'arinfox_scene_05_2026-09-18T17-58-45-622Z.png',
  'arinfox_scene_06_2026-09-18T17-58-55-686Z.png',
  'arinfox_scene_07_2026-09-18T17-59-05-062Z.png',
  'arinfox_scene_08_2026-09-18T17-59-15-467Z.png',
  'arinfox_scene_09_2026-09-18T18-55-35-944Z.png',
  'arinfox_scene_10_2026-09-18T17-59-33-781Z.png',
  'arinfox_scene_11_2026-09-18T17-59-43-414Z.png',
  'arinfox_scene_12_2026-09-18T17-59-53-209Z.png',
  'arinfox_scene_13_2026-09-18T18-00-03-610Z.png',
  'arinfox_scene_14_2026-09-18T18-00-14-038Z.png',
  'arinfox_scene_15_2026-09-18T18-00-24-296Z.png',
  'arinfox_scene_16_2026-09-18T18-00-41-496Z.png',
  'arinfox_scene_17_v03_2026-09-18T20-27-40-404Z.png',
  'arinfox_scene_18_v02_2026-09-18T20-25-47-534Z.png',
  'arinfox_scene_19_2026-09-18T18-01-27-385Z.png',
  'arinfox_scene_20_2026-09-18T18-01-37-914Z.png',
  'arinfox_scene_21_2026-09-18T18-01-48-087Z.png',
  'arinfox_scene_22_2026-09-18T18-02-06-303Z.png',
  'arinfox_scene_23_2026-09-18T18-02-16-052Z.png',
  'arinfox_scene_24_2026-09-18T18-02-26-179Z.png',
  'arinfox_scene_25_2026-09-18T18-02-36-134Z.png',
  'arinfox_scene_26_2026-09-18T18-02-46-671Z.png',
  'arinfox_scene_27_2026-09-18T18-02-56-244Z.png'
];
const preloadedSceneImages=new Set();
function sceneImagePath(index){const file=ARIN_FOX_SCENE_IMAGES[index];return file?STORY_IMAGE_BASE+file+'?v='+STORY_IMAGE_VERSION:''}
function preloadSceneImage(index){const src=sceneImagePath(index);if(!src||preloadedSceneImages.has(src))return;preloadedSceneImages.add(src);const image=new Image();image.decoding='async';try{image.fetchPriority='low'}catch{}image.src=src}

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
  $('#storyScreen')?.remove();
  if($('#storyLibraryScreen'))return;
  ($('.stage')||document.body).insertAdjacentHTML('beforeend',`<section id="storyLibraryScreen" class="screen story-library-screen" aria-hidden="true"><div class="story-library-shell"><div class="story-library-topbar"><button id="storyLibraryBackButton" class="back-button focusable story-library-back" data-focusable type="button" aria-label="العودة">${storyIcon('back')}</button><div class="story-library-heading"><span class="eyebrow">استمع وشاهد</span><h2>القصص</h2><p>اختر قصة لتعمل تلقائيًا من البداية حتى النهاية.</p></div><div class="story-library-count"><span>1</span><small>قصة</small></div></div><div id="storyLibraryGrid" class="story-library-grid"></div></div></section><section id="storyNarratedScreen" class="screen story-screen" aria-hidden="true"><div class="story-player-shell"><div class="story-player-topbar"><button id="storyBackButton" class="back-button focusable story-back" data-focusable type="button" aria-label="العودة للقصص">${storyIcon('back')}</button><div class="story-player-heading"><span class="eyebrow">قصة مسموعة</span><h2 id="storyTitle">أرين والثعلب</h2><p id="storyChapterTitle">صباح جميل</p></div><div id="storyProgress" class="story-progress" role="progressbar" aria-valuemin="1" aria-valuemax="27" aria-valuenow="1"><strong id="storyProgressText">1 / 27</strong><span class="story-progress-track"><span id="storyProgressFill"></span></span></div></div><div class="story-stage-card"><div id="storyVisual" class="story-visual"></div><div class="story-caption-panel"><span class="story-kicker">الراوية</span><p id="storyNarration"></p><span id="storyPathNote" class="story-path-note">تعمل القصة تلقائيًا من البداية حتى النهاية.</span></div></div><div id="storyControls" class="story-controls"><button id="storyPlayPauseButton" class="story-control focusable" data-focusable data-autofocus type="button"><span id="storyPlayPauseIcon" class="story-control-icon">${storyIcon('pause')}</span><span id="storyPlayPauseText">إيقاف مؤقت</span></button><button id="storyReplaySegmentButton" class="story-control focusable" data-focusable type="button"><span class="story-control-icon">${storyIcon('replay')}</span><span>إعادة الجزء</span></button></div><div id="storyEnding" class="story-ending hidden" aria-hidden="true" aria-label="خيارات نهاية القصة"><div class="story-ending-actions"><button id="storyReplayStoryButton" class="story-control focusable" data-focusable type="button"><span class="story-control-icon">${storyIcon('replay')}</span><span>إعادة القصة</span></button><button id="storyChooseAnotherButton" class="story-control focusable" data-focusable type="button"><span class="story-control-icon">${storyIcon('library')}</span><span>العودة للقصص</span></button></div></div></div></section>`);
}
function renderLibrary(){
  const grid=$('#storyLibraryGrid');if(!grid)return;
  preloadSceneImage(0);grid.innerHTML='';
  STORIES.forEach((story,index)=>{
    const card=document.createElement('button');card.type='button';card.className='story-cover-card focusable';card.dataset.focusable='';if(index===0)card.dataset.autofocus='';
    const coverSrc=sceneImagePath(0);
    card.innerHTML=`<span class="story-cover-art"><img class="story-cover-image" src="${coverSrc}" alt="" aria-hidden="true" draggable="false"><span class="story-cover-play">${storyIcon('play')}</span></span><span class="story-cover-copy"><span class="story-type-badge">${story.typeLabel}</span><strong>${story.title}</strong><small>${story.description}</small><span class="story-duration">◷ ${story.durationLabel}</span></span>`;
    card.addEventListener('click',()=>openStory(story.id));grid.appendChild(card)
  });
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
function syncControls(){
  const paused=audio.paused||player.finished,muted=storyMuted();
  const text=$('#storyPlayPauseText'),icon=$('#storyPlayPauseIcon'),button=$('#storyPlayPauseButton');
  if(!button)return;
  button.disabled=player.finished;
  if(text)text.textContent=paused?(muted?'تشغيل الصوت':'متابعة'):'إيقاف مؤقت';
  if(icon)icon.innerHTML=storyIcon(paused?'play':'pause');
}
function renderSegment(){
  const story=player.story,segment=story?.segments?.[player.index];if(!story||!segment)return;
  setStoryPathNote();$('#storyChapterTitle').textContent=segment.chapter;$('#storyNarration').textContent=segment.caption;
  const visual=$('#storyVisual');visual.className='story-visual story-theme-'+segment.theme;
  const frame=document.createElement('div');frame.className='story-scene-enter story-static-scene story-scene-loading';
  const src=sceneImagePath(player.index);
  const image=document.createElement('img');image.className='story-scene-image';image.alt='';image.setAttribute('aria-hidden','true');image.decoding='async';image.draggable=false;try{image.fetchPriority='high'}catch{}
  let retried=false;
  image.addEventListener('load',()=>{frame.classList.remove('story-scene-loading');frame.classList.add('story-scene-ready')});
  image.addEventListener('error',()=>{
    if(!retried){retried=true;image.src=src+(src.includes('?')?'&':'?')+'retry='+Date.now();return}
    frame.classList.remove('story-scene-loading');frame.classList.add('story-scene-error');image.remove();
    const error=document.createElement('div');error.className='story-scene-error-message';error.textContent='تعذر تحميل صورة المشهد.';frame.appendChild(error);
  });
  image.src=src;frame.appendChild(image);visual.replaceChildren(frame);preloadSceneImage(player.index+1);
  const current=player.index+1,total=story.segments.length;$('#storyProgressText').textContent=current+' / '+total;$('#storyProgressFill').style.transform='scaleX('+(current/total)+')';$('#storyProgress').setAttribute('aria-valuenow',String(current));$('#storyEnding').classList.add('hidden');$('#storyEnding').setAttribute('aria-hidden','true');$('#storyControls').classList.remove('hidden');player.finished=false;syncControls()
}
async function playCurrentAudioPart({render=false,forceSeek=false}={}){
  const segment=player.story?.segments?.[player.index],parts=segmentAudioParts(segment),part=parts[player.partIndex];
  if(!segment||!part)return;
  clearAutoAdvanceTimer();
  const token=++player.token;
  player.partBoundaryHandled=false;
  if(render)renderSegment();
  let source=audioPath(part),start=Number(part.startAt||0);
  if(segment.stitchParts?.length&&player.partIndex===0){
    try{source=await stitchedAudioPath(segment);start=0}catch{source=audioPath(part)}
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
function openStory(id){const story=STORIES.find(item=>item.id===id)||STORIES[0];stopAudio();player.story=story;player.index=0;player.finished=false;$('#storyTitle').textContent=story.title;setStoryPathNote();setActiveScreen('storyNarratedScreen');playSegment(true)}
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
