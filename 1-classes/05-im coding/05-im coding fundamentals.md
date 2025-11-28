# IMI 1
## 1. Conceptual frame for Project 1: FM synth as IMI


We start with a single-page “Internet Music Instrument”:
- Technology: Vite + vanilla JS + WebAudio.
- Interface: fullscreen, dark background, neon-ish UI, minimal text.
- Sound engine: 1 carrier oscillator, 1 modulator oscillator, classic FM:
	- Carrier frequency: $f_c$
	- Modulator frequency: $f_m$
	- Modulation index: $I$
	- Output:
	$$
        y(t) = A \sin \big( 2\pi f_c t + I \sin (2\pi f_m t ) \big)
        $$
- Mapping: sliders for $f_c$, $f_m$, $I$ and output gain.
We will keep oscillators running and control only gains and frequencies. This avoids the “oscillators can’t be restarted after stop()” issue and behaves more like a continuous instrument.


## 2. Project skeleton with Vite (vanilla)

Commands:
1. Create project:
    npm create vite@latest internet-music-fm – –template vanilla
    cd internet-music-fm
    npm install
2. Run dev server:
    npm run dev
We will mainly edit:
- index.html
- main.js
- style.css (optional but I include a minimal one)

## 3. index.html: fullscreen IMI layout

### creating a vite project

```bash
npm create vite@latest im1-fmsynth -- --template vanilla

cd im1-fmsynth
npm install
npm run dev

# build for production
npm run build

# (optional) preview for production
```

Put this in index.html (inside the Vite project), replacing the default body. Keep the script tag as Vite expects: type=“module” src=”/main.js”.
```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>IMI FM Synth 01</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="module" src="/main.js"></script>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div id="app">
      <div class="hud">
        <div class="title">IMI FM SYNTH 01</div>
        <div class="subtitle">webAudio · js · from scratch</div>
      </div>
      <div class="controls">
        <button id="start-audio">init / arm audio</button>
        <div class="control-group">
          <label>
            carrier freq
            <span id="carrier-value"></span> Hz
          </label>
          <input
            id="carrier-slider"
            type="range"
            min="40"
            max="2000"
            step="1"
            value="220"
          />
        </div>
        <div class="control-group">
          <label>
            modulator freq
            <span id="mod-value"></span> Hz
          </label>
          <input
            id="mod-slider"
            type="range"
            min="0.1"
            max="1000"
            step="0.1"
            value="110"
          />
        </div>
        <div class="control-group">
          <label>
            modulation index I
            <span id="index-value"></span>
          </label>
          <input
            id="index-slider"
            type="range"
            min="0"
            max="15"
            step="0.1"
            value="5"
          />
        </div>
        <div class="control-group">
          <label>
            output gain
            <span id="gain-value"></span>
          </label>
          <input
            id="gain-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value="0.2"
          />
        </div>
        <div class="status-line">
          click and drag sliders / listen to spectral changes · no visuals yet
        </div>
      </div>
    </div>
  </body>
</html>
```

## 4. style.css: simple neon / wireframe feeling

 Create style.css in the project root (Vite serves it fine).
```
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top, #050810 0, #000000 55%, #020308 100%);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
  color: #d0ffe7;
  overflow: hidden;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
}
/* subtle wireframe grid */
#app::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 255, 200, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 200, 0.12) 1px, transparent 1px);
  background-size: 40px 40px, 40px 40px;
  mix-blend-mode: screen;
  opacity: 0.35;
  pointer-events: none;
}
.hud {
  position: absolute;
  top: 4vh;
  left: 6vw;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.title {
  font-size: 2rem;
  text-shadow: 0 0 8px rgba(0, 255, 200, 0.8);
}
.subtitle {
  font-size: 0.85rem;
  opacity: 0.8;
}
.controls {
  position: relative;
  margin-top: 18vh;
  width: min(480px, 90vw);
  padding: 1.8rem 2rem;
  border-radius: 18px;
  border: 1px solid rgba(0, 255, 200, 0.4);
  backdrop-filter: blur(18px);
  background: rgba(0, 10, 12, 0.72);
  box-shadow: 0 0 28px rgba(0, 255, 200, 0.35);
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}
#start-audio {
  border: 1px solid rgba(0, 255, 200, 0.7);
  background: transparent;
  color: #d0ffe7;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: transform 0.08s ease-out, box-shadow 0.08s ease-out, background 0.08s ease-out;
}
#start-audio:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 18px rgba(0, 255, 200, 0.6);
  background: rgba(0, 255, 200, 0.08);
}
.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.control-group label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.85;
  display: flex;
  justify-content: space-between;
}
.control-group span {
  font-variant-numeric: tabular-nums;
}
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: rgba(120, 255, 220, 0.22);
  outline: none;
}
/* track */
input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 999px;
}
/* thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #7affd9;
  box-shadow: 0 0 14px rgba(0, 255, 200, 0.9);
  cursor: pointer;
  margin-top: -6px;
}
input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #7affd9;
  border: none;
  box-shadow: 0 0 14px rgba(0, 255, 200, 0.9);
  cursor: pointer;
}
.status-line {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}
```

