import { WORLDS, QUESTION_TYPES, getRoundCount, getOptionCount, AR } from './game-data.js';
import { createTvNavigation } from './tv-nav.js';
import { createVoice } from './voice.js';
import { createArt } from './art.js';
import { renderScene } from './scene-art.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const screens={home:$('#homeScreen'),age:$('#ageScreen'),world:$('#worldScreen'),game:$('#gameScreen'),finish:$('#finishScreen')};
const state={age:null,world:null,round:0,stars:0,current:null,locked:false};
const ui={
  sound:$('#soundButton'),start:$('#startButton'),ageBack:$('#ageBackButton'),worldBack:$('#worldBackButton'),
  worldGrid:$('#worldGrid'),gameWorld:$('#gameWorldLabel'),round:$('#roundText'),stars:$('#starsText'),progress:$('#progressFill'),
  question:$('#questionText'),questionKicker:$('#questionKicker'),replay:$('#replayButton'),choices:$('#choices'),feedback:$('#feedback'),
  feedbackText:$('#feedbackText'),finishStars:$('#finishStars'),finishMessage:$('#finishMessage'),playAgain:$('#playAgainButton'),
  worldButton:$('#worldButton'),homeButton:$('#homeButton')
};

function activeScreen(){return Object.values(screens).find(s=>s.classList.contains('screen-active'));}
const tv=createTvNavigation({getActiveScreen:activeScreen,onBack:goBack});
const voice=createVoice();
const art=createArt();

function show(name,focus=true){
  Object.entries(screens).forEach(([k,s])=>s.classList.toggle('screen-active',k===name));
  if(focus)setTimeout(()=>tv.focusFirst(screens[name]),30);
}
function goBack(){
  if(screens.finish.classList.contains('screen-active'))return show('world');
  if(screens.game.classList.contains('screen-active'))return show('world');
  if(screens.world.classList.contains('screen-active'))return show('age');
  if(screens.age.classList.contains('screen-active'))return show('home');
}
function random(arr){return arr[Math.floor(Math.random()*arr.length)];}
function shuffle(arr){return [...arr].sort(()=>Math.random()-.5);}

function makeQuestion(){
  const pool=QUESTION_TYPES[state.age]||QUESTION_TYPES['2-3'];
  const type=random(pool);
  const world=WORLDS[state.world];
  let opts=[], answer=null, prompt='', kicker='';
  if(type==='animal'){
    opts=shuffle(world.animals).slice(0,getOptionCount(state.age)); answer=random(opts);
    prompt=`أين ${answer.label}؟`; kicker='ابحث عن الحيوان';
  }else if(type==='color'){
    opts=shuffle(AR.colors).slice(0,getOptionCount(state.age)); answer=random(opts);
    prompt=`أين الفقاعة ${answer.feminine}؟`; kicker='ابحث عن اللون';
  }else if(type==='shape'){
    opts=shuffle(AR.shapes).slice(0,getOptionCount(state.age)); answer=random(opts);
    prompt=`أين ${answer.label}؟`; kicker='ابحث عن الشكل';
  }else if(type==='number'){
    opts=shuffle(AR.numbers).slice(0,getOptionCount(state.age)); answer=random(opts);
    prompt=`أين الرقم ${answer.value}؟`; kicker='ابحث عن الرقم';
  }else if(type==='size'){
    const animal=random(world.animals); opts=shuffle([{...animal,size:'small',label:'الصغير'},{...animal,size:'big',label:'الكبير'}]); answer=random(opts);
    prompt=`أين ${answer.label}؟`; kicker='قارن الأحجام';
  }else if(type==='match'){
    const base=random(world.animals); answer={...base,match:true};
    const others=shuffle(world.animals.filter(a=>a.id!==base.id)).slice(0,getOptionCount(state.age)-1);
    opts=shuffle([answer,...others]); prompt='اختر نفس الصورة'; kicker='طابق الصورة';
  }else{
    const common=random(world.animals), odd=random(world.animals.filter(a=>a.id!==common.id));
    opts=shuffle([{...common,odd:false},{...common,odd:false},{...odd,odd:true}]).slice(0,getOptionCount(state.age));
    if(!opts.some(o=>o.odd))opts[opts.length-1]={...odd,odd:true}; answer=opts.find(o=>o.odd); prompt='أي واحد مختلف؟'; kicker='لغز صغير';
  }
  return{type,opts,answer,prompt,kicker};
}

