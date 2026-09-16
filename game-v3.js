import { COLORS, SHAPES, NUMBERS, WORLDS, FEEDBACK } from './game-data.js';
import { createTvNavigation } from './tv-nav.js';
import { createVoiceEngine } from './voice.js';
import { animalArt, choiceArt, worldArt, uiArt } from './art.js';
import { sceneArt } from './scene-art.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const screens = { home:$('#homeScreen'), age:$('#ageScreen'), world:$('#worldScreen'), settings:$('#settingsScreen'), game:$('#gameScreen'), finish:$('#finishScreen') };
const app=$('#app'), worldDecor=$('#worldDecor'), hud=$('#hud'), settingsButton=$('#settingsButton'), starCount=$('#starCount'), roundText=$('#roundText'), progressMeter=$('#progressMeter'), progressFill=$('#progressFill'), worldName=$('#worldName'), worldIcon=$('#worldIcon'), choicesEl=$('#choices'), questionText=$('#questionText'), questionKicker=$('#questionKicker'), questionVisual=$('#questionVisual'), replayButton=$('#replayButton'), soundButton=$('#soundButton'), soundIcon=$('#soundIcon'), feedback=$('#feedback'), feedbackTitle=$('#feedbackTitle'), feedbackSubtitle=$('#feedbackSubtitle'), feedbackIcon=$('#feedbackIcon'), confetti=$('#confetti'), finalStars=$('#finalStars');
const updateStatus=$('#updateStatus'), updateProgressEl=$('#updateProgress'), updateProgressFill=$('#updateProgressFill'), updateProgressPercent=$('#updateProgressPercent'), currentVersion=$('#currentVersion'), latestVersion=$('#latestVersion'), checkUpdateButton=$('#checkUpdateButton'), otaOverlay=$('#otaOverlay'), otaOverlayLabel=$('#otaOverlayLabel'), otaOverlayPercent=$('#otaOverlayPercent'), otaOverlayFill=$('#otaOverlayFill');

const state={age:'2-3',world:'jungle',round:0,totalRounds:12,stars:0,streak:0,muted:localStorage.getItem('bubbleSafariMuted')==='1',effects:localStorage.getItem('bubbleSafariEffects')!=='0',quality:localStorage.getItem('bubbleSafariQuality')||'auto',settingsReturn:'home',currentQuestion:null,locked:false,typePlan:[],usedTargets:{},feedbackHistory:[],lastSize:null,flowId:0};
const voice=createVoiceEngine({isMuted:()=>state.muted});
let tv;

const ANIMAL_LAYOUT={
  lion:{scale:.92,y:1},elephant:{scale:.86,y:2},monkey:{scale:.9,y:1},giraffe:{scale:.72,y:2},panda:{scale:.92,y:1},frog:{scale:.94,y:2},tiger:{scale:.9,y:1},zebra:{scale:.84,y:1},hippo:{scale:.9,y:2},rabbit:{scale:.76,y:4},cow:{scale:.84,y:2},horse:{scale:.82,y:1},duck:{scale:.92,y:2},cat:{scale:.86,y:2},fish:{scale:.96},turtle:{scale:.88,y:1},dolphin:{scale:.86},octopus:{scale:.86,y:3},crab:{scale:.82,y:3},whale:{scale:.88,y:1},shark:{scale:.88}
};
const getAnimalLayout=id=>ANIMAL_LAYOUT[id]||{scale:.88,x:0,y:1,labelOffset:0};

function hydrateStaticArt(){
  $$('[data-world-art]').forEach(el=>{el.innerHTML=worldArt(el.dataset.worldArt)});
  $$('[data-ui-art]').forEach(el=>{el.innerHTML=uiArt(el.dataset.uiArt)});
  $$('[data-mascot-art]').forEach(el=>{el.innerHTML=animalArt(el.dataset.mascotArt)});
}

