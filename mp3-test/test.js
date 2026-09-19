(()=>{
'use strict';
const scenes=[
  {
    chapter:'الهدية',
    caption:'وضعت أَرين السلة على الطاولة وقدمت لجدتها الزهرة الجميلة.',
    image:'./assets/stories/arin-fox/arinfox_scene_22_2026-09-18T18-02-06-303Z.webp',
    audio:'./audio/arin-fox-22-gift.mp3'
  },
  {
    chapter:'اعتذار الثعلب',
    caption:'اعتذر الثعلب، وذكّرته الجدة أن يتعلم من خطئه، فوعد ألا يخيف أحدًا مرة أخرى.',
    image:'./assets/stories/arin-fox/arinfox_scene_23_2026-09-18T18-02-16-052Z.webp',
    audio:'./audio/arin-fox-23-fox-apology-v2.mp3',
    delay:900
  },
  {
    chapter:'طريق العودة',
    caption:'حان وقت العودة، فرافق الحارس أَرين في جزء من الطريق.',
    image:'./assets/stories/arin-fox/arinfox_scene_24_2026-09-18T18-02-26-179Z.webp',
    audio:'./audio/arin-fox-24-return.mp3'
  }
];

const $=s=>document.querySelector(s);
const image=$('#sceneImage'), audio=new Audio();
audio.preload='auto';
let index=0,token=0,timer=0,finished=false;
const expectedMime='audio/mpeg';
const can=new Audio().canPlayType(expectedMime);
$('#codecBadge').textContent='MP3: '+(can||'غير معلن');
$('#codecBadge').classList.toggle('warn',!can);
$('#tech').textContent=navigator.userAgent.includes('BubbleSafariMP3Test')?'WebView APK':'Browser';

function setResult(text,kind=''){
  const el=$('#result');el.textContent=text;el.className='result'+(kind?' '+kind:'');
}
function format(sec){return Number.isFinite(sec)?sec.toFixed(2)+' ث':'—'}
function stop(){clearTimeout(timer);timer=0;audio.pause();token++}
async function loadImage(src,currentToken){
  $('#imageState').textContent='تحميل الصورة…';
  const probe=new Image();probe.decoding='async';probe.src=src;
  await new Promise((resolve,reject)=>{probe.onload=resolve;probe.onerror=reject});
  try{if(probe.decode)await probe.decode()}catch{}
  if(currentToken!==token)return false;
  image.src=src;
  $('#imageState').textContent='الصورة جاهزة';
  return true
}
function preloadNext(){
  const next=scenes[index+1];if(!next)return;
  const img=new Image();img.decoding='async';img.src=next.image;
  const a=new Audio();a.preload='metadata';a.src=next.audio;
}
async function playScene(restart=true){
  clearTimeout(timer);finished=false;
  const scene=scenes[index],current=++token;
  $('#sceneNumber').textContent=(index+1)+' / '+scenes.length;
  $('#chapter').textContent=scene.chapter;
  $('#caption').textContent=scene.caption;
  $('#audioState').textContent='تحضير الصورة والصوت…';
  $('#duration').textContent='—';
  setResult('المشهد '+(index+1)+': انتظر حتى تظهر الصورة ثم راقب بداية الصوت ونهايته.');
  try{await loadImage(scene.image,current)}catch(e){
    if(current===token){$('#audioState').textContent='فشل تحميل الصورة';setResult(String(e),'err')}return;
  }
  if(current!==token)return;
  audio.src=scene.audio;audio.load();
  await new Promise((resolve,reject)=>{
    const ok=()=>{cleanup();resolve()},bad=()=>{cleanup();reject(new Error('MP3 metadata error'))};
    const cleanup=()=>{audio.removeEventListener('loadedmetadata',ok);audio.removeEventListener('error',bad)};
    audio.addEventListener('loadedmetadata',ok);audio.addEventListener('error',bad);
  }).catch(e=>{if(current===token)setResult(e.message,'err')});
  if(current!==token)return;
  $('#duration').textContent='المدة '+format(audio.duration);
  preloadNext();
  if(!restart)return;
  try{
    audio.currentTime=0;
    await audio.play();
  }catch(e){
    $('#audioState').textContent='اضغط تشغيل';
    setResult('التشغيل التلقائي لم يبدأ. اضغط تشغيل / إيقاف. '+e.name,'');
  }
}
function advance(){
  if(index>=scenes.length-1){
    finished=true;audio.pause();$('#audioState').textContent='اكتمل الاختبار';
    setResult('اكتملت المشاهد الثلاثة. إذا كانت البدايات والنهايات نظيفة ولم يحدث تأخير أو تقطيع، فاختبار MP3 نجح على هذا التلفزيون.','ok');
    $('#restart').focus();return;
  }
  const delay=scenes[index].delay??450;
  timer=setTimeout(()=>{index++;playScene(true)},delay);
}
audio.addEventListener('loadstart',()=>{$('#audioState').textContent='تحميل MP3…'});
audio.addEventListener('canplay',()=>{$('#audioState').textContent='MP3 جاهز'});
audio.addEventListener('play',()=>{$('#audioState').textContent='يعمل الآن'});
audio.addEventListener('pause',()=>{if(!finished&&!audio.ended)$('#audioState').textContent='متوقف مؤقتًا'});
audio.addEventListener('ended',()=>{if(!finished){$('#audioState').textContent='انتهى المشهد بنجاح';advance()}});
audio.addEventListener('error',()=>{setResult('خطأ تشغيل MP3. code='+(audio.error?.code||'unknown'),'err');$('#audioState').textContent='خطأ MP3'});

$('#playPause').addEventListener('click',async()=>{if(finished)return;if(audio.paused){try{await audio.play()}catch(e){setResult('تعذر التشغيل: '+e.name,'err')}}else audio.pause()});
$('#replay').addEventListener('click',()=>{stop();playScene(true)});
$('#next').addEventListener('click',()=>{stop();index=(index+1)%scenes.length;playScene(true)});
$('#restart').addEventListener('click',()=>{stop();index=0;playScene(true);$('#playPause').focus()});

window.addEventListener('keydown',e=>{
  if(e.key==='MediaPlayPause'){e.preventDefault();$('#playPause').click()}
  if(e.key==='MediaTrackNext'){e.preventDefault();$('#next').click()}
});

setTimeout(()=>playScene(true),350);
})();