## 5. main.js: FM synth engine in one file


Key design decisions:
- Single AudioContext, created only after a user gesture.
- FMSynth implemented as a small class (creational pattern: simple Factory by new FMSynth(ctx)).
- Oscillators always running; gain shapes the “play/stop”.
- Mapping slider → parameters:
    - carrier frequency: direct.
    - mod frequency: direct.
    - modulation index I: transforms to a frequency deviation via Δf = I·f_m, so we set:
        modGain.gain = I * f_m
    - output gain: directly controls output.gain.
- 
Put this in main.js:
```
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
```
At this point:
- You open the page.
- Click “init / arm audio” to satisfy browser gesture requirements.
- Move sliders and listen to the progressive change in spectra:
    - increase index → more sidebands / brighter, more metallic.
    - play with ratios $f_c : f_m$ (e.g. 1:1, 2:1, 3:2, 5:1, etc.).

## 6. Why Vite vanilla

For this course and today’s goal:
- Vite vanilla is enough and closer to “JS from scratch”.
- It forces students to see the real AudioContext, DOM, events without abstraction.
- Build setup is already modern (ES modules, HMR, production builds) so we can scale later.
We introduce React when:
1. We add a Three.js scene with multiple objects and need component-level state.
2. We want React Three Fiber for more complex 3D instrument UIs.
3. We need more structured UI patterns (e.g. multiple panels, routing, presets, patch browsers).
So I would:
- Stage 1 (FM synth, mic input, basic analysis): Vite vanilla.
- Stage 2–3 (3D nodes, spatial mapping, gesture-based FM emitters): migrate or parallel project in React + Three.js / R3F if needed.
If you want, next step I can extend this same project into:
- A scope / spectrum mini-visualization using Canvas, or
- The skeleton for Project 2: add mic input and an analyzer node, compute RMS/SPL and a very simple pitch estimate, then later plug that into a Three.js point cloud.

## 7. References (FM, WebAudio) in BibTeX
---
Page ranges are approximate, based on Training Data; please check against your own copies.
```
@book{roads1996computermusic,
  author    = {Curtis Roads},
  title     = {The Computer Music Tutorial},
  year      = {1996},
  publisher = {MIT Press},
  address   = {Cambridge, MA},
  pages     = {217--260},
  note      = {Chapter on frequency modulation synthesis}
}
@book{dodge1985computer,
  author    = {Charles Dodge and Thomas A. Jerse},
  title     = {Computer Music: Synthesis, Composition, and Performance},
  year      = {1985},
  publisher = {Schirmer Books},
  address   = {New York},
  pages     = {115--142},
  note      = {Sections on FM synthesis and modulation techniques}
}
@book{smith2010wbia,
  author    = {Julius O. Smith},
  title     = {Physical Audio Signal Processing},
  year      = {2010},
  publisher = {W3K Publishing},
  address   = {Stanford, CA},
  note      = {Online book, see chapter on Modulation Synthesis}
}
@misc{w3cWebAudio,
  author       = {Chris Rogers and others},
  title        = {Web Audio API},
  year         = {2018},
  howpublished = {W3C Recommendation},
  note         = {Core reference for AudioContext, OscillatorNode, GainNode}
}
```
I