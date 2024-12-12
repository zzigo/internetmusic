// problem:
// add controls to change the frequencies of the carrier and modulator

// bonus problem
// think about how you can adapt this code so that when a node is played instead of the default frequencies
// the current values of your controls (sliders) are used
// e.g.: If your modulation frequency slider is on 200 and you click "play" it should use 200 as an input to the playFmNote function

// bonus problem 2
// if you don't want to do the above things, do anything you want or find interesting, this is for you to have fun after all

// create AudioContext and start it by clicking in the window
const ctx = new AudioContext();
document.addEventListener("click", () => ctx.resume());

// grab the play button from the html
const toggle = document.querySelector("#toggle-button");
const depthSlider = document.querySelector("#depth-slider");

// a placeholder for the references to our playing nodes
let nodeRefs;

// we use this variable to keep track of whether our sound is playing or not
// initially it will be false
let playingState = false;

// add an event listener to the play button
toggle.addEventListener("click", () => {
  // if playing state is false, we are not playing, we start playback and assign nodeRefs
  if (playingState === false) {
    nodeRefs = playFmNote(440, 20, 0);

    // bonus, let's update the text of the button to reflect our playing state
    toggle.innerHTML = "■";
  }

  // if playingState is true that means we are currently playing and want to stop the note
  if (playingState === true) {
    stopFmNote(nodeRefs.carrier, nodeRefs.modulator);

    // update the text of our button to reflect our playing state
    toggle.innerHTML = "▶";
  }

  // the "!" here is a logical NOT operator, it inverts a boolean value
  // if playingState is true, !playingState will evaluate to false and vice-versa
  playingState = !playingState;
});

// add event listener for the depth slider
depthSlider.addEventListener("input", (e) => {
  // if playingState is true, then nodeRefs.modDepth will be defined, so we can set it
  if (playingState === true) {
    nodeRefs.modDepth.gain.linearRampToValueAtTime(
      e.target.value,
      ctx.currentTime + 0.01
    );
  }
});

// function that takes 3 arguments: carrierFrequency, modulatorFrequency and modulationDepth
// and starts playing a fm note with those parameters
const playFmNote = (carrierFrequency, modulatorFrequency, modulationDepth) => {
  // create carier oscillator and set frequency
  const carrier = ctx.createOscillator();
  carrier.frequency.setValueAtTime(carrierFrequency, ctx.currentTime);
  carrier.start(ctx.currentTime);
  // create modulator and set frequency
  const modulator = ctx.createOscillator();
  modulator.frequency.setValueAtTime(modulatorFrequency, ctx.currentTime);
  modulator.start(ctx.currentTime);

  // create gain for modulation depth and set value
  const modDepthGain = ctx.createGain();
  modDepthGain.gain.setValueAtTime(modulationDepth, ctx.currentTime);
  // connect modulator to the gain
  modulator.connect(modDepthGain);

  // connect gain to carrier.detune
  modDepthGain.connect(carrier.detune);

  // connect carrier to the output
  carrier.connect(ctx.destination);

  // we return an object with references to our playing nodes so that we can adjust their parameters and stop them later
  return {
    carrier: carrier,
    modulator: modulator,
    modDepth: modDepthGain,
  };
};

// create stop function that takes references to the playing notes
const stopFmNote = (...playingNotes) => {
  playingNotes.forEach((n) => n.stop());
};
// hint: ...playingNotes here let's us collect this functions argument as an array
// so that we can apply .forEach
// we could also have written it like this:
// const stopFmNote = (carrierRef, modulatorRef) => {}
// and then stop them individually, but if we do it like this we are more flexible
// we can give any number of parameters to this function and they will all be collected into the playingNotes array
