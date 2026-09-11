import { COLORS, SHAPES, NUMBERS, WORLDS, FEEDBACK } from './game-data.js';
import { createTvNavigation } from './tv-nav.js';
import { createVoiceEngine } from './voice.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const screens = { home:$('#homeScreen'), age:$('#ageScreen'), world:$('#worldScreen'), game:$('#gameScreen'), finish:$('#finishScreen') };
const app=$('#app'), hud=$('#hud'), starCount=$('#starCount'), roundText=$('#roundText'), worldName=$('#worldName'), worldIcon=$('#worldIcon'), choicesEl=$('#choices'), questionText=$('#questionText'), questionKicker=$('#questionKicker'), replayButton=$('#replayButton'), soundButton=$('#soundButton'), soundIcon=$('#soundIcon'), feedback=$('#feedback'), feedbackTitle=$('#feedbackTitle'), feedbackSubtitle=$('#feedbackSubtitle'), feedbackIcon=$('#feedbackIcon'), confetti=$('#confetti'), finalStars=$('#finalStars');

const state={age:'2-3',world:'jungle',round:0,totalRounds:12,stars:0,streak:0,muted:localStorage.getItem('bubbleSafariMuted')==='1',currentQuestion:null,locked:false,typePlan:[],usedTargets:{},feedbackHistory:[],lastSize:null};
const voice=createVoiceEngine({isMuted:()=>state.muted});
let tv;

function showScreen(name){Object.entries(screens).forEach(([key,el])=>{el.classList.toggle('screen-active',key===name);el.setAttribute('aria-hidden',key===name?'false':'true')});hud.classList.toggle('hidden',name!=='game');requestAnimationFrame(()=>{let selector=null;if(name==='home')selector='#startButton';if(name==='age')selector=`[data-age="${state.age}"]`;if(name==='world')selector=`[data-world="${state.world}"]`;if(name==='finish')selector='#playAgainButton';const preferred=selector?$(selector,screens[name]):null;if(preferred)tv?.setFocus(preferred);else tv?.focusFirst(screens[name])})}
function handleBack(){voice.stop();state.locked=false;if(screens.game.classList.contains('screen-active'))return showScreen('world');if(screens.world.classList.contains('screen-active'))return showScreen('age');if(screens.age.classList.contains('screen-active')||screens.finish.classList.contains('screen-active'))showScreen('home')}
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
  const target=randomFrom(fresh);used.add(target.id);return target
}

function buildTypePlan(){const world=WORLDS[state.world],base=state.age==='2-3'?world.youngTypes:world.olderTypes,bag=[];while(bag.length<state.totalRounds)bag.push(...shuffle(base));const plan=bag.slice(0,state.totalRounds);for(let i=1;i<plan.length;i++){if(plan[i]===plan[i-1]){const swap=plan.findIndex((type,j)=>j>i&&type!==plan[i-1]&&type!==plan[i+1]);if(swap>-1)[plan[i],plan[swap]]=[plan[swap],plan[i]]}}return plan}
function symbolPool(){const animals=WORLDS[state.world].animals;return animals.length?animals.map(a=>({...a,symbol:a.emoji,kind:'animal'})):SHAPES.map(s=>({...s,kind:'shape'}))}

