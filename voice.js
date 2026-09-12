export function createVoiceEngine({ isMuted }) {
  let audioContext = null;
  let currentResolve = null;
  let pendingVoice = null;
  let activeKey = null;
  const voicePlayer = new Audio();
  voicePlayer.preload = 'auto';
  voicePlayer.volume = .96;
  const audioFile = key => `./audio/${key}.wav`;
  const speechFallback = {
    prompt_match: 'اختر الصورة',
    prompt_odd: 'اختر الصورة المختلفة'
  };

  function ensureAudio() {
    if (isMuted()) return null;
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    return audioContext;
  }

  function tone(freq, when, duration, gain = .08, type = 'sine') {
    const ctx = ensureAudio();
    if (!ctx || isMuted()) return;
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

  function success(big = false) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(523.25, t, .17, .07);
    tone(659.25, t + .09, .18, .065);
    tone(783.99, t + .18, big ? .42 : .24, .075);
    if (big) tone(1046.5, t + .29, .45, .06);
  }

  function wrong() {
    const ctx = ensureAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(310, t, .12, .03);
    tone(270, t + .08, .14, .026);
  }

  function settleCurrent(result = false) {
    const resolve = currentResolve;
    currentResolve = null;
    activeKey = null;
    if (resolve) resolve(result);
  }

  function stop() {
    try {
      voicePlayer.pause();
      voicePlayer.currentTime = 0;
      voicePlayer.removeAttribute('src');
      voicePlayer.load();
    } catch {}
    try { window.speechSynthesis?.cancel(); } catch {}
    settleCurrent(false);
  }

  function speakFallback(key) {
    const text = speechFallback[key];
    if (!text || !('speechSynthesis' in window) || isMuted()) return Promise.resolve(false);
    return new Promise(resolve => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = .88;
        utterance.pitch = 1.08;
        const voices = speechSynthesis.getVoices?.() || [];
        const arabic = voices.find(v => /^ar([_-]|$)/i.test(v.lang || ''));
        if (arabic) utterance.voice = arabic;
        utterance.onend = () => resolve(true);
        utterance.onerror = () => resolve(false);
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      } catch { resolve(false); }
    });
  }

  function tryPlay(key) {
    if (isMuted() || !key) return Promise.resolve(false);
    stop();
    if (speechFallback[key]) {
      pendingVoice = null;
      return speakFallback(key);
    }
    activeKey = key;
    voicePlayer.src = audioFile(key);
    voicePlayer.preload = 'auto';

    return new Promise(resolve => {
      currentResolve = resolve;
      const finish = result => {
        if (activeKey !== key) return;
        settleCurrent(result);
      };
      voicePlayer.onended = () => finish(true);
      voicePlayer.onerror = async () => {
        if (activeKey !== key) return;
        const spoken = await speakFallback(key);
        finish(spoken);
      };
      voicePlayer.play().then(() => {
        pendingVoice = null;
      }).catch(async err => {
        if (err?.name === 'NotAllowedError') pendingVoice = { key };
        if (speechFallback[key]) {
          const spoken = await speakFallback(key);
          finish(spoken);
        } else finish(false);
      });
    });
  }

  function play(key) {
    if (isMuted() || !key) return Promise.resolve(false);
    pendingVoice = { key };
    return tryPlay(key);
  }

  function retryPending() {
    ensureAudio();
    if (!pendingVoice || isMuted() || activeKey) return;
    const { key } = pendingVoice;
    tryPlay(key);
  }

  function preload(keys = []) {
    // Keep memory predictable on TV: warm only a tiny set through the HTTP/app-assets cache.
    [...new Set(keys.filter(Boolean))].slice(0, 5).forEach(key => {
      fetch(audioFile(key), { cache: 'force-cache' }).catch(() => {});
    });
  }

  document.addEventListener('keydown', retryPending, { capture: true });
  document.addEventListener('pointerdown', retryPending, { capture: true });

  return { ensureAudio, success, wrong, stop, play, preload };
}
