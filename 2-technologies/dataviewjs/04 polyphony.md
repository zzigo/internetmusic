
```dataviewjs
// Class 04 — Polyphonic random walk (minimal, clean Start/Stop, panning, gain balance)
// One button; N independent walkers over the same Mixolydian scale.

const btn=document.createElement('button'); btn.textContent='▶ start'; this.container.appendChild(btn);

let ac=null, running=false;
const timers=[];      // one scheduler per voice
const voices=[];      // {i,o,g,p} per active voice

// ---- musical setup ----
const N=3;                     // number of voices (2–4 is nice)
const R=220;                   // root Hz (A3)
const S=[0,1,4,5,6,8,9,10];      // Mixolydian semitones
const hz=n=>R*Math.pow(2,n/12);
const randStep=()=>[-1,0,1][(Math.random()*3)|0];  // -1/0/+1
const dur=()=>0.12+Math.random()*0.38;             // seconds

function start(){
  ac=new (window.AudioContext||window.webkitAudioContext)();

  // simple master chain: compressor -> destination
  const comp=ac.createDynamicsCompressor();
  comp.connect(ac.destination);

  // create voices
  for(let v=0; v<N; v++){
    const state={ i:(S.length/2)|0, o:null, g:null, p:null };
    scheduleNext(state, comp, v);
    voices.push(state);
  }
  running=true; btn.textContent='■ stop';
}

function scheduleNext(state, comp, vIdx){
  if(!ac) return;
  const d=dur();

  // random-walk index with reflection boundaries
  state.i += randStep();
  if(state.i<0) state.i=1;
  if(state.i>=S.length) state.i=S.length-2;

  // build per-note chain
  const o=ac.createOscillator();
  const g=ac.createGain();
  const p=ac.createStereoPanner();

  o.type='sine';
  o.frequency.value=hz(S[state.i]);

  // subtle per-voice level so N voices don’t clip; pan spread across field
  const baseGain=0.12/N;
  g.gain.setValueAtTime(0, ac.currentTime);
  g.gain.linearRampToValueAtTime(baseGain, ac.currentTime+0.01);
  g.gain.exponentialRampToValueAtTime(1e-4, ac.currentTime+d*0.9);

  // static spread plus tiny random jitter each note
  const spread=(vIdx/(N-1))*2-1;                  // from -1 to +1 across voices
  p.pan.value=Math.max(-1, Math.min(1, spread + (Math.random()-0.5)*0.2));

  o.connect(g).connect(p).connect(comp);
  o.start(); o.stop(ac.currentTime+d);

  // keep refs so we can kill immediately on Stop
  state.o=o; state.g=g; state.p=p;

  // schedule next note for this voice
  timers[vIdx]=setTimeout(()=>{
    if(running) scheduleNext(state, comp, vIdx);
  }, d*1000);
}

function stop(){
  running=false;
  // cancel timers
  while(timers.length){ const id=timers.pop(); try{clearTimeout(id);}catch{} }
  // kill active nodes
  while(voices.length){
    const v=voices.pop();
    try{v.o.stop();}catch{} try{v.g.disconnect();}catch{} try{v.p.disconnect();}catch{}
  }
  // close context
  ac.close().catch(()=>{}).finally(()=>{ ac=null; btn.textContent='▶ start'; });
}

btn.onclick=async()=>{
  if(!ac){ start(); await ac.resume(); }
  else{ stop(); }
};
```

---

```dataviewjs
// Class 04 + minimal canvas score: 2 voices, two "staves", dots move L→R.
// Colors: red (V1), green (V2). No staff lines. Clean Start/Stop.

const btn=document.createElement('button'); btn.textContent='▶ start'; this.container.appendChild(btn);

// canvas
const W=560,H=220; const c=document.createElement('canvas'); c.width=W; c.height=H; c.style.display='block'; c.style.margin='8px 0'; this.container.appendChild(c);
const g=c.getContext('2d');

let ac=null, running=false, raf=0;
const timers=[];      // per-voice schedulers
const voices=[];      // per-voice state

// ---- music ----
const N=2;                           // two voices = two staves
const R=220;                         // root Hz (A3)
const S=[0,2,4,5,7,9,10];            // Mixolydian semitones
const hz=n=>R*Math.pow(2,n/12);
const step=()=>[-1,0,1][(Math.random()*3)|0];
const dur=()=>0.12+Math.random()*0.38;

// ---- viz state ----
const cols=['#f44','#4f4'];          // red, green
const vState=[];                     // {x,y,band}
const speed=1.6;                     // px per frame
const pad=10, bandH=(H-3*pad)/2;     // two staves separated by pad

function mapPitchToY(deg, band){
  // map scale degree 0..max to vertical within its band (bottom low, top high)
  const t = deg / (S[S.length-1]||1);
  const yTop = pad + band*(bandH+pad);
  const y = yTop + (1-t)*bandH;
  return y;
}

function draw(){
  g.clearRect(0,0,W,H);
  for(let v=0; v<N; v++){
    const s=vState[v];
    s.x += speed; if(s.x>W+6) s.x=-6;
    g.beginPath(); g.arc(s.x, s.y, 4, 0, Math.PI*2);
    g.fillStyle=cols[v%cols.length]; g.fill();
  }
  raf=requestAnimationFrame(draw);
}

function scheduleNext(state, chain, vIdx){
  if(!ac) return;
  const d=dur();

  // random-walk within scale (reflect)
  state.i += step();
  if(state.i<0) state.i=1;
  if(state.i>=S.length) state.i=S.length-2;

  // audio
  const o=ac.createOscillator(), ga=ac.createGain(), pn=ac.createStereoPanner();
  o.type='sine'; o.frequency.value=hz(S[state.i]);
  const base=0.12/N;
  ga.gain.setValueAtTime(0,ac.currentTime);
  ga.gain.linearRampToValueAtTime(base,ac.currentTime+0.01);
  ga.gain.exponentialRampToValueAtTime(1e-4,ac.currentTime+d*0.9);
  pn.pan.value = vIdx===0 ? -0.4 : 0.4;
  o.connect(ga).connect(pn).connect(chain);
  o.start(); o.stop(ac.currentTime+d);

  // update viz Y at note onset
  vState[vIdx].y = mapPitchToY(S[state.i], vState[vIdx].band);

  timers[vIdx]=setTimeout(()=>{ if(running) scheduleNext(state, chain, vIdx); }, d*1000);
}

function start(){
  ac=new (window.AudioContext||window.webkitAudioContext)();
  const comp=ac.createDynamicsCompressor(); comp.connect(ac.destination);

  // init voices + viz
  voices.length=0; vState.length=0;
  for(let v=0; v<N; v++){
    voices.push({i:(S.length/2)|0});
    vState.push({x:(v*(W/N))|0, y:mapPitchToY(S[(S.length/2)|0], v), band:v});
    scheduleNext(voices[v], comp, v);
  }
  running=true; btn.textContent='■ stop';
  raf=requestAnimationFrame(draw);
}

function stop(){
  running=false;
  // cancel timers
  while(timers.length){ const id=timers.pop(); try{clearTimeout(id);}catch{} }
  // close context
  if(ac){ ac.close().catch(()=>{}).finally(()=>{ ac=null; }); }
  if(raf){ cancelAnimationFrame(raf); raf=0; }
  btn.textContent='▶ start';
}

btn.onclick=async()=>{
  if(!ac){ start(); await ac.resume(); }
  else{ stop(); }
};
```



## spatial division for staff representation 


This line defines a **simple geometric partition** of the canvas into two *horizontal bands*—each corresponding to one musical voice or stave—separated by a fixed padding space.

```js
const pad=10, bandH=(H-3*pad)/2;
```

**Explanation step-by-step:**

1. `pad=10` establishes a uniform margin in pixels used to separate the bands vertically and to keep notes from touching the canvas borders.  
2. `(H-3*pad)` subtracts three paddings from the total canvas height:
   - One top margin,  
   - One middle gap between the two staves,  
   - One bottom margin.  
3. Dividing by two yields `bandH`, the effective height of each stave region.  
4. This allows `mapPitchToY()` to locate each note’s *vertical position* inside its assigned band (red or green).  

The result is a minimal **two-stave coordinate system**, spatially analogous to treble and bass staffs in notation—where pitch height corresponds to visual height, but spacing remains proportional to the canvas geometry.