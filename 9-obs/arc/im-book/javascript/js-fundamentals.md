---
description: These are a collection of snippets just to get fun on the browser
---

# js-fundamentals

open the console ⌘+⇧+J

erase the console ⌘+K&#x20;

copy the snippet and try out things!

#### webAudio&#x20;

```jsx
var audioContext = new AudioContext(); 
var osc = audioContext.createOscillator(); osc.type = "sawtooth"; 
osc.frequency.value = 100;
osc.connect(audioContext.destination); 
osc.start();
osc.stop(audioContext.currentTime + 1)
```

#### list all scripts in a webpage

```jsx
[].forEach.call( document.querySelectorAll("script[src]"), function( src ) { 
      console.log( src ); 
    });
```

#### envelopes in WA \[codegolfing style]

```
var o,e,dr,d=document,w=window,b=d.createElement("button"),c=new AudioContext(),wv=w.innerWidth,hv=w.innerHeight;b.id='b';b.style.width=wv;b.style.height=hv;d.body.appendChild(b);b.innerText="PLAY";d.body.style.display='flex';d.body.style.background='lightgrey'
b.addEventListener("click",()=>{o=c.createOscillator();e=c.createGain();dr=1.5;o.frequency.value=200;o.type='sine';e.gain.value=1
o.connect(e);e.connect(c.destination);o.start(c.currentTime);e.gain.exponentialRampToValueAtTime(0.000001,c.currentTime+dr)
setTimeout(()=>o.stop(c.currentTime),dr*10000);})
```

{% embed url="https://replit.com/@jsmusic/cg-tone" %}
