---
description: "a basic introduction to Yotam Mann's toneJS library"
---

# toneJS fundamentals

{% embed url="https://replit.com/@jsmusic/helloToneJS#index.html" %}

##

{% hint style="danger" %}
IMPORTANT

in order to avoid the error "Invoke user interaction" add this enclosing the tone.js code:
{% endhint %}

```
//attach a click listener to a play button
document.querySelector('#play')?.addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
	
	//tone.js code goes here
	
	}

```

### Make a note

```jsx
const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n");
```

### Oscillator with ADSR envelope

```jsx
const synth = new Tone.Synth().toDestination();
const now = Tone.now() // is 0 on page loading, equal to AudioContext.currentTime

synth.triggerAttack("C4", now)
// wait 1 second after attack
synth.triggerRelease(now + 1)
```

### **triggerAttack / triggerRelease**

`triggerAttack` start with increasing amplitude pitch, and `triggerRelease` goes to 0 amplitude  (note off)

```jsx
const synth = new Tone.Synth().toDestination();
const now = Tone.now()
synth.triggerAttackRelease("C4", "8n", now)
synth.triggerAttackRelease("E4", "8n", now + 0.5)
synth.triggerAttackRelease("G4", "8n", now + 1)
```

### **triggerAttackRelease**

`triggerAttackRelease` combines `triggerAttack` with `triggerRelease`

The first argument is the pitch in  Hertz or D#2

The second one, is the duration in seconds or proportional notation

Third argument is when `triggerAttackRelease` is played.

```jsx
setInterval(() => console.log(Tone.now()), 100);
```

Check this to show the seconds of the scheduler.

## **Starting Audio**

**IMPORTANT**: Run Tone.js after calling`Tone.start()` with a  "click" or "keydown".

```jsx
document.querySelector('button')?.addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
})
```

## **Scheduling**

#### **Transport**

Tone.Transport can be started,stopped, looped and adjusted in realTime,  unlike AudioContext

Tone.Loop is a  loop.

```jsx
// crea dos sintes mono
const synthA = new Tone.FMSynth().toDestination();
const synthB = new Tone.AMSynth().toDestination();

const loopA = new Tone.Loop(time => {
	synthA.triggerAttackRelease("C2", "8n", time);
}, "4n").start(0);

const loopB = new Tone.Loop(time => {
	synthB.triggerAttackRelease("C4", "8n", time);
}, "4n").start("8n"); //starts after the synthA

Tone.Transport.start()
```

### Tone.Transport, scheduleOnce, scheduleRepeat

```jsx
// schedule an event on the 16th measure
Tone.Transport.schedule((time) => {
	// invoked on measure 16
	console.log("measure 16!");
}, "16:0:0");
```

```jsx
schedule (
callback:TransportCallback,
The callback to be invoked at the time.

time:TransportTime|TransportTimeClass
The time to invoke the callback at.

) => number
The id of the event which can be used for canceling the event.
```

## **Instruments**

[Tone.FMSynth](https://tonejs.github.io/docs/FMSynth), [Tone.AMSynth](https://tonejs.github.io/docs/AMSynth) y [Tone.NoiseSynth](https://tonejs.github.io/docs/NoiseSynth) (monophonic)

[Tone.PolySynth](https://tonejs.github.io/docs/PolySynth) (`triggerRelease` must be an array of pitches)

```jsx
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
const now = Tone.now()
synth.triggerAttack("D4", now);
synth.triggerAttack("F4", now + 0.5);
synth.triggerAttack("A4", now + 1);
synth.triggerAttack("C4", now + 1.5);
synth.triggerAttack("E4", now + 2);
synth.triggerRelease(["D4", "F4", "A4", "C4", "E4"], now + 4);
```

## **Samples**

[Tone.Player](https://tonejs.github.io/docs/Player) loads an audio

```jsx
const player = new Tone.Player("<https://tonejs.github.io/audio/berklee/gong_1.mp3>").toDestination();
Tone.loaded().then(() => {
	player.start();
});
```

[Tone.Sampler](https://tonejs.github.io/docs/Sampler)

```jsx
const sampler = new Tone.Sampler({
	urls: {
		"C4": "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		"A4": "A4.mp3",
	},
	baseUrl: "<https://tonejs.github.io/audio/salamander/>",
}).toDestination();

Tone.loaded().then(() => {
	sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 0.5);
})
```

### **Signals**

```jsx
const osc = new Tone.Oscillator().toDestination();

osc.frequency.value = "C4";

osc.frequency.rampTo("C5", 2)
```


---
jiwon

2 pieces
piano piece based on a film attached by to the piano
