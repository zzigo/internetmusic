#designpattern

as applied in [[05-im1-fmsynth]]

The `FMSynth` class is a perfect example of the Facade pattern.

- **What it is:** A Facade provides a simplified, higher-level interface to a complex subsystem of components. It hides the internal complexity from the client.
- **How it's used here:** The Web Audio API is quite complex. You have to create individual nodes (`OscillatorNode`, `GainNode`), connect them in a specific graph, and manage their parameters.
    - The `FMSynth` class encapsulates all of this complexity.
    - Instead of manually manipulating a carrier oscillator, a modulator oscillator, and a gain node, the rest of your code can simply call easy-to-understand methods like `fmSynth.setCarrierFrequency(value)`, `fmSynth.turnOn()`, and `fmSynth.turnOff()`.
    - This makes the main application logic in functions like `updateFMFromPointer` much cleaner and more readable.


### Summary

In essence, your application is structured like this:

- The **Observer** pattern listens for user input.
- The event handlers then use the **Facade** (`FMSynth` class) to translate that input into simple audio commands.
- The **Singleton** pattern ensures that there is only one central audio engine (`AudioContext` and `FMSynth` instance) for the Facade to command.

This is a very effective and common combination of patterns for building interactive web applications, especially those involving complex subsystems like the Web Audio API.