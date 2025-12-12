// variable initializations
let audioCtx = null;
let engineOn = false;
let fmSynth = null;
// functions

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

