
# snippet 1 : buttons

```js 
// Do something when a button gets added to the Max patcher
xebraState.on("object_added", function(object) {
if (object.type === "button") addHTMLButton(object);

});

  

// Do something when a button is removed

xebraState.on("object_removed", function(object) {
if (object.type === "button") removeHTMLButton(object);

});


xebraState.on("object_changed", function(object, param) {
if (object.type === "button") {
if (param.type === "bgcolor") {
var button = document.getElementById("button-" + object.id);
button.style.backgroundColor = colorToHex(param.value);

}

}

});
```


