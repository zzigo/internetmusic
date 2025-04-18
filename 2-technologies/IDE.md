# editors

After Browser, the code editor is the second most important tool we will use. Actually, there are two types of editors, **local** editors, and **cloud** editors. Those editors are known as Integrated Development Environment (IDE), having a collection of applications used by developers for writing code. \


### What do we need from an IDE?

1. a source code editor that in a way can accelerate the writing process. There is a normalized quantity of tools already established to do that. You can find them either integrated or in external plugins. Between the more useful:
   1. ESLint: Useful to check JavaScript errors and helps in auto-formatting the code
   2. Prettier: JS code formatter
   3. Emmet: high-speed code abbreviations
2. A console for debugging.
3. A live preview for visualizing and testing the results.

### Local vs Cloud IDEs: PRO and CONS

Local -> PRO : very customizable, faster, offline.

Local - CONS: hard-config, heavy-cpu , need of live-server (emulator of a real internet connection).&#x20;

Cloud -> PRO: ready to go, shareable, never miss a configuration.

Cloud -> CONS: slower, internet dependent.\


### Best Cloud-IDE

**repl**.it, **glitch**.com, **gitpod.io**&#x20;

**codePen**, **jsFiddle**  (for snippets)

### Best  Local-IDE

1. **vim** and **nvim:** the best of the best. Absolutely hard learning-curve. It can be addictive.
2. **vscode**: the most popular. Lots of plugins. It can become very heavy&#x20;
3. **sublime**: very light.&#x20;
4. **atom**: easy config. based on Electron. It can become slow.

This course is based on repl.it, but you can also synch each repository (or replit) to your local IDE through github. See [How to create a github repository](how-to-create-a-github-repository.md)

### Live Server

In case you choose to work with a local-ide you will need a live-server, basically an emulator of ba functionalities of the web as php-interpreter, apache-nginx port management, and so on.&#x20;

The simplest live-server is done in python:&#x20;

* check Python version, type `python --version`, press `ENTER`
  * `Go to the Folder you want to initialize the server`
  * `Python 2.0+`, type `python -m SimpleHTTPServer 5000`, press `ENTER`
  * `Python 3.0+`, type `python -m http.server 5000`, press `ENTER`
* on the browser type `http://localhost:5000`

