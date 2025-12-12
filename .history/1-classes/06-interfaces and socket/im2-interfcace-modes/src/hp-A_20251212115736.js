// hp-A.js

window.loadHpA = function() {
    console.log('Instrument A loaded');
  
    // variable initializations
    let audioCtx = null;
    let engineOn = false;
    let fmSynth = null;
    let lineX = null; 
    let lineY = null;
    let hud = null;
  
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
      updateHudUI();
      console.log("FM engine started");
    }
  
    function stopEngine() {
      if (engineOn) {
        fmSynth.turnOff(releaseTime);
        engineOn = false;
        updateHudUI();
        console.log("FM engine stopped");
      }
    }
  
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
      updateHudUI();
    }
  
    function updateHudUI() {
        if (!hud) return;
    
        hud.hudLed.style.backgroundColor = engineOn ? "lime" : "#333";
    
        const carrierFreq = lerp(40, 2000, normX);
        const modFreq = lerp(20, 1000, normY);
    
        hud.hudX.textContent = `x: ${normX.toFixed(2)} carrier: ${carrierFreq.toFixed(1)} Hz`;
        hud.hudY.textContent = `y: ${normY.toFixed(2)} mod: ${modFreq.toFixed(1)} Hz`;
      }
  
    function init() {
      console.log("HELLO WORLD from Instrument A");
  
      // Create vertical crosshair line (follows X axis)
      lineX = document.createElement("div");
      lineX.className = "line-x";
      lineX.style.position = "absolute";
      lineX.style.top = "0";
      lineX.style.width = "1px";
      lineX.style.height = "100vh";
      lineX.style.background = "rgba(0, 255, 120, 0.9)";
      lineX.style.boxShadow = "0 0 8px rgba(0, 255, 120, 0.9)";
      lineX.style.pointerEvents = "none";
      lineX.style.zIndex = "2";
      document.body.appendChild(lineX);
  
      // Create horizontal crosshair line (follows Y axis)
      lineY = document.createElement("div");
      lineY.className = "line-y";
      lineY.style.position = "absolute";
      lineY.style.left = "0";
      lineY.style.height = "1px";
      lineY.style.width = "100vw";
      lineY.style.background = "rgba(255, 80, 80, 0.9)";
      lineY.style.boxShadow = "0 0 8px rgba(255, 80, 80, 0.9)";
      lineY.style.pointerEvents = "none";
      lineY.style.zIndex = "2";
      document.body.appendChild(lineY);
  
      hud = createHUD();
  
      updateHudUI();
  
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
  
      // Simple pointer interaction: down to start, up to stop
      // Avoids conflict with swipe gestures
      const pointerDownHandler = (e) => {
        // Only respond to left-click (button 0)
        if (e.button === 0) {
          handlePointerMove(e);
          startEngine();
        }
      };
  
      const pointerUpHandler = (e) => {
        if (e.button === 0) {
          stopEngine();
        }
      };
  
      window.addEventListener("pointerdown", pointerDownHandler);
      window.addEventListener("pointerup", pointerUpHandler);
  
      return {
        noteOn: (note, velocity) => {
          console.log('noteOn', note, velocity);
          startEngine();
        },
        noteOff: (note) => {
            console.log('noteOff', note);
            stopEngine();
        },
        unload: () => {
          console.log('Instrument A unloaded');
          stopEngine();
          window.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("pointerdown", pointerDownHandler);
          window.removeEventListener("pointerup", pointerUpHandler);
  
          if(lineX) lineX.remove();
          if(lineY) lineY.remove();
          if(hud && hud.hudContainer) hud.hudContainer.remove();
          
          // Close audio context
          if (audioCtx) {
            audioCtx.close();
          }
        }
      };
    }
  
    return init();
  }
