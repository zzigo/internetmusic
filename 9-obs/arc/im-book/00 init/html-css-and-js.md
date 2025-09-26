# HTML, CSS & JS

Due to the nature of this course, we will not go through each of these languages in detail. Rather, we will try to introduce the different concepts when we can directly apply them to musical thinking. However, here you will find essential information for coding simple applications.

Nevertheless, pay attention to this basic information, the concepts developed during the modules, and the integrations groups at the end of this book.

#### What is what?

&#x20;While HTML defines the **structure** of web content, CSS  describes a web page's **appearance** and JS its **functionality** or behavior.

### &#x20;HTML

HTML stands for the hypertext markup language, is the standard by which we create documents for the WWW, originally created by Berners-Lee in 1991.  From the philosophical view, is a declarative language (describing what you want to do but not how you do it). In essence, HTML organizes a series of **elements.** When you load a webpage there is a first element that transforms all the rest elements into **objects.** This meta-object (or interface) is called DOM (Document Object Model) and defines the **properties**, **methods,** and **events** of all HTML elements.

#### Basic structure

```
<html>
    <head>
    </head>
        <style>
            <!-- css code -->
    <body>
            <!-- html code -->
        <script>
            //javascript code
        </script>
    </body>
</html

```

{% hint style="info" %}
Comments!\
****\
****Commenting on code is essential to document what the code does, especially in collaborative environments. When a line or block is "commented out" its content will be ignored by the browser.\


In most editors just select the text you want to comment on and press:

\
⌘**+c  <- Universal shortcut for comments**

****\
**or manually:**

CSS ->  /\*  this is a comment  \*/\
HTML -> \<!-- this is a comment -- >\
JS ->      // this is a comment\
JS block -> /\*&#x20;

&#x20;                           this is a block comment

&#x20;                    \*/

&#x20;
{% endhint %}

### CSS

Is the acronymous for "Cascade Style Sheet" Basically is a set of rules describing how HTML elements are displayed on some graphic destination (screen, paper, or other media).

For example, let's say you want to assign the color red to a phrase enclosed on the tags \<p>\</p> in the HTML section:

```
<html>
    <head>
        <style>
            p { color: red; }
        </style>
    </head>
    <body>
        <p> this is a red colored phrase </p>
    </body>
</html>
```

The entire structure of CSS rule is called **ruleset** having very important individual parts:

![Anatomy of a CSS ruleset \[Mozilla Foundation\]](https://developer.mozilla.org/en-US/docs/Learn/Getting\_started\_with\_the\_web/CSS\_basics/css-declaration-small.png)

{% hint style="success" %}
**Try this!**\
****1. go to repl.it, create a new HTML code.

2\. Insert the code above and change the color of the paragraph \<p>. You can try change _`red` _ for, _`orange`_ , _`white`_, _`green`_, or values in rgb as `rbg (244,120,30)`
{% endhint %}

### JS

1. Javascript is a multipurpose programming language initially created to aid developers in adding dynamic features to websites like animations and manipulations of the browser document object model (DOM). It was created in 11 days and released in 1995 by Netscape, one of the first browsers of history (Brendan Eich, first named LiveScript)
2. JS is used to add interactivity and interconnectivity to HTML. Its most important concepts are canvas, DOM, OOP, and extensivity through libraries.
3. Node.Js is introduced in 2009 (Ryan Dahl), transferring the power of JS to the backend (the server-side of the web) and generalizing JS in so many platforms as the most deployed programming language in history.
4. The big difference is that js is a not compiled language that can outperform Python and in some cases, even to C++ thanks, most prominently, to the V8 JavaScript engine, which does just-in-time compilation, inlining, and dynamic code optimization.
5. Is the programming language of the web and the most-deployed programming language in history: desktops, tablets and phones.

{% hint style="warning" %}
In a very loose comparison, JS and CSS could be related to the Orchestration or Material Disposition of a Musical Score, or Csound patch, meanwhile HTML is the time and content organization presented in the Score.
{% endhint %}

{% hint style="success" %}
**Try this!**\
****\
****1. Open the Browser's console (see shortcuts in [the browser](the-browser.md))\
2\. Make a simple sum of two variables and print it again on the console.\
\
\---\
Solution:\
\
`var a = 2;`\
`var b = 3;`\
`console.log (a + b)`\
``
{% endhint %}



