```js
// Create a new SpeechSynthesisUtterance instance
let utterance = new SpeechSynthesisUtterance("Hello! This is an example of text-to-speech in JavaScript.");

// Optional: Set voice properties
utterance.lang = 'en-US'; // Language
utterance.pitch = 1;      // Pitch (default is 1, range is 0 to 2)
utterance.rate = 1;       // Rate of speech (default is 1, range is 0.1 to 10)
utterance.volume = 1;     // Volume (default is 1, range is 0 to 1)

// Speak the text
window.speechSynthesis.speak(utterance);
```
