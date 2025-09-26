# buffers

A buffer is a bunch of samples of digital audio in memory. Its length depends on the sample-rate an desired time (SR\*Time = sampleSize).\
\
We need to know three things about buffers:

1. How to **fill** a buffer with raw data (we already did it on the [Snare](snare.md) experiment)
2. How to **load** a sample (wav, ogg, local or remote)
3. And how to **play** it  (linear or granular)

### Raw Generation

How we already did, using filters, formulas  and random number generators you can get the typical noise-types. There  is a great [article](https://noisehack.com/generate-noise-web-audio-api/#demo) and [lib](https://github.com/zacharydenton/noise.js) by Zachary Denton covering the topic extensively.

### How to Load a Sample

#### WebAudio  method

To load a sample on a buffer you need to use the fetch method, use the decodeAudioData method to fill the arrayBuffer, pass the arrayBuffer to a BufferSource method, and finally play that source... too complicated!&#x20;

{% embed url="https://replit.com/@jsmusic/buffers01#index.html" %}
playing a buffer with WA :sob:
{% endembed %}

#### Howler.js

Howler is a very light audio-lib that get solve a lot of issues in cross-platform apps.&#x20;



Here we create an instance of `Howl` (the Howler meta Function) ,assign a source (`src`:) and invoke the method .`play()` et voilà

```
var sound = new Howl({
  src: ['sound.mp3']
});

sound.play();
```

{% embed url="https://replit.com/@jsmusic/wa-04-textfieldbuffer#index.html" %}

On this textbuffer example we are also using two other technologies, the **textarea** HTML element**,** and **text-parsing.**  This method is one of the most interesting on the web dealing with the keyboard, search-engine performative logic and regExp(). We will retake all of this on further modules. Check [textarea](textarea.md) for more info.

### Tone.js Method&#x20;

See[ A Synth app](a-synth-app.md)



