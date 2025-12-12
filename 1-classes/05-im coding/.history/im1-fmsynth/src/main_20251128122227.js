// variable initializations
let audioCtx = null;
let engineOn = false;
let fmSynth = null;

// FM Synth definition class
class FMSynth {
  constructor(audioCtx) {
    this.audioCtx = audioCtx;

    this.output = audioCtx.createGain();
    // set a small initial gain so we actually hear something
    this.output.gain.value = 0.2;

    this.carrier = audioCtx.createOscillator();
    this.carrier.type = "sine";
    this.carrier.frequency.value = 220; // Hz

    this.modulator = audioCtx.createOscillator();
    this.modulator.type = "sine";
    this.modulator.frequency.value = 110; // Hz

    this.modGain = audioCtx.createGain();
    this.modGain.gain.value = 0; // start with no modulation

    // FM routing: modulator → modGain → carrier.frequency
    this.modulator.connect(this.modGain);
    this.modGain.connect(this.carrier.frequency);

    // carrier → output
    this.carrier.connect(this.output);

    this.modIndex = 0;

    this.carrier.start();
    this.modulator.start();
  }

  connect(destination) {
    // connect whole synth output, not just the carrier
    this.output.connect(destination);
  }

  // optional helpers if you later want to control parameters
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
    const df = I * fm; // frequency deviation
    const now = this.audioCtx.currentTime;
    this.modGain.gain.setTargetAtTime(df, now, 0.01);
  }
}

// turn on the FM engine once, on first click
function toggleAudioEngine() {
  if (!audioCtx) {
    // cross-browser AudioContext
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    fmSynth = new FMSynth(audioCtx);
    fmSynth.connect(audioCtx.destination);
    engineOn = true;
    console.log("FM engine started");
  } else if (audioCtx.state === "suspended") {
    // in case browser auto-suspends
    audioCtx.resume();
    engineOn = true;
    console.log("AudioContext resumed");
  } else {
    // already running; do nothing (no off toggle)
    console.log("FM engine already running");
  }
}

// map from normX/nomrY to FM parameters

function updateFMFromPointer() {
  if (!fmSynth) return;

  // map normX [0,1] to carrier frequency [100, 1000] Hz
  const carrierFreq = 100 + normX * (1000 - 100);
  fmSynth.setCarrierFrequency(carrierFreq);

  // map normY [0,1] to mod index [0, 20]
  const modIndex = normY * 20;
  fmSynth.setModIndex(modIndex);
}

let normX = 0.5;
let normY = 0.5;
// pointer

function handlePointerMove(ev) {
  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;

  normX = ev.clientX / w;
  normY = ev.clientY / h;

  updateFMFromPointer();

}


//// Initialization and event listeners
function init() {
  console.log("HELLO WORLD");
}

// click anywhere in the window → start FM engine
window.addEventListener("click", () => {
  console.log("WINDOW CLICKED");
  toggleAudioEngine();
});

window.addEventListener("DOMContentLoaded", init);

