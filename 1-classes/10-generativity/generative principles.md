


# 1. symmetry/tiling (ordered repetition) — : symmetry and tiling 
    
```dataviewjs
const W=480,H=200; const c=document.createElement('canvas'); c.width=W;c.height=H; c.style.border='1px solid #ccc'; this.container.appendChild(c);
const ctx=c.getContext('2d'); let t=0; const cols=16, rows=8, cw=W/cols, rh=H/rows;

// helper + toggle (independent)
function makeAudio(){ const AC=new (window.AudioContext||window.webkitAudioContext)();
  function mkIR(sec=1.2){ const L=Math.floor(AC.sampleRate*sec), buf=AC.createBuffer(2,L,AC.sampleRate);
    for(let ch=0; ch<2; ch++){ const d=buf.getChannelData(ch); for(let i=0;i<L;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/L,2.2);} return buf;}
  const conv=AC.createConvolver(); conv.buffer=mkIR(1.4);
  const comp=AC.createDynamicsCompressor(); comp.connect(conv); conv.connect(AC.destination);
  const mkVoice=(type='sine',gain=0.05,freq=220)=>{ const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=freq; g.gain.value=gain; o.connect(g).connect(comp); o.start(); return {o,g}; };
  return {AC, mkVoice, destroy: async()=>{try{await AC.close();}catch{}}};
}
function addStartStop(onStart,onStop){ const b=document.createElement('button'); b.textContent='Start Audio'; b.style.margin='8px 0'; this.container.appendChild(b);
  let A=null; b.onclick=async()=>{ if(!A){A=makeAudio(); await A.AC.resume(); b.textContent='Stop Audio'; onStart&&onStart(A);} else {onStop&&onStop(A); await A.destroy(); A=null; b.textContent='Start Audio';}}; }
addStartStop.call(this,(A)=>{ const v=A.mkVoice('sine',0.05,220); (function loop(){
  ctx.clearRect(0,0,W,H);
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){ ctx.fillStyle=((x+y)%2)?`hsl(${(x*20+y*10)%360},60%,50%)`:'#111'; ctx.fillRect(x*cw,y*rh,cw-1,rh-1); }
  const m=Math.floor((Math.sin(t*0.02)*0.5+0.5)*(cols-1)); ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.fillRect(m*cw,0,cw,H);
  v.o.frequency.value = 200+8*m; t++; requestAnimationFrame(loop);
})()},(A)=>{});
```



# 2. randomization (controlled disorder) — : radom walk
    

```dataviewjs
const W=480,H=200; const c=document.createElement('canvas'); c.width=W;c.height=H; c.style.border='1px solid #ccc'; this.container.appendChild(c);
const ctx=c.getContext('2d'); let y=H/2;
function makeAudio(){ const AC=new (window.AudioContext||window.webkitAudioContext)();
  function mkIR(s=1.0){ const L=AC.sampleRate*s|0, b=AC.createBuffer(2,L,AC.sampleRate); for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch); for(let i=0;i<L;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/L*3);} return b;}
  const conv=AC.createConvolver(); conv.buffer=mkIR(1.1); const comp=AC.createDynamicsCompressor(); comp.connect(conv); conv.connect(AC.destination);
  const mkVoice=(type='triangle',g0=0.05,f=180)=>{const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=f; g.gain.value=g0; o.connect(g).connect(comp); o.start(); return {o,g};};
  return {AC,mkVoice,destroy:async()=>{try{await AC.close();}catch{}}}
}
function addStartStop(onStart,onStop){ const b=document.createElement('button'); b.textContent='Start Audio'; b.style.margin='8px 0'; this.container.appendChild(b);
  let A=null; b.onclick=async()=>{ if(!A){A=makeAudio(); await A.AC.resume(); b.textContent='Stop Audio'; onStart&&onStart(A);} else {onStop&&onStop(A); await A.destroy(); A=null; b.textContent='Start Audio';}};}
addStartStop.call(this,(A)=>{ const v=A.mkVoice('triangle',0.05,180); (function loop(){
  ctx.fillStyle='rgba(0,0,0,0.1)'; ctx.fillRect(0,0,W,H);
  y=Math.max(0,Math.min(H,y+(Math.random()-0.5)*6)); ctx.fillStyle='#0cf'; ctx.fillRect((performance.now()/8)%W,y,2,2);
  v.o.frequency.value = 160 + y; requestAnimationFrame(loop);
})()},(A)=>{});
```


