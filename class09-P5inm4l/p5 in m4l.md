
A simple solution for interfacing "patches" created in [MaxMSP/Jitter](https://cycling74.com/) and "sketches" written in [P5*js](https://p5js.org/). The solution uses the [jweb] object from MaxMSP to load P5*js sketch, and for bidirectional communication (messaging and sharing Max dictionaries) between MaxMSP patch holding the [jweb] object with the loaded sketch. Licensed under the Simplified BSD License.

P5js sketch (as any HTML/JavaScript document loaded inside jweb) can communicate with Max. Max can call functions from P5js sketches. P5js sketch can read/write content of Max dictionaries and send messages to Max.

However, there is a namespace conflict between Max API binded to the "window" object (accessible from within jweb) and P5js API binded by default to the same object (in so called "global mode").

There are several methods to circumvent this problem, and one of the simpler ones (requiring editing only the "sketch.js" file) is using P5js in so called "instance mode". Look at the code in the "sketch.js" file attached to this example to see how to prevent the namespaces conflict and how to effectively interact with P5js sketches inside jweb object.

For more informations about differences between "global" and "instance" modes of the P5js look at the "p5.js overview" document (available at [https://github.com/processing/p5.js/wiki/p5.js-overview](https://github.com/processing/p5.js/wiki/p5.js-overview)). For more information about communication between Max patcher and content loaded jweb object check the "Communicating with Max from within jweb" document (part of Max documentation).