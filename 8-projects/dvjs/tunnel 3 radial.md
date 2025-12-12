```dataviewjs
// DataviewJS — BEA5 arcade (fixed for latest three: outputColorSpace), tunnel at origin, polar W/S,
// music layers (Bass 8ths + Chopped Melody 16ths + Collision Chords), enemies, and WebRTC recorder LED.

(async function () {
  // ---------- UI ----------
  const root = dv.container;

  const bar = document.createElement('div');
  bar.style.cssText = 'display:flex;gap:12px;align-items:center;margin:6px 0';
  const btn = document.createElement('button');
  btn.textContent = 'Start';
  btn.style.cssText='padding:6px 10px;border-radius:8px;background:#1c2533;color:#cfd6e6;border:none;cursor:pointer';
  const led = document.createElement('div');
  led.title = 'Record/Stop';
  led.style.cssText = 'width:12px;height:12px;border-radius:50%;background:#2a0000;box-shadow:inset 0 0 6px #000;cursor:pointer';
  bar.appendChild(btn); bar.appendChild(led); root.appendChild(bar);

  const wrap = document.createElement('div');
  wrap.style.position='relative';
  root.appendChild(wrap);

  let app = null;

  btn.onclick = () => { if (!app) start(); else app.stop?.(); };

  async function start(){
    // ---------- Load Three (dynamic import, no <script type=module>) ----------
    const THREE = await import('https://esm.sh/three@0.161.0');
    const EffectComposer  = (await import('https://esm.sh/three@0.161.0/examples/jsm/postprocessing/EffectComposer.js')).EffectComposer;
    const RenderPass      = (await import('https://esm.sh/three@0.161.0/examples/jsm/postprocessing/RenderPass.js')).RenderPass;
    const UnrealBloomPass = (await import('https://esm.sh/three@0.161.0/examples/jsm/postprocessing/UnrealBloomPass.js')).UnrealBloomPass;

    // ---------- Canvas ----------
    const CAP_W=1080, CAP_H=1350, VIEW_SCALE=0.6;
    const canvas = document.createElement('canvas');
    canvas.width=CAP_W; canvas.height=CAP_H;
    canvas.style.width = Math.round(CAP_W*VIEW_SCALE)+'px';
    canvas.style.height= Math.round(CAP_H*VIEW_SCALE)+'px';
    canvas.style.display='block';
    wrap.appendChild(canvas);

    // ---------- Audio ----------
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const actx = new AudioContext(); await actx.resume();

    function makeImpulse(sec=3.0, decay=3.4){
      const len = Math.floor(actx.sampleRate*sec);
      const b = actx.createBuffer(2,len,actx.sampleRate);
      for(let ch=0; ch<2; ch++){
        const d=b.getChannelData(ch);
        for(let i=0;i<len;i++){ const t=i/len; d[i]=(Math.random()*2-1)*Math.pow(1-t,decay); }
      }
      return b;
    }
    const master = actx.createGain(); master.gain.value=0.5;
    const bus    = actx.createGain(); bus.gain.value=1.0;
    const conv   = actx.createConvolver(); conv.buffer=makeImpulse(3.2,3.6);
    const revSend= actx.createGain(); revSend.gain.value=0.42;
    const hp     = actx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=35;
    bus.connect(master); bus.connect(revSend).connect(conv).connect(master);
    master.connect(hp).connect(actx.destination);

    function shaper(amt=1.6){ const n=2048,c=new Float32Array(n); for(let i=0;i<n;i++){ const x=(i/(n-1))*2-1; c[i]=Math.tanh(amt*x);} const ws=actx.createWaveShaper(); ws.curve=c; ws.oversample='4x'; return ws; }

    function makeLayer({baseDelay=0.12,bpFreq=600,q=8,fb=0.6,outGain=0.6,panPos=[0,0,0]}={}){
      const src=actx.createGain(); src.gain.value=0.0;
      const dly=actx.createDelay(2.0); dly.delayTime.value=baseDelay;
      const bp =actx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=bpFreq; bp.Q.value=q;
      const ws =shaper(1.7);
      const loop=actx.createGain(); loop.gain.value=fb;
      const out=actx.createGain(); out.gain.value=outGain;
      const pan=actx.createPanner(); pan.panningModel='HRTF'; pan.distanceModel='inverse'; pan.refDistance=2; pan.rolloffFactor=1.0;
      pan.positionX.value=panPos[0]; pan.positionY.value=panPos[1]; pan.positionZ.value=panPos[2];

      src.connect(dly);
      dly.connect(bp).connect(ws).connect(loop).connect(dly);
      ws.connect(out).connect(pan).connect(bus); pan.connect(revSend);

      const comp=actx.createDynamicsCompressor(); comp.threshold.value=-18; comp.knee.value=8; comp.ratio.value=3;
      out.connect(comp).connect(bus);

      const impBuf=actx.createBuffer(1,256,actx.sampleRate); const id=impBuf.getChannelData(0);
      for(let i=0;i<id.length;i++){ id[i]=(Math.random()*2-1)*Math.pow(1-i/id.length,3); }

      function impulse(amp=0.9, t=actx.currentTime){
        const b=actx.createBufferSource(); b.buffer=impBuf; const g=actx.createGain(); g.gain.value=amp;
        b.connect(g).connect(src); try{ b.start(t);}catch(_){ b.start(); } b.onended=()=>{ try{ g.disconnect(); }catch(_){ } };
      }

      return {
        nodes:{src,dly,bp,ws,loop,out,pan},
        impulse, setFreq:(f)=>bp.frequency.setTargetAtTime(f, actx.currentTime, 0.12),
        setDelay:(v)=>dly.delayTime.setTargetAtTime(v, actx.currentTime, 0.2),
        setQ:(v)=>bp.Q.setTargetAtTime(v, actx.currentTime, 0.2),
        setFb:(v)=>loop.gain.setTargetAtTime(v, actx.currentTime, 0.2),
        dispose:()=>{ try{ src.disconnect(); dly.disconnect(); bp.disconnect(); ws.disconnect(); loop.disconnect(); out.disconnect(); pan.disconnect(); comp.disconnect(); }catch(_){ } }
      };
    }

    // Layers: A=Chopped Melody, B=Bass (gain 0.5), C=Collision Chords
    const layerA = makeLayer({baseDelay:0.045,bpFreq:900,q:10,fb:0.55,outGain:0.55,panPos:[-2,0,-6]});
    const layerB = makeLayer({baseDelay:0.18, bpFreq:220,q:7, fb:0.62,outGain:0.50,panPos:[ 2,0,-8]}); // bass gain 0.5
    const layerC = makeLayer({baseDelay:0.12, bpFreq:1200,q:6, fb:0.60,outGain:0.62,panPos:[ 0,0,-10]}); // chords

    // Chop gate (16ths) between A.ws and A.out
    const melGate = actx.createGain(); melGate.gain.value=0.0;
    try{ layerA.nodes.ws.disconnect(layerA.nodes.out); }catch(_){}
    layerA.nodes.ws.connect(melGate).connect(layerA.nodes.out);

    // ---------- THREE ----------
    const {Scene, PerspectiveCamera, WebGLRenderer, Color, FogExp2, Group, LineBasicMaterial,
           BufferGeometry, Float32BufferAttribute, Line, MeshStandardMaterial, Mesh, Vector3,
           SpotLight, PointLight, Sprite, SpriteMaterial, CanvasTexture, BoxGeometry, Vector2, WebGLRenderTarget} = THREE;

    const scene = new Scene();
    scene.background = new Color(0x05070a);
    scene.fog = new FogExp2(0x05070a, 0.0007);

    const camera = new PerspectiveCamera(45, CAP_W/CAP_H, 0.1, 5000);
    camera.position.set(0,0,6);
    camera.lookAt(new Vector3(0,0,-40));

    const renderer = new WebGLRenderer({canvas, antialias:true, preserveDrawingBuffer:true});
    renderer.setSize(CAP_W, CAP_H, false);
    // FIX: outputEncoding removed → use outputColorSpace
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;

    const composer = new EffectComposer(renderer, new WebGLRenderTarget(CAP_W, CAP_H, {samples:4}));
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new Vector2(CAP_W, CAP_H), 1.4, 0.22, 0.0));

    // ---------- Tunnel at origin (static): z = 0 .. -TUNNEL_LEN ----------
    const TUNNEL_R=11.0, TUNNEL_LEN=4800, RINGS=180, RADIALS=48;
    function buildTunnel(){
      const grp=new Group();
      const ringMat  = new LineBasicMaterial({ color:0x20ff80, transparent:true, opacity:0.75, depthTest:false, depthWrite:false });
      const radialMat= new LineBasicMaterial({ color:0x20ff80, transparent:true, opacity:0.40, depthTest:false, depthWrite:false });
      for(let i=0;i<=RINGS;i++){
        const z = - (i * (TUNNEL_LEN/RINGS)); // includes 0
        const segs=96, arr=[];
        for(let s=0;s<=segs;s++){ const th=(s/segs)*Math.PI*2; arr.push(TUNNEL_R*Math.cos(th), TUNNEL_R*Math.sin(th), z); }
        const geo=new BufferGeometry(); geo.setAttribute('position', new Float32BufferAttribute(new Float32Array(arr),3));
        grp.add(new Line(geo, ringMat));
      }
      for(let r=0;r<RADIALS;r++){
        const th=(r/RADIALS)*Math.PI*2, x=TUNNEL_R*Math.cos(th), y=TUNNEL_R*Math.sin(th);
        const geo=new BufferGeometry(); geo.setAttribute('position', new Float32BufferAttribute(new Float32Array([x,y,0, x,y,-TUNNEL_LEN]),3));
        grp.add(new Line(geo, radialMat));
      }
      return grp;
    }
    const tunnel = buildTunnel(); scene.add(tunnel);

    // ---------- Player cube at origin ----------
    const player = new Mesh(new BoxGeometry(1,1,1), new MeshStandardMaterial({color:0xfff04a, wireframe:true, emissive:0xffee66, emissiveIntensity:2.2}));
    scene.add(player);
    const pLight = new PointLight(0xfff89a, 7.0, 70, 2.0); pLight.position.set(0,0,1.0); scene.add(pLight);

    // ---------- Enemies inside tunnel ----------
    const enemies = [];
    const oppMat = new MeshStandardMaterial({color:0x9b59ff, wireframe:true, emissive:0x220033});
    for(let i=0;i<28;i++){
      const g=new THREE.Group(); g.add(new Mesh(new THREE.BoxGeometry(1.2,1.2,1.2,2,2,2), oppMat));
      g.userData={ theta: Math.random()*Math.PI*2, r: Math.max(0.6, Math.random()*TUNNEL_R*0.9), z: -50 - i*140 - Math.random()*100 };
      enemies.push(g); scene.add(g);
    }

    // Lights
    [[0xff4444,-8,9,-40],[0x44aaff,10,12,-120],[0x44ff66,0,14,-300],[0xff44ee,-12,13,-600],[0xffcc44,12,10,-1000]].forEach(([c,x,y,z])=>{
      const L=new SpotLight(c,160,1400,Math.PI/5,0.45,2.0); L.position.set(x,y,z); scene.add(L);
    });

    // ---------- HUD score ----------
    const scCan=document.createElement('canvas'); scCan.width=512; scCan.height=256;
    const scCtx=scCan.getContext('2d'); const scTex=new THREE.CanvasTexture(scCan);
    const scSpr=new THREE.Sprite(new THREE.SpriteMaterial({map:scTex, transparent:true})); scSpr.scale.set(4.0,1.9,1); camera.add(scSpr); scSpr.position.set(-2.6,2.2,-6);
    function drawScore(t){ const w=scCan.width,h=scCan.height; scCtx.clearRect(0,0,w,h);
      scCtx.fillStyle='rgba(10,14,20,0.55)'; scCtx.strokeStyle='rgba(255,255,255,0.15)'; scCtx.lineWidth=4;
      scCtx.beginPath(); const r=32; scCtx.moveTo(r,0); scCtx.arcTo(w,0,w,h,r); scCtx.arcTo(w,h,0,h,r); scCtx.arcTo(0,h,0,0,r); scCtx.arcTo(0,0,w,0,r); scCtx.closePath(); scCtx.fill(); scCtx.stroke();
      scCtx.font='bold 88px ui-sans-serif, system-ui, Segoe UI'; scCtx.fillStyle='#ffe36a'; scCtx.textAlign='center'; scCtx.textBaseline='middle'; scCtx.fillText(t,w/2,h/2); scTex.needsUpdate=true; }
    let score=0; drawScore('score: 0');

    // ---------- Controls (guard key) ----------
    const keys = new Set();
    function addKey(e){ const k=(e && e.key) ? String(e.key).toLowerCase() : ''; if (k.length===1) keys.add(k); actx.resume().catch(()=>{}); }
    function delKey(e){ const k=(e && e.key) ? String(e.key).toLowerCase() : ''; if (k.length===1) keys.delete(k); }
    window.addEventListener('keydown', addKey, {passive:false});
    window.addEventListener('keyup',   delKey, {passive:false});

    // ---------- Gameplay state ----------
    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
    const TUNNEL_R_INNER=0.4;
    let theta = Math.PI*0.25, rRad = TUNNEL_R*0.8;
    let zSpeed = 1.0, dashCd=0;

    function setPolar(obj, rr, th, zz){ obj.position.set(rr*Math.cos(th), rr*Math.sin(th), zz); }

    // ---------- MUSIC ----------
    layerA.impulse(0.9); layerB.impulse(0.9); layerC.impulse(0.9); // immediate sound
    const BPM=120, beat=60/BPM, sixteenth=beat/4;
    const dorian=[0,2,3,5,7,9,10];
    const toFreq=(m)=>440*Math.pow(2,(m-69)/12);
    let rootMidi=50;
    function shiftRootEvery4(bar){ if(bar>0 && bar%4===0){ const c=[+3,-3,+4,-4]; rootMidi += c[(Math.random()*c.length)|0]; } }
    function thetaNote(th, rr){
      const thNorm = ((th%(Math.PI*2))+Math.PI*2)%(Math.PI*2) / (Math.PI*2);
      const deg = Math.floor(thNorm*7)%7;
      const octave = 4 + Math.floor((1 - clamp(rr/TUNNEL_R,0,1))*2);
      return 12*octave + dorian[deg];
    }
    function collisionChordBurst(){
      const minor = Math.random()<0.5, third = minor?3:4, fifth=7;
      const base = rootMidi + dorian[0];
      const freqs = [base, base+third, base+fifth].map(toFreq);
      layerA.setFreq(freqs[0]); layerA.impulse(0.8);
      layerB.setFreq(Math.max(80, Math.min(800, freqs[1]))); layerB.impulse(0.9, actx.currentTime+0.015);
      layerC.setFreq(Math.max(200, Math.min(4000, freqs[2]))); layerC.setQ(5.5); layerC.setDelay(0.09); layerC.impulse(1.0, actx.currentTime+0.03);
    }

    const clock={next:actx.currentTime+0.05, step:0, bar:0};
    const lookahead=0.025, ahead=0.12;
    const timer = setInterval(()=>{
      const now=actx.currentTime;
      while(clock.next < now + ahead){
        const t=clock.next, step=clock.step, bar=clock.bar;

        // Melody (16ths chopped)
        const melMidi = thetaNote(theta, rRad);
        layerA.setFreq(clamp(toFreq(melMidi), 120, 6000));
        const onDur=Math.max(0.03, sixteenth*0.45);
        melGate.gain.setValueAtTime(0.0, t);
        melGate.gain.linearRampToValueAtTime(1.0, t+0.004);
        melGate.gain.linearRampToValueAtTime(0.0, t+onDur);
        if (step%4===0) layerA.impulse(0.5, t);

        // Bass (8ths) + modal drift every 4 bars
        if (step===0) shiftRootEvery4(bar);
        if (step%2===0){
          const strong=(step%4===0);
          const deg = strong ? [0,3,4][(Math.random()*3)|0] : [1,2,4,5,6][(Math.random()*5)|0];
          const bassMidi = (rootMidi + dorian[deg]) - 12;
          layerB.setFreq(clamp(toFreq(bassMidi), 80, 800));
          layerB.impulse(0.7, t);
        }

        clock.step = (clock.step+1)%16;
        if (clock.step===0) clock.bar++;
        clock.next += sixteenth;
      }
    }, lookahead*1000);

    // ---------- Collision woosh ----------
    function wooshAt(x,y,z){
      const src=actx.createBufferSource(), len=Math.floor(actx.sampleRate*0.35), buf=actx.createBuffer(1,len,actx.sampleRate), d=buf.getChannelData(0);
      for(let i=0;i<len;i++) d[i]=Math.random()*2-1; src.buffer=buf;
      const p=actx.createPanner(); p.panningModel='HRTF'; p.distanceModel='inverse'; p.refDistance=2; p.rolloffFactor=1.8;
      p.positionX.value=x; p.positionY.value=y; p.positionZ.value=z;
      const bp=actx.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=6;
      const g=actx.createGain(); g.gain.value=0.0001;
      src.connect(bp).connect(p).connect(g).connect(bus); p.connect(revSend);
      const t=actx.currentTime; bp.frequency.setValueAtTime(300,t); bp.frequency.exponentialRampToValueAtTime(3000,t+0.18); bp.frequency.exponentialRampToValueAtTime(900,t+0.35);
      g.gain.exponentialRampToValueAtTime(1.0,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+0.36);
      src.start(); src.onended=()=>{ try{ g.disconnect(); bp.disconnect(); p.disconnect(); }catch(_){ } };
    }

    // ---------- Recorder (LED) ----------
    let recording=false, mediaRecorder=null, mediaStream=null, chunks=[];
    function recStart(){
      if (recording) return;
      chunks=[];
      const vStream = canvas.captureStream(30);
      const aTap = actx.createMediaStreamDestination();
      master.connect(aTap);
      mediaStream = new MediaStream([].concat(vStream.getVideoTracks(), aTap.stream.getAudioTracks()));
      mediaRecorder = new MediaRecorder(mediaStream, {mimeType:'video/webm;codecs=vp9,opus'});
      mediaRecorder.ondataavailable = (e)=>{ if (e.data && e.data.size) chunks.push(e.data); };
      mediaRecorder.onstop = ()=>{
        const blob = new Blob(chunks, {type:'video/webm'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download='BEA5-arcade-1080x1350.webm';
        a.textContent = 'download recording';
        a.style.cssText='font-size:11px;color:#9ad;margin-left:8px';
        bar.appendChild(a);
      };
      mediaRecorder.start(); recording=true; led.style.background='#ff1a1a'; led.style.boxShadow='0 0 6px #ff3a3a, inset 0 0 4px #3a0000';
    }
    function recStop(){
      if (!recording) return;
      try{ mediaRecorder.stop(); }catch(_){}
      try{ mediaStream && mediaStream.getTracks().forEach(t=>t.stop()); }catch(_){}
      recording=false; led.style.background='#2a0000'; led.style.boxShadow='inset 0 0 6px #000';
    }
    led.onclick = async ()=>{ await actx.resume().catch(()=>{}); recording?recStop():recStart(); };

    // ---------- Loop ----------
    let last=performance.now(); let raf=0;
    function tick(now){
      const dt=Math.min(0.033,(now-last)/1000); last=now;

      // Controls
      const left=keys.has('a'), right=keys.has('d'), inward=keys.has('w'), outward=keys.has('s'), dash=keys.has('q');
      const ang=2.8, rad=7.0;
      if (dash && dashCd<=0){ zSpeed += 1.2; dashCd=1.0; }
      if (dashCd>0) dashCd-=dt;
      zSpeed += (-zSpeed + 1.0)*0.02;

      if (left)  theta -= ang*dt;
      if (right) theta += ang*dt;
      if (inward)  rRad -= rad*dt;
      if (outward) rRad += rad*dt;
      rRad = clamp(rRad, TUNNEL_R_INNER, TUNNEL_R*0.95);

      // Enemies advance (tunnel static)
      for (let i=0;i<enemies.length;i++){
        const g=enemies[i], u=g.userData;
        u.z += zSpeed;
        if (u.z > 4){
          u.z = -TUNNEL_LEN - Math.random()*120;
          u.theta = Math.random()*Math.PI*2;
          u.r = Math.max(TUNNEL_R_INNER, Math.random()*TUNNEL_R*0.9);
        }
        u.theta += 0.2*dt*(Math.random()<0.5?-1:1);
        g.position.set(u.r*Math.cos(u.theta), u.r*Math.sin(u.theta), u.z);
      }

      // Player at origin (polar radius around 0)
      player.position.set(rRad*Math.cos(theta), rRad*Math.sin(theta), 0);
      pLight.position.set(player.position.x, player.position.y, player.position.z+0.8);

      camera.position.x += (player.position.x*0.18 - camera.position.x)*0.08;
      camera.position.y += (player.position.y*0.18 - camera.position.y)*0.08;
      camera.lookAt(player.position.x, player.position.y, -40);

      // Collisions → woosh + chord burst + score
      let hit=false;
      for (let i=0;i<enemies.length;i++){
        const e=enemies[i]; if (e.position.clone().sub(player.position).length() < 1.6){
          wooshAt(e.position.x, e.position.y, e.position.z);
          collisionChordBurst();
          const u=e.userData; u.z = -TUNNEL_LEN - Math.random()*120;
          u.theta=Math.random()*Math.PI*2; u.r=Math.max(TUNNEL_R_INNER, Math.random()*TUNNEL_R*0.9);
          score++; hit=true;
        }
      }
      if (hit) drawScore('score: '+score);

      composer.render();
      raf=requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // ---------- Teardown ----------
    app = { stop: ()=>{
      try{ cancelAnimationFrame(raf); }catch(_){}
      try{ clearInterval(timer); }catch(_){}
      try{
        scene.traverse(o=>{
          if (o.geometry && o.geometry.dispose) o.geometry.dispose();
          if (o.material){
            if (Array.isArray(o.material)) o.material.forEach(m=>{ if (m.map && m.map.dispose) m.map.dispose(); if (m.dispose) m.dispose(); });
            else { if (o.material.map && o.material.map.dispose) o.material.map.dispose(); if (o.material.dispose) o.material.dispose(); }
          }
        });
        renderer.dispose?.();
      }catch(_){}
      if (recording) recStop();
      try{ canvas.remove(); }catch(_){}
      app=null; btn.textContent='Start';
    }};
    btn.textContent='Stop';
  }
})();
```




