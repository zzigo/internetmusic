# js-variables



1. Variables in JS are untype

```jsx
// Values can be assigned to variables with an = sign 

x = 0; // Now the variable x has the value 0
x.  // => 0: A variable evaluates to its value

// JavaScript supports several types of values 

x = 1; // Numbers.
x = 0.01; // Numbers can be integers or reals.
x = "hello world"; // Strings of text in quotation marks.
x = 'JavaScript'; // Single quote marks also delimit strings.
x = true; // A Boolean value.
x = false; // The other Boolean value.
x = null; // Null is a special value that means "no value."
x = undefined; // Undefined is another special value like null. 
```

Since the update ES6 (2015) there are new features to declare variables. We have the new options `let` and `const`, added to the old `var`

Each of its specificities will be defined by its scope, use, and hoisting.

#### One Statement, Many Variables

You can declare many variables in one statement.

```jsx
var person = "John Doe", carName = "Volvo", price = 200;
```

#### var

What is a scope?

Scope means where these variables are available for use. **var** declarations area globally scoped or function/locally scoped.

* global: when a **var** is declared outside a function. So, when a var is declared outside a function (or a block) is available for use in the whole window.

```jsx
var tonality = "C Major" ;

function section1() {
	var modulation = "Eb Major";
}
```

Here, `tonality` is globally scoped because it exits outside a function while `modulation` is function scoped. So we cannot access the variable `modulation` outside of a function .

*   var variables can be re-declared and updated

    ```jsx
    var tonality = "C Major";
    var tonality = "Gb Major";

    or

    var tonality = "C Major";
    tonality = "Gb Major";
    ```

#### Hoisting

Is a JavaScript mechanism where variables and functions declarations are moved to the top of their scope before code execution. This means that if we do this:

```jsx
console.log (tonality);
var tonality = "C Major"; 
```

it is interpreted as this:

```jsx
var tonality;
console.log (tonality); // still undefined
tonality = "C Major";
```

#### let

\<aside> ⭕ Variables defined with `let` cannot be Redeclared.

Variables defined with `let` must be Declared before use.

Variables defined with `let` have Block Scope.

\</aside>

Is now preferred for variable declaration. Its an improvement to `var` declarations and solve many problems.

*   `let` is block scoped

    * A block is a chunk of code bounded by {}. A block lives in curly braces: function, for, while, if..then..else, switch case, arrays.
    * A variable declared in a block with `let` is only available for use within that block.

    ```jsx
    let greeting = "say Hi";
       let times = 4;

       if (times > 3) {
            let hello = "say Hello instead";
            console.log(hello);// "say Hello instead"
        }
       console.log(hello) // hello is not defined
    	
    if {
    }

    for {

    }
    ```

We see that using `hello` outside its block (the curly braces where it was defined) returns an error. This is because `let` variables are block-scoped.

**let can be updated but not re-declared.**

Just like `var`, a variable declared with `let` can be updated within its scope. Unlike `var`, a `let` variable cannot be re-declared within its scope. So while this will work:

```jsx
let greeting = "say Hi";
    greeting = "say Hello instead";
```

this will return an error:

```jsx
let greeting = "say Hi";
    let greeting = "say Hello instead"; // error: Identifier 'greeting' has already been declared
```

#### const

\<aside> ⭕ Variables defined with `const` cannot be Redeclared.

Variables defined with `const` cannot be Reassigned.

Variables defined with `const` have Block Scope.

\</aside>

```jsx
const PI = 3.141592653589793;
PI = 3.14;      // This will give an error
PI = PI + 10;   // This will also give an error
```

Variables declared with the `const` maintain constant values. `const` declarations share some similarities with `let` declarations.

*   **const declarations are block-scoped**

    Like `let` declarations, `const` declarations can only be accessed within the block they were declared.
*   **const cannot be updated or re-declared**

    This means that the value of a variable declared with `const` remains the same within its scope. It cannot be updated or re-declared. So if we declare a variable with `const`, we can neither do this:

    ```jsx
        const greeting = "say Hi";
        greeting = "say Hello instead";// error: Assignment to constant variable.
    ```

    nor this:

    ```jsx
        const greeting = "say Hi";
        const greeting = "say Hello instead";// error: Identifier 'gre
    ```

    Every `const` declaration, therefore, must be initialized at the time of declaration.

    This behavior is somehow different when it comes to objects declared with `const`. While a `const` object cannot be updated, the properties of this object can be updated. Therefore, if we declare a `const` object like this:

    ```jsx
        const greeting = {
            message: "say Hi",
            times: 4
        }
    ```

    while we cannot do this:

    ```jsx
        greeting = {
            words: "Hello",
            number: "five"
        } // error:  Assignment to constant variable.
    ```

    we can do this:

    ```jsx
        greeting.message = "say Hello instead";
    ```

    This will update the value of `greeting.message` without returning errors.

