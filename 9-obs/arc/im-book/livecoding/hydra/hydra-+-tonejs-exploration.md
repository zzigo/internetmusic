# Hydra + ToneJS exploration

## 1. Sync between ToneJS , H & p5

```cpp

//init p5 and toneJS libs inside hydra
p1 = new P5()
await loadScript("https://unpkg.com/tone")

//var declare [L]
var number = 0

//FM synth 
synth = new Tone.FMSynth().toDestination();

//create a class seq which loop hydra & toneJS functions
seq = new Tone.Sequence ((time,note) => {

//trigger the tJS synth in eighteen notes in proportion with time
synth.triggerAttackRelease(note, "8n",time);

//convert pitch notation into midivalues - shift to absolute octave
number = (Tone.Midi(note).toMidi())-60;

//p5 text kind of console
p1.background(0);
p1.hide()
p1.textSize(300);
p1.fill(255);
p1.text(number,20,p1.displayHeight-200); 

//hydra loop
osc(number*10).kaleid(number).out();

},["C4", ["C#5", "D6", "D#5"], "E4", ["F5", "F#6"]]).start(0);

//p5 rendering
s1.init({src: p1.canvas}) 
src(s1).out(o3)

//tonejs transport setup
Tone.Transport.start();
Tone.Transport.bpm.value = 60;

//hydra rendering
render()
```

## 2. Using the toneJS part object

```cpp

//init p5 and toneJS libs inside hydra
p1 = new P5()
await loadScript("https://unpkg.com/tone")

//BPM
Tone.Transport.bpm.value = 150

const AMinorScale = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const SoundObj1 = ["C4", "E4", "A4"];  
const SoundObj2 = ["F4", "D4", "C4"];  



//create materials organized in time
const material = [
  {'time':0, 'note': SoundObj1, 'duration': '2n.'},
  {'time':'0:3', 'note': SoundObj2, 'duration':'4n'},
   {'time':'1:0', 'note': SoundObj2, 'duration':'2n'},
   {'time':'1:3', 'note': SoundObj1, 'duration':'4n'},
  ];

 //create synth1
  const synth1 = new Tone.PolySynth(Tone.Synth, {
  activeVoices: 5,
  volume: -5,
  oscillator : {
		type : "sawtooth"
	}
}).toMaster();
  
//create a class Part which loop hydra & toneJS functions
seq = new Tone.Part ((time,note) => {
  						synth1.triggerAttackRelease(note.note, note.duration,time);
  					//hydra loop
  shape(3).add(osc(1,Math.random(),1), 1)
	.add(o1, () => (Math.sin(time/4) * 0.7 + 0.1))
	//.repeat(5)
  	.scale(()=>Math.sin(time / 16)).rotate(0, -0.1)
	.out(o1)

src(o1)
  .rotate(0,0.1)
  .out()
					//end hydra
  
  //p5
  //convert pitch notation into midivalues - shift to absolute octave
var number = (Tone.Midi(note.note[0]).toMidi())-60;
//p5 text kind of console
p1.background(0);
p1.hide()
p1.textSize(300);
p1.fill(255);
p1.text(number,20,p1.displayHeight-200); 

  //end p5
									}
                     ,material).start(0);

//p5 rendering
s1.init({src: p1.canvas}) 
src(s1).out(o3)

//tonejs transport setup
Tone.Transport.start();

//hydra rendering
render(o0)
```