export function createVoiceEngine({ isMuted }) {
  let audioContext = null;
  let currentVoice = null;
  let pendingVoice = null;
  const audioFile = key => `./audio/${key}.wav`;

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
  }

  function tryPlay(key) {
    if (isMuted() || !key) return Promise.resolve(false);
    stop();
    const audio = new Audio(audioFile(key));
    currentVoice = audio;
    audio.preload = 'auto';
    audio.volume = .96;
    return audio.play().then(() => {
      pendingVoice = null;
      fetch(audioFile(key)).catch(() => {});
      audio.onended = () => { if (currentVoice === audio) currentVoice = null; };
      return true;
    }).catch(err => {
      if (currentVoice === audio) currentVoice = null;
      if (err?.name === 'NotAllowedError') pendingVoice = { key };
      return false;
    });
  }

  function play(key) {
    if (isMuted() || !key) return;
    pendingVoice = { key };
    tryPlay(key);
  }

  function retryPending() {
    ensureAudio();
    if (!pendingVoice || isMuted()) return;
    const { key } = pendingVoice;
    tryPlay(key);
  }

  document.addEventListener('keydown', retryPending, { capture: true });
  document.addEventListener('pointerdown', retryPending, { capture: true });

  return { ensureAudio, success, wrong, stop, play };
}
