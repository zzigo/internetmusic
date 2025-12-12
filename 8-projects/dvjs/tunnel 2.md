```dataviewjs
// DataviewJS — 3D-Arcade (letters only)
// Patch: (1) restore & enhance collision sound as a spatial "woosh"
//        (2) render the score INSIDE the canvas using a Three.js camera-attached sprite
//        (3) MUSIC: Bass NPC generative loop + FM chop w/ ratchets + 8-bit vibe (Giana Sisters-ish)
// Keeps: unified green grid, wireframe look, player yellow + emissive/halo, violet opponents,
// strong bloom, 5 spotlights, FM synth (spatial) + reverb, LED WebRTC recorder, Start/Stop teardown.

(async () => {
  // ---------- UI ----------
  const root = dv.container;
  const css = document.createElement('style');
  css.textContent = `
  .arcade-root{display:grid;gap:10px;place-items:center;font-family:ui-sans-serif,system-ui}
  .arcade-row{display:flex;gap:12px;align-items:center;justify-content:center}
  .arcade-btn{font-size:12px;line-height:1;padding:8px 10px;border-radius:8px;background:#1c2533;color:#cfd6e6;border:none;cursor:pointer}
  .arcade-btn:hover{background:#233144}
  .arcade-led{width:10px;height:10px;border-radius:50%;background:#2a0000;box-shadow:inset 0 0 6px #000;cursor:pointer}
  .arcade-led.on{background:#ff1a1a;box-shadow:0 0 6px #ff3a3a,inset 0 0 4px #3a0000}
  .arcade-hint{font-size:11px;color:#9aa7bd;text-align:center;max-width:720px}
  .arcade-wrap{position:relative;display:grid;place-items:center;width:100%}
  .arcade-canvas{display:block}
  .arcade-err{font-size:12px;color:#ffb4b4;background:#2b1212;padding:8px 10px;border-radius:8px}
  `;
  document.head.appendChild(css);

  const ui = document.createElement('div'); ui.className='arcade-root'; root.appendChild(ui);
  const row = document.createElement('div'); row.className='arcade-row'; ui.appendChild(row);
  const startBtn = document.createElement('button'); startBtn.className='arcade-btn'; startBtn.textContent='Start'; row.appendChild(startBtn);
  const led = document.createElement('div'); led.className='arcade-led'; row.appendChild(led);
  const hint = document.createElement('div'); hint.className='arcade-hint';
  hint.textContent = 'Controls: A/D (left/right), W/S (up/down), Q (dash). Click LED to record/stop.';
  ui.appendChild(hint);
  const wrap = document.createElement('div'); wrap.className='arcade-wrap'; ui.appendChild(wrap);

  let app = null, cleanupObserver = null;
  const showError = (msg)=>{ const e=document.createElement('div'); e.className='arcade-err'; e.textContent=msg; ui.appendChild(e); return e; };

  // ---------- Loader via esm.sh ----------
  async function loadThreeWithPost(){
    if (window.THREE && window.__THREE_POST) return {THREE:window.THREE, POST:window.__THREE_POST};
    const readyEvt = 'three-esm-ready-'+Math.random().toString(36).slice(2);
    const s = document.createElement('script');
    s.type='module';
    s.textContent = `
      import * as THREE from 'https://esm.sh/three@0.161.0';
      import { EffectComposer } from 'https://esm.sh/three@0.161.0/examples/jsm/postprocessing/EffectComposer.js';
      import { RenderPass } from 'https://esm.sh/three@0.161.0/examples/jsm/postprocessing/RenderPass.js';
      import { UnrealBloomPass } from 'https://esm.sh/three@0.161.0/examples/jsm/postprocessing/UnrealBloomPass.js';
      window.THREE = THREE;
      window.__THREE_POST = { EffectComposer, RenderPass, UnrealBloomPass };
      window.dispatchEvent(new Event('${readyEvt}'));
    `;
    const p = new Promise((resolve,reject)=>{
      const onReady = ()=>{ window.removeEventListener(readyEvt,onReady); resolve({THREE:window.THREE, POST:window.__THREE_POST}); };
      window.addEventListener(readyEvt, onReady, {once:true});
      s.onerror = (e)=>{ window.removeEventListener(readyEvt,onReady); reject(e); };
    });
    document.head.appendChild(s);
    return await p;
  }

  // ---------- Teardown ----------
  function disposeApp(){
    if(!app) return;
    try { if (app.recorder && app.recording) { app.recorder.stop(); app.recording=false; } } catch(_){}
    try { app.stream && app.stream.getTracks().forEach(t=>t.stop()); } catch(_){}
    try { window.removeEventListener('keydown', app.keydown, {passive:false}); } catch(_){}
    try { window.removeEventListener('keyup', app.keyup, {passive:false}); } catch(_){}
    try { led.onclick = null; } catch(_){}
    try { startBtn.onclick = null; } catch(_){}
    try { app.raf && cancelAnimationFrame(app.raf); } catch(_){}
    try {
      // stop oscillators / schedulers
      app.carrier?.stop?.(); app.mod?.stop?.();
      app.npc?.stop?.();
      app.clock?.stop?.();
    } catch(_){}
    try { app.actx && app.actx.state!=='closed' && app.actx.close(); } catch(_){}
    try {
      if (app.scene) {
        app.scene.traverse(o=>{
          if (o.geometry) o.geometry.dispose?.();
          if (o.material) {
            if (Array.isArray(o.material)) o.material.forEach(m=>{ m.map?.dispose?.(); m.dispose?.(); });
            else { o.material.map?.dispose?.(); o.material.dispose?.(); }
          }
        });
      }
      app.renderer?.dispose?.();
      app.composer = null;
    } catch(_){}
    try { app.canvas?.remove(); app.downloadLink?.remove(); } catch(_){}
    app = null; led.classList.remove('on'); startBtn.textContent='Start';
    try { app.clock?.stop?.(); } catch(_){}
  }
  function attachAutoCleanup(){
    if (cleanupObserver) cleanupObserver.disconnect();
    cleanupObserver = new MutationObserver(()=>{
      if (!root.isConnected) { disposeApp(); cleanupObserver.disconnect(); cleanupObserver=null; }
    });
    cleanupObserver.observe(document.body, {childList:true, subtree:true});
  }

  // ---------- Start ----------
  async function startApp(){
    if (app) return;

    let THREEref, POST;
    try { ({THREE:THREEref, POST} = await loadThreeWithPost()); }
    catch(err){ showError('Could not load Three.js via esm.sh.'); console.error(err); return; }

    // Canvas
    const CAP_W = 1080, CAP_H = 1350, VIEW_SCALE = 0.6;
    const canvas = document.createElement('canvas'); canvas.className='arcade-canvas';
    canvas.width = CAP_W; canvas.height = CAP_H;
    canvas.style.width = Math.round(CAP_W*VIEW_SCALE)+'px';
    canvas.style.height = Math.round(CAP_H*VIEW_SCALE)+'px';
    wrap.appendChild(canvas);

    // ---------- WebAudio ----------
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const actx = new AudioContext();

    const listener = actx.listener;
    function setListenerFromCamera(cam){
      const forward = new THREEref.Vector3(); cam.getWorldDirection(forward);
      const up = new THREEref.Vector3(0,1,0).applyQuaternion(cam.quaternion);
      listener.positionX?.setValueAtTime(cam.position.x, actx.currentTime);
      listener.positionY?.setValueAtTime(cam.position.y, actx.currentTime);
      listener.positionZ?.setValueAtTime(cam.position.z, actx.currentTime);
      listener.forwardX?.setValueAtTime(forward.x, actx.currentTime);
      listener.forwardY?.setValueAtTime(forward.y, actx.currentTime);
      listener.forwardZ?.setValueAtTime(forward.z, actx.currentTime);
      listener.upX?.setValueAtTime(up.x, actx.currentTime);
      listener.upY?.setValueAtTime(up.y, actx.currentTime);
      listener.upZ?.setValueAtTime(up.z, actx.currentTime);
    }

    // FM synth (player tone)
    const carrier = actx.createOscillator(); carrier.type = 'sine';
    const mod = actx.createOscillator(); mod.type = 'sine';
    const modGain = actx.createGain(); modGain.gain.value = 0;
    const panner = actx.createPanner();
    Object.assign(panner, { panningModel:'HRTF', distanceModel:'inverse', refDistance:2, maxDistance:2000, rolloffFactor:1.6, coneInnerAngle:180, coneOuterAngle:230, coneOuterGain:0.2 });

    // Reverb bus
    function makeImpulse(seconds=1.8, decay=3.1){
      const length = Math.floor(actx.sampleRate * seconds);
      const buf = actx.createBuffer(2, length, actx.sampleRate);
      for (let ch=0; ch<2; ch++){
        const d = buf.getChannelData(ch);
        for (let i=0;i<length;i++){ const t=i/length; d[i]=(Math.random()*2-1)*Math.pow(1-t,decay); }
      }
      return buf;
    }
    const convolver = actx.createConvolver(); convolver.buffer = makeImpulse();
    const reverbSend = actx.createGain(); reverbSend.gain.value = 0.15;
    const master = actx.createGain(); master.gain.value = 0.38;

    // === MUSIC ADDITIONS: routing tweaks (add FM gate pre-master, keep reverb un-gated) ===
// after: const reverbSend = actx.createGain(); ... const master = actx.createGain();
	const fmGate = actx.createGain(); fmGate.gain.value = 1.0; // amplitude gate for 16ths/tuplets
	
	mod.connect(modGain).connect(carrier.frequency);
	carrier.connect(panner);
	
	// dry (gated)
	panner.connect(fmGate).connect(master);
	
	// wet (not gated)
	panner.connect(reverbSend).connect(convolver).connect(master);
	
	master.connect(actx.destination);

    // --- Collision "WOOSH" (spatial) ---
    function collisionWooshAt(x,y,z){
      const noise = actx.createBufferSource();
      const len = actx.sampleRate * 0.35;
      const buf = actx.createBuffer(1, len, actx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i=0;i<len;i++){ d[i] = Math.random()*2-1; }
      noise.buffer = buf;

      const p = actx.createPanner();
      Object.assign(p, { panningModel:'HRTF', distanceModel:'inverse', refDistance:2, maxDistance:1500, rolloffFactor:1.8 });
      p.positionX.value = x; p.positionY.value = y; p.positionZ.value = z;

      const bp = actx.createBiquadFilter(); bp.type='bandpass';
      const g = actx.createGain(); g.gain.value = 0.0001;

      noise.connect(bp).connect(p).connect(g).connect(master);
      p.connect(reverbSend);

      const now = actx.currentTime;
      bp.frequency.setValueAtTime(300, now);
      bp.frequency.exponentialRampToValueAtTime(3000, now + 0.18);
      bp.frequency.exponentialRampToValueAtTime(900, now + 0.35);
      bp.Q.setValueAtTime(6, now);

      g.gain.exponentialRampToValueAtTime(1.0, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

      noise.start();
      noise.onended = ()=>{ try{ g.disconnect(); bp.disconnect(); p.disconnect(); }catch(_){ } };
    }

    carrier.start(); mod.start();

    // ---------- THREE + PostFX ----------
    const THREE = THREEref;
    const {EffectComposer, RenderPass, UnrealBloomPass} = POST;
    const {
      Scene, PerspectiveCamera, WebGLRenderer, Color, FogExp2, Group, LineBasicMaterial,
      BufferGeometry, Float32BufferAttribute, Line, PlaneGeometry, MeshStandardMaterial, Mesh,
      BoxGeometry, Vector3, SpotLight, sRGBEncoding, ACESFilmicToneMapping, AdditiveBlending,
      PCFSoftShadowMap, PointLight, Sprite, SpriteMaterial, CanvasTexture
    } = THREE;

    const scene = new Scene();
    scene.background = new Color(0x05070a);
    scene.fog = new FogExp2(0x05070a, 0.0007);

    const camera = new PerspectiveCamera(45, CAP_W/CAP_H, 0.1, 5000);

    const renderer = new WebGLRenderer({canvas, antialias:true, preserveDrawingBuffer:true});
    renderer.setSize(CAP_W, CAP_H, false);
    renderer.outputEncoding = sRGBEncoding;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    // Bloom
    const rt = new THREE.WebGLRenderTarget(CAP_W, CAP_H, { samples: 4 });
    const composer = new EffectComposer(renderer,rt);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(CAP_W, CAP_H), 1.4, 0.22, 0.0);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    // Unified GREEN grid
    function buildUnifiedGrid(){
      const grp = new Group();
      const matZ = new LineBasicMaterial({ color: 0x20ff80, transparent:true, opacity:0.7, blending:AdditiveBlending });
      const matX = new LineBasicMaterial({ color: 0x20ff80, transparent:true, opacity:0.32, blending:AdditiveBlending });
      const y=-3.0, xMin=-12, xMax=12, zNear=+6, zFar=-4000;
      const lanes = [-11,-9,-7,-5,-3,-1,1,3,5,7,9,11];
      lanes.forEach(x=>{
        const geo = new BufferGeometry();
        geo.setAttribute('position', new Float32BufferAttribute(new Float32Array([x,y,zNear, x,y,zFar]),3));
        grp.add(new Line(geo, matZ));
      });
      for (let z=zNear; z>zFar; z-=44){
        const geo = new BufferGeometry();
        geo.setAttribute('position', new Float32BufferAttribute(new Float32Array([xMin,y,z, xMax,y,z]),3));
        grp.add(new Line(geo, matX));
      }
      return grp;
    }
    scene.add(buildUnifiedGrid());

    // Floor (wireframe shadow catcher)
    const floor = new Mesh(
      new PlaneGeometry(60, 4200, 20, 120),
      new MeshStandardMaterial({ color:0x0a0c10, wireframe:true, metalness:0.0, roughness:0.9 })
    );
    floor.rotation.x = -Math.PI/2;
    floor.position.set(0, -3.02, -2000);
    floor.receiveShadow = true;
    scene.add(floor);

    // Player (thicker look via emissive + halo)
    const playerMat = new MeshStandardMaterial({
      color: 0xfff04a, wireframe: true, emissive: 0xffee66, emissiveIntensity: 2.6, metalness: 0.0, roughness: 0.28
    });
    const sprite = new Mesh(new PlaneGeometry(2.2,2.2,4,4), playerMat);
    sprite.position.set(0,-1.8,-5); sprite.castShadow = true; scene.add(sprite);
    const playerLight = new PointLight(0xfff89a, 7.0, 70, 2.0); playerLight.castShadow = false; scene.add(playerLight);

    // Opponents (violet)
    const oppMat = new MeshStandardMaterial({ color:0x9b59ff, wireframe:true, emissive:0x220033, metalness:0.1, roughness:0.5 });
    function makeGoal(x,z){
      const g = new Group();
      const box = new Mesh(new BoxGeometry(1.2,1.2,1.2,2,2,2), oppMat);
      box.position.set(0,-1.5,0); box.castShadow = true; g.add(box);
      g.position.set(x,0,z); return g;
    }
    const goals = [];
    for (let i=0;i<28;i++){
      const x = (Math.floor(Math.random()*9)-4)*2.0;
      const z = -120 - i*100 - Math.random()*40;
      const goal = makeGoal(x,z); goals.push(goal); scene.add(goal);
    }

    // Spots
    const spots = [
      {color:0xff4444, pos:[-8,  9,  -40]},
      {color:0x44aaff, pos:[ 10, 12, -120]},
      {color:0x44ff66, pos:[  0, 14, -300]},
      {color:0xff44ee, pos:[-12, 13, -600]},
      {color:0xffcc44, pos:[ 12, 10,-1000]}
    ];
    spots.forEach(s=>{
      const L = new SpotLight(s.color, 160, 1400, Math.PI/5, 0.45, 2.0);
      L.position.set(...s.pos); L.castShadow = true; L.shadow.mapSize.set(1024,1024); L.shadow.bias = -0.0001;
      scene.add(L);
    });

    camera.position.set(0, 1.6, 5);
    camera.lookAt(new Vector3(0,-1.5,-50));

    // ---- Score sprite INSIDE canvas (camera HUD) ----
    const scoreCanvas = document.createElement('canvas'); scoreCanvas.width = 512; scoreCanvas.height = 256;
    const scoreCtx = scoreCanvas.getContext('2d');
    const scoreTex = new CanvasTexture(scoreCanvas);
    const scoreMat = new SpriteMaterial({ map: scoreTex, transparent: true });
    const scoreSprite = new Sprite(scoreMat);
    scoreSprite.scale.set(4.0, 1.9, 1);
    camera.add(scoreSprite);
    scoreSprite.position.set(-2.6, 2.2, -6);

    function drawScore(text){
      const w = scoreCanvas.width, h = scoreCanvas.height;
      scoreCtx.clearRect(0,0,w,h);
      scoreCtx.fillStyle = 'rgba(10,14,20,0.55)';
      scoreCtx.strokeStyle = 'rgba(255,255,255,0.15)';
      scoreCtx.lineWidth = 4;
      scoreCtx.beginPath();
      const r=32; scoreCtx.moveTo(r,0); scoreCtx.arcTo(w,0,w,h,r); scoreCtx.arcTo(w,h,0,h,r);
      scoreCtx.arcTo(0,h,0,0,r); scoreCtx.arcTo(0,0,w,0,r); scoreCtx.closePath();
      scoreCtx.fill(); scoreCtx.stroke();
      scoreCtx.font = 'bold 88px ui-sans-serif, system-ui, Segoe UI';
      scoreCtx.fillStyle = '#ffe36a';
      scoreCtx.textAlign = 'center';
      scoreCtx.textBaseline = 'middle';
      scoreCtx.fillText(text, w/2, h/2);
      scoreTex.needsUpdate = true;
    }

    // ---------- Controls ----------
    const keys = new Set();
    const keydown = (e)=>{ if (/^[a-z]$/i.test(e.key)) keys.add(e.key.toLowerCase()); };
    const keyup = (e)=>{ if (/^[a-z]$/i.test(e.key)) keys.delete(e.key.toLowerCase()); };
    window.addEventListener('keydown', keydown, {passive:false});
    window.addEventListener('keyup', keyup, {passive:false});

    // ---------- Gameplay + Audio mapping ----------
    let zSpeed = 0.8, dashCooldown = 0, score = 0;
    const clamp = (v,a,b)=> Math.max(a, Math.min(b, v));
    drawScore(`score: ${score}`);

    // ---------- Recording ----------
    let recorder=null, chunks=[], recording=false, stream=null;
    function startRecording(){
      if (recording) return;
      chunks = [];
      const vStream = canvas.captureStream(30);
      const aTap = actx.createMediaStreamDestination();
      master.connect(aTap);
      stream = new MediaStream([...vStream.getVideoTracks(), ...aTap.stream.getAudioTracks()]);
      recorder = new MediaRecorder(stream, {mimeType:'video/webm;codecs=vp9,opus'});
      recorder.ondataavailable = e=>{ if (e.data && e.data.size) chunks.push(e.data); };
      recorder.onstop = ()=>{
        const blob = new Blob(chunks, {type:'video/webm'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download='arcade-1080x1350.webm';
        a.textContent = 'download recording'; a.style.fontSize='11px'; a.style.color='#9ad';
        ui.appendChild(a); app && (app.downloadLink=a);
      };
      recorder.start(); recording=true; led.classList.add('on');
      app.stream = stream; app.recorder = recorder; app.recording = recording;
    }
    function stopRecording(){
      if (!recording) return;
      try{ recorder.stop(); }catch(_){}
      try{ stream && stream.getTracks().forEach(t=>t.stop()); }catch(_){}
      recording=false; led.classList.remove('on');
      app && (app.recording=false);
    }
    led.onclick = ()=>{ if (actx.state!=='running') actx.resume(); recording?stopRecording():startRecording(); };

    // ---------- RENDER LOOP ----------
    let last = performance.now(), raf=0;
    function tick(now){
      const dt = Math.min(0.033, (now-last)/1000); last = now;

      const left = keys.has('a'), right = keys.has('d'), up = keys.has('w'), down = keys.has('s'), dash = keys.has('q');
      if (dash && dashCooldown<=0){ zSpeed += 1.75; dashCooldown = 1.0; }
      if (dashCooldown>0) dashCooldown -= dt;
      zSpeed += (-zSpeed + 0.8) * 0.02;

      const dx = (right - left) * 4.0 * dt;
      const dy = (up - down) * 3.0 * dt;
      sprite.position.x = clamp(sprite.position.x + dx, -11, 11);
      sprite.position.y = clamp(sprite.position.y + dy, -2.7, 0.0);

      goals.forEach(g=> g.position.z += zSpeed);
      goals.forEach(g=>{
        if (g.position.z > 6) {
          g.position.z = -3800 - Math.random()*200;
          g.position.x = (Math.floor(Math.random()*9)-4)*2.0;
        }
      });
      let hitThisFrame = false;
      goals.forEach(g=>{
        const d = g.position.clone().sub(sprite.position).length();
        if (d < 1.6) {
          collisionWooshAt(g.position.x, g.position.y, g.position.z);
          g.position.z = -3800 - Math.random()*200;
          g.position.x = (Math.floor(Math.random()*9)-4)*2.0;
          score += 1; hitThisFrame = true;
        }
      });
      if (hitThisFrame) drawScore(`score: ${score}`);

      // --- FM + Doppler + spatial mapping for player tone ---
      const yNorm = (sprite.position.y + 2.7)/2.7;             // 0..1
      const fCarrierBase = 180 + yNorm*240;                    // Carrier ← Y
      const xNorm = (sprite.position.x + 11)/22;               // 0..1
      const fMod = 0.5 + xNorm * 120;                          // Modulator ← X
      const avgZ = -Math.min(...goals.map(g=>g.position.z));   // depth proxy
      const doppler = (avgZ % 400) * 0.35;                     // Doppler-ish ← Z
      const fCarrier = Math.max(40, fCarrierBase + doppler);
      const modIndex = Math.max(0, 30 + (zSpeed-0.8)*120 + yNorm*40);

      mod.frequency.setTargetAtTime(fMod, actx.currentTime, 0.05);
      modGain.gain.setTargetAtTime(modIndex, actx.currentTime, 0.05);
      carrier.frequency.setTargetAtTime(fCarrier, actx.currentTime, 0.05);

      panner.positionX.value = sprite.position.x;
      panner.positionY.value = sprite.position.y;
      panner.positionZ.value = sprite.position.z;
      setListenerFromCamera(camera);

      playerLight.position.copy(sprite.position).add(new Vector3(0, 1.2, 0));

      camera.position.x += (sprite.position.x*0.25 - camera.position.x)*0.1;
      camera.position.y += ((sprite.position.y+1.8)*0.25 - camera.position.y)*0.1;
      camera.lookAt(sprite.position.x, sprite.position.y, sprite.position.z - 30);

      composer.render();

      // === MUSIC ADDITIONS: update gate density from Y for next scheduler slice ===
      app.musicState.yGateDensity = 1 + Math.round(yNorm * 2); // 1,2,3 → 16ths → ratchets
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // ---------- MUSIC ENGINE (Scheduler + Bass NPC) ----------
    // === MUSIC ENGINE: 120 BPM, 4/4, 16th scheduler, bass NPC, FM gating ===
const BPM = 120;
const beat = 60/BPM;          // quarter
const sixteenth = beat/4;     // 16th

function makeClock(){
  const st = { next: actx.currentTime+0.05, step:0, bar:0, running:false };
  const lookahead = 0.025, ahead = 0.12;
  let iv = null;
  function tick(){
    const now = actx.currentTime;
    while (st.next < now+ahead){
      sequenceStep(st.next, st.step, st.bar);
      st.step = (st.step+1)%16;
      if (st.step===0) st.bar++;
      st.next += sixteenth;
    }
  }
  return {
    start(){ if (st.running) return; st.running=true; st.next=actx.currentTime+0.05; st.step=0; st.bar=0; iv=setInterval(tick, lookahead*1000); },
    stop(){ st.running=false; if (iv){clearInterval(iv); iv=null;} },
    state: st
  };
}

// NES-ish pulse osc
function makePulseOsc(freq, width=0.25){
  const N=128, real=new Float32Array(N), imag=new Float32Array(N);
  for (let k=1;k<N;k++){ const a=Math.sin(Math.PI*k*width)/(Math.PI*k); real[k]=0; imag[k]=2*a; }
  const w = actx.createPeriodicWave(real, imag, {disableNormalization:true});
  const o = actx.createOscillator(); o.setPeriodicWave(w); o.frequency.value=freq; return o;
}

// Bass chain
const bassFilter = actx.createBiquadFilter(); bassFilter.type='lowpass'; bassFilter.frequency.value=1600; bassFilter.Q.value=0.7;
const bassOut = actx.createGain(); bassOut.gain.value = 0.5; // per-note env
bassFilter.connect(bassOut).connect(master);
bassFilter.connect(reverbSend);

// Click-free gain env
function envGainAt(g, t, a=0.004, r=0.06, peak=0.75){
  g.cancelScheduledValues(t);
  g.setValueAtTime(g.value??g.gain.value, t);
  g.linearRampToValueAtTime(peak, t+a);
  g.linearRampToValueAtTime(0.0001, t+a+r);
}

// Modal tools
function makeScale(mode='dorian'){
  const modes = { dorian:[0,2,3,5,7,9,10], aeolian:[0,2,3,5,7,8,10], mixolydian:[0,2,4,5,7,9,10] };
  return modes[mode]||modes.dorian;
}
function pick(a){ return a[(Math.random()*a.length)|0]; }

// NPC state and loop builder
const musicState = {
  mode:'dorian', root:50, loopBars:16, pattern:[], fills:new Set(), yGateDensity:1
};
function regenLoop(){
  musicState.pattern.length=0; musicState.fills.clear();
  const scale = makeScale(musicState.mode); let root = musicState.root;
  for (let bar=0; bar<musicState.loopBars; bar++){
    if (bar>0 && bar%4===0){ root += pick([+3,-3,+4,-4]); } // ± minor/major third
    if (Math.random()<0.22) musicState.fills.add(bar);
    for (let s=0; s<16; s++){
      const onEighth = (s%2===0);
      const isRest = onEighth && Math.random()<0.12;
      let midi=null;
      if (!isRest){
        const degree = (s%4===0)? pick([0,3,4]) : pick([1,2,4,5,6]); // modal color
        midi = (root + scale[degree%7] + (degree>6?12:0)) - 12;     // bass register
      }
      musicState.pattern.push({bar,s,midi});
    }
  }
  musicState.root = root;
}
regenLoop();

// Bass note
function triggerBass(t, midi, durBeats=0.5){
  if (midi==null) return;
  const freq = 440*Math.pow(2,(midi-69)/12);
  const o = makePulseOsc(freq, pick([0.125,0.25,0.5]));
  const v = actx.createGain(); v.gain.value=0.0;
  o.connect(v).connect(bassFilter);
  envGainAt(v.gain, t, 0.004, 0.07, 0.7);
  const dur = Math.max(0.08, durBeats*beat);
  o.start(t); o.stop(t+dur);
  o.onended = ()=>{ try{ v.disconnect(); }catch(_){} };
  const f0 = 1100 + Math.random()*700;
  bassFilter.frequency.setTargetAtTime(f0, t, 0.02);
}

// Tiny chiptune fill near bar end
function triggerFill(t, rootMidi){
  const pat = [0,7,12,7,0,12];
  const step = sixteenth/3; // tuplet-ish
  for (let i=0;i<pat.length;i++) triggerBass(t + i*step, rootMidi + pat[i], 0.25);
}

// FM gate: 16ths base; ratchets when player goes up
function scheduleFMGate(t, density=1){
  const pulses = Math.max(1, Math.min(3, density)); // 1..3
  const win = sixteenth;
  const onDur = Math.max(0.028, win/(pulses*2.2));
  for (let p=0;p<pulses;p++){
    const tOn = t + p*(win/pulses);
    fmGate.gain.cancelScheduledValues(tOn);
    fmGate.gain.setValueAtTime(fmGate.gain.value, tOn);
    fmGate.gain.linearRampToValueAtTime(1.0, tOn+0.003);
    fmGate.gain.linearRampToValueAtTime(0.08, tOn+onDur);
  }
}

// One 16th step
function sequenceStep(t, step, barAbs){
  const bar = barAbs % musicState.loopBars;
  const cell = musicState.pattern[bar*16 + step];
  if (step%2===0) triggerBass(t, cell?.midi, 0.5);      // eighths
  if (step===15 && musicState.fills.has(bar)){
    const rootMidi = (cell?.midi ?? musicState.root)+12;
    triggerFill(t + sixteenth*0.25, rootMidi);
  }
  scheduleFMGate(t, musicState.yGateDensity);
}

// Start transport
const clock = makeClock(); clock.start();

    // === Store app state for teardown and for render loop coupling ===
    app = {
      actx, carrier, mod, modGain, panner, convolver, master,
      scene, renderer, camera, composer, canvas,
      keydown, keyup, raf, recorder:null, recording:false, stream:null, downloadLink:null,
      // music
      clock, npc:{stop:()=>{}}, musicState
    };

    // Regenerate the bass loop every 16 bars, and shift harmony every 4 bars implicitly
    const loopIv = setInterval(()=>{
      if (!app) return clearInterval(loopIv);
      regenLoop();
    }, (16*16*sixteenth)*1000); // 16 bars * 16 steps * 1/16 duration

    // ---------- Start/Stop ----------
    startBtn.textContent = 'Stop';
    startBtn.onclick = ()=>{ stopRecording(); cancelAnimationFrame(raf); disposeApp(); attachAutoCleanup(); };

    attachAutoCleanup();
  }

  startBtn.onclick = ()=> startApp();
  window.addEventListener('beforeunload', () => disposeApp());
})().catch(err=>console.error('arcade init error', err));
```
