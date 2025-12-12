import "./style.css";

/*
  Technologies:
  - getUserMedia() to access the microphone
  - Web Audio API (AudioContext + AnalyserNode) to estimate level (RMS)
  - WebSocket to send normalized value to a local OSC bridge

  Pattern design (didactic mapping):
  - Facade: AudioMeter hides WebAudio graph details and exposes a simple readLevel()
  - Strategy: LevelMapping provides interchangeable scaling (dB clamp, normalization)
  - Mediator: OSCMediator centralizes “when/how” we transmit values (throttle + reconnect)
*/

const armBtn = document.querySelector("#armBtn");
const vuFill = document.querySelector("#vuFill");
const hudLine1 = document.querySelector("#hudLine1");
const hudLine2 = document.querySelector("#hudLine2");

// -------------------- Strategy: mapping and normalization --------------------
const LevelMapping = {
  // dBFS reference: 0 dBFS is “full scale” (rms=1). We clamp at minDb to avoid -Infinity.
  minDb: -60,
  maxDb: 0,

  rmsToDb(rms) {
    if (rms <= 0) return -Infinity;
    return 20 * Math.log10(rms);
  },

  clampDb(db) {
    if (!Number.isFinite(db)) return this.minDb;
    return Math.min(this.maxDb, Math.max(this.minDb, db));
  },

  // Map clamped dB to 0..1
  dbTo01(dbClamped) {
    return (dbClamped - this.minDb) / (this.maxDb - this.minDb);
  }
};

// -------------------- Facade: audio metering --------------------
class AudioMeter {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.timeData = null;
    this.stream = null;
  }

  async init() {
    // Browser policies require a user gesture; we call init from the button click.
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const src = this.audioCtx.createMediaStreamSource(this.stream);

    // AnalyserNode gives time-domain samples; we compute RMS ourselves.
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;

    src.connect(this.analyser);

    this.timeData = new Float32Array(this.analyser.fftSize);
  }

  readRms() {
    if (!this.analyser) return 0;

    this.analyser.getFloatTimeDomainData(this.timeData);

    // RMS = sqrt(mean(x^2))
    let sumSq = 0;
    for (let i = 0; i < this.timeData.length; i++) {
      const x = this.timeData[i];
      sumSq += x * x;
    }
    const meanSq = sumSq / this.timeData.length;
    return Math.sqrt(meanSq);
  }
}

// -------------------- Mediator: websocket to OSC bridge --------------------
class OSCMediator {
  constructor(url) {
    this.url = url;
    this.ws = null;

    // Throttle: don’t spam OSC. 30Hz is a good default for control-rate.
    this.minIntervalMs = 1000 / 30;
    this.lastSentAt = 0;

    this.status = "disconnected";
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.status = "connected";
      };

      this.ws.onclose = () => {
        this.status = "disconnected";
        // simple auto-reconnect
        setTimeout(() => this.connect(), 500);
      };

      this.ws.onerror = () => {
        this.status = "error";
      };
    } catch {
      this.status = "error";
    }
  }

  sendLevel(payload) {
    const now = performance.now();
    if (now - this.lastSentAt < this.minIntervalMs) return;
    this.lastSentAt = now;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    // Bridge expects JSON.
    this.ws.send(JSON.stringify(payload));
  }
}

// -------------------- App wiring --------------------
const meter = new AudioMeter();
const osc = new OSCMediator("ws://localhost:57121");
osc.connect();

let running = false;

armBtn.addEventListener("click", async () => {
  if (running) return;

  try {
    await meter.init();
    running = true;
    armBtn.textContent = "MIC ARMED";
    loop();
  } catch (err) {
    armBtn.textContent = "MIC DENIED";
    console.error(err);
  }
});

function loop() {
  if (!running) return;

  const rms = meter.readRms();                       // 0..1 (linear)
  const db = LevelMapping.rmsToDb(rms);              // -inf..0
  const dbClamped = LevelMapping.clampDb(db);        // minDb..0
  const db01 = LevelMapping.dbTo01(dbClamped);       // 0..1

  // Choose what we send to TD:
  // - v01: normalized 0..1 (derived from dB clamp)
  // - db: clamped dB for debugging/alternative mapping
  const payload = {
    address: "/mic/level",
    v01: db01,
    db: dbClamped
  };

  // Update VU meter: height is percentage of viewport
  vuFill.style.height = `${(db01 * 100).toFixed(1)}%`;

  // HUD: show both normalized representations
  hudLine1.textContent =
    `rms(linear): ${rms.toFixed(4)} | dBFS(clamped): ${dbClamped.toFixed(2)} dB | dB→01: ${db01.toFixed(4)}`;

  hudLine2.textContent =
    `ws: ${osc.status} | send: ${payload.address} ${payload.v01.toFixed(4)} (float)`;

  // Send to OSC bridge
  osc.sendLevel(payload);

  requestAnimationFrame(loop);
}