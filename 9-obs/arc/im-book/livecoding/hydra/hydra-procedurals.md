# Hydra procedurals

### Audio

To start to work with audio we will use the function a.&#x20;

The first step is to visualize the audioinput using this command:

```
a.show() //shows audio input
a.hide() //hides audio input
```

#### a.fft\[]

By applying a Fast Fourier Transform we convert the audio signal into the frequency domain, and apply this value to any other. `a.fft` use lowest sound value (bass freqs). a.fft gives normalize value between 0 and 1,  availablie in 4 different frequency bands: a.fft\[0],  a.fft\[1], a.fft\[2] and a.fft\[3]

The basic code snippet is&#x20;

```
()=>(a.fft[0]*4)
```

Just let experiment with the multiplier value in order to arrive to the proper value-range depending on the synth-chain you're working on

```
shape(3,() => a.fft[0]).out() // audio input controls shape's size
```

```
shape(4).color(0,0,1).scale( () => a.fft[0] *2 ).out(o0)
  shape(5).color(1,0,1).scale( () => a.fft[1] *2 ).out(o1)
  shape(6).color(0,1,1).scale( () => a.fft[2] *2 ).out(o2)
  shape(7).color(0.5,0,1).scale( () => a.fft[3] *2 ).out(o3)
  render()
```

```
a.setSmooth (0.9) //add this command above the previous code
```

#### Audio and Mouse together

```
a.show();
a.setBins(3);

shape( 3 )
.rotate(

  () => Math.PI * mouse.x / 180

)
.repeatX( 30 )
.repeatY( 30 )
.scale(
  () => a.fft[0]*4
)
.out( o0 );
  a.setSmooth (0.9);
;
render(o0);
```

### Screen

```
s0.initScreen()

src(s0)
    .invert()
    .blend(o0,0.94)
    .modulate(o0, 20)
    .out()
```

### WebCam

```
s0.initCam()
src(s0).saturate(2).contrast(1.3).layer(src(o0).mask(shape(4,2).scale(0.5,0.7).scrollX(0.25)).scrollX(0.001)).modulate(o0,0.001).out(o0)
```



### **MIDI (experimental)**

MIDI controllers can work with Hydra via WebMIDI an example workflow is at [/docs/midi.md](https://github.com/ojack/hydra/blob/master/docs/midi.md) .

```java
// register WebMIDI RUN ON THE CONSOLE
navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
    console.log(midiAccess);
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;
    for (var input of midiAccess.inputs.values()){
        input.onmidimessage = getMIDIMessage;
    }
}

function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}

//create an array to hold our cc values and init to a normalized value
var cc=Array(128).fill(0.5)

getMIDIMessage = function(midiMessage) {
    var arr = midiMessage.data    
    var index = arr[1]
    //console.log('Midi received on cc#' + index + ' value:' + arr[2])    // uncomment to monitor incoming Midi
    var val = (arr[2]+1)/128.0  // normalize CC values to 0.0 - 1.0
    cc[index]=val
}
```

#### **Hydra script**

Now that these controls have been assigned to the cc\[] array, we can start using them in Hydra. As we've normalized the values 0-1 we can use as-is with most functions or quickly remap them with various math.

```java
// example midi mappings - Korg NanoKontrol2 CCs

// color controls with first three knobs
noise(4).color( ()=>cc[16], ()=>cc[17], ()=>cc[18] ).out()

// rotate & scale with first two faders
osc(10,0.2,0.5).rotate( ()=>(cc[0]*6.28)-3.14 ).scale( ()=>(cc[1]) ).out()
```

### hydra+tone.js

```java
await loadScript("<https://unpkg.com/tone>")

synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n");
```

### hydra+three.js

```java
await loadScript("<https://threejs.org/build/three.js>")

scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
geometry = new THREE.BoxGeometry()
material = new THREE.MeshBasicMaterial({color: 0x00ff00})
cube = new THREE.Mesh(geometry, material);
scene.add(cube)
camera.position.z = 1.5

// 'update' is a reserved function that will be run every time the main hydra rendering context is updated
update = () => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render( scene, camera );
}

s0.init({ src: renderer.domElement })

src(s0).repeat().out()
```
