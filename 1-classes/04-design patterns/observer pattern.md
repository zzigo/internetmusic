#designpattern 

as applied in [[05-im1-fmsynth]]

This pattern is fundamental to how your application responds to user input.

- **What it is:** The Observer pattern defines a one-to-many dependency between objects. When one object (the "subject" or "observable") changes state, all its dependents ("observers") are notified and updated automatically.
    
- **How it's used here:** The browser's event system is a native implementation of this pattern.
    
    - **Subject:** The `window` object.
    - **Observers:** Your event handler functions (`handlePointerMove` and the anonymous function for `pointerdown`).
    - **Notification:** When the user moves the pointer or touches the screen, the `window` (subject) "notifies" your handler functions (observers) by invoking them with an event object.
    
    Your code subscribes to these notifications with `window.addEventListener(...)`, and the handlers react by updating the synth parameters and the HUD.
    