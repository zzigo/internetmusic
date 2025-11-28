

```dataviewjs
// Minimal Web Audio toggle — single sine oscillator
const b=document.createElement('button'); b.textContent='▶ start'; this.container.appendChild(b);
let a=null,o=null;

b.onclick=async()=>{
  if(!a){
    a=new (window.AudioContext||window.webkitAudioContext)(); //polyfill
    await a.resume();
    o=a.createOscillator();
    o.type='sine';
    o.frequency.value=220;
    o.connect(a.destination);
    o.start();
    b.textContent='■ stop';
  }else{
    o.stop();
    await a.close();
    a=null;o=null;
    b.textContent='▶ start';
  }
};
```

```html
<!DOCTYPE html>
<html>
<body>
<button id="b">▶ start</button>

<script>
let a=null,o=null;

document.getElementById("b").onclick=async()=>{
  if(!a){
    a=new (window.AudioContext||window.webkitAudioContext)();
    await a.resume();
    o=a.createOscillator();
    o.type='sine';
    o.frequency.value=220;
    o.connect(a.destination);
    o.start();
    b.textContent='■ stop';
  }else{
    o.stop();
    await a.close();
    a=null;o=null;
    b.textContent='▶ start';
  }
};
</script>
</body>
</html>
```

## concepts

1. **Variable declaration:** `let a=null,o=null;` — creates two variables for AudioContext and Oscillator, initialized as null to check state later.  
2. **Element creation:** `document.createElement('button')` — dynamically creates an HTML button node in the DOM.  
3. **Property assignment:** `b.textContent='▶ start';` — sets visible text of the button element.  
4. **DOM insertion:** `this.container.appendChild(b);` — inserts button into the current DataviewJS container inside Obsidian.  
5. **Event binding:** `b.onclick=async()=>{...}` — assigns an asynchronous function to handle button click events.  
6. **Conditional creation:** `if(!a){...}` — checks if AudioContext `a` is not yet created.  
7. **Polyfill instantiation:** `a=new (window.AudioContext||window.webkitAudioContext)();` — creates a new AudioContext, using legacy prefix if necessary.  
8. **Context resume:** `await a.resume();` — ensures AudioContext starts after user interaction per browser policy.  
9. **Oscillator creation:** `o=a.createOscillator();` — creates an OscillatorNode inside the audio graph.  
10. **Waveform type:** `o.type='sine';` — selects waveform shape (sine, square, sawtooth, triangle).  
11. **Frequency assignment:** `o.frequency.value=220;` — sets oscillator base frequency in Hertz (A3).  
12. **Graph connection:** `o.connect(a.destination);` — routes oscillator output to the final audio destination (speakers).  
13. **Start node:** `o.start();` — begins sound generation immediately at current context time.  
14. **UI feedback:** `b.textContent='■ stop';` — updates button label to reflect running state.  
15. **Stop branch:** `else{...}` — defines alternative behavior when AudioContext already exists.  
16. **Node termination:** `o.stop();` — halts oscillator waveform production gracefully.  
17. **Context close:** `await a.close();` — releases AudioContext resources and audio hardware thread.  
18. **State reset:** `a=null;o=null;` — clears variables to indicate inactive audio engine.  
19. **UI reset:** `b.textContent='▶ start';` — restores button label to start state.  
20. **Arrow function syntax:** `()=>{}` — defines compact, lexical-scope function expressions.  
21. **Logical OR fallback:** `(window.AudioContext||window.webkitAudioContext)` — selects available constructor, ensuring cross-browser support.  
22. **Await operator:** `await` — pauses async function until the promise (like context resume) resolves.  
23. **Comment notation:** `//` — single-line comment explaining code purpose or behavior.  
24. **Equality negation:** `!a` — logical NOT operator used to test absence of AudioContext.  
25. **Property chain:** `a.createOscillator()` — method call on an object to instantiate a node.  
26. **Chained connection:** `o.connect(a.destination)` — links nodes forming signal routing graph.  
27. **Dynamic UI control:** combining DOM and audio state into one reactive toggle.  
28. **Browser policy compliance:** resuming context after gesture to satisfy autoplay restrictions.  
29. **Memory management:** closing and nullifying context prevents multiple active contexts.  
30. **Event-driven architecture:** execution triggered by user interaction, not continuous script execution.



## async function

An async function lets you use the keyword **await** inside it to pause execution **until a Promise resolves** — without blocking the main thread.
In DataviewJS (Obsidian), this is essential for working with APIs like **Web Audio**, **fetch**, or **file IO**, since these operations are asynchronous by design.

1. async function getData() automatically wraps its return value in a **Promise**.
2. await fetch(...) pauses _inside_ that function until the HTTP request finishes.
3. The rest of Obsidian’s interface stays responsive — no blocking.
4. Once the Promise resolves, .then(...) receives the returned text.

```dataviewjs
// async function version
async function getData() {
  // fetch() returns a Promise that resolves with a Response
  const r = await fetch("https://api.github.com/zen");
  const t = await r.text(); // wait until response text arrives
  return t;
}

// Use it
const p = document.createElement('p');
p.textContent = "Loading...";
this.container.appendChild(p);

getData().then(txt => p.textContent = txt);
```


## != non=async

```dataviewjs
// without async/await
function getData() {
  return fetch("https://api.github.com/zen")
    .then(r => r.text())
    .then(t => t);
}

const p = document.createElement('p');
p.textContent = "Loading...";
this.container.appendChild(p);

getData().then(txt => p.textContent = txt);
```


### differences 

- Uses **Promise chaining** with .then() instead of await.
- Harder to read when there are multiple asynchronous steps.
- Does the same job — but async/await syntax is cleaner and closer to sequential thinking.



- **async** always returns a **Promise**, even if you return a simple value.
- **await** only works **inside** an async function.
- Code _after_ await runs only after the Promise resolves.
- Without async, you must handle results with .then() or .catch() manually.

