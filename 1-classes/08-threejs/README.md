
# react-three/fiber

its a library organized on top of [[react]] installation.
The definition of three.hs scene becomes [[declarative]] with re-usable, self-contained components that react to state, and are readily interactive and can participate in React's ecosystem 

```
npm install three @types/three @react-three/fiber
```

- one important difference is that Threejs is expressed in [[JSX]] rather than simple [[js]]

## step by step

1. install a react framework, in this  ase we use [[vite]]

```
yarn  create vite
```

	1.choose react, javascript

2. got to folder , install vite, install react-three
```
	cd <project-name-vite>
	yarn
	yarn add three @react-three/fiber @react-three/drei gsap
```

3. run server
```
	yarn dev
```