// variable initializations
let audioCtx = null;
let engineOn = false;
let fmSynth = null;
// functions

// FM Synth definition class

class FMSynth {
  constructor(audioCtx) {
    this.audioCtx = audioCtx;

    this.carrierOsc = this.audioCtx.createOscillator();
    this.modulatorOsc = this.audioCtx.createOscillator();
    this.modulationGain = this.audioCtx.createGain();

    // Set default parameters
    this.carrierOsc.frequency.setValueAtTime(440, this.audioCtx.currentTime); // A4
    this.modulatorOsc.frequency.setValueAtTime(220, this.audioCtx.currentTime); // A3
    this.modulationGain.gain.setValueAtTime(100, this.audioCtx.currentTime); // Modulation index

    // Connect nodes
    this.modulatorOsc.connect(this.modulationGain);
    this.modulationGain.connect(this.carrierOsc.frequency);

    this.carrierOsc.start();
    this.modulatorOsc.start();
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