# 3. effective complexity sweep (order <- ->disorder) — : effective complexity peak 
    

```dataviewjs
const W=480,H=200; const c=document.createElement('canvas'); c.width=W;c.height=H; c.style.border='1px solid #ccc'; this.container.appendChild(c);

const ctx=c.getContext('2d'); let t=0;

function makeAudio(){ const AC=new (window.AudioContext||window.webkitAudioContext)();

  function mkIR(s=1.3){ const L=AC.sampleRate*s|0, b=AC.createBuffer(2,L,AC.sampleRate); for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch); for(let i=0;i<L;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/L,2.5);} return b;}

  const conv=AC.createConvolver(); conv.buffer=mkIR(1.3); const comp=AC.createDynamicsCompressor(); comp.connect(conv); conv.connect(AC.destination);

  const mkVoice=(type='sawtooth',g0=0.04,f=140)=>{const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=f; g.gain.value=g0; o.connect(g).connect(comp); o.start(); return {o,g};};

  return {AC,mkVoice,destroy:async()=>{try{await AC.close();}catch{}}}

}

function addStartStop(onStart,onStop){ const b=document.createElement('button'); b.textContent='Start Audio'; b.style.margin='8px 0'; this.container.appendChild(b);

  let A=null; b.onclick=async()=>{ if(!A){A=makeAudio(); await A.AC.resume(); b.textContent='Stop Audio'; onStart&&onStart(A);} else {onStop&&onStop(A); await A.destroy(); A=null; b.textContent='Start Audio';}};}

addStartStop.call(this,(A)=>{ const v=A.mkVoice('sawtooth',0.04,140); (function draw(){

  ctx.fillStyle='rgba(0,0,0,0.08)'; ctx.fillRect(0,0,W,H);

  const k=(Math.sin(t*0.005)*0.5+0.5), cols=12, s=W/cols;

  for(let i=0;i<cols;i++){ const base=i*s+s*0.5, jitter=k*(Math.random()-0.5)*s; ctx.fillStyle=`hsl(${(i*30+t/2)%360},70%,55%)`; ctx.fillRect(base+jitter-3,20,6,H-40); }

  v.o.frequency.value=140+60*k; t++; requestAnimationFrame(draw);

})()},(A)=>{});
```


# 4. L-system (recursive grammar) — : grammar-based forms 
    

