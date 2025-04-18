---
cover: >-
  https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2970&q=80
coverY: 0
description: fundamentals before enter into coding
---

# special characters

{% hint style="info" %}
computer code is full of acronyms. To access to a full list of them go to the \[Glossary]. \
\
JS -> Javascript
{% endhint %}

## important characters in javascript

### ;   Semicolon

&#x20;JS does not strictly require them.  when there is a place where a semicolon is needed, the parser will add it behind the scenes. Code looks cleaner but be careful, it can produce some uncaught type errors.

### \[ ] Square brackets

Are mostly used to define arrays

```
["Violin","Viola","Violoncello"]
```

### {} curly brackets (the object 'creator')

In unix curly brackets are placeholders for output text. In the case of JS, they are used to pass **objects** to variables and functions. Also, they are used to combine a set of statements in a **block**:

```
{"a": 1, "b": 2}
```

### `<> Angle brackets or chevrons`

are used in UI Pages for HTML tags

```
<html>
<body>
<p>hello sound</p>
</body>
</html>
```

### ' " \` single, double quotes and backticks

* Quotes are used to enclose strings.
* The three of them can be used indistinctly, from the technical point of view they are the same thing.

```
'crescendo' === "crescendo" === `crescendo`
```

* The decision is more stylistic and depends on the configuration of the keyboard according to your language.
* According to common practice, it is more usual to use `'` in javascript, `"` in JSON and `` ` `` in [template literals](special-characters.md#template-literales) or for block's separation.&#x20;
* A double-quoted string can have single quotes without escaping them, conversely, a single-quoted string can have double quotes within it without having to escape them.

```
var partitas = "Bach's well-known collection of instrumental pieces"
var partitas = 'Bach\'s well-known "collection" of instrumental pieces'
```

* `'` is easier if you wish to write html within javascript, but they are not accepted in JSON.
* A double-quoted string can have single quotes without escaping them, conversely, a single-quoted string can have double quotes within it without having to escape them.

#### &#x20;template literals

Using backticks `` ` `` in  template literals, you are able to make use of the syntactic sugar, making substitutions like this more readable:

```
let crotchet = 60;
let quaver = 120;
console.log(`Semiquaver is ${quaver * 2} and not ${crochet  + quaver} 
```

{% hint style="success" %}
### **Try this!**

A first secret to enter into code is to practice the location of all these special character on your keyboard as if you were playing a Bach fugue!\
\
{}{}{}\[] <><><>"" "" {} ({}{}) <> <> ( \[ { } ] ) ;\
{ ( ) } { ( \[ ] ) } ;\
" ' { ( ) } ' ";
{% endhint %}

