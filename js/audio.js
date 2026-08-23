/* Tiny WebAudio bleep machine. No files, no downloads, no mercy. */
(function () {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type, gain) {
    const c = ensure();
    if (!c || muted) return;
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const amp = c.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, t0);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain || 0.18, t0 + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function slide(f1, f2, dur, type, gain) {
    const c = ensure();
    if (!c || muted) return;
    const t0 = c.currentTime;
    const osc = c.createOscillator();
    const amp = c.createGain();
    osc.type = type || 'sawtooth';
    osc.frequency.setValueAtTime(f1, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, f2), t0 + dur);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain || 0.16, t0 + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  const SFX = {
    unlock() { ensure(); },
    setMuted(v) { muted = !!v; },
    isMuted() { return muted; },

    good(combo) {
      const step = Math.min(combo || 1, 12);
      const base = 440 * Math.pow(2, (step - 1) / 12);
      tone(base, 0, 0.09, 'square', 0.15);
      tone(base * 1.5, 0.06, 0.11, 'square', 0.13);
    },
    bad() {
      slide(220, 70, 0.32, 'sawtooth', 0.2);
      tone(110, 0.02, 0.22, 'square', 0.12);
    },
    golden() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.055, 0.16, 'triangle', 0.16));
    },
    wave() {
      [392, 523.25, 659.25].forEach((f, i) => tone(f, i * 0.08, 0.2, 'triangle', 0.15));
    },
    tick() { tone(1200, 0, 0.03, 'square', 0.06); },
    over() {
      [523.25, 466.16, 392, 311.13, 261.63].forEach((f, i) => tone(f, i * 0.14, 0.28, 'sawtooth', 0.15));
    },
    ui() { tone(660, 0, 0.05, 'square', 0.1); }
  };

  window.SB_SFX = SFX;
})();