function makeAnimalQuestion(){const animals=WORLDS[state.world].animals;if(!animals.length)return makeShapeQuestion();const target=freshFrom(animals,'animal');return{type:'animal',kicker:'ابحث عن الحيوان',prompt:`أين ${target.name}؟`,voiceKey:target.audio,fallbackSpeech:`أين ${target.name}؟`,options:pickUnique(animals,choiceCount(),target).map((animal,i)=>({id:animal.id,label:animal.name,symbol:animal.emoji,color:COLORS[(state.round+i)%COLORS.length].hex,correct:animal.id===target.id,kind:'animal'}))}}
function makeColorQuestion(){const target=freshFrom(COLORS,'color'),selected=pickUnique(COLORS,choiceCount(),target),icon=randomFrom(symbolPool()).symbol;return{type:'color',kicker:'ابحث عن اللون',prompt:`أين الفقاعة ${target.name}؟`,voiceKey:target.audio,fallbackSpeech:`أين الفقاعة ${target.name}؟`,options:shuffle(selected.map(color=>({id:color.id,label:color.label,symbol:icon,color:color.hex,correct:color.id===target.id,kind:'color'})))}}
function makeShapeQuestion(){const target=freshFrom(SHAPES,'shape'),selected=pickUnique(SHAPES,choiceCount(),target);return{type:'shape',kicker:'ابحث عن الشكل',prompt:`أين ${target.name}؟`,voiceKey:target.audio,fallbackSpeech:`أين ${target.name}؟`,options:shuffle(selected.map((shape,i)=>({id:shape.id,label:shape.name,symbol:shape.symbol,color:COLORS[(state.round+i+1)%COLORS.length].hex,correct:shape.id===target.id,kind:'shape'})))}}
function makeNumberQuestion(){const target=freshFrom(NUMBERS,'number'),selected=pickUnique(NUMBERS,choiceCount(),target);return{type:'number',kicker:'ابحث عن الرقم',prompt:`أين الرقم ${target.value}؟`,voiceKey:target.audio,fallbackSpeech:`أين الرقم ${target.name}؟`,options:shuffle(selected.map((number,i)=>({id:number.id,label:`الرقم ${number.value}`,symbol:String(number.value),color:COLORS[(state.round+i+2)%COLORS.length].hex,correct:number.id===target.id,kind:'number'})))}}
function makeSizeQuestion(){const base=freshFrom(symbolPool(),'size-symbol'),big=state.lastSize===null?Math.random()>.5:!state.lastSize;state.lastSize=big;const young=state.age==='2-3',targetId=big?'big':'small',scales=young?[.68,1.34]:(big?[.72,1,1.38]:[.62,1,1.28]),labels=young?['الصغير','الكبير']:['الصغير','المتوسط','الكبير'],correctIndex=big?scales.length-1:0;return{type:'size',kicker:'قارن الأحجام',prompt:big?'أين الكبير؟':'أين الصغير؟',voiceKey:big?'size_big':'size_small',fallbackSpeech:big?'أين الكبير؟':'أين الصغير؟',options:scales.map((scale,i)=>({id:`${targetId}-${i}`,label:labels[i],symbol:base.symbol,color:COLORS[(state.round+i)%COLORS.length].hex,correct:i===correctIndex,kind:'size',scale}))}}
function makeMatchQuestion(){const pool=symbolPool(),target=freshFrom(pool,'match'),options=pickUnique(pool,choiceCount(),target).map((item,i)=>({id:item.id,label:item.name,symbol:item.symbol,color:COLORS[(state.round+i)%COLORS.length].hex,correct:item.id===target.id,kind:item.kind}));return{type:'match',kicker:'طابق الصورة',prompt:`اختر نفس الصورة  ${target.symbol}`,voiceKey:null,fallbackSpeech:'اختر الصورة المطابقة.',options}}
function makeOddQuestion(){const pool=symbolPool(),base=freshFrom(pool,'odd-base');let odd=freshFrom(pool.filter(item=>item.id!==base.id),'odd-item');if(!odd)odd=SHAPES.find(s=>s.id!==base.id);const oddIndex=Math.floor(Math.random()*3);return{type:'odd',kicker:'لغز صغير',prompt:'أي واحد مختلف؟',voiceKey:null,fallbackSpeech:'أي واحد مختلف؟',options:[0,1,2].map((_,i)=>{const item=i===oddIndex?odd:base;return{id:`${item.id}-${i}`,label:item.name,symbol:item.symbol||item.emoji,color:COLORS[(state.round+i)%COLORS.length].hex,correct:i===oddIndex,kind:item.kind||(item.emoji?'animal':'shape')}})}}
function makeQuestion(){const type=state.typePlan[state.round]||'animal';if(type==='animal')return makeAnimalQuestion();if(type==='color')return makeColorQuestion();if(type==='shape')return makeShapeQuestion();if(type==='number')return makeNumberQuestion();if(type==='size')return makeSizeQuestion();if(type==='match')return makeMatchQuestion();return makeOddQuestion()}

function shade(hex,percent){const num=parseInt(hex.slice(1),16),amt=Math.round(2.55*percent),r=Math.max(0,Math.min(255,(num>>16)+amt)),g=Math.max(0,Math.min(255,((num>>8)&255)+amt)),b=Math.max(0,Math.min(255,(num&255)+amt));return`#${(0x1000000+r*0x10000+g*0x100+b).toString(16).slice(1)}`}
function renderQuestion(){state.currentQuestion=makeQuestion();questionKicker.textContent=state.currentQuestion.kicker;questionText.textContent=state.currentQuestion.prompt;roundText.textContent=`${state.round+1} / ${state.totalRounds}`;starCount.textContent=state.stars;choicesEl.innerHTML='';choicesEl.style.gridTemplateColumns=`repeat(${state.currentQuestion.options.length},minmax(0,1fr))`;state.currentQuestion.options.forEach((option,index)=>{const button=document.createElement('button');button.type='button';button.className='choice focusable';button.dataset.focusable='';button.setAttribute('aria-label',option.label);const contentClass=option.kind==='number'?'choice-number':option.kind==='shape'?'choice-shape':'choice-symbol',sizeStyle=option.kind==='size'?`style="--size-scale:${option.scale}"`:'',sizeClass=option.kind==='size'?' choice-size-symbol':'';button.innerHTML=`<span class="choice-bubble" style="background:radial-gradient(circle at 30% 24%,rgba(255,255,255,.65),transparent 12%),linear-gradient(145deg,${option.color},${shade(option.color,-8)})"></span><span class="choice-content"><span class="${contentClass}${sizeClass}" ${sizeStyle}>${option.symbol}</span></span><span class="choice-label">${option.label}</span>`;button.addEventListener('click',()=>selectChoice(button,option));choicesEl.appendChild(button);if(index===0)setTimeout(()=>tv.setFocus(button),50)});setTimeout(()=>voice.play(state.currentQuestion.voiceKey,state.currentQuestion.fallbackSpeech),180)}

