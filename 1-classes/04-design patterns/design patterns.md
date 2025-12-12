---
theme: moon
type: class
tags:
  - designpattern
---

<grid drag="60 55" drop="5 10" bg="black" align="left">
![|200](https://i.imgur.com/N8z2xP4.png)
# Design Patterns in Software Architecture
### Origins and Evolution (1994)
</grid>

<grid drag="-5 10" drop="5 -10" bg="black">
<span style="display: flex; align-items: center; gap: 15px;">
  <b>Internet Music 25/26 C10</b>
</span>
</grid>

<grid drag="25 55" drop="-5 10" bg="black" align="top">
→ Origins of Design Patterns<br>
→ Categorization: Creational, Structural, Behavioral<br>
→ Focus: Mediator Pattern<br>
</grid>

---


check > https://refactoring.guru/design-patterns/memento

---

# Origins of Design Patterns (1994)

Design patterns are **formalized best practices** addressing recurring problems in software design. They provide **abstract solutions** that are reusable across various contexts, promoting modularity, scalability, and maintainability. The concept of design patterns was popularized by the **"Gang of Four"** (Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides) with their landmark book:  
**"Design Patterns: Elements of Reusable Object-Oriented Software" (1994).** 

<mark class="hltr-green">Design patterns abstract common problems into reusable solutions.</mark>  
<mark class="hltr-green">They promote modularity and scalability in software systems.</mark>  
<mark class="hltr-green">Patterns are categorized into creational, structural, and behavioral types.</mark>  

---

# Theoretical Foundations

The foundational theories behind design patterns lie in their ability to **encapsulate complex interactions** within a system. They can be divided into **three categories**, each addressing a different aspect of software architecture:

<mark class="hltr-blue">Creational patterns manage object instantiation.</mark>  
<mark class="hltr-blue">Structural patterns organize object composition.</mark>  
<mark class="hltr-blue">Behavioral patterns define object interaction protocols.</mark>  

---

## Creational Patterns

Creational patterns deal with **object creation mechanisms**, enhancing flexibility and reuse by abstracting the process of object instantiation.

### Examples:
- **Singleton Pattern:** Ensures a class has only one instance with a global access point.  
- **Factory Pattern:** Provides an interface for creating objects without specifying their exact classes.  
- **Prototype Pattern:** Clones existing objects instead of creating new ones.  

---

## Structural Patterns

Structural patterns focus on **object composition**, describing how objects and classes can be combined to form larger, flexible structures.

### Examples:
- **Adapter Pattern:** Converts the interface of a class into an interface expected by clients.  
- **Decorator Pattern:** Dynamically adds behavior to objects without altering their structure.  
- **Facade Pattern:** Provides a simplified interface to a complex subsystem.  

---

## Behavioral Patterns

Behavioral patterns manage **communication between objects**, defining protocols for interactions.

### Examples:
- **Observer Pattern:** Allows objects to notify other objects about state changes.  
- **Strategy Pattern:** Defines a family of algorithms, encapsulates each, and makes them interchangeable.  
- **State Pattern:** Allows an object to alter its behavior when its internal state changes.  

---

# The Mediator Pattern (Behavioral)

The **Mediator Pattern** addresses complex communications by **encapsulating object interactions** within a mediator object, promoting loose coupling by eliminating direct references between components.

---

### **Motivation:**  
When objects communicate directly, the interdependencies can become overwhelming. A mediator simplifies this by centralizing the communication logic.

---
### **Implementation:**
```python
# Example Python implementation of Mediator Pattern
class Mediator:
    def notify(self, sender, event):
        pass

class ConcreteMediator(Mediator):
    def __init__(self, component1, component2):
        self._component1 = component1
        self._component2 = component2
        self._component1.mediator = self
        self._component2.mediator = self

    def notify(self, sender, event):
        if event == "A":
            print("Mediator reacts on A and triggers operation B.")
            self._component2.do_b()
        elif event == "B":
            print("Mediator reacts on B and triggers operation A.")
            self._component1.do_a()

class Component:
    def __init__(self, mediator=None):
        self._mediator = mediator

    @property
    def mediator(self):
        return self._mediator

    @mediator.setter
    def mediator(self, mediator):
        self._mediator = mediator

class Component1(Component):
    def do_a(self):
        print("Component 1 does A.")
        self.mediator.notify(self, "A")

class Component2(Component):
    def do_b(self):
        print("Component 2 does B.")
        self.mediator.notify(self, "B")

component1 = Component1()
component2 = Component2()
mediator = ConcreteMediator(component1, component2)

component1.do_a()
component2.do_b()

```


---

# Design Patterns in Software Architecture

Design patterns are formalized best practices that address recurring problems in software design. They serve as templates for solving specific issues, enabling developers to create systems that are modular, scalable, and maintainable. These patterns are not tied to a specific programming language or framework but rather provide abstract solutions that can be adapted across various contexts. The concept of design patterns was popularized by the seminal work of the "Gang of Four" (Gamma et al., 1994), who categorized them into three primary types: creational, structural, and behavioral.

---

<mark class="hltr-green">Design patterns abstract common problems into reusable solutions.</mark>  
<mark class="hltr-green">They promote modularity and scalability in software systems.</mark>  
<mark class="hltr-green">Patterns are categorized into creational, structural, and behavioral types.</mark>

---

## Theoretical Foundations

The theoretical underpinnings of design patterns lie in their ability to encapsulate complex interactions within a system. Creational patterns focus on object creation mechanisms, aiming to make systems independent of how their objects are created. Structural patterns deal with object composition or the way objects are assembled into larger structures. Behavioral patterns address the interaction between objects and the distribution of responsibilities among them.

---

For instance, the **Singleton Pattern** (a creational pattern) ensures that a class has only one instance while providing a global point of access to it. This is particularly useful in scenarios where a single shared resource must be managed efficiently (Gamma et al., 1994). Similarly, the **Adapter Pattern** (a structural pattern) allows incompatible interfaces to work together by converting the interface of one class into another that clients expect.

---

<mark class="hltr-blue">Creational patterns manage object instantiation.</mark>  
<mark class="hltr-blue">Structural patterns organize object composition.</mark>  
<mark class="hltr-blue">Behavioral patterns define object interaction protocols.</mark>

---

## Application in Modern Web Development

In modern web development, design patterns play a crucial role in managing complexity. For example, the **Observer Pattern** is widely used in event-driven architectures like React.js or Angular. This pattern allows an object (the subject) to notify other objects (observers) about state changes without tightly coupling them.

---

Consider a scenario where multiple UI components need to update when data changes. The Observer Pattern enables these components to subscribe to data changes and react accordingly without requiring direct dependencies between them.

---


```python
# Example Python implementation of Observer Pattern
class Subject:
    def __init__(self):
        self._observers = []

    def attach(self, observer):
        self._observers.append(observer)

    def notify(self):
        for observer in self._observers:
            observer.update(self)

class Observer:
    def update(self, subject):
        pass

class ConcreteObserver(Observer):
    def update(self, subject):
        print("State updated:", subject.state)

subject = Subject()
observer = ConcreteObserver()
subject.attach(observer)
subject.state = "New State"
subject.notify()
```



This modular approach ensures that changes in one part of the system do not cascade unpredictably across others.

## Research Questions

1. **Fundamental Question**: How do design patterns contribute to reducing cognitive load for developers when designing complex systems?  
2. **Interdisciplinary Question**: Can principles from architectural design (e.g., Christopher Alexander's *A Pattern Language*) be applied directly to software design?  
3. **Speculative Question**: What new categories of design patterns might emerge with advancements in quantum computing or AI-driven development?

---

## References

```bibtex
@book{gamma1994design,
  title={Design Patterns: Elements of Reusable Object-Oriented Software},
  author={Gamma, Erich and Helm, Richard and Johnson, Ralph and Vlissides, John},
  year={1994},
  publisher={Addison-Wesley}
}

@article{alexander1977pattern,
  title={A Pattern Language},
  author={Alexander, Christopher},
  year={1977},
  publisher={Oxford University Press}
}
```




---



**1. Singleton Pattern (Managing Global State)**

  

Ensures a single instance of a sound manager exists across your application.

```
class SoundManager {
    constructor() {
        if (SoundManager.instance) return SoundManager.instance;
        this.sounds = {};
        SoundManager.instance = this;
    }
    load(name, src) {
        const audio = new Audio(src);
        this.sounds[name] = audio;
    }
    play(name) {
        this.sounds[name]?.play();
    }
}
const soundManager = new SoundManager();
soundManager.load("click", "click.mp3");
soundManager.play("click");
```

  

---

**2. Observer Pattern (Event Handling System)**

  

Manages event subscriptions, commonly used in animation trigger systems.

```
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, listener) {
        (this.events[event] || (this.events[event] = [])).push(listener);
    }
    emit(event, data) {
        (this.events[event] || []).forEach(listener => listener(data));
    }
}

const emitter = new EventEmitter();
emitter.on('animationStart', () => console.log("Animation started"));
emitter.emit('animationStart');
```

  

---

**3. Command Pattern (Audio Control)**

  

Encapsulates audio actions as objects allowing undo/redo or queued playback.

```
class AudioCommand {
    constructor(audio) {
        this.audio = audio;
    }
    execute() {
        this.audio.play();
    }
    undo() {
        this.audio.pause();
    }
}

const audio = new Audio('background.mp3');
const playCommand = new AudioCommand(audio);
playCommand.execute();  // Plays the audio
playCommand.undo();     // Pauses the audio
```

  

---

**4. State Pattern (Interactive Animations)**

  

Manages animation states based on user interaction.

```
class AnimationState {
    constructor() {
        this.state = "idle";
    }
    setState(state) {
        this.state = state;
        console.log(`State changed to: ${state}`);
    }
}

const animation = new AnimationState();
animation.setState("running");  // Triggers animation start
animation.setState("paused");   // Pauses animation
```

  

---

**5. Strategy Pattern (Sound Effect System)**

  

Dynamically chooses sound effects based on interaction type.

```
class ClickSound {
    play() { console.log("Playing click sound"); }
}
class HoverSound {
    play() { console.log("Playing hover sound"); }
}

class SoundPlayer {
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    play() {
        this.strategy.play();
    }
}

const player = new SoundPlayer();
player.setStrategy(new ClickSound());
player.play();  // Output: Playing click sound
player.setStrategy(new HoverSound());
player.play();  // Output: Playing hover sound
```

  

---

**6. Decorator Pattern (Extending Animations)**

  

Dynamically adds new behaviors to existing animations.

```
class BasicAnimation {
    render() {
        console.log("Rendering base animation");
    }
}

class WithSoundEffect {
    constructor(animation) {
        this.animation = animation;
    }
    render() {
        this.animation.render();
        console.log("Playing sound effect");
    }
}

const animation = new BasicAnimation();
const decoratedAnimation = new WithSoundEffect(animation);
decoratedAnimation.render();
```

  

---

**7. Factory Pattern (Generating Animations and Sounds)**

  

Creates various animation and sound objects without specifying the exact class.

```
class AnimationFactory {
    static create(type) {
        if (type === "fade") return new FadeAnimation();
        if (type === "slide") return new SlideAnimation();
        return null;
    }
}

class FadeAnimation {
    play() { console.log("Playing fade animation"); }
}

class SlideAnimation {
    play() { console.log("Playing slide animation"); }
}

const anim = AnimationFactory.create("fade");
anim.play();
```

  

---

**8. Mediator Pattern (Centralized Interaction System)**

  

Manages interaction between various modules like audio, animation, and UI.

```
class InteractionMediator {
    constructor() {
        this.components = {};
    }
    register(name, component) {
        this.components[name] = component;
    }
    notify(sender, event) {
        if (event === "click") this.components["sound"].play();
    }
}

class SoundComponent {
    play() { console.log("Playing sound"); }
}

const mediator = new InteractionMediator();
const sound = new SoundComponent();
mediator.register("sound", sound);
mediator.notify(null, "click");
```

  

---

**9. Flyweight Pattern (Optimizing Sound Effects)**

  

Shares common sound resources instead of creating new ones repeatedly.

```
class SoundEffect {
    constructor(file) {
        this.audio = new Audio(file);
    }
    play() {
        this.audio.play();
    }
}

class SoundFactory {
    constructor() {
        this.sounds = {};
    }
    getSound(file) {
        if (!this.sounds[file]) this.sounds[file] = new SoundEffect(file);
        return this.sounds[file];
    }
}

const soundFactory = new SoundFactory();
const clickSound = soundFactory.getSound("click.mp3");
clickSound.play();
```

  

---

**10. Chain of Responsibility Pattern (Interaction Pipelines)**

  

Passes requests along a chain of objects to determine the proper handler.

```
class Handler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handle(request) {
        if (this.nextHandler) return this.nextHandler.handle(request);
        return null;
    }
}

class AnimationHandler extends Handler {
    handle(request) {
        if (request === "animation") {
            console.log("Handling animation");
            return true;
        }
        return super.handle(request);
    }
}

class SoundHandler extends Handler {
    handle(request) {
        if (request === "sound") {
            console.log("Handling sound");
            return true;
        }
        return super.handle(request);
    }
}

const animationHandler = new AnimationHandler();
const soundHandler = new SoundHandler();

animationHandler.setNext(soundHandler);
animationHandler.handle("sound");
```


  