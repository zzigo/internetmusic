# canvas

The \<canvas> element is used to draw graphics on a web page. It has its very own methods, very similar to any drawing software: lines, paths, boxes, text, circles, arcs, and images.&#x20;

In order to create a canvas follow these steps:



1. create the HTML element and specify the size&#x20;

```
<canvas id="myCanvas" width="600" height="360"></canvas>
```

2\. In Javascript create a variable containing the binding to the element and the context also.&#x20;

```
<script>
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
</script>
```

3\. Give some drawing elements&#x20;

```
ctx.moveTo (0,0) //indicate the starting point;
```

{% hint style="warning" %}
The HTML canvas is a two-dimensional grid that works with cartesian coordinates.

The upper-left corner has  (0,0) coordinates and lower-right the (100%,100%) values defined in the width,height HTML element's atributes.
{% endhint %}

{% embed url="https://codepen.io/LucianoAzzigotti/pen/dyRdYbQ" %}

{% hint style="success" %}
**Try this!**\
****\
****1. Create a 5-lines staff with title, instrument-name, and two pitches
{% endhint %}

solution:

{% embed url="https://codepen.io/LucianoAzzigotti/pen/vYWYOzV" %}

{% hint style="info" %}
to know more about the For...Next method used here go to[js-loops](js-loops.md)
{% endhint %}