```dataviewjs
// Canvas setup
const W=540, H=320;
const c=document.createElement('canvas'); c.width=W; c.height=H; c.style.border='1px solid #ccc';
this.container.appendChild(c);
const ctx=c.getContext('2d');

// L-system (grammar)
const axiom = 'F';
const rules  = { 'F': 'F[+F]F[-F]F' };   // simple bush
const iter   = 3;                         // grammar depth
function expand(s){ let out=''; for(const ch of s) out += (rules[ch]||ch); return out; }
let str = axiom; for(let i=0;i<iter;i++) str = expand(str);

// Turtle parameters
const step  = 13;
const dTh   = 0.40;                       // radians
const origin= {x: W/2, y: H-16};
const startAngle = -Math.PI/2;

// Precompute segments + token stream aligned to grammar
const segments = [];   // [{x1,y1,x2,y2, depth, ang}]
const tokens   = [];   // one entry per drawable/event step: 'F','+','-','[',']'
{
  const stack = [];
  let x=origin.x, y=origin.y, ang=startAngle, depth=0;
  for(const ch of str){
    tokens.push(ch);
    if(ch==='F'){
      const nx = x + Math.cos(ang)*step, ny = y + Math.sin(ang)*step;
      segments.push({x1:x,y1:y,x2:nx,y2:ny, depth, ang});
      x=nx; y=ny;
    } else if(ch==='+'){ ang += dTh; }
      else if(ch==='-'){ ang -= dTh; }
      else if(ch==='['){ stack.push({x,y,ang}); depth++; }
      else if(ch===']'){ const s=stack.pop(); x=s.x; y=s.y; ang=s.ang; depth=Math.max(0,depth-1); }
  }
}

// Draw static skeleton once
function drawSkeleton(){
  ctx.clearRect(0,0,W,H);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#2e2e2e';
  ctx.beginPath();
  for(const s of segments){ ctx.moveTo(s.x1,s.y1); ctx.lineTo(s.x2,s.y2); }
  ctx.stroke();
}
drawSkeleton();

// Sequencer state (visual progress)
let segIndex = 0;
function drawProgress(k=120){ // draw last k segments highlighted
  drawSkeleton();
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = '#6c6';
  ctx.beginPath();
  for(let i=Math.max(0, segIndex-k); i<Math.min(segIndex, segments.length); i++){
    const s=segments[i]; ctx.moveTo(s.x1,s.y1); ctx.lineTo(s.x2,s.y2);
  }
  ctx.stroke();
}

// Audio: build/destroy per toggle. Events are tied to grammar tokens.
function makeAudio(){
  const AC = new (window.AudioContext||window.webkitAudioContext)();

  // Reverb IR
  function mkIR(sec=1.2){
    const L = Math.floor(AC.sampleRate*sec);
    const buf = AC.createBuffer(2,L,AC.sampleRate);
    for(let ch=0; ch<2; ch++){
      const d = buf.getChannelData(ch);
      for(let i=0;i<L;i++) d[i] = (Math.random()*2-1)*Math.pow(1 - i/L, 2.0);
    }
    return buf;
  }
  const conv = AC.createConvolver(); conv.buffer = mkIR(1.4);
  const comp = AC.createDynamicsCompressor();
  comp.connect(conv); conv.connect(AC.destination);

  // Noise grain voice factory: bandpassed burst, optional pan
  function scheduleGrain(time, freq=400, dur=0.08, gain=0.06, type='band'){
    const src = AC.createBufferSource();
    const len = Math.max(1, Math.floor(AC.sampleRate*dur));
    const nb  = AC.createBuffer(1, len, AC.sampleRate);
    const data= nb.getChannelData(0);
    for(let i=0;i<len;i++){ data[i] = (Math.random()*2-1) * Math.pow(1 - i/len, 1.8); }
    src.buffer = nb;

    const g = AC.createGain(); g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time+0.005);
    g.gain.exponentialRampToValueAtTime(1e-4, time+dur);

    const pan = AC.createStereoPanner();

    let node = src;
    if(type==='band' || type==='high'){
      const biq = AC.createBiquadFilter();
      biq.type = (type==='high')?'highpass':'bandpass';
      biq.frequency.setValueAtTime(freq, time);
      biq.Q.value = 6;
      node.connect(biq).connect(pan).connect(g).connect(comp);
    } else {
      node.connect(pan).connect(g).connect(comp);
    }
    // simple angle-to-pan mapping via freq proxy
    pan.pan.setValueAtTime(Math.max(-1, Math.min(1, (freq-600)/600)), time);

    src.start(time);
  }

  // Low woody click for branch junctions
  function scheduleClick(time, depth){
    scheduleGrain(time, 160 + depth*60, 0.035, 0.07, 'high');
  }

  // Whispery wind on rotations
  function scheduleSwoosh(time, angSign){
    // angle sign → pan direction
    scheduleGrain(time, 1200, 0.06, 0.045, 'high');
  }

  return {
    AC, comp, conv,
    destroy: async ()=>{ try{ await AC.close(); } catch(e){} },
    scheduleGrain, scheduleClick, scheduleSwoosh
  };
}

// Transport toggle
function addStartStop(onStart,onStop){
  const b=document.createElement('button'); b.textContent='Start Audio'; b.style.margin='8px 0';
  this.container.appendChild(b);
  let A=null;
  b.onclick=async()=>{
    if(!A){ A=makeAudio(); await A.AC.resume(); b.textContent='Stop Audio'; onStart?.(A); }
    else  { onStop?.(A); await A.destroy(); A=null; b.textContent='Start Audio'; }
  };
}
let rafId=null, intervalId=null;

// Sequencer: step through tokens at tempo, loop, and sonify grammar
addStartStop.call(this, (A)=>{
  const BPM = 110;              // tempo
  const div = 2;                // events per beat (2 = eighths)
  const stepDur = 60/BPM/div;   // seconds
  let nextT = A.AC.currentTime + 0.05;
  let iTok = 0;
  let depth = 0;

  // schedule-ahead loop
  intervalId = setInterval(()=>{
    while(nextT < A.AC.currentTime + 0.12){
      const ch = tokens[iTok];
      // Visual progress: advance segIndex when we hit 'F'
      if(ch==='F'){
        const s = segments[Math.min(segIndex, segments.length-1)];
        // Map depth→band frequency; deeper branches = lower freq
        const freq = 250 + depth*120;
        A.scheduleGrain(nextT, freq, 0.07, 0.06, 'band');
        A.scheduleClick(nextT, depth);
        segIndex = Math.min(segIndex+1, segments.length);
      } else if(ch==='+'){
        A.scheduleSwoosh(nextT, +1);
      } else if(ch==='-'){
        A.scheduleSwoosh(nextT, -1);
      } else if(ch==='['){
        depth++;
        // subtle junction tick
        A.scheduleClick(nextT, depth);
      } else if(ch===']'){
        depth = Math.max(0, depth-1);
        A.scheduleClick(nextT, depth);
      }

      // advance token and loop
      iTok = (iTok + 1) % tokens.length;
      if(iTok===0){ segIndex = 0; drawSkeleton(); } // restart visual sweep
      nextT += stepDur;
    }
  }, 25);

  // visual animation
  (function loop(){
    drawProgress(140);
    rafId = requestAnimationFrame(loop);
  })();

}, (A)=>{
  if(rafId){ cancelAnimationFrame(rafId); rafId=null; }
  if(intervalId){ clearInterval(intervalId); intervalId=null; }
  // AudioContext is closed in destroy(); nothing else to clean
});
```




