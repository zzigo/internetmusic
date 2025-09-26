# Scheduling basics

JS has two main timing events:

```
setTimeout()
setInterval()
```

While `setTimeout()` runs a function after a certain delay, `setInterval()` calls a function in a continuous loop at a specified delay.

{% embed url="https://replit.com/@jsmusic/scheduling01#index.js" %}

### A better implementation

To avoid many shortcomings of these functions, there is a more practical implementation by [Ayman Farhat](https://www.thecodeship.com/web-development/alternative-to-javascript-evil-setinterval/) of `setInterval()` adding a second argument that defines the number of repetitions to be done.&#x20;

{% embed url="https://replit.com/@jsmusic/schedule01-farhat#index.js" %}