function showScreen(name){
  Object.entries(screens).forEach(([key,el])=>{el.classList.toggle('screen-active',key===name);el.setAttribute('aria-hidden',key===name?'false':'true')});
  hud.classList.toggle('hidden',name!=='game');
  settingsButton?.classList.toggle('hidden',name==='settings');
  requestAnimationFrame(()=>{
    let selector=null;
    if(name==='home')selector='#startButton';
    if(name==='age')selector=`[data-age="${state.age}"]`;
    if(name==='world')selector=`[data-world="${state.world}"]`;
    if(name==='settings')selector='#settingsBackButton';
    if(name==='finish')selector='#playAgainButton';
    const preferred=selector?$(selector,screens[name]):null;
    if(preferred)tv?.setFocus(preferred); else tv?.focusFirst(screens[name]);
  });
}
function activeScreenName(){return Object.entries(screens).find(([,el])=>el.classList.contains('screen-active'))?.[0]||'home'}
function clearTransientUi(){
  feedback?.classList.remove('show');
  feedback?.setAttribute('aria-hidden','true');
  if(confetti)confetti.innerHTML='';
  $$('.choice.correct-pop,.choice.wrong-shake').forEach(el=>el.classList.remove('correct-pop','wrong-shake'));
}
function setGameLocked(value){state.locked=!!value;if(settingsButton)settingsButton.disabled=state.locked}
function handleBack(){
  state.flowId++;voice.stop();setGameLocked(false);clearTransientUi();
  if(screens.settings.classList.contains('screen-active'))return showScreen(state.settingsReturn||'home');
  if(screens.game.classList.contains('screen-active'))return showScreen('world');
  if(screens.world.classList.contains('screen-active'))return showScreen('age');
  if(screens.age.classList.contains('screen-active')||screens.finish.classList.contains('screen-active'))return showScreen('home');
}

function installTvRuntimeHotfix(){
  if(window.__bubbleTvRuntimeHotfix)return;
  window.__bubbleTvRuntimeHotfix='2026-09-12.2';
  const style=document.createElement('style');
  style.textContent=`
@media (min-aspect-ratio:4/3) and (max-height:820px){
  .topbar{height:10vh;min-height:62px;padding:max(10px,1.7vh) 4.5vw}
  .brand-mark{width:50px;height:50px}.brand-face{left:9px;top:17px;font-size:17px}
  .brand-copy strong{font-size:clamp(18px,1.65vw,25px)}.brand-copy small{margin-top:4px;font-size:clamp(9px,.8vw,13px)}
  .stage{padding:max(72px,10vh) 5vw max(32px,4.5vh)}
  #homeScreen{grid-template-columns:minmax(0,.88fr) minmax(0,1.12fr);grid-template-rows:minmax(0,1fr) auto;grid-template-areas:'copy mascot' 'actions mascot';gap:1.2vh 4vw;padding:0 2vw;align-items:center}
  #homeScreen .hero-copy{grid-area:copy;max-width:none;width:100%;align-self:end;justify-self:stretch}
  #homeScreen .mascot-scene{grid-area:mascot;width:min(37vw,52vh,410px);align-self:center;justify-self:center}
  #homeScreen .home-actions{grid-area:actions;position:static;right:auto;bottom:auto;transform:none;align-self:start;justify-self:start;display:flex;flex-wrap:wrap;gap:10px 14px;padding-top:1.6vh;max-width:100%}
  #homeScreen .hero-copy h1{font-size:clamp(48px,5.2vw,72px);line-height:.98;letter-spacing:-2px}
  #homeScreen .hero-copy p{margin-top:1.4vh;max-width:44vw;font-size:clamp(17px,1.55vw,22px);line-height:1.35}
  #homeScreen .eyebrow{margin-bottom:1vh;padding:6px 13px;font-size:clamp(12px,1.05vw,16px)}
  #homeScreen .primary-button{height:60px;min-width:250px;padding:0 28px;border-radius:21px;font-size:clamp(20px,1.55vw,25px)}
  #homeScreen .remote-hint{min-height:44px;padding:7px 11px;font-size:clamp(11px,.95vw,14px);white-space:nowrap}
}
@media (min-aspect-ratio:16/10) and (max-height:650px){
  .stage{padding-top:68px;padding-bottom:34px}#homeScreen{gap:6px 3vw}
  #homeScreen .hero-copy h1{font-size:clamp(42px,5vw,62px)}#homeScreen .hero-copy p{margin-top:8px;font-size:clamp(15px,1.45vw,19px)}
  #homeScreen .mascot-scene{width:min(34vw,49vh,330px)}#homeScreen .home-actions{padding-top:8px}
  #homeScreen .primary-button{height:54px;min-width:230px}#homeScreen .remote-hint{min-height:40px}
}`;
  document.head.appendChild(style);
  let lastActivate=0;
  document.addEventListener('keydown',event=>{
    const code=event.keyCode||event.which||0,key=event.key;
    const ok=[13,23,66,96,109,160].includes(code)||['Enter','Select','Accept','NumpadEnter','GamepadA'].includes(key);
    if(!ok)return;
    event.preventDefault();event.stopImmediatePropagation();
    const now=Date.now();if(now-lastActivate<180)return;lastActivate=now;
    const active=$('.screen-active');if(!active)return;
    let target=document.activeElement;
    const globalTarget=target?.matches?.('#settingsButton[data-focusable]:not([disabled]), #soundButton[data-focusable]:not([disabled])')&&target.offsetParent!==null;
    if(!target||!target.matches?.('[data-focusable]')||(!active.contains(target)&&!globalTarget))target=$('[data-autofocus][data-focusable]:not([disabled])',active)||$('[data-focusable]:not([disabled])',active);
    if(!target)return;
    try{target.focus({preventScroll:true})}catch{target.focus()}
    target.classList.add('tv-focus');target.click();
  },true);
}
installTvRuntimeHotfix();
tv=createTvNavigation({getActiveScreen:()=>$('.screen-active'),onBack:handleBack});

