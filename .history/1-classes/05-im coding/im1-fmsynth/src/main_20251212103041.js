// variable initializations
let audioCtx = null;
let engineOn = false;
let fmSynth = null;
let lineX = null; 
let lineY = null;
let hudLed = null;
let hudX = null;
let hudY = null;

let releaseTime = 500; // ms for audio fade out

// normalized pointer coords (0..1 across the window)
let normX = 0.5;
let normY = 0.5;

// FM Synth definition class
// Facade Pattern: Simplifies the complex Web Audio API into a simple interface.
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

  turnOn() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.output.gain.cancelScheduledValues(now);
    this.output.gain.linearRampToValueAtTime(0.2, now + 0.05);
  }

  turnOff(release) {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.output.gain.cancelScheduledValues(now);
    this.output.gain.setTargetAtTime(0, now, release / 1000 / 4); // Exponential release
  }

  setCarrierFrequency(value) {
    const now = this.audioCtx.currentTime;
    this.carrier.frequency.setTargetAtTime(value, now, 0.02);
  }

  setModFrequency(value) {
    const now = this.audioCtx.currentTime;
    this.modulator.frequency.setTargetAtTime(value, now, 0.02);
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
    this.modGain.gain.setTargetAtTime(df, now, 0.02);
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

function startEngine() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    fmSynth = new FMSynth(audioCtx);
    fmSynth.connect(audioCtx.destination);
    fmSynth.setModIndex(3);
    console.log("FM engine initialized");
  } else if (audioCtx.state === "suspended") {
    audioCtx.resume().then(() => {
        console.log("AudioContext resumed");
    });
  }

  fmSynth.turnOn();
  engineOn = true;
  updateFMFromPointer();
  updateHud();
  console.log("FM engine started");
}

function stopEngine() {
  if (engineOn) {
    fmSynth.turnOff(releaseTime);
    engineOn = false;
    updateHud();
    console.log("FM engine stopped");
  }
}

// turn on the FM engine once, on first click
// Singleton Pattern: Ensures only one instance of AudioContext and FMSynth is created.
function toggleAudioEngine() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    fmSynth = new FMSynth(audioCtx);
    fmSynth.connect(audioCtx.destination);
    fmSynth.setModIndex(3);

    fmSynth.turnOn();
    engineOn = true;
    updateFMFromPointer();
    updateHud();
    console.log("FM engine started");
  } else if (audioCtx.state === "suspended") {
    audioCtx.resume();
    fmSynth.turnOn();
    engineOn = true;
    updateHud();
    console.log("AudioContext resumed");
  } else if (engineOn) {
    fmSynth.turnOff(releaseTime);
    engineOn = false;
    updateHud();
    console.log("FM engine stopped");
  } else {
    fmSynth.turnOn();
    engineOn = true;
    updateHud();
    console.log("FM engine re-started");
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

  if (lineX) {
    lineX.style.transform = `translateX(${x}px)`;
  }
  if (lineY) {
    lineY.style.transform = `translateY(${y}px)`;
  }

  updateFMFromPointer();
  updateHud();
}

function updateHud() {
  if (!hudLed) return;

  hudLed.style.backgroundColor = engineOn ? "lime" : "#333";

  const carrierFreq = lerp(40, 2000, normX);
  const modFreq = lerp(20, 1000, normY);

  hudX.textContent = `x: ${normX.toFixed(2)} carrier: ${carrierFreq.toFixed(1)} Hz`;
  hudY.textContent = `y: ${normY.toFixed(2)} mod: ${modFreq.toFixed(1)} Hz`;
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

  // create HUD
  const hudContainer = document.createElement("div");
  hudContainer.className = "hud";
  
  hudLed = document.createElement("div");
  hudLed.className = "hud-led";

  hudX = document.createElement("div");
  hudY = document.createElement("div");

  hudContainer.appendChild(hudLed);
  hudContainer.appendChild(hudX);
  hudContainer.appendChild(hudY);
  document.body.appendChild(hudContainer);

  updateHud();

  // Observer Pattern: Listens for user input events to update the application.
  window.addEventListener("pointermove", handlePointerMove, { passive: true });

  // --- Mobile Device Compatibility ---
  // Use 'pointerdown' instead of 'click' to start the audio engine.
  // The 'click' event can be unreliable on mobile browsers, as it may not fire
  // if the user moves their finger even slightly. 'pointerdown' (or 'touchstart')
  // is a more direct and reliable user gesture for initializing the Web Audio API.
  /*
  window.addEventListener("pointerdown", () => {
    toggleAudioEngine();
  });
  */

  // New "hold" mode using pointer events for mouse and touch
  window.addEventListener("pointerdown", (e) => {
    handlePointerMove(e); // Update position on press
    startEngine();
  });
  window.addEventListener("pointerup", stopEngine);
  window.addEventListener("pointerleave", stopEngine); // Stop when mouse leaves the window
}

window.addEventListener("DOMContentLoaded", init);