#designpattern 
![](https://i.imgur.com/bVe2kag.png)

**Singleton** is a creational design pattern that lets you ensure that a class has only one instance, while providing a global access point to this instance.


This is one of the most prominent patterns in [[05-im1-fmsynth]], specifically in how the `AudioContext` and `FMSynth` are managed.

- **What it is:** The Singleton pattern ensures that a **[[class]]** has only one instance and provides a global point of access to it.
    
- **How it's used here:** Your `toggleAudioEngine` function is the gatekeeper.
    
    - It checks `if (!audioCtx)`.
    - If the `audioCtx` (and by extension, the `fmSynth`) doesn't exist, it creates it.
    - If it _does_ exist, it reuses the existing instance (e.g., by calling `audioCtx.resume()` or `fmSynth.turnOn()`).
    
    This logic guarantees that you never accidentally create multiple audio contexts or synthesizers, which would be inefficient and could lead to conflicting audio outputs.
    