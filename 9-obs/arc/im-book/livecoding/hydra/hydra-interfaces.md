# Hydra interfaces

#### mouse

```
shape(3,() => mouse.x/window.innerWidth).out()
```

In this case, as Hydra can parse JS code, the function shape inherits an [arrow function](js-functions.md) on its second argument instantiating the size value with the mouse, divided by the window's width.&#x20;
