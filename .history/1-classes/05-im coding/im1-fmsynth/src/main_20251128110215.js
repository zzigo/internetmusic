// IMI FM Synth Cross HUD
// Pointer (or primary touch) controls carrier/mod cross.
// SHIFT key or second finger controls index/gain cross.

let audioCtx = null;
let fmSynth = null;
let engineOn = false;

// primary cross (carrier / mod)
let primaryX = 0.5;
let primaryY = 0.5;

// secondary cross (index / gain)
let secondaryX = 0.5;
let secondaryY = 0.5;
let secondaryActive = false;

let shiftActive = false;
let isTouchMode = false;

// DOM elements
let lineCarrierX, lineModY, lineIndexX, lineGainY, audioLed;

// -----------------------------
// FM synth definition
// -----------------------------
class FMSynth {
  constructor(audioCtx) {
    this.audioCtx = audioCtx;

    this.output = audioCtx.createGain();
    this.output.gain.value = 0.0;

    this.carrier = audioCtx.createOscillator();
    this.carrier.type = "sine";
    this.carrier.frequency.value = 220;

    this.modulator = audioCtx.createOscillator();
    this.modulator.type = "sine";
    this.modulator.frequency.value = 110;

    this.modGain = audioCtx.createGain();
    this.modGain.gain.value = 0;

    this.modulator.connect(this.modGain);
    this.modGain.connect(this.carrier.frequency);

    this.carrier.connect(this.output);

    this.modIndex = 0;

    this.carrier.start();
    this.modulator.start();
  }

  connect(dest) {
    this.output.connect(dest);
  }

  setCarrierFrequency(value) {
    const now = this.audioCtx.currentTime;
    this.carrier.frequency.setTargetAtTime(value, now, 0.01);
  }

  setModFrequency(value) {
    const now = this.audioCtx.currentTime;
    this.modulator.frequency.setTargetAtTime(value, now, 0.01);
    this._updateModGain();
  }

  setModIndex(I) {
    this.modIndex = I;
    this._updateModGain();
  }

  setOutputGain(value) {
    const now = this.audioCtx.currentTime;
    this.output.gain.setTargetAtTime(value, now, 0.01);
  }

  _updateModGain() {
    const fm = this.modulator.frequency.value;
    const I = this.modIndex ?? 0;
    const df = I * fm;
    const now = this.audioCtx.currentTime;
    this.modGain.gain.setTargetAtTime(df, now, 0.01);
  }
}

// -----------------------------
// Helpers
// -----------------------------
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp01(x) {
  return Math.min(Math.max(x, 0), 1);
}

// pointer / touches → FM parameters
function applyParamsFromPointer() {
  if (!fmSynth) return;

  // primary cross: carrier / mod
  const x1 = primaryX;
  const y1 = primaryY;

  const carrierFreq = lerp(40, 2000, x1);
  const modFreq = lerp(20, 1000, y1);

  fmSynth.setCarrierFrequency(carrierFreq);
  fmSynth.setModFrequency(modFreq);

  // secondary cross: index / gain (only when active)
  if (secondaryActive) {
    const x2 = secondaryX;
    const y2 = secondaryY;

    const modIndex = lerp(0, 15, x2);
    const gain = lerp(0, 0.9, y2);

    fmSynth.setModIndex(modIndex);
    if (engineOn) {
      fmSynth.setOutputGain(gain);
    } else {
      fmSynth.setOutputGain(0);
    }
  } else {
    // if engine is off, mute; if on, keep existing index/gain
    if (!engineOn) {
      fmSynth.setOutputGain(0);
    }
  }
}

// -----------------------------
// Cross line positioning
// -----------------------------
function updateCrossLines() {
  if (!lineCarrierX || !lineModY || !lineIndexX || !lineGainY) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  const x1 = primaryX * w;
  const y1 = primaryY * h;

  // main cross
  lineCarrierX.style.left = `${x1}px`;
  lineModY.style.top = `${y1}px`;

  // secondary cross (only visible when active)
  const x2 = secondaryX * w;
  const y2 = secondaryY * h;
  const offset = 3;

  lineIndexX.style.left = `${x2 + offset}px`;
  lineGainY.style.top = `${y2 + offset}px`;

  const opacity = secondaryActive ? 1 : 0;
  lineIndexX.style.opacity = opacity;
  lineGainY.style.opacity = opacity;
}

