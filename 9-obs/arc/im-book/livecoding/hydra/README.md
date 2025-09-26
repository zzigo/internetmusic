---
description: By Olivia Jack
---

# Hydra

Hydra is inspired by modular synthesis where each module performs a specific operation and the inputs and outputs of various modules are interconnected to produce more complex results than a single module can perform.

{% embed url="https://vimeo.com/316214052" %}
Sandin Image Processor (1977) one of the influences of Hydra
{% endembed %}



Modular synths are generally **generators** (VCO, controlled voltage oscillator) or **modulators** (VCF, voltage-controlled filter).

In hydra, this logic is followed and each function can be seen as a video synthesis module.

Conceptually, Hydra is fundamentally based on two technical principles: the use of [WebRTC](webrtc.md) and feedback.

{% hint style="info" %}
a strange recursion  between video-feedback and experimental music: the two video-feedback pionners Steina and Woody Vasulka founded The Kitchen in 1970
{% endhint %}

### Important shortcuts

| shortcut  | function              |   |
| --------- | --------------------- | - |
| ⌃+⇧+Enter | Run the full code     |   |
| ⌃+Enter   | Run the selected line |   |
| ⌃+⇧+H     | Hide/Show code        |   |
| ⌃+⇧+S     | Take a screenshot     |   |

{% hint style="success" %}
Reference of all functions in Hydra:\
[https://github.com/hydra-synth/hydra/blob/main/docs/funcs.md](https://github.com/hydra-synth/hydra/blob/main/docs/funcs.md)\
\

{% endhint %}

### &#x20;Hydra from scratch

1. Go to  [https://hydra.ojack.xyz/](https://hydra.ojack.xyz) (check the important short-cuts above!)
2. Erase the demo code both selecting and erasing or pressing the trash-can (upper right bar)
3. Connect a generator with the output\


```
osc().out()
```

4\. Now connect a modulator in between the source and the output, for example a `rotate` function.

```
osc().rotate().out()
```

5.Connect another generator, for example the webcam to a buffer.

```
s0.initCam()
```

6\. Add a modulator between the generator and the output, in this case a kaleidoscope function `kaleid().`

```
src(s0).kaleid(4).out()
```

Here we say : use the buffer s0 as source, connect it to the kaleid operator with 4 faces as argument, and finally to the output.

7\. Use lists instead of a static number (written as arrays) to make arguments dynamic.

```
src(s0).kaleid([1,2,4,8,16])
```

8\. You can also control the speed with `fast()`

```
src(s0).kaleid([1,2,4,8,16].fast(10))
```

9\. Try another generator like `voronoi()`

{% hint style="info" %}
`A` **voronoi** is a pattern very found in nature, from mud dries to giraffes spots and also bubbles). Best way to explain voronoi in a simple way is describing  how bubbles squish together getting the same pattern based on where the bubbles touch.  The voronoi has three main components: the sites (average center), the segments (equidistant to the sites) and the nodes (the vertices equtan to three or more sites).
{% endhint %}
