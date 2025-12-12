// variable initializations
let audioCtx = null;
let engineOn = false;
let fmSynth = null;
// functions

// FM Synth definition class

class FMSynth {
  constructor(audioCtx) {
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
  
  connect(destination) {
    this.carrierOsc.connect(destination);
  } 


function toggleAudioEngine() {
  if (!audioCtx) {
audioCtx = new (window.AudioContext ||  window.webkitURLwebkitAudioContext)(); //AGNOSTIC BROWSER

fmSynth = new FMSynth(audioCtx);
fmSynth.connect(audioCtx.destination);
engineOn = true;
  }

}

function init() {
console.log("HELLO WORLD");
}

window.addEventListener ("click", () => {console.log("WINDOW CLICKED");});

window.addEventListener ("DOMContentLoaded", init);