# 5. chaos (Lorenz projection) — : deterministic yet unpredictable 
    

```dataviewjs
const W=480,H=240; const c=document.createElement('canvas'); c.width=W;c.height=H; c.style.border='1px solid #ccc'; this.container.appendChild(c);
const ctx=c.getContext('2d'); ctx.fillStyle='black'; ctx.fillRect(0,0,W,H);
let x=0.01,y=0,z=0; const a=10,b=28,c2=8/3;
function makeAudio(){ const AC=new (window.AudioContext||window.webkitAudioContext)();
  const conv=AC.createConvolver(); const L=(AC.sampleRate*1.2)|0, ir=AC.createBuffer(2,L,AC.sampleRate);
  for(let ch=0;ch<2;ch++){ const d=ir.getChannelData(ch); for(let i=0;i<L;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/L,2.3);} conv.buffer=ir;
  const comp=AC.createDynamicsCompressor(); comp.connect(conv); conv.connect(AC.destination);
  const mkVoice=(type='square',g0=0.02,f=200)=>{const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=f; g.gain.value=g0; o.connect(g).connect(comp); o.start(); return {o,g};};
  return {AC,mkVoice,destroy:async()=>{try{await AC.close();}catch{}}}
}
function addStartStop(onStart,onStop){ const b=document.createElement('button'); b.textContent='Start Audio'; b.style.margin='8px 0'; this.container.appendChild(b);
  let A=null; b.onclick=async()=>{ if(!A){A=makeAudio(); await A.AC.resume(); b.textContent='Stop Audio'; onStart&&onStart(A);} else {onStop&&onStop(A); await A.destroy(); A=null; b.textContent='Start Audio';}};}
addStartStop.call(this,(A)=>{ const v=A.mkVoice('square',0.02,200); (function step(){
  for(let i=0;i<6;i++){ const dt=0.005; const dx=a*(y-x), dy=x*(b-z)-y, dz=x*y-c2*z; x+=dx*dt; y+=dy*dt; z+=dz*dt;
    const px=(x+20)/40*W, py=(z)/50*H; ctx.fillStyle='rgba(0,255,160,0.5)'; ctx.fillRect(px,H-py,1,1); }
  v.o.frequency.value=200+z*3; requestAnimationFrame(step);
})()},(A)=>{});
```


# 6. cellular automaton (local rules) — : emergence via local interactions 
    

```dataviewjs
const W=320,H=160; const c=document.createElement('canvas'); c.width=W;c.height=H; c.style.border='1px solid #ccc'; this.container.appendChild(c);
const ctx=c.getContext('2d'); const cols=160, rows=80, s=W/cols; let grid=new Array(cols).fill(0).map(()=>Math.random()<0.5?1:0);
function rule(a,b,c){ const n=a+b+c; return (n==1)?1:0; }
function makeAudio(){ const AC=new (window.AudioContext||window.webkitAudioContext)(); const conv=AC.createConvolver();
  const L=AC.sampleRate, ir=AC.createBuffer(2,L,AC.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch); for(let i=0;i<L;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/L*3);} conv.buffer=ir;
  const comp=AC.createDynamicsCompressor(); comp.connect(conv); conv.connect(AC.destination);
  const mkVoice=(type='sawtooth',g0=0.03,f=120)=>{const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=f; g.gain.value=g0; o.connect(g).connect(comp); o.start(); return {o,g};};
  return {AC,mkVoice,destroy:async()=>{try{await AC.close();}catch{}}}
}
function addStartStop(onStart,onStop){ const b=document.createElement('button'); b.textContent='Start Audio'; b.style.margin='8px 0'; this.container.appendChild(b);
  let A=null; b.onclick=async()=>{ if(!A){A=makeAudio(); await A.AC.resume(); b.textContent='Stop Audio'; onStart&&onStart(A);} else {onStop&&onStop(A); await A.destroy(); A=null; b.textContent='Start Audio';}};}
addStartStop.call(this,(A)=>{ const v=A.mkVoice('sawtooth',0.03,120); let y=0; (function tick(){
  for(let x=0;x<cols;x++){ ctx.fillStyle=grid[x]?'#fff':'#111'; ctx.fillRect(x*s,y*(H/rows),s,H/rows); }
  const next=[]; for(let x=0;x<cols;x++){ const L=grid[(x-1+cols)%cols],C=grid[x],R=grid[(x+1)%cols]; next[x]=rule(L,C,R); }
  grid=next; y=(y+1)%rows; v.o.frequency.value=120+(grid.reduce((a,b)=>a+b,0)/cols)*200; requestAnimationFrame(tick);
})()},(A)=>{});
```


# 7. reaction–diffusion feel (cheap Gray–Scott) — : complex generative fields 
    

```dataviewjs
const W=300,H=300; const c=document.createElement('canvas'); c.width=W;c.height=H; c.style.border='1px solid #ccc'; this.container.appendChild(c);
const ctx=c.getContext('2d'); const img=ctx.createImageData(W,H); const A=new Float32Array(W*H), B=new Float32Array(W*H);
for(let i=0;i<W*H;i++){A[i]=1;B[i]=0;} for(let i=0;i<200;i++){B[(~~(Math.random()*H))*W+~~(Math.random()*W)]=1;}
function makeAudio(){ const AC=new (window.AudioContext||window.webkitAudioContext)(); const conv=AC.createConvolver();
  const L=(AC.sampleRate*1.4)|0, ir=AC.createBuffer(2,L,AC.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch); for(let i=0;i<L;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/L,2);} conv.buffer=ir;
  const comp=AC.createDynamicsCompressor(); comp.connect(conv); conv.connect(AC.destination);
  const mkVoice=(type='sine',g0=0.03,f=220)=>{const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=f; g.gain.value=g0; o.connect(g).connect(comp); o.start(); return {o,g};};
  return {AC,mkVoice,destroy:async()=>{try{await AC.close();}catch{}}}
}
function addStartStop(onStart,onStop){ const b=document.createElement('button'); b.textContent='Start Audio'; b.style.margin='8px 0'; this.container.appendChild(b);
  let A=null; b.onclick=async()=>{ if(!A){A=makeAudio(); await A.AC.resume(); b.textContent='Stop Audio'; onStart&&onStart(A);} else {onStop&&onStop(A); await A.destroy(); A=null; b.textContent='Start Audio';}};}
addStartStop.call(this,(A)=>{ const v=A.mkVoice('sine',0.03,220);
  (function loop(){ const DA=1,DB=0.5,f=0.055,k=0.062,dt=1.0;
    const lap=(F,x,y)=>F[y*W+x-1]+F[y*W+x+1]+F[(y-1)*W+x]+F[(y+1)*W+x]-4*F[y*W+x];
    for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x,a=A[i],b=B[i];
      const na=a+(DA*lap(A,x,y)-a*b*b+f*(1-a))*dt, nb=b+(DB*lap(B,x,y)+a*b*b-(k+f)*b)*dt;
      A[i]=Math.max(0,Math.min(1,na)); B[i]=Math.max(0,Math.min(1,nb));
    }
    const d=img.data; let p=0; for(let i=0;i<W*H;i++){const v=Math.floor((A[i]-B[i])*255); d[p++]=v; d[p++]=255-v; d[p++]=200; d[p++]=255;}
    ctx.putImageData(img,0,0); if(v) v.o.frequency.value=200+(B.reduce((s,x)=>s+x,0)/(W*H))*600; requestAnimationFrame(loop);
  })();
},(A)=>{});
```


