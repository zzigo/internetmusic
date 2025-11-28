
```dataviewjs
// Minimal Mixolydian random-walk melody with robust Stop (fixed display + sound)
const b=document.createElement('button'); b.textContent='▶ start'; this.container.appendChild(b);
const l=document.createElement('span'); l.style.marginLeft='10px'; l.textContent='—'; this.container.appendChild(l);

let a=null,t=null,r=false;            // AudioContext, timeout id, running flag
const V=[];                           // active voices
const R=220;                          // root A3
const S=[0,2,4,5,7,9,10];             // Mixolydian semitones
let i=0;                              // current degree

const hz=n=>R*Math.pow(2,n/12);       // pitch class -> Hz

function note(){
  if(!r||!a) return;

  // random step -1,0,+1 with boundary reflection
  i += [-1,0,1][(Math.random()*3)|0];
  if(i<0) i=1; if(i>=S.length) i=S.length-2;

  const d=0.12+Math.random()*0.38;    // seconds
  const f=hz(S[i]);

  // voice
  const o=a.createOscillator(), g=a.createGain();
  o.type='sine'; o.frequency.value=f;
  l.textContent=Math.round(f)+' Hz';
  g.gain.setValueAtTime(0,a.currentTime);
  g.gain.linearRampToValueAtTime(0.12,a.currentTime+0.01);
  g.gain.exponentialRampToValueAtTime(1e-4,a.currentTime+d*0.9);
  o.connect(g).connect(a.destination);
  o.start(); o.stop(a.currentTime+d);
  V.push({o,g});

  // cleanup this voice after it ends
  setTimeout(()=>{ try{o.stop();}catch{} try{g.disconnect();}catch{} }, d*1000+10);

  // schedule next note if still running
  t=setTimeout(()=>{ if(r) note(); }, d*1000);
}

b.onclick=async()=>{
  if(!a){
    a=new (window.AudioContext||window.webkitAudioContext)(); await a.resume();
    r=true; i=0; b.textContent='■ stop'; note();
  }else{
    r=false; if(t){clearTimeout(t); t=null;}
    while(V.length){ const v=V.pop(); try{v.o.stop();}catch{} try{v.g.disconnect();}catch{} }
    await a.close(); a=null; b.textContent='▶ start'; l.textContent='—';
  }
};
```









## concepts 

## Concept list — Web Audio Random Walk Melody (DataviewJS)

1. **Button creation:** dynamically creates a start/stop HTML button inside the DataviewJS container.  
2. **AudioContext variable:** `a` holds the Web Audio processing environment, initialized as null.  
3. **Scheduler variable:** `t` stores a timeout reference to control note timing.  
4. **Root frequency:** `R=220` defines the tonal center (A3 in Hz).  
5. **Mixolydian scale array:** `S=[0,2,4,5,7,9,10]` represents semitone intervals relative to the root.  
6. **Index tracking:** `i` marks the current position in the scale array.  
7. **Frequency conversion:** `hz(n)` converts semitone offset `n` into frequency using `R*Math.pow(2,n/12)`.  
8. **Random step generation:** chooses −1, 0, or +1 to move within the scale (a discrete random walk).  
9. **Boundary reflection:** ensures the walker bounces back when reaching array limits.  
10. **Random duration:** computes note length with random value between 0.12 s and 0.5 s.  
11. **Oscillator creation:** `a.createOscillator()` generates a sine tone per note.  
12. **Gain envelope:** `createGain()` shapes amplitude for soft attack and exponential decay.  
13. **Envelope timing:** uses `setValueAtTime`, `linearRampToValueAtTime`, and `exponentialRampToValueAtTime` for dynamics.  
14. **Signal chain:** connects oscillator → gain → audio destination (speakers).  
15. **Node scheduling:** `o.start()` begins tone; `o.stop(a.currentTime+d)` stops after duration.  
16. **Recursive scheduling:** `setTimeout(note,d*1000)` calls the function again after each note’s duration.  
17. **Asynchronous control:** button’s `onclick` uses `async` to safely `await a.resume()` after user gesture.  
18. **Toggle state:** same button starts and stops playback depending on current context.  
19. **Cleanup:** `clearTimeout(t)` stops further note scheduling when user stops playback.  
20. **Context destruction:** `await a.close()` fully releases the AudioContext to avoid leaks in Obsidian.  
21. **UI feedback:** button text toggles between “▶ start” and “■ stop” to reflect state.  
22. **Discrete-time sequencing:** uses variable delays rather than fixed metronome for more organic rhythm.  
23. **Procedural melody generation:** no stored score; melody emerges from algorithmic state and randomness.  
24. **Mixolydian modality:** choice of 7-step pattern introduces major scale color with lowered 7th degree.  
25. **Low-level synthesis:** each note uses raw Web Audio primitives without external libraries.  
26. **Non-blocking timing:** scheduling relies on JavaScript event loop rather than busy waiting.  
27. **Minimalism:** avoids global scope pollution and external dependencies; pure DataviewJS execution.  
28. **Autonomy:** melody evolves indefinitely until user stops playback.  
29. **Reproducible randomness:** behavior could be seeded by Math.random() replacement if determinism needed.  
30. **Human–machine feedback:** integrates stochastic logic with simple UI for experimental composition study.



## on-liner random-walk

```js
  i += [-1,0,1][Math.floor(Math.random()*3)];
```

 very compact **array expression** being used as a **lookup table**, not an object.

### **
1. [-1, 0, 1]
    → This is a literal **array** containing three numbers.
    It’s just like const steps = [-1, 0, 1];.
    
2. Math.random() * 3
    → Generates a floating-point number between 0 and <3.
3. Math.floor(...)
    → Rounds that down to an integer: 0, 1, or 2.
    
4. [-1,0,1][that_integer]
    
    → Indexes the array:
    - index 0 → -1
    - index 1 → 0
    - index 2 → +1
1. i += ...
    → Adds that random step to i.


means Add randomly −1, 0, or +1 to i.

### **Equivalent verbose form**

```
const steps = [-1, 0, 1];
const randomIndex = Math.floor(Math.random() * steps.length);
i = i + steps[randomIndex];
```