// -----------------------------
// Audio engine toggle
// -----------------------------
async function toggleAudioEngine() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    fmSynth = new FMSynth(audioCtx);
    fmSynth.connect(audioCtx.destination);

    // default initial state
    engineOn = true;
    fmSynth.setModIndex(5);
    fmSynth.setOutputGain(0.2);
    applyParamsFromPointer();
    updateLed();
    return;
  }

  if (audioCtx.state === "running") {
    await audioCtx.suspend();
    engineOn = false;
    applyParamsFromPointer();
    updateLed();
  } else if (audioCtx.state === "suspended") {
    await audioCtx.resume();
    engineOn = true;
    applyParamsFromPointer();
    updateLed();
  }
}

function updateLed() {
  if (!audioLed) return;
  audioLed.classList.remove("on", "off");
  audioLed.classList.add(engineOn ? "on" : "off");
}

// -----------------------------
// Pointer handling (desktop / pointer devices)
// -----------------------------
function handlePointerMove(ev) {
  if (isTouchMode) return; // touch will handle its own mapping

  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;

  primaryX = clamp01(ev.clientX / w);
  primaryY = clamp01(ev.clientY / h);

  // if SHIFT active, use same pointer as secondary
  if (shiftActive || ev.shiftKey) {
    secondaryX = primaryX;
    secondaryY = primaryY;
    secondaryActive = true;
  } else {
    secondaryActive = false;
  }

  updateCrossLines();
  applyParamsFromPointer();
}

// -----------------------------
// Touch handling (phones / tablets)
// -----------------------------
function handleTouchMove(ev) {
  isTouchMode = true;

  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;

  const t1 = ev.touches[0];
  primaryX = clamp01(t1.clientX / w);
  primaryY = clamp01(t1.clientY / h);

  if (ev.touches.length > 1) {
    const t2 = ev.touches[1];
    secondaryX = clamp01(t2.clientX / w);
    secondaryY = clamp01(t2.clientY / h);
    secondaryActive = true;
  } else {
    secondaryActive = false;
  }

  updateCrossLines();
  applyParamsFromPointer();

  ev.preventDefault();
}

function handleTouchEnd(ev) {
  if (ev.touches.length === 0) {
    secondaryActive = false;
    updateCrossLines();
    applyParamsFromPointer();
  }
}

// -----------------------------
// Keyboard (SHIFT tracking)
// -----------------------------
function handleKeyDown(ev) {
  if (ev.key === "Shift") {
    shiftActive = true;
  }
}

function handleKeyUp(ev) {
  if (ev.key === "Shift") {
    shiftActive = false;
    secondaryActive = false;
    updateCrossLines();
    applyParamsFromPointer();
  }
}

// -----------------------------
// Init
// -----------------------------
function init() {
  lineCarrierX = document.getElementById("line-carrier-x");
  lineModY = document.getElementById("line-mod-y");
  lineIndexX = document.getElementById("line-index-x");
  lineGainY = document.getElementById("line-gain-y");
  audioLed = document.getElementById("audio-led");

  updateCrossLines();
  updateLed();

  // pointer / mouse
  window.addEventListener("pointermove", handlePointerMove, { passive: true });

  // touch
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEnd, { passive: false });
  window.addEventListener("touchcancel", handleTouchEnd, { passive: false });

  // keyboard
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // tap / click anywhere toggles audio
  window.addEventListener("click", () => {
    toggleAudioEngine().catch(err => {
      console.error("Error toggling audio engine:", err);
    });
  });

  window.addEventListener("resize", () => {
    updateCrossLines();
  });
}

window.addEventListener("DOMContentLoaded", init);