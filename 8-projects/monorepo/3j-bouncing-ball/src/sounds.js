import * as Tone from 'tone';

// Utility: Map a value range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Create the FM Synth for the low drone
export const droneSynth = new Tone.FMSynth({
  harmonicity: 0.5, // Ratio between carrier and modulator frequencies
  modulationIndex: 10, // Strength of modulation
  oscillator: { type: 'sine' },
  modulation: { type: 'sine' },
  envelope: {
    attack: 2, // Slow fade-in
    decay: 1,
    sustain: 0.8,
    release: 5, // Long release
  },
  modulationEnvelope: {
    attack: 1,
    decay: 1,
    sustain: 0.5,
    release: 5,
  },
}).toDestination();

// Add reverb for spatial depth
const droneReverb = new Tone.Reverb({
  decay: 10, // Long reverb tail
  wet: 0.3, // Mix
}).toDestination();
droneSynth.connect(droneReverb);

// Create other sounds if needed (e.g., collisionSynth, whooshingSynth)
export const collisionSynth = new Tone.MembraneSynth({
  volume: -10,
  pitchDecay: 0.05,
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0.5,
    release: 0.01,
  }
});

// Export an audio context
export const audioContext = Tone.getContext().rawContext;



export const whooshingSynth = new Tone.NoiseSynth({
  volume: -20,
  envelope: { attack: 0.05, decay: 0.2, sustain: 0.1, release: 0.3 },
}).toDestination();

// Function to update the drone's parameters based on sunset progress
export function updateDrone(sunsetProgress) {
  // Map sunset progress to frequency range (e.g., 40 Hz to 120 Hz)
  const frequency = mapRange(sunsetProgress, 0, 1, 40, 120);
  droneSynth.set({
    frequency,
    modulationIndex: mapRange(sunsetProgress, 0, 1, 5, 20), // Modulation depth
  });
}

// Create Reverb Effect
const reverb = new Tone.Reverb(2).toDestination(); // 5-second reverb tail
whooshingSynth.connect(reverb);
collisionSynth.connect(reverb);


// Initialize all sounds and start the drone
export async function initializeSounds() {
  await Tone.start();
  console.log('Audio Context Started');
  droneSynth.triggerAttack('C2'); // Start the low drone on note C2
}