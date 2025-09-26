# mouse

### Static mouse position

We are using the element canvas. Canvas is used to draw graphics on a web page via Javascript. We will use it to track the mouse activity. To know more about it, go to [Canvas](canvas.md).\


To catch the mouse activity we are using an **HTML DOM event** called _**onclick**_, but the problem is that there is no continuous information and we only know the mouse position on the click event.

{% embed url="https://replit.com/@jsmusic/mouse01#index.html" %}
remember to press click to get the coordinates
{% endembed %}

### Dynamic mouse position

In this case, we've changed the **HTML DOM EVENT** from _**onclick**_ to _**onmousemove**_, triggering the function `mouseActivity`() which takes the `clientX,Y` properties showing mouse's coordinates.

Just to experiment we added another HTML DOM EVENT called _**onmouseout**_ that trigger the function `clearCoor()` once the mouse is outside the canvas. It will erase the content of the onScreenConsole.

{% embed url="https://replit.com/@jsmusic/mouse02#index.html" %}

### Mouse position with _addEventListener_ method

We have another option to control the mouse activity through the **document** object. Due the [Hoisting](js-hoisting.md) we don't need to put the function prior to the others.&#x20;

In this case, the mouse coordinates are no longer limited to the canvas area but to the whole document.&#x20;

This is useful for [Theremin](gallery.md) app,  since is dealing with the fullscreen type defined by CSS as we will see in the next step.

{% embed url="https://replit.com/@jsmusic/mouse03#index.html" %}

### Controlling sound with mouse

The creation of the **Oscillator** depends on the activity of the mouse. This can be ordered into a programming flowchart answering always these 2 questions:&#x20;

****\
**1. What I want the user do?,**&#x20;

**2. What happens with that action?**&#x20;

Almost always this is the order that structures the folding and dependencies between events and functions. In this case:&#x20;

1\. When the mouse is pressed-down, trigger `playRandomOscillator()`

The Method `setTargetAtTime` schedules the start of a gradual change to some value.&#x20;

The format is  `.setTargetAtTime(target,startTime,timeConstant);`&#x20;

`target` in this case is the frequency value&#x20;

`startTime` is when the transition begins

`timeConstant` value, given in seconds, of an exponential approach to the target value. The larger this value is, the slower the transition will be.

{% embed url="https://replit.com/@jsmusic/mousesound04#index.html" %}
