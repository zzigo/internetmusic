# generators

So let's create our first instrument.

> [!tip]
> Make a simple instrument with performative-interaction and WA Generators\
>remember these two programming-flow questions:
>**1. What I want the performer do?
>2. What happens with that action?**


3. As an initial formula, we can summarize that a web instrument consists of a **representation**, an **interface**, and a **sound** action.
4. In the beginning, the representation and the interface will be the same object.;
5. Each stage will have a specific code and specific bindings between them.;
6. Along the way, we will start from a very raw code, to understand the fundamentals of JS, which will become more synthetic and encapsulated with the use of libraries.;


5.For representation-interface we will use the \<button\</button> HTML element

6.For binding the buttons to JS we will use the method:

```
document.getElementById("kick")
```

7\. To listen to user interaction:

```
<buttonTarget>.addEventListener ("click", () => { <codeToPlay> })
```

This is a tricky step. The method addEventListener triggers an arrow [function](js-functions.md) that is  called whenever the event is delivered. The definition of the event is  the`"click"` part of the code. So the basic syntaxis is:

```
addEventListener(type, function);
```

8\. Inside the addEventListener triggered function the WA code is hosted.;

9\. Finally we set a list of generators: sine oscillator, square oscillator, a white noise buffer being played in two instances, and a bass drum emulator made of a freq-ramp-oscillator. For a detailed description of each generator go to the next section.

