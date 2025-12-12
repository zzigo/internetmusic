// main.js
// IMI FM SYNTH 01
// Vite vanilla · single file audio engine

let audioCtx = null;
let fmSynth = null;

// FM synth definition (carrier + modulator)
class FMSynth {
  constructor(audioCtx) {
    this.audioCtx = audioCtx;

    // Output node
    this.output = audioCtx.createGain();
    this.output.gain.value = 0.0; // start muted

    // Carrier oscillator
    this.carrier = audioCtx.createOscillator();
    this.carrier.type = "sine";
    this.carrier.frequency.value = 220;

    // Modulator oscillator
    this.modulator = audioCtx.createOscillator();
    this.modulator.type = "sine";
    this.modulator.frequency.value = 110;

    // Modulation depth gain: controls Δf = I * f_m
    this.modGain = audioCtx.createGain();
    this.modGain.gain.value = 0; // no modulation at start

    // Connect modulator -> modGain -> carrier.frequency
    this.modulator.connect(this.modGain);
    this.modGain.connect(this.carrier.frequency);

    // Carrier to output
    this.carrier.connect(this.output);

    // Oscillators always running
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

    // Important: keep modulation index consistent
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
    // Δf = I * f_m
    const fm = this.modulator.frequency.value;
    const I = this.modIndex ?? 0;
    const df = I * fm;
    const now = this.audioCtx.currentTime;
    this.modGain.gain.setTargetAtTime(df, now, 0.01);
  }
}

// UI wiring
function initUI() {
  const startButton = document.getElementById("start-audio");

  const carrierSlider = document.getElementById("carrier-slider");
  const modSlider = document.getElementById("mod-slider");
  const indexSlider = document.getElementById("index-slider");
  const gainSlider = document.getElementById("gain-slider");

  const carrierValue = document.getElementById("carrier-value");
  const modValue = document.getElementById("mod-value");
  const indexValue = document.getElementById("index-value");
  const gainValue = document.getElementById("gain-value");

  // Helper to update value labels
  function updateLabels() {
    carrierValue.textContent = Number(carrierSlider.value).toFixed(0);
    modValue.textContent = Number(modSlider.value).toFixed(1);
    indexValue.textContent = Number(indexSlider.value).toFixed(1);
    gainValue.textContent = Number(gainSlider.value).toFixed(2);
  }

  updateLabels();

  startButton.addEventListener("click", async () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      fmSynth = new FMSynth(audioCtx);

      // initial parameters from sliders
      fmSynth.setCarrierFrequency(Number(carrierSlider.value));
      fmSynth.setModFrequency(Number(modSlider.value));
      fmSynth.setModIndex(Number(indexSlider.value));
      fmSynth.setOutputGain(Number(gainSlider.value));

      // connect to speakers
      fmSynth.connect(audioCtx.destination);

      startButton.textContent = "audio armed";
      startButton.disabled = true;
    } else if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
  });

  carrierSlider.addEventListener("input", () => {
    updateLabels();
    if (fmSynth) {
      fmSynth.setCarrierFrequency(Number(carrierSlider.value));
    }
  });

  modSlider.addEventListener("input", () => {
    updateLabels();
    if (fmSynth) {
      fmSynth.setModFrequency(Number(modSlider.value));
    }
  });

  indexSlider.addEventListener("input", () => {
    updateLabels();
    if (fmSynth) {
      fmSynth.setModIndex(Number(indexSlider.value));
    }
  });

  gainSlider.addEventListener("input", () => {
    updateLabels();
    if (fmSynth) {
      fmSynth.setOutputGain(Number(gainSlider.value));
    }
  });
}

// Initialize when DOM is ready
window.addEventListener("DOMContentLoaded", initUI);