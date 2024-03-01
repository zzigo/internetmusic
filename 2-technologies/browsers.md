#technologies  #browser 

 The aim of the browser is to unify and make convertible a number of communication protocols. Among the best known: HTTP, FTP, IRC, SSL, and among the most modern, IPFS, HTTPS, and SFTP. Also, since the 2000s, multimedia capabilities have been developed with HTML, CSS, and Javascript interpreters.

The web browser is possibly the most important piece of software so far this century. About one-third of the global population is using the Internet, so you could estimate about 2.3 billion browsers.

Browser code can be roughly divided into three parts:

1. Browser engine - takes care of rendering webpages. Is the code all browsers share (Chromium-based and others).
   1. Blink, contributions of FAAG IBM, etc. fork of WebKit (apple), it's used in Edge, Opera, Vivaldi, Brave, Silk.
2. User interface - unique on each browser although there is some common basis.
3. Synchronization, (google based or other).

#### Browser's comparison

1. Google Chrome:
   1. data-slurping (sharing data between devices) ecosystem.
   2. Based on Blink and its powerful javascript interpreter v8
2. Safari
   1. on mac, less battery power and faster.
   2. Based on WebKit engine.
3. Firefox
   1. first "freedom" browser, no ads, no trackers, cookies tracking preventions.
   2. Initiated with the Gecko engine (starting with Netscape in 1997), and later with Quantum.
4. Brave:
   1. Based on Blink and V8
   2. Faster than Chrome and Firefox, because it strips ads and ad trackers from web content.
   3. “Private Tabs with Tor”
5. Vivaldi
   1. tiled and stacked tabs
   2. Also based on Blink.
6. Opera: started with its Presto engine. Now also based on Blink and v8.
7. Microsoft Edge, based on chromium.

Over the years, only three engines survived: WebKit (Apple, Safari), Blink (Google, and cousin of Webkit), and Gecko (Mozilla).

Chromium is the codebase for Chrome and others, is based on Blink and V8 (the js renderer, also used in node.js and Electron app creator framework).

> [!IMPORTANT] 
> all technologies related to WebAudio API work better on **Chrome**

To check if a technology is implemented on a browser you can check it at [https://caniuse.com/](https://caniuse.com)

### How to open the Javascript Console in different browsers?

#### Chrome and Chromium-based (brave, vivaldi, edge, opera)

| shortcut | function                                     |
| -------- | -------------------------------------------- |
| ⌘⌥ + J   | open the console                             |
| ⌘ + K    | erase the console                            |
| ⌘⇧ + M   | switch to mobile preview view                |
| ⌘⇧ + C   | inspect CSS and HTML elements on the preview |

#### Firefox (quantum gecko based)

| shortcut | function                                     |
| -------- | -------------------------------------------- |
| ⌘⌥ + K   | open the console                             |
| ⌥ + O /  | erase the console                            |
| ⌘⌥ + M   | switch to mobile preview view                |
| ⌘⌥ + C   | inspect CSS and HTML elements on the preview |

> [!SUCCESS] Try this
> 1. go to your browser
> 2. load a page or` type about:blank into the address `bar
> 3. open the console with the shortcuts explained above
> 4. type console.log ("helloworld")+ enter and see the results.
> 5. SPOILER ALERT!: if you wannt know what kind of things are possible just in the console, jump to [[js-foundamentals]] and follow instructions