# 8. flocking (self-organization) — : agent systems and emergence 
    

```dataviewjs
const W=480,H=220; const c=document.createElement('canvas'); c.width=W;c.height=H; c.style.border='1px solid #ccc'; this.container.appendChild(c);
const ctx=c.getContext('2d'); const N=80; const P=[...Array(N)].map(()=>({x:Math.random()*W,y:Math.random()*H,vx:Math.random()*2-1,vy:Math.random()*2-1}));
function makeAudio(){ const AC=new (window.AudioContext||window.webkitAudioContext)(); const conv=AC.createConvolver();
  const L=AC.sampleRate, ir=AC.createBuffer(2,L,AC.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch); for(let i=0;i<L;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/L*2.5);} conv.buffer=ir;
  const comp=AC.createDynamicsCompressor(); comp.connect(conv); conv.connect(AC.destination);
  const mkVoice=(type='triangle',g0=0.03,f=180)=>{const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=f; g.gain.value=g0; o.connect(g).connect(comp); o.start(); return {o,g};};
  return {AC,mkVoice,destroy:async()=>{try{await AC.close();}catch{}}}
}
function addStartStop(onStart,onStop){ const b=document.createElement('button'); b.textContent='Start Audio'; b.style.margin='8px 0'; this.container.appendChild(b);
  let A=null; b.onclick=async()=>{ if(!A){A=makeAudio(); await A.AC.resume(); b.textContent='Stop Audio'; onStart&&onStart(A);} else {onStop&&onStop(A); await A.destroy(); A=null; b.textContent='Start Audio';}};}
addStartStop.call(this,(A)=>{ const v=A.mkVoice('triangle',0.03,180); (function step(){
  ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(0,0,W,H);
  for(const p of P){ let cx=0,cy=0,cnt=0,sx=0,sy=0;
    for(const q of P){ if(q===p) continue; const dx=q.x-p.x,dy=q.y-p.y,d=dx*dx+dy*dy; if(d<120*120){cx+=q.x;cy+=q.y;cnt++;} if(d<20*20){sx-=dx;sy-=dy;} }
    if(cnt){ p.vx+=(cx/cnt-p.x)*0.0005; p.vy+=(cy/cnt-p.y)*0.0005; } p.vx+=sx*0.002; p.vy+=sy*0.002;
    p.x=(p.x+p.vx+W)%W; p.y=(p.y+p.vy+H)%H; ctx.fillStyle='#7fffd4'; ctx.fillRect(p.x,p.y,2,2);
  }
  const d = P.reduce((a,p)=>a+Math.hypot(p.vx,p.vy),0)/N; v.o.frequency.value=180+d*40; requestAnimationFrame(step);
})()},(A)=>{});
```


# 9. evolutionary palette (artist-in-the-loop) — : evolutionary systems, human selection 
    

