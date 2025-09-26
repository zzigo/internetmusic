# keyboard

{% embed url="https://codepen.io/chriscoyier/pen/mPgoYJ" %}
by Chris Coyier
{% endembed %}

To add a basic control keyboard to your code you need two things; the `addEventListener` method and a function routing the action of the chosen keys.&#x20;

The code below is used in the tone.js synth example:

```
document.addEventListener('keydown',keyboard);

function keyboard(e) {
	 switch(e.code){
    case 'KeyQ': helloTone();console.log('KeyJ'); break;
		case 'KeyW': helloMelody();break;
		case 'KeyE': synth1();break;
		case 'KeyA': fx1();break;
		case 'KeyW': measuredTime();break;
		case 'KeyE': schedy();break;
		case 'KeyA': membrane();break;
}
}
```

1. Calling the first hierarchy object `document,` then calling its specific **method** addEventListener and finally the  **event** `'keydown'`as first argument.
2. Second argument of the method is used to call the function **keyboard**&#x20;

{% hint style="info" %}
Notice that the call to keyboard function doesnt use ()
{% endhint %}
