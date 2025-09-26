# js-functions

### Function hello world

A function in JavaScript is similar to a procedure—**a set of statements that performs a task or calculates a value**, but for a procedure to qualify as a function, it should take some input and return an output where there is some obvious relationship between the input and the output.

It's important to note that there are no classes in JavaScript. Functions can be used to somewhat simulate classes but in general, JavaScript is a class-less language. Everything is an object. And when it comes to inheritance, objects inherit from objects, not classes from classes as in the "class"-ical languages.

```jsx
function effectsBox(input) {

    return input * 2;

}

console.log(effectsBox(120)); // Output 240

//_____________________________________

function effectsBox(input, multiplier) {

    return input * multiplier;
}

console.log(effectsBox(120, 2)); // Output 240

//________________________________________

var add = function(a, b) {
    return a + b;
};

var container = add(2, 3);
console.log(container); // 5
```

### 1.5.2 instances

```jsx
var audioContext = new AudioContext(); //___Initializes web audio api

function playOsc(oscType, freq) {
    var osc = audioContext.createOscillator();
    osc.type = oscType;
    osc.frequency.value = freq; //____freq is a parameter
    osc.connect(audioContext.destination);
    osc.start(audioContext.currentTime);
}

playOsc("sine", 330); //____Plays oscillator at 330hz

/*____We can play multiple oscillators at once using only
one line of code each time! Adding another sine at 340 will
create a pulsating effect*/

playOsc("sine", 340);
```

{% embed url="https://replit.com/@jsmusic/functions01#index.html" %}
function applied to WebAudio API
{% endembed %}

### 1.5.3 Arguments

```jsx
function playOsc(oscType, freq) {
    console.log(arguments[0]);
    console.log(arguments[1]);
}
playOsc("sine", 200); // sine 200
```

### 1.5.4 Throw

```jsx
function playOsc(oscType, freq) {
    if (arguments.length !== 2) {
        throw "Error! This function takes two arguments ";
    }
}

playOsc("sine"); //___Error! This function takes two arguments

//
function playOsc(oscType, freq) {
    if (arguments.length !== 2) {
        throw "Error! This function takes two arguments";
    }
    //_____Check for correct argument data types
    if (typeof oscType !== "string" || typeof freq !== "number") {
        throw "Please enter the correct argument types";
    }
}
playOsc(100, true); //___Please enter the correct argument types
```

### 1.5.5 callback

```jsx
"use strict";

function doStuff(callback) {
    return callback();
}

function addTwoNumbers() {
    return 2 + 2;
}
doStuff(addTwoNumbers); // 4

//_________________________________________
"use strict";

function doStuff(callback) {

    return callback();

}

doStuff(function() { //___Callback declaration is used directly

    return 3 + 3;

});

//______________________________________________

"use strict";

function calculateFrequencies(a, b, callback) {
    if (callback === undefined) {
        return a * b;
    } else {
        return callback(a, b);
    }
}

function diff(a, b) {
    return Math.abs(a - b);
}

console.log(calculateFrequencies(200, 2)); // 400___Multiplies numbers
console.log(calculateFrequencies(1000, 4000, diff)); // 3000___uses custom callback to find the difference
```

### 1.5.6 Types of functions and function scoping

#### Anonymous functions

```jsx
// When used as a function expression
(function () {});
// or using the ECMAScript 2015 arrow notation
() => {};
```

#### named functions

```jsx
// Function declaration
function foo() {};
// Named function expression
(function bar() {});
// or using the ECMAScript 2015 arrow notation
const foo = () => {};
```

#### inner outer functions

```jsx
function addSquares(a,b) {
   function square(x) {
      return x * x;
   }
   return square(a) + square(b);
};
//Using ECMAScript 2015 arrow notation
const addSquares = (a,b) => {
   const square = x => x*x;
   return square(a) + square(b);
};
```

1. IIFE \[immediately invoked function expression]
   1.  is a js function that runs as soon as it is defined. 1.

       ```jsx
       (function () {
         statements
       })();
       ```
2.  arrow function expression



    ```jsx
    const materials = [
      'Hydrogen',
      'Helium',
      'Lithium',
      'Beryllium'
    ];

    console.log(materials.map(material => material.length));
    // expected output: Array [8, 6, 7, 9]
    ```
3.  function declaration vs function expression vs arrow function

    ```jsx
    // function declaration
    function sayHiStranger() {
      return 'Hi, stranger!'
    }

    //function expression
    const sayHiStranger = function () {
      return 'Hi, stranger!'
    }

    //arrow function 
    const sayHiStranger = () => 'Hi, stranger'

    //parens free syntax
    const favoriteSeries = seriesName => seriesName === "Bridgerton" ? "Let's watch it" : "Let's go out"
    // call the function
    console.log(favoriteSeries("Bridgerton"))
    // output: "Let's watch it"
    ```

### Classes or Functions?

* In js there is no classes, are only used conceptually to describe the practice of creating functions, an analogy.
  * In class-based inheritance, you create a class (a "blueprint") and then instantiate objects from the class.
  * A class is a template of the object that will be created at instantiation.
  * The term class is usually used in an object-oriented programming language context
*   The important concept here is the _prototype_:

    * In JavaScript, prototypes are created as functions.
    * Prototype was an idea in the middle '80, or a style ob OOP in which behavior reuse (inheritance) is performed via a process of reusing existing objects (the prototypes)
    * This way of thinking in objects is also known as prototypal, prototype-oriented, classless, instance-based programming.

    > You make prototype objects, and then … make new instances. Objects are mutable in JavaScript, so we can augment the new instances, giving them new fields and methods. These can then act as prototypes for even newer objects. We don't need classes to make lots of similar objects… Objects inherit from objects. What could be more object oriented than that? \[Douglas Crockford]
* JS treats _functions_ as first-class objects, so being an object, you can assign properties to a function.
* Hoisting is the JS interpreter's action of moving all variables and functions declarations to the top of the current scope.
* A function is a behavior that can carry data while, inversely, a class is data that can carry behavior.
