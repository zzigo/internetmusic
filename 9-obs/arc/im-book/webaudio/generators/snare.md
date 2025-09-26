# Snare

To synthesize a snare we need to emulate the rattling of the snare wires. This can be done by creating a noise burst effect.&#x20;

We will use the technique called the **random number generator.**

**T**he `createBufferSource` method Interface is used to create a new `AudioBufferSourceNode`, which can be used to play audio data contained within an AudioBuffer object. This allows us to fill in the buffer with any code and content we want.

While .`createBufferSource` is the interface that represents the in-memory audio data(in a kinda stochastic way!) .`createBuffer` is the Interface being used.

To create an empty AudioBuffer object `.createBuffer (channels,length, sampleRate )`

&#x20;**channels**: integer with the number of channels (1-32)&#x20;

&#x20;**length**: An integer representing the size of the buffer of  nsample-frames (where each sample-frame is the size of a sample in bytes multiplied by numOfChannels). To determine the length to use for a specific number of seconds of audio, use numSeconds \* sampleRate.&#x20;

**sampleRate** (linear audio data in sample-frames per second) supported by modern browsers ( 8,000 Hz to 96,000 Hz)

{% embed url="https://replit.com/@jsmusic/generators04-snare#index.html" %}