function chooseFeedback(){const recent=new Set(state.feedbackHistory.slice(-2)),candidates=FEEDBACK.filter(item=>!recent.has(item.audio)),chosen=randomFrom(candidates.length?candidates:FEEDBACK);state.feedbackHistory.push(chosen.audio);return chosen}
function showSuccess(){const msg=state.streak>=4?{title:'مذهل!',sub:'أربع إجابات متتالية',audio:'feedback_wow'}:chooseFeedback();feedbackTitle.textContent=msg.title;feedbackSubtitle.textContent=msg.sub;feedbackIcon.textContent=state.streak>=4?'🏅':'★';feedback.classList.add('show');burstConfetti();voice.play(msg.audio,msg.title)}
function burstConfetti(){confetti.innerHTML='';const colors=['#ffd45b','#ff7c68','#75c9e8','#81c96c','#ad92e8','#ff9fc4'];for(let i=0;i<26;i++){const piece=document.createElement('i');piece.className='confetti-piece';piece.style.background=colors[i%colors.length];piece.style.setProperty('--x',`${(Math.random()-.5)*620}px`);piece.style.setProperty('--y',`${(Math.random()-.72)*470}px`);piece.style.setProperty('--r',`${(Math.random()-.5)*720}deg`);confetti.appendChild(piece)}setTimeout(()=>{confetti.innerHTML=''},900)}
function selectChoice(button,option){if(state.locked)return;voice.ensureAudio();if(!option.correct){state.streak=0;button.classList.remove('wrong-shake');void button.offsetWidth;button.classList.add('wrong-shake');voice.wrong();voice.play('feedback_tryagain','حاول مرة أخرى');setTimeout(()=>button.classList.remove('wrong-shake'),450);return}state.locked=true;state.streak++;button.classList.add('correct-pop');state.stars++;starCount.textContent=state.stars;localStorage.setItem('bubbleSafariBest',String(Math.max(state.stars,Number(localStorage.getItem('bubbleSafariBest')||0))));voice.success();showSuccess();setTimeout(()=>{feedback.classList.remove('show');state.round++;if(state.round>=state.totalRounds)finishGame();else{state.locked=false;renderQuestion()}},1700)}

function setWorld(id){state.world=id;const world=WORLDS[id];app.classList.remove('world-jungle','world-farm','world-ocean','world-rainbow');app.classList.add(world.className);worldName.textContent=world.name;worldIcon.textContent=world.icon}
function startGame(worldId=state.world){setWorld(worldId);state.round=0;state.totalRounds=state.age==='2-3'?12:15;state.stars=0;state.streak=0;state.locked=false;state.usedTargets={};state.feedbackHistory=[];state.lastSize=null;state.typePlan=buildTypePlan();starCount.textContent='0';showScreen('game');setTimeout(renderQuestion,180)}
function finishGame(){voice.stop();state.locked=false;finalStars.textContent=state.stars;showScreen('finish');voice.success(true);setTimeout(()=>voice.play('ui_finish',`أحسنت! جمعت ${state.stars} نجمة`),220)}
function updateSoundUi(){soundIcon.textContent=state.muted?'🔇':'🔊';soundButton.setAttribute('aria-label',state.muted?'تشغيل الصوت':'كتم الصوت')}

$('#startButton').addEventListener('click',()=>{voice.ensureAudio();voice.play('ui_start','هيا نبدأ المغامرة');showScreen('age')});
$('#ageBackButton').addEventListener('click',()=>showScreen('home'));
$$('.age-card').forEach(card=>card.addEventListener('click',()=>{state.age=card.dataset.age;showScreen('world')}));
$('#worldBackButton').addEventListener('click',()=>showScreen('age'));
$$('.world-card').forEach(card=>card.addEventListener('click',()=>startGame(card.dataset.world)));
replayButton.addEventListener('click',()=>{voice.ensureAudio();if(state.currentQuestion)voice.play(state.currentQuestion.voiceKey,state.currentQuestion.fallbackSpeech)});
soundButton.addEventListener('click',()=>{state.muted=!state.muted;localStorage.setItem('bubbleSafariMuted',state.muted?'1':'0');if(state.muted)voice.stop();else if(state.currentQuestion){voice.ensureAudio();voice.play(state.currentQuestion.voiceKey,state.currentQuestion.fallbackSpeech)}updateSoundUi()});
$('#playAgainButton').addEventListener('click',()=>startGame(state.world));
$('#worldButton').addEventListener('click',()=>showScreen('world'));
$('#homeButton').addEventListener('click',()=>showScreen('home'));
document.addEventListener('pointerdown',()=>voice.ensureAudio(),{once:true});

updateSoundUi();setWorld('jungle');showScreen('home');
if('serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
