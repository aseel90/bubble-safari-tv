export function createVoiceEngine({ isMuted }) {
  let audioContext = null;
  let currentVoice = null;
  const missingVoice = new Set();
  const audioFile = key => `./audio/${key}.wav`;

  function ensureAudio() {
    if (isMuted()) return null;
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') audioContext.resume();
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
    tone(523.25, t, .17, .08);
    tone(659.25, t + .09, .18, .07);
    tone(783.99, t + .18, big ? .42 : .24, .08);
    if (big) tone(1046.5, t + .29, .45, .065);
  }

  function wrong() {
    const ctx = ensureAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(310, t, .12, .035);
    tone(270, t + .08, .14, .03);
  }

  function stop() {
    if (currentVoice) {
      try { currentVoice.pause(); currentVoice.currentTime = 0; } catch {}
      currentVoice = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  function fallback(text) {
    if (isMuted() || !text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = .8;
    utterance.pitch = 1.05;
    utterance.volume = .95;
    const voices = window.speechSynthesis.getVoices();
    const arabic = voices.find(v => /^ar[-_]/i.test(v.lang));
    if (arabic) utterance.voice = arabic;
    window.speechSynthesis.speak(utterance);
  }

  function play(key, text) {
    if (isMuted()) return;
    stop();
    if (!key || missingVoice.has(key)) return fallback(text);
    const audio = new Audio(audioFile(key));
    currentVoice = audio;
    audio.preload = 'auto';
    audio.volume = .96;
    let fellBack = false;
    const fail = () => {
      if (fellBack) return;
      fellBack = true;
      missingVoice.add(key);
      if (currentVoice === audio) currentVoice = null;
      fallback(text);
    };
    audio.onerror = fail;
    const result = audio.play();
    if (result?.then) {
      result.then(() => {
        // Warm a complete 200 response in the Service Worker cache. Media elements
        // commonly use Range requests (206), which Cache API cannot store directly.
        fetch(audioFile(key)).catch(() => {});
      }).catch(fail);
    } else if (result?.catch) {
      result.catch(fail);
    }
    audio.onended = () => { if (currentVoice === audio) currentVoice = null; };
  }

  return { ensureAudio, success, wrong, stop, play };
}
