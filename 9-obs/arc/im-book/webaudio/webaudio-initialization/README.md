# webaudio initialization

### 01. basic configuration

```
var actx = new AudioConext(); //create audiocontext
oscillator = actx.createOscillator();
oscillator.connect(context.destination); //first connection
oscillator.start(context.currentTime); //start the WA thread

```

{% embed url="https://codepen.io/LucianoAzzigotti/pen/vYZeENd?editors=0012" %}
webaudio tes-tone
{% endembed %}