const randomFrom=items=>items[Math.floor(Math.random()*items.length)];
function shuffle(items){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function pickUnique(pool,count,target){return shuffle([target,...shuffle(pool.filter(x=>x.id!==target.id)).slice(0,count-1)])}
function choiceCount(){return state.age==='2-3'?2:3}
function freshFrom(pool,namespace='default'){
  const key=`${state.world}:${namespace}`;
  let used=state.usedTargets[key];
  if(!used){used=new Set();state.usedTargets[key]=used}
  let fresh=pool.filter(item=>!used.has(item.id));
  if(!fresh.length){used.clear();fresh=pool}
  const target=randomFrom(fresh);used.add(target.id);return target;
}

function buildTypePlan(){const world=WORLDS[state.world],base=state.age==='2-3'?world.youngTypes:world.olderTypes,plan=[];while(plan.length<state.totalRounds){const batch=shuffle(base);if(plan.length&&batch[0]===plan[plan.length-1]){const swap=batch.findIndex(type=>type!==plan[plan.length-1]);if(swap>0)[batch[0],batch[swap]]=[batch[swap],batch[0]]}plan.push(...batch)}return plan.slice(0,state.totalRounds)}
function symbolPool(){const animals=WORLDS[state.world].animals;return animals.length?animals.map(a=>({...a,kind:'animal'})):SHAPES.map(s=>({...s,kind:'shape'}))}

function makeAnimalQuestion(){const animals=WORLDS[state.world].animals;if(!animals.length)return makeShapeQuestion();const target=freshFrom(animals,'animal');return{type:'animal',kicker:'ابحث عن الحيوان',prompt:`أين ${target.name}؟`,voiceKey:target.audio,options:pickUnique(animals,choiceCount(),target).map((animal,i)=>({id:animal.id,label:animal.name,visualId:animal.id,visualKind:'animal',color:COLORS[(state.round+i)%COLORS.length].hex,correct:animal.id===target.id,kind:'animal'}))}}
function makeColorQuestion(){const target=freshFrom(COLORS,'color'),selected=pickUnique(COLORS,choiceCount(),target),icon=randomFrom(symbolPool());return{type:'color',kicker:'ابحث عن اللون',prompt:`أين الفقاعة ${target.name}؟`,voiceKey:target.audio,options:shuffle(selected.map(color=>({id:color.id,label:color.label,visualId:icon.id,visualKind:icon.kind,color:color.hex,correct:color.id===target.id,kind:'color'})))}}
function makeShapeQuestion(){const target=freshFrom(SHAPES,'shape'),selected=pickUnique(SHAPES,choiceCount(),target);return{type:'shape',kicker:'ابحث عن الشكل',prompt:`أين ${target.name}؟`,voiceKey:target.audio,options:shuffle(selected.map((shape,i)=>({id:shape.id,label:shape.name,visualId:shape.id,visualKind:'shape',color:COLORS[(state.round+i+1)%COLORS.length].hex,correct:shape.id===target.id,kind:'shape'})))}}
function makeNumberQuestion(){const available=state.age==='2-3'?NUMBERS.slice(0,3):NUMBERS,target=freshFrom(available,'number'),selected=pickUnique(available,choiceCount(),target);return{type:'number',kicker:'ابحث عن الرقم',prompt:`أين الرقم ${target.value}؟`,voiceKey:target.audio,options:shuffle(selected.map((number,i)=>({id:number.id,label:String(number.value),number:number.value,visualKind:'number',color:COLORS[(state.round+i+2)%COLORS.length].hex,correct:number.id===target.id,kind:'number'})))}}
function makeSizeQuestion(){const pool=symbolPool(),target=freshFrom(pool,'size'),askBig=state.lastSize==='big'?false:state.lastSize==='small'?true:Math.random()>.5;state.lastSize=askBig?'big':'small';const options=state.age==='2-3'?[{id:'small',scale:.72,label:'صغير'},{id:'big',scale:1.3,label:'كبير'}]:[{id:'small',scale:.72,label:'صغير'},{id:'medium',scale:1,label:'وسط'},{id:'big',scale:1.3,label:'كبير'}];return{type:'size',kicker:'قارن الأحجام',prompt:askBig?'أين الصورة الكبيرة؟':'أين الصورة الصغيرة؟',voiceKey:askBig?'size_big':'size_small',options:shuffle(options.map((size,i)=>({id:size.id,label:size.label,visualId:target.id,visualKind:target.kind,color:COLORS[(state.round+i+3)%COLORS.length].hex,scale:size.scale,correct:size.id===(askBig?'big':'small'),kind:'size'})))}}
function makeMatchQuestion(){const pool=symbolPool(),target=freshFrom(pool,'match'),options=pickUnique(pool,choiceCount(),target);return{type:'match',kicker:'طابق الصورة',prompt:'اختر الصورة',voiceKey:'prompt_match',questionVisual:{kind:target.kind,id:target.id},options:shuffle(options.map((item,i)=>({id:item.id,label:item.name||item.label,visualId:item.id,visualKind:item.kind,color:COLORS[(state.round+i)%COLORS.length].hex,correct:item.id===target.id,kind:'match'})))}}
function makeOddQuestion(){const pool=symbolPool();if(pool.length<3)return makeMatchQuestion();const base=freshFrom(pool,'oddBase'),odd=freshFrom(pool.filter(item=>item.id!==base.id),'oddTarget');const count=choiceCount(),items=Array.from({length:Math.max(1,count-1)},(_,i)=>({id:`base-${i}`,label:base.name||base.label,visualId:base.id,visualKind:base.kind,color:COLORS[(state.round+i)%COLORS.length].hex,correct:false,kind:'odd'}));items.push({id:'odd',label:odd.name||odd.label,visualId:odd.id,visualKind:odd.kind,color:COLORS[(state.round+count)%COLORS.length].hex,correct:true,kind:'odd'});return{type:'odd',kicker:'لغز صغير',prompt:'أي واحد مختلف؟',voiceKey:'prompt_odd',options:shuffle(items)}}
function makeQuestion(type){return type==='animal'?makeAnimalQuestion():type==='color'?makeColorQuestion():type==='shape'?makeShapeQuestion():type==='number'?makeNumberQuestion():type==='size'?makeSizeQuestion():type==='match'?makeMatchQuestion():makeOddQuestion()}
function shade(hex,amount){const value=parseInt(hex.replace('#',''),16),r=Math.max(0,Math.min(255,(value>>16)+amount)),g=Math.max(0,Math.min(255,((value>>8)&255)+amount)),b=Math.max(0,Math.min(255,(value&255)+amount));return`#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}`}
function renderOptionVisual(option){if(option.visualKind==='number')return`<span class="choice-number">${option.number}</span>`;const art=choiceArt(option.visualKind,option.visualId);const layout=option.visualKind==='animal'?getAnimalLayout(option.visualId):{scale:1,x:0,y:0};return`<span class="choice-art choice-art-${option.visualKind}${option.kind==='size'?' choice-size-art':''}" style="--art-scale:${layout.scale};--art-x:${layout.x||0}px;--art-y:${layout.y||0}px">${art}</span>`}
function updateProgress(){const current=state.round+1,total=state.totalRounds,ratio=Math.max(0,Math.min(1,total?current/total:0));roundText.textContent=`${current} / ${total}`;starCount.textContent=state.stars;if(progressMeter){progressMeter.setAttribute('aria-valuemax',String(total));progressMeter.setAttribute('aria-valuenow',String(current))}if(progressFill)progressFill.style.transform=`scaleX(${ratio})`}
function renderQuestion(){
  const type=state.typePlan[state.round]||'animal';state.currentQuestion=makeQuestion(type);questionKicker.textContent=state.currentQuestion.kicker;questionText.textContent=state.currentQuestion.prompt;updateProgress();
  if(state.currentQuestion.questionVisual){questionVisual.classList.remove('hidden');questionVisual.innerHTML=choiceArt(state.currentQuestion.questionVisual.kind,state.currentQuestion.questionVisual.id)}else{questionVisual.classList.add('hidden');questionVisual.innerHTML=''}
  choicesEl.innerHTML='';choicesEl.style.gridTemplateColumns=`repeat(${state.currentQuestion.options.length},minmax(0,1fr))`;
  state.currentQuestion.options.forEach((option,index)=>{
    const button=document.createElement('button');button.type='button';button.className='choice focusable';button.dataset.focusable='';button.dataset.kind=option.kind;button.setAttribute('aria-label',option.label);if(option.kind==='size')button.dataset.sizeVisual=option.scale<.82?'small':option.scale>1.18?'big':'medium';
    const layout=option.visualKind==='animal'?getAnimalLayout(option.visualId):null;if(layout?.labelOffset)button.style.setProperty('--label-offset',`${layout.labelOffset}px`);button.innerHTML=`<span class="choice-bubble" style="--bubble-color:${option.color};--bubble-deep:${shade(option.color,-8)}"></span><span class="choice-content">${renderOptionVisual(option)}</span><span class="choice-label">${option.label}</span>`;
    button.addEventListener('click',()=>selectChoice(button,option));choicesEl.appendChild(button);if(index===0)setTimeout(()=>tv.setFocus(button),50);
  });
  setTimeout(()=>voice.play(state.currentQuestion.voiceKey),180);
}

function chooseFeedback(){const recent=new Set(state.feedbackHistory.slice(-2)),candidates=FEEDBACK.filter(item=>!recent.has(item.audio)),chosen=randomFrom(candidates.length?candidates:FEEDBACK);state.feedbackHistory.push(chosen.audio);return chosen}
async function showSuccess(){
  const msg=state.streak>=4?{title:'مذهل!',sub:'أربع إجابات متتالية',audio:'feedback_wow'}:chooseFeedback();
  feedbackTitle.textContent=msg.title;feedbackSubtitle.textContent=msg.sub;feedbackIcon.innerHTML=uiArt(state.streak>=4?'medal':'star');feedback.setAttribute('aria-hidden','false');feedback.classList.add('show');burstConfetti();voice.success();await sleep(120);return voice.play(msg.audio);
}
function burstConfetti(){confetti.innerHTML='';if(!state.effects)return;const colors=['#ffd45b','#ff7c68','#75c9e8','#81c96c','#ad92e8','#ff9fc4'];const count=app.dataset.quality==='full'?26:14;for(let i=0;i<count;i++){const piece=document.createElement('i');piece.className='confetti-piece';piece.style.background=colors[i%colors.length];piece.style.setProperty('--x',`${(Math.random()-.5)*620}px`);piece.style.setProperty('--y',`${(Math.random()-.72)*470}px`);piece.style.setProperty('--r',`${(Math.random()-.5)*720}deg`);confetti.appendChild(piece)}setTimeout(()=>{confetti.innerHTML=''},850)}
async function selectChoice(button,option){
  if(state.locked)return;
  voice.ensureAudio();
  const flow=state.flowId;
  if(!option.correct){
    setGameLocked(true);state.streak=0;button.classList.remove('wrong-shake');void button.offsetWidth;button.classList.add('wrong-shake');voice.stop();voice.wrong();
    const started=performance.now();await sleep(90);await voice.play('feedback_tryagain');const remain=Math.max(120,850-(performance.now()-started));await sleep(remain);
    if(flow!==state.flowId||!screens.game.classList.contains('screen-active'))return;
    button.classList.remove('wrong-shake');setGameLocked(false);return;
  }
  setGameLocked(true);state.streak++;button.classList.add('correct-pop');state.stars++;starCount.textContent=state.stars;localStorage.setItem('bubbleSafariBest',String(Math.max(state.stars,Number(localStorage.getItem('bubbleSafariBest')||0))));
  voice.stop();const started=performance.now();await showSuccess();const remain=Math.max(260,1000-(performance.now()-started));await sleep(remain);
  if(flow!==state.flowId||!screens.game.classList.contains('screen-active'))return;
  feedback.classList.remove('show');feedback.setAttribute('aria-hidden','true');state.round++;
  if(state.round>=state.totalRounds)finishGame();else{setGameLocked(false);renderQuestion()}
}

function setWorld(id){state.world=id;const world=WORLDS[id];app.classList.remove('world-jungle','world-farm','world-ocean','world-bubblecity','world-rainbow');app.classList.add(world.className);worldName.textContent=world.name;worldIcon.innerHTML=worldArt(world.art);if(worldDecor)worldDecor.innerHTML=sceneArt(world.art)}
function startGame(worldId=state.world){state.flowId++;setWorld(worldId);state.round=0;state.totalRounds=state.age==='2-3'?12:15;state.stars=0;state.streak=0;setGameLocked(false);state.usedTargets={};state.feedbackHistory=[];state.lastSize=null;state.typePlan=buildTypePlan();starCount.textContent='0';if(progressFill)progressFill.style.transform='scaleX(0)';const world=WORLDS[state.world];voice.preload([...world.animals.map(a=>a.audio),...COLORS.map(c=>c.audio),...SHAPES.map(s=>s.audio),...NUMBERS.map(n=>n.audio),'size_big','size_small','prompt_match','prompt_odd','feedback_tryagain',...FEEDBACK.map(f=>f.audio)]);showScreen('game');setTimeout(renderQuestion,180)}
function finishGame(){state.flowId++;voice.stop();setGameLocked(false);finalStars.textContent=state.stars;showScreen('finish');voice.success(true);setTimeout(()=>voice.play('ui_finish'),220)}
function resolveQuality(){
  if(state.quality!=='auto')return state.quality;
  const tv=/BubbleSafariTV|Android TV|TV/i.test(navigator.userAgent);
  const cores=Number(navigator.hardwareConcurrency||0);
  return tv||(cores>0&&cores<=4)?'balanced':'full';
}
function applyPreferences(){
  app.dataset.quality=resolveQuality();
  app.dataset.effects=state.effects?'on':'off';
  $$('.quality-button').forEach(button=>{const selected=button.dataset.quality===state.quality;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',selected?'true':'false')});
  const hint=$('#qualityHint');if(hint)hint.textContent=state.quality==='auto'?`تلقائي: ${app.dataset.quality==='balanced'?'متوازن للتلفزيون':'كامل'}`:state.quality==='balanced'?'متوازن: نفس الهوية بحمل رسومي أقل':'كامل: كل المؤثرات الثانوية';
  const effectsText=$('#settingsEffectsText');if(effectsText)effectsText.textContent=state.effects?'تشغيل':'إيقاف';
  const effectsToggle=$('#settingsEffectsToggle');if(effectsToggle)effectsToggle.setAttribute('aria-pressed',state.effects?'true':'false');
}
function updateSoundUi(){
  soundIcon.innerHTML=uiArt(state.muted?'muted':'sound');soundButton.setAttribute('aria-label',state.muted?'تشغيل الصوت':'كتم الصوت');
  const text=$('#settingsSoundText');if(text)text.textContent=state.muted?'إيقاف':'تشغيل';
  const toggle=$('#settingsSoundToggle');if(toggle)toggle.setAttribute('aria-pressed',state.muted?'false':'true');
}
function openSettings(){if(state.locked&&screens.game.classList.contains('screen-active'))return;state.settingsReturn=activeScreenName();voice.stop();showScreen('settings');applyPreferences();updateSoundUi()}
function closeSettings(){showScreen(state.settingsReturn||'home');setTimeout(()=>tv?.ensureFocus(),60)}
function isNativeTvApp(){return location.hostname==='appassets.androidplatform.net'||/BubbleSafariTV/i.test(navigator.userAgent)}
function setUpdatePercent(percent){
  const safe=Math.max(0,Math.min(100,Number(percent)||0)),scale=String(safe/100),text=`${Math.round(safe)}%`;
  if(updateProgressFill)updateProgressFill.style.transform=`scaleX(${scale})`;
  if(updateProgressPercent)updateProgressPercent.textContent=text;
  if(updateProgressEl){updateProgressEl.setAttribute('aria-valuenow',String(Math.round(safe)));updateProgressEl.dataset.percent=String(Math.round(safe))}
  if(otaOverlayFill)otaOverlayFill.style.transform=`scaleX(${scale})`;
  if(otaOverlayPercent)otaOverlayPercent.textContent=text;
}
function renderUpdateState(detail={}){
  const phase=String(detail.phase||'idle'),percent=Number(detail.percent||0),message=String(detail.message||''),version=String(detail.version||'');
  const active=['checking','available','downloading','verifying','installing'].includes(phase);
  const indeterminate=['checking','available','verifying','installing'].includes(phase)&&percent<=0;
  if(updateStatus&&message)updateStatus.textContent=message;
  if(latestVersion&&version)latestVersion.textContent=version.slice(0,8);
  if(updateProgressEl){updateProgressEl.dataset.phase=phase;updateProgressEl.classList.toggle('indeterminate',indeterminate)}
  if(otaOverlay){
    otaOverlay.classList.toggle('hidden',phase==='idle');
    otaOverlay.classList.toggle('indeterminate',indeterminate);
    otaOverlay.classList.toggle('is-ready',phase==='ready'||phase==='upToDate');
    otaOverlay.classList.toggle('is-error',phase==='error');
  }
  if(otaOverlayLabel&&message)otaOverlayLabel.textContent=message;
  setUpdatePercent(indeterminate?0:percent);
  if(checkUpdateButton){
    checkUpdateButton.disabled=active;
    checkUpdateButton.textContent=active?'جاري التحديث…':phase==='ready'?'التحديث جاهز':'تحقق من وجود تحديث';
  }
  if(phase==='upToDate'||phase==='ready')setUpdatePercent(100);
  if(phase==='upToDate')setTimeout(()=>otaOverlay?.classList.add('hidden'),2300);
  if(phase==='error')setTimeout(()=>otaOverlay?.classList.add('hidden'),4500);
}
window.BubbleSafariNativeUpdate=renderUpdateState;
window.addEventListener('bubbleSafariUpdate',event=>renderUpdateState(event.detail||{}));

async function readCurrentVersion(){
  let current='';
  try{const response=await fetch('./.bubble-safari-version',{cache:'no-store'});if(response.ok)current=(await response.text()).trim()}catch{}
  if(!current&&isNativeTvApp()){try{const response=await fetch('./bubble-safari-version.txt',{cache:'no-store'});if(response.ok)current=(await response.text()).trim()}catch{}}
  if(currentVersion)currentVersion.textContent=current?current.slice(0,8):'النسخة الأساسية';
  return current;
}
async function checkForUpdates(){
  if(!checkUpdateButton||!updateStatus)return;
  renderUpdateState({phase:'checking',percent:0,message:'جاري التحقق من التحديثات…'});
  const current=await readCurrentVersion();
  if(isNativeTvApp()){
    try{
      await fetch(`https://appassets.androidplatform.net/native/check-update?t=${Date.now()}`,{cache:'no-store'});
      return;
    }catch{
      renderUpdateState({phase:'error',percent:0,message:'تعذر بدء فحص التحديث الآن.'});
      return;
    }
  }
  try{
    const response=await fetch(`https://aseel90.github.io/bubble-safari-tv/updates/manifest.json?t=${Date.now()}`,{cache:'no-store'});
    if(!response.ok)throw new Error('manifest');
    const manifest=await response.json(),latest=String(manifest.version||'').trim();
    if(latestVersion)latestVersion.textContent=latest?latest.slice(0,8):'—';
    if(current&&latest&&current===latest)renderUpdateState({phase:'upToDate',percent:100,message:'اللعبة محدثة بالكامل.',version:latest});
    else if(latest)renderUpdateState({phase:'available',percent:0,message:'يوجد تحديث أحدث. داخل تطبيق التلفزيون سيظهر تقدم التنزيل الحقيقي.',version:latest});
    else renderUpdateState({phase:'error',percent:0,message:'لم أتمكن من قراءة رقم الإصدار الأحدث.'});
  }catch{
    if(latestVersion)latestVersion.textContent='—';
    renderUpdateState({phase:'error',percent:0,message:'تعذر الاتصال بخادم التحديثات الآن. اللعبة ستستمر بالعمل دون مشكلة.'});
  }finally{if(checkUpdateButton)checkUpdateButton.disabled=false}
}

$('#startButton').addEventListener('click',()=>{voice.ensureAudio();voice.play('ui_start');showScreen('age')});
$('#ageBackButton').addEventListener('click',()=>showScreen('home'));
$$('.age-card').forEach(card=>card.addEventListener('click',()=>{state.age=card.dataset.age;showScreen('world')}));
$('#worldBackButton').addEventListener('click',()=>showScreen('age'));
$$('.world-card').forEach(card=>card.addEventListener('click',()=>startGame(card.dataset.world)));
replayButton.addEventListener('click',()=>{voice.ensureAudio();if(state.currentQuestion)voice.play(state.currentQuestion.voiceKey)});
soundButton.addEventListener('click',()=>{state.muted=!state.muted;localStorage.setItem('bubbleSafariMuted',state.muted?'1':'0');if(state.muted)voice.stop();else if(state.currentQuestion){voice.ensureAudio();voice.play(state.currentQuestion.voiceKey)}updateSoundUi()});
settingsButton?.addEventListener('click',openSettings);
$('#settingsBackButton').addEventListener('click',closeSettings);
$('#settingsSoundToggle').addEventListener('click',()=>{state.muted=!state.muted;localStorage.setItem('bubbleSafariMuted',state.muted?'1':'0');if(state.muted)voice.stop();else voice.ensureAudio();updateSoundUi()});
$('#settingsEffectsToggle').addEventListener('click',()=>{state.effects=!state.effects;localStorage.setItem('bubbleSafariEffects',state.effects?'1':'0');applyPreferences()});
$$('.quality-button').forEach(button=>button.addEventListener('click',()=>{state.quality=button.dataset.quality;localStorage.setItem('bubbleSafariQuality',state.quality);applyPreferences()}));
$('#checkUpdateButton').addEventListener('click',checkForUpdates);
$('#playAgainButton').addEventListener('click',()=>startGame(state.world));
$('#worldButton').addEventListener('click',()=>showScreen('world'));
$('#homeButton').addEventListener('click',()=>showScreen('home'));
document.addEventListener('pointerdown',()=>voice.ensureAudio(),{once:true});

hydrateStaticArt();applyPreferences();updateSoundUi();setWorld('jungle');showScreen('home');readCurrentVersion();
if('serviceWorker'in navigator&&location.hostname.endsWith('github.io'))window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).catch(()=>{}));