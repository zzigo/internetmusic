# Lowis-Misuary BD

1.Following a Chris Lowis-Misuary's idea, a kick simulation made by two oscillator is created.&#x20;

2.The sound of a kick drum starts off with high attack and falls away rapidly.

3.We use the AudioParam:

```
.exponentialRampToValueAtTime (value, endTime)
```

to generate the ramp both in gain and frequency. The `value` argument represents a floating point number that the AudioParam will ramp to by the given time.

4\. In this example we use the HTML-in-JS style to create the button.

{% embed url="https://replit.com/@jsmusic/generators03#index.html" %}

