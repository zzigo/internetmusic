// variable initializations
let audioCtx = null;
let engineOn = false;
let fmSynth = null;
let lineX = null; 
let lineY = null;

// normalized pointer coords (0..1 across the window)
let normX = 0.5;
let normY = 0.5;

// FM Synth definition class
class FMSynth {
  constructor(audioCtx) {
    this.audioCtx = audioCtx;

    this.output = audioCtx.createGain();
    this.output.gain.value = 0.2; // audible default

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

  connect(destination) {
    this.output.connect(destination);
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

  _updateModGain() {
    const fm = this.modulator.frequency.value;
    const I = this.modIndex ?? 0;
    const df = I * fm;
    const now = this.audioCtx.currentTime;
    this.modGain.gain.setTargetAtTime(df, now, 0.01);
  }
}

// helpers
function clamp01(x) {
  return Math.min(Math.max(x, 0), 1);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function updateFMFromPointer() {
  if (!fmSynth) return;

  const carrierFreq = lerp(40, 2000, normX);
  const modFreq = lerp(20, 1000, normY);

  fmSynth.setCarrierFrequency(carrierFreq);
  fmSynth.setModFrequency(modFreq);
}

// turn on the FM engine once, on first click
function toggleAudioEngine() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    fmSynth = new FMSynth(audioCtx);
    fmSynth.connect(audioCtx.destination);
    fmSynth.setModIndex(3);

    engineOn = true;
    updateFMFromPointer();
    console.log("FM engine started");
  } else if (audioCtx.state === "suspended") {
    audioCtx.resume();
    engineOn = true;
    console.log("AudioContext resumed");
  } else {
    console.log("FM engine already running");
  }
}

// pointer / touchpad fullscreen control + logging
function handlePointerMove(ev) {
  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;

  const x = ev.clientX;
  const y = ev.clientY;

  normX = clamp01(x / w);
  normY = clamp01(y / h);

  // *** Console logging X Y and normalized X Y ***
  console.log(
    `X:${x.toFixed(1)}  Y:${y.toFixed(1)}  |  normX:${normX.toFixed(3)}  normY:${normY.toFixed(3)}`
  );

  if (lineX) {
    lineX.style.transform = `translateX(${x}px)`;
  }
  if (lineY) {
    lineY.style.transform = `translateY(${y}px)`;
  }

  updateFMFromPointer();
}

function init() {
  console.log("HELLO WORLD");

  //create crosslines

  lineX = document.createElement("div");
  lineX.className = "line-x";
  document.body.appendChild(lineX);

  lineY = document.createElement("div");
  lineY.className = "line-y";
  document.body.appendChild(lineY);

  window.addEventListener("pointermove", handlePointerMove, { passive: true });

  window.addEventListener("click", () => {
    console.log("WINDOW CLICKED");
    toggleAudioEngine();
  });
}

window.addEventListener("DOMContentLoaded", init);