(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const screens = {
    home: $('#homeScreen'),
    age: $('#ageScreen'),
    game: $('#gameScreen'),
    finish: $('#finishScreen')
  };

  const hud = $('#hud');
  const starCount = $('#starCount');
  const roundText = $('#roundText');
  const choicesEl = $('#choices');
  const questionText = $('#questionText');
  const questionKicker = $('#questionKicker');
  const replayButton = $('#replayButton');
  const soundButton = $('#soundButton');
  const soundIcon = $('#soundIcon');
  const feedback = $('#feedback');
  const feedbackTitle = $('#feedbackTitle');
  const feedbackSubtitle = $('#feedbackSubtitle');
  const feedbackIcon = $('#feedbackIcon');
  const confetti = $('#confetti');
  const finalStars = $('#finalStars');

  const COLORS = [
    { id: 'red', name: 'الحمراء', hex: '#ff8176' },
    { id: 'blue', name: 'الزرقاء', hex: '#70cfe9' },
    { id: 'yellow', name: 'الصفراء', hex: '#ffd867' },
    { id: 'green', name: 'الخضراء', hex: '#79c96c' },
    { id: 'purple', name: 'البنفسجية', hex: '#ad92e8' },
    { id: 'pink', name: 'الوردية', hex: '#ff9fc4' }
  ];

  const ANIMALS = [
    { id: 'lion', name: 'الأسد', emoji: '🦁' },
    { id: 'elephant', name: 'الفيل', emoji: '🐘' },
    { id: 'monkey', name: 'القرد', emoji: '🐵' },
    { id: 'giraffe', name: 'الزرافة', emoji: '🦒' },
    { id: 'panda', name: 'الباندا', emoji: '🐼' },
    { id: 'frog', name: 'الضفدع', emoji: '🐸' },
    { id: 'tiger', name: 'النمر', emoji: '🐯' },
    { id: 'zebra', name: 'الحمار الوحشي', emoji: '🦓' },
    { id: 'hippo', name: 'فرس النهر', emoji: '🦛' }
  ];

  const state = {
    age: '2-3',
    round: 0,
    totalRounds: 10,
    stars: 0,
    muted: localStorage.getItem('bubbleSafariMuted') === '1',
    currentQuestion: null,
    locked: false,
    lastAnimal: null,
    lastType: null,
    audioContext: null
  };

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      el.classList.toggle('screen-active', key === name);
      el.setAttribute('aria-hidden', key === name ? 'false' : 'true');
    });
    hud.classList.toggle('hidden', name !== 'game');
    requestAnimationFrame(() => focusFirst(name));
  }

  function focusFirst(screenName) {
    const screen = screens[screenName];
    if (!screen) return;
    const target = $('[data-focusable]:not([disabled])', screen);
    if (target) setTvFocus(target);
  }

  function setTvFocus(el) {
    $$('.tv-focus').forEach(node => node.classList.remove('tv-focus'));
    if (!el) return;
    el.classList.add('tv-focus');
    try { el.focus({ preventScroll: true }); } catch { el.focus(); }
  }

  function activeFocusables() {
    const activeScreen = $('.screen-active');
    if (!activeScreen) return [];
    return $$('[data-focusable]:not([disabled])', activeScreen).filter(el => {
      const style = getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });
  }

  function spatialNavigate(direction) {
    const items = activeFocusables();
    if (!items.length) return;
    const current = document.activeElement && items.includes(document.activeElement)
      ? document.activeElement
      : $('.tv-focus');
    if (!current || !items.includes(current)) {
      setTvFocus(items[0]);
      return;
    }

    const from = current.getBoundingClientRect();
    const fx = from.left + from.width / 2;
    const fy = from.top + from.height / 2;
    let best = null;
    let bestScore = Infinity;

    items.forEach(item => {
      if (item === current) return;
      const r = item.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const dx = x - fx;
      const dy = y - fy;
      const valid =
        (direction === 'left' && dx < -8) ||
        (direction === 'right' && dx > 8) ||
        (direction === 'up' && dy < -8) ||
        (direction === 'down' && dy > 8);
      if (!valid) return;

      const primary = (direction === 'left' || direction === 'right') ? Math.abs(dx) : Math.abs(dy);
      const secondary = (direction === 'left' || direction === 'right') ? Math.abs(dy) : Math.abs(dx);
      const score = primary + secondary * 2.15;
      if (score < bestScore) {
        bestScore = score;
        best = item;
      }
    });

    if (best) setTvFocus(best);
  }

  document.addEventListener('keydown', event => {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' ', 'Escape', 'Backspace'];
    if (keys.includes(event.key)) event.preventDefault();

    if (event.key === 'ArrowLeft') spatialNavigate('left');
    if (event.key === 'ArrowRight') spatialNavigate('right');
    if (event.key === 'ArrowUp') spatialNavigate('up');
    if (event.key === 'ArrowDown') spatialNavigate('down');
    if (event.key === 'Enter' || event.key === ' ') {
      const el = document.activeElement;
      if (el && el.matches('[data-focusable]')) el.click();
    }
    if (event.key === 'Escape' || event.key === 'Backspace') handleBack();
  }, { passive: false });

  function handleBack() {
    if (screens.game.classList.contains('screen-active')) {
      state.locked = false;
      cancelSpeech();
      showScreen('age');
    } else if (screens.age.classList.contains('screen-active') || screens.finish.classList.contains('screen-active')) {
      showScreen('home');
    }
  }

  function randomFrom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function uniqueAnimals(count, preferred) {
    const pool = ANIMALS.filter(a => !preferred || a.id !== preferred.id);
    const chosen = preferred ? [preferred] : [];
    chosen.push(...shuffle(pool).slice(0, count - chosen.length));
    return shuffle(chosen);
  }

  function makeQuestion() {
    const types = state.age === '4-5' ? ['animal', 'animal', 'color', 'number'] : ['animal', 'animal', 'color'];
    let type = randomFrom(types);
    if (type === state.lastType && Math.random() < .65) {
      type = randomFrom(types.filter(t => t !== state.lastType));
    }
    state.lastType = type;

    if (type === 'animal') {
      let target = randomFrom(ANIMALS);
      if (target.id === state.lastAnimal) target = randomFrom(ANIMALS.filter(a => a.id !== state.lastAnimal));
      state.lastAnimal = target.id;
      const options = uniqueAnimals(3, target).map((animal, index) => ({
        id: animal.id,
        label: animal.name,
        symbol: animal.emoji,
        color: COLORS[(state.round + index) % COLORS.length].hex,
        correct: animal.id === target.id,
        kind: 'animal'
      }));
      return {
        type,
        kicker: 'ابحث عن الحيوان',
        prompt: `أين ${target.name}؟`,
        speech: `أين ${target.name}؟`,
        options
      };
    }

    if (type === 'color') {
      const selectedColors = shuffle(COLORS).slice(0, 3);
      const target = randomFrom(selectedColors);
      const animal = randomFrom(ANIMALS);
      return {
        type,
        kicker: 'ابحث عن اللون',
        prompt: `أين الفقاعة ${target.name}؟`,
        speech: `أين الفقاعة ${target.name}؟`,
        options: shuffle(selectedColors.map(color => ({
          id: color.id,
          label: color.name.replace('ال', ''),
          symbol: animal.emoji,
          color: color.hex,
          correct: color.id === target.id,
          kind: 'color'
        })))
      };
    }

    const nums = shuffle([1, 2, 3, 4, 5]).slice(0, 3);
    const target = randomFrom(nums);
    return {
      type: 'number',
      kicker: 'ابحث عن الرقم',
      prompt: `أين الرقم ${target}؟`,
      speech: `أين الرقم ${target}؟`,
      options: shuffle(nums.map((num, index) => ({
        id: String(num),
        label: `الرقم ${num}`,
        symbol: String(num),
        color: COLORS[(state.round + index + 2) % COLORS.length].hex,
        correct: num === target,
        kind: 'number'
      })))
    };
  }

  function renderQuestion() {
    state.currentQuestion = makeQuestion();
    questionKicker.textContent = state.currentQuestion.kicker;
    questionText.textContent = state.currentQuestion.prompt;
    roundText.textContent = `${state.round + 1} / ${state.totalRounds}`;
    starCount.textContent = state.stars;
    choicesEl.innerHTML = '';

    state.currentQuestion.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice focusable';
      button.dataset.focusable = '';
      button.dataset.correct = option.correct ? '1' : '0';
      button.setAttribute('aria-label', option.label);
      button.innerHTML = `
        <span class="choice-bubble" style="background: radial-gradient(circle at 30% 24%, rgba(255,255,255,.65), transparent 12%), linear-gradient(145deg, ${option.color}, ${shade(option.color, -8)})"></span>
        <span class="choice-content">
          <span class="${option.kind === 'number' ? 'choice-number' : 'choice-symbol'}">${option.symbol}</span>
        </span>
        <span class="choice-label">${option.label}</span>`;
      button.addEventListener('click', () => selectChoice(button, option));
      choicesEl.appendChild(button);
      if (index === 0) setTimeout(() => setTvFocus(button), 60);
    });

    setTimeout(() => speak(state.currentQuestion.speech), 260);
  }

  function shade(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const r = Math.max(0, Math.min(255, (num >> 16) + amt));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
    return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
  }

  function selectChoice(button, option) {
    if (state.locked) return;
    ensureAudio();

    if (!option.correct) {
      button.classList.remove('wrong-shake');
      void button.offsetWidth;
      button.classList.add('wrong-shake');
      softWrongSound();
      speak('حاول مرة أخرى');
      setTimeout(() => button.classList.remove('wrong-shake'), 450);
      return;
    }

    state.locked = true;
    button.classList.add('correct-pop');
    state.stars += 1;
    starCount.textContent = state.stars;
    localStorage.setItem('bubbleSafariBest', String(Math.max(state.stars, Number(localStorage.getItem('bubbleSafariBest') || 0))));
    successSound();
    showSuccess();

    setTimeout(() => {
      feedback.classList.remove('show');
      state.round += 1;
      if (state.round >= state.totalRounds) finishGame();
      else {
        state.locked = false;
        renderQuestion();
      }
    }, 1050);
  }

  function showSuccess() {
    const messages = [
      ['رائع!', 'وجدتها'],
      ['أحسنت!', 'إجابة جميلة'],
      ['ممتاز!', 'استمر يا بطل'],
      ['واو!', 'أنت رائع']
    ];
    const [title, sub] = randomFrom(messages);
    feedbackTitle.textContent = title;
    feedbackSubtitle.textContent = sub;
    feedbackIcon.textContent = '★';
    feedback.classList.add('show');
    burstConfetti();
    speak(title);
  }

  function burstConfetti() {
    confetti.innerHTML = '';
    const colors = ['#ffd45b', '#ff7c68', '#75c9e8', '#81c96c', '#ad92e8', '#ff9fc4'];
    for (let i = 0; i < 26; i += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti-piece';
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty('--x', `${(Math.random() - .5) * 620}px`);
      piece.style.setProperty('--y', `${(Math.random() - .72) * 470}px`);
      piece.style.setProperty('--r', `${(Math.random() - .5) * 720}deg`);
      piece.style.animationDelay = `${Math.random() * .08}s`;
      confetti.appendChild(piece);
    }
    setTimeout(() => { confetti.innerHTML = ''; }, 900);
  }

  function startGame(age) {
    state.age = age;
    state.round = 0;
    state.stars = 0;
    state.locked = false;
    state.lastAnimal = null;
    state.lastType = null;
    starCount.textContent = '0';
    showScreen('game');
    renderQuestion();
  }

  function finishGame() {
    cancelSpeech();
    state.locked = false;
    finalStars.textContent = state.stars;
    showScreen('finish');
    successSound(true);
    setTimeout(() => speak(`أحسنت! جمعت ${state.stars} نجوم`), 300);
  }

  function ensureAudio() {
    if (state.muted) return null;
    if (!state.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      state.audioContext = new AudioCtx();
    }
    if (state.audioContext.state === 'suspended') state.audioContext.resume();
    return state.audioContext;
  }

  function tone(freq, when, duration, gain = .08, type = 'sine') {
    const ctx = ensureAudio();
    if (!ctx || state.muted) return;
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    vol.gain.setValueAtTime(0, when);
    vol.gain.linearRampToValueAtTime(gain, when + .015);
    vol.gain.exponentialRampToValueAtTime(.001, when + duration);
    osc.connect(vol).connect(ctx.destination);
    osc.start(when);
    osc.stop(when + duration + .03);
  }

  function successSound(big = false) {
    if (state.muted) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(523.25, t, .17, .08, 'sine');
    tone(659.25, t + .09, .18, .07, 'sine');
    tone(783.99, t + .18, big ? .42 : .24, .08, 'sine');
    if (big) tone(1046.5, t + .29, .45, .065, 'sine');
  }

  function softWrongSound() {
    if (state.muted) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(310, t, .12, .035, 'sine');
    tone(270, t + .08, .14, .03, 'sine');
  }

  function cancelSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  function speak(text) {
    if (state.muted || !('speechSynthesis' in window)) return;
    cancelSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = .82;
    utterance.pitch = 1.08;
    utterance.volume = .95;
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => /^ar[-_]/i.test(v.lang));
    if (arabicVoice) utterance.voice = arabicVoice;
    window.speechSynthesis.speak(utterance);
  }

  function updateSoundUi() {
    soundIcon.textContent = state.muted ? '🔇' : '🔊';
    soundButton.setAttribute('aria-label', state.muted ? 'تشغيل الصوت' : 'كتم الصوت');
  }

  $('#startButton').addEventListener('click', () => {
    ensureAudio();
    showScreen('age');
  });
  $('#ageBackButton').addEventListener('click', () => showScreen('home'));
  $$('.age-card').forEach(card => card.addEventListener('click', () => startGame(card.dataset.age)));
  replayButton.addEventListener('click', () => {
    ensureAudio();
    if (state.currentQuestion) speak(state.currentQuestion.speech);
  });
  soundButton.addEventListener('click', () => {
    state.muted = !state.muted;
    localStorage.setItem('bubbleSafariMuted', state.muted ? '1' : '0');
    if (state.muted) cancelSpeech();
    else {
      ensureAudio();
      if (state.currentQuestion) speak(state.currentQuestion.speech);
    }
    updateSoundUi();
  });
  $('#playAgainButton').addEventListener('click', () => startGame(state.age));
  $('#homeButton').addEventListener('click', () => showScreen('home'));

  document.addEventListener('pointerdown', () => ensureAudio(), { once: true });
  document.addEventListener('focusin', event => {
    if (event.target.matches('[data-focusable]')) {
      $$('.tv-focus').forEach(node => node.classList.remove('tv-focus'));
      event.target.classList.add('tv-focus');
    }
  });

  updateSoundUi();
  showScreen('home');

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }
})();