function renderChoice(opt,q,i){
  const btn=document.createElement('button'); btn.type='button'; btn.className='choice focusable'; btn.dataset.focusable='';
  btn.setAttribute('aria-label',opt.label||String(opt.value));
  btn.innerHTML=art.choice(opt,q.type,i);
  btn.addEventListener('click',()=>choose(opt,btn)); return btn;
}

function sameAnswer(opt,answer,type){
  if(type==='odd')return !!opt.odd;
  if(type==='size')return opt.id===answer.id&&opt.size===answer.size;
  if(type==='number')return opt.value===answer.value;
  return opt.id===answer.id;
}

function renderRound(){
  state.locked=false; const total=getRoundCount(state.age); state.current=makeQuestion();
  document.body.dataset.world=state.world;
  ui.gameWorld.textContent=WORLDS[state.world].name; ui.round.textContent=`${state.round+1} / ${total}`; ui.stars.textContent=String(state.stars);
  ui.progress.style.transform=`scaleX(${(state.round+1)/total})`;
  ui.progress.parentElement.setAttribute('aria-valuenow',String(state.round+1)); ui.progress.parentElement.setAttribute('aria-valuemax',String(total));
  ui.question.textContent=state.current.prompt; ui.questionKicker.textContent=state.current.kicker;
  ui.choices.innerHTML=''; state.current.opts.forEach((o,i)=>ui.choices.appendChild(renderChoice(o,state.current,i)));
  renderScene(state.world,state.current.type);
  if(state.current.type==='match'||state.current.type==='odd')ui.replay.hidden=true;else ui.replay.hidden=false;
  setTimeout(()=>tv.focusFirst(screens.game),30);
  voice.sayQuestion(state.current);
}

function choose(opt,btn){
  if(state.locked)return; state.locked=true;
  const ok=sameAnswer(opt,state.current.answer,state.current.type);
  if(ok){
    state.stars++; ui.stars.textContent=String(state.stars); btn.classList.add('correct-pop');
    voice.feedback(true); showFeedback(random(['رائع!','أحسنت!','ممتاز!','واو!']));
  }else{
    btn.classList.add('wrong-shake'); voice.feedback(false); showFeedback(random(['حاول مرة أخرى','قريب جدًا!']));
  }
  setTimeout(()=>{
    ui.feedback.classList.remove('show');
    if(ok){
      state.round++;
      if(state.round>=getRoundCount(state.age))finish();else renderRound();
    }else{state.locked=false;btn.classList.remove('wrong-shake');tv.setFocus(btn);}
  },ok?900:700);
}
function showFeedback(text){ui.feedbackText.textContent=text;ui.feedback.classList.add('show');}
function finish(){
  ui.finishStars.textContent=String(state.stars); const total=getRoundCount(state.age);
  ui.finishMessage.textContent=state.stars===total?'أنت بطل سفاري الفقاعات!':state.stars>=Math.ceil(total*.75)?'مغامرة رائعة!':'أحسنت يا مستكشف!';
  voice.finish(); show('finish');
}

ui.start.addEventListener('click',()=>show('age'));
ui.ageBack.addEventListener('click',()=>show('home'));
$$('.age-card').forEach(c=>c.addEventListener('click',()=>{state.age=c.dataset.age;show('world');}));
ui.worldBack.addEventListener('click',()=>show('age'));
$$('.world-card').forEach(c=>c.addEventListener('click',()=>{state.world=c.dataset.world;state.round=0;state.stars=0;show('game');renderRound();}));
ui.replay.addEventListener('click',()=>voice.sayQuestion(state.current,true));
ui.sound.addEventListener('click',()=>{voice.toggle();ui.sound.textContent=voice.muted?'🔇':'🔊';ui.sound.setAttribute('aria-label',voice.muted?'تشغيل الصوت':'كتم الصوت');});
ui.playAgain.addEventListener('click',()=>{state.round=0;state.stars=0;show('game');renderRound();});
ui.worldButton.addEventListener('click',()=>show('world'));
ui.homeButton.addEventListener('click',()=>show('home'));

window.addEventListener('DOMContentLoaded',()=>{art.hydrate();renderScene('jungle','home');tv.focusFirst(screens.home);});
if('serviceWorker'in navigator&&location.protocol!=='file:'&&location.hostname!=='appassets.androidplatform.net')window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).catch(()=>{}));
