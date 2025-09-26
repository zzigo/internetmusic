# Hydra Generators

## graph generators

| generator                 | example                                                                                                      | description |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------- |
| osc(freq,sync,rgbsynch)   | <pre><code>osc().add(o1).out()</code></pre>                                                                  |             |
| solid(r,g,b)              |                                                                                                              |             |
| noise()                   | <pre><code>noise().out()</code></pre>                                                                        |             |
| gradient()                |                                                                                                              |             |
| shape(sides,scale,border) | <pre><code>shape(3).out(o0)
//
shape([3,4,5].fast(50)).rotate([1,2,3,4,5,6].fast(100)).out(o0)
</code></pre> |             |
| voronoi()                 |                                                                                                              |             |
|                           |                                                                                                              |             |
|                           |                                                                                                              |             |
|                           |                                                                                                              |             |
|                           |                                                                                                              |             |
|                           |                                                                                                              |             |
|                           |                                                                                                              |             |
|                           |                                                                                                              |             |
|                           |                                                                                                              |             |
|                           |                                                                                                              |             |
| noise()                   |                                                                                                              |             |

## input generators

| generator      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webcam         | s0.initCam() src(s0).saturate(2).contrast(1.3).layer(src(o0).mask(shape(4,2).scale(0.5,0.7).scrollX(0.25)).scrollX(0.001)).modulate(o0,0.001).out(o0)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| desktop screen | s0.initScreen() src(s0).out()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| streaming      | <p>pb.setName("myScreen")<br>//in the other window<br>s0.initStream("myScreen")<br>//render to screen</p><pre><code>s0.initStream("myGraphics")
src(s0).out()</code></pre>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| tone.js        | <p></p><pre><code>await loadScript("https://unpkg.com/tone")

synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n");</code></pre>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| p5             | <p></p><pre><code>// Initialize a new p5 instance It is only necessary to call this once
p5 = new P5() // {width: window.innerWidth, height:window.innerHeight, mode: 'P2D'}

// draw a rectangle at point 300, 100
p5.rect(300, 100, 100, 100)

// Note that P5 runs in instance mode, so all functions need to start with the variable where P5 was initialized (in this case p5)
// reference for P5: https://P5js.org/reference/
// explanation of instance mode: https://github.com/processing/P5.js/wiki/Global-and-instance-mode

// When live coding, the "setup()" function of P5.js has basically no use; anything that you would have called in setup you can just call outside of any function.

p5.clear()

for(var i = 0; i &#x3C; 100; i++){
  p5.fill(i*10, i%30, 255)
  p5.rect(i*20, 200, 10,200)
}

// To live code animations, you can redefine the draw function of P5 as follows:
// (a rectangle that follows the mouse)
p5.draw = () => {
  p5.fill(p5.mouseX/5, p5.mouseY/5, 255, 100)
  p5.rect(p5.mouseX, p5.mouseY, 30, 150)
}

// To use P5 as an input to hydra, simply use the canvas as a source:
s0.init({src: p5.canvas})

// Then render the canvas
src(s0).repeat().out()</code></pre> |