```dataviewjs
const W=480,H=120; const c=document.createElement('canvas'); c.width=W;c.height=H; c.style.border='1px solid #ccc'; this.container.appendChild(c);
const ctx=c.getContext('2d'); const POP=8; let gen=[...Array(POP)].map(()=>[...Array(5)].map(()=>`hsl(${~~(Math.random()*360)},70%,50%)`));
function render(){ ctx.clearRect(0,0,W,H); gen.forEach((pal,i)=> pal.forEach((col,j)=>{ ctx.fillStyle=col; ctx.fillRect(i*(W/POP)+j*(W/POP/5),0,(W/POP/5),H);})); }
function evolve(i){ const base=gen[i]; const kids=[base]; while(kids.length<POP){ kids.push(base.map(c=>{ const h=(parseInt(c.match(/\d+/)[0])+(Math.random()*60-30)+360)%360; return `hsl(${h},70%,50%)`; })); } gen=kids; render(); }
function makeAudio(){ const AC=new (window.AudioContext||window.webkitAudioContext)(); const conv=AC.createConvolver();
  const ir=AC.createBuffer(2,AC.sampleRate,AC.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch); for(let i=0;i<ir.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/ir.length*3);} conv.buffer=ir;
  const comp=AC.createDynamicsCompressor(); comp.connect(conv); conv.connect(AC.destination);
  const mkVoice=(type='sine',g0=0.02,f=220)=>{const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=f; g.gain.value=g0; o.connect(g).connect(comp); o.start(); return {o,g};};
  return {AC,mkVoice,destroy:async()=>{try{await AC.close();}catch{}}}
}
function addStartStop(onStart,onStop){ const b=document.createElement('button'); b.textContent='Start Audio'; b.style.margin='8px 0'; this.container.appendChild(b);
  let A=null; b.onclick=async()=>{ if(!A){A=makeAudio(); await A.AC.resume(); b.textContent='Stop Audio'; onStart&&onStart(A);} else {onStop&&onStop(A); await A.destroy(); A=null; b.textContent='Start Audio';}};}
addStartStop.call(this,(A)=>{ A.mkVoice('sine',0.02,220); render(); },(A)=>{});
c.onclick=(e)=>{ const i=Math.floor(e.offsetX/(W/POP)); evolve(i); };
```


# 10. functional autonomy (parameterized machine) — : authorship vs autonomy axis 
    

```dataviewjs
const W=480,H=200; const c=document.createElement('canvas'); c.width=W;c.height=H; c.style.border='1px solid #ccc'; this.container.appendChild(c);
const ctx=c.getContext('2d'); let seed=Math.random()*1e6|0; function rnd(){seed^=seed<<13; seed^=seed>>>17; seed^=seed<<5; return ((seed>>>0)%1e9)/1e9;}
function makeAudio(){ const AC=new (window.AudioContext||window.webkitAudioContext)(); const conv=AC.createConvolver();
  const L=(AC.sampleRate*1.2)|0, ir=AC.createBuffer(2,L,AC.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch); for(let i=0;i<L;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/L,2.2);} conv.buffer=ir;
  const comp=AC.createDynamicsCompressor(); comp.connect(conv); conv.connect(AC.destination);
  const mkVoice=(type='sawtooth',g0=0.03,f=110)=>{const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=f; g.gain.value=g0; o.connect(g).connect(comp); o.start(); return {o,g};};
  return {AC,mkVoice,destroy:async()=>{try{await AC.close();}catch{}}}
}
function addStartStop(onStart,onStop){ const b=document.createElement('button'); b.textContent='Start Audio'; b.style.margin='8px 0'; this.container.appendChild(b);
  let A=null; b.onclick=async()=>{ if(!A){A=makeAudio(); await A.AC.resume(); b.textContent='Stop Audio'; onStart&&onStart(A);} else {onStop&&onStop(A); await A.destroy(); A=null; b.textContent='Start Audio';}};}
addStartStop.call(this,(A)=>{ A.mkVoice('sawtooth',0.03,110); (function draw(){
  ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.fillRect(0,0,W,H);
  for(let i=0;i<50;i++){ const x=rnd()*W, y=rnd()*H, r=3+rnd()*20; ctx.fillStyle=`hsl(${rnd()*360},60%,60%)`; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }
  requestAnimationFrame(draw);
})()},(A)=>{});
```



