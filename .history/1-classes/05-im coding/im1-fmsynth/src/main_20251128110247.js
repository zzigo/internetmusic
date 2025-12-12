// main.js
// IMI FM Synth Cross HUD
// Pointer position controls FM params via two overlaid crosses

let audioCtx = null;
let fmSynth = null;
let engineOn = false;

let lastNormX = 0.5;
let lastNormY = 0.5;

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
// Mapping helpers
// -----------------------------
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// pointer -> FM parameters
function applyParamsFromPointer() {
  if (!fmSynth) return;

  const x = lastNormX;
  const y = lastNormY;

  const carrierFreq = lerp(40, 2000, x);  // X for carrier
  const modFreq = lerp(20, 1000, y);      // Y for modulator

  const modIndex = lerp(0, 15, x);        // X for modulation index
  const gain = lerp(0, 0.9, y);           // Y for output gain

  fmSynth.setCarrierFrequency(carrierFreq);
  fmSynth.setModFrequency(modFreq);
  fmSynth.setModIndex(modIndex);

  if (engineOn) {
    fmSynth.setOutputGain(gain);
  } else {
    fmSynth.setOutputGain(0);
  }
}

// -----------------------------
// Cross line positioning
// -----------------------------
function updateCrossLines() {
  if (!lineCarrierX || !lineModY || !lineIndexX || !lineGainY) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  const x = lastNormX * w;
  const y = lastNormY * h;

  // main cross: carrier / mod
  lineCarrierX.style.left = `${x}px`;
  lineModY.style.top = `${y}px`;

  // secondary cross: slightly offset to see both
  const offset = 3;

  lineIndexX.style.left = `${x + offset}px`;
  lineGainY.style.top = `${y + offset}px`;
}

// -----------------------------
// Audio engine toggle
// -----------------------------
async function toggleAudioEngine() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    fmSynth = new FMSynth(audioCtx);
    fmSynth.connect(audioCtx.destination);
    engineOn = true;
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
// Pointer handling
// -----------------------------
function handlePointerMove(ev) {
  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;

  lastNormX = Math.min(Math.max(ev.clientX / w, 0), 1);
  lastNormY = Math.min(Math.max(ev.clientY / h, 0), 1);

  updateCrossLines();
  applyParamsFromPointer();
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

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("resize", () => {
    updateCrossLines();
  });

  // tap / click anywhere toggles audio
  window.addEventListener("click", () => {
    toggleAudioEngine().catch(err => {
      console.error("Error toggling audio engine:", err);
    });
  });
}

window.addEventListener("DOMContentLoaded", init);