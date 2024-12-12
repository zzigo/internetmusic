<template>
  <div id="app">
    <button @click="initializeAudio">Start Audio</button>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import * as dat from 'dat.gui';

export default {
  setup() {
    const canvas = ref(null);
    const cameraSpeed = 0.1; // Speed of camera movement
    const numCubes = 3; // Number of cubes
    const audioFiles = [
      'audio/sample1.wav',
      'audio/sample2.wav',
      'audio/sample3.wav',
    ]; // Array of different audio file paths
    let audioContext = null; // Initialize audioContext variable
    let composer; // For post-processing
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const initializeAudio = () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      audioContext.resume().then(() => {
        console.log('AudioContext resumed');
        loadAudio();
      });
    };

    const loadAudio = () => {
      // Set up the Three.js scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true});
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // Set up post-processing
      composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      // Create the bloom pass
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
    bloomPass.threshold = 2; // Adjust threshold
    bloomPass.strength = 15; // Initial strength of the bloom effect
    bloomPass.radius = 5; // Radius of the bloom effect
    composer.addPass(bloomPass);

    // Set up the GUI
    const gui = new dat.GUI();
    const bloomFolder = gui.addFolder('Bloom Effect');
    bloomFolder.add(bloomPass, 'threshold', 0.0, 1.0).name('Threshold');
    bloomFolder.add(bloomPass, 'strength', 0.0, 3.0).name('Strength'); // Add strength control
    bloomFolder.add(bloomPass, 'radius', 0.0, 2.0).name('Radius');
    bloomFolder.open();

      // Add a grid helper
      const gridHelper = new THREE.GridHelper(10, 10); // size and divisions
      scene.add(gridHelper);

      // Set up audio listener
      const listener = new THREE.AudioListener();
      camera.add(listener);

      const audioLoader = new THREE.AudioLoader();


      //lights
      const sunlight = new THREE.DirectionalLight(0xffffff, 1); // Color and intensity
sunlight.position.set(5, 10, 5); // Position the light
sunlight.castShadow = true; // Enable shadow casting
scene.add(sunlight);

// Set the shadow map size for better quality
sunlight.shadow.mapSize.width = 512; // Default
sunlight.shadow.mapSize.height = 512; // Default

// Adjust shadow properties
sunlight.shadow.camera.near = 0.5; // Near plane for shadow
sunlight.shadow.camera.far = 50; // Far plane for shadow
sunlight.shadow.camera.left = -10; // Left bound
sunlight.shadow.camera.right = 10; // Right bound
sunlight.shadow.camera.top = 10; // Top bound
sunlight.shadow.camera.bottom = -10; // Bottom bound

// Enable shadow maps for the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows

      // Function to create a translucent neon cube with audio
      const createNeonCube = (position, audioFile) => {
        const geometry = new THREE.BoxGeometry();
        
        // Create a translucent material
        const color = Math.random() * 0xffffff; // Random color
        const material = new THREE.MeshStandardMaterial({
          color: color,
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
        });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(position.x, position.y, position.z);
        cube.castShadow = true; // Enable shadow casting
  cube.receiveShadow = true; // Enable shadow receiving
        scene.add(cube);

          // Create a strong PointLight that emits from the cube
  const lightIntensity = 5; // Adjust intensity for strong emission
  const light = new THREE.PointLight(color, lightIntensity, 10); // Light with radius
  light.position.copy(cube.position);
  light.castShadow = true; // Enable shadow casting for the point light
  scene.add(light);

    

        const sound = new THREE.PositionalAudio(listener);
        audioLoader.load(audioFile, (buffer) => {
          sound.setBuffer(buffer);
          sound.setLoop(true);
          sound.setVolume(1); // Set initial volume
          sound.setRefDistance(0); // Distance at which volume starts to decrease
          sound.setMaxDistance(1); // Max distance for sound to be audible
          sound.play();
        });

        sound.position.copy(cube.position);
        scene.add(sound);

        return { cube, sound, light };
      };

      // Create multiple neon cubes with audio
      const cubes = [];
      for (let i = 0; i < numCubes; i++) {
        const randomPosition = new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );
        const audioFile = audioFiles[i];
        const neonCube = createNeonCube(randomPosition, audioFile);
        cubes.push(neonCube);
      }

      camera.position.z = 5;

      const keys = {};
      window.addEventListener('keydown', (event) => {
        keys[event.key] = true;
      });
      window.addEventListener('keyup', (event) => {
        keys[event.key] = false;
      });

      // Mouse event handlers for dragging
      const onMouseDown = (event) => {
        isDragging = true;
        previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
      };

      const onMouseMove = (event) => {
        if (isDragging) {
          const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y,
          };

          const sensitivity = 0.005; // Adjust sensitivity to your liking
          camera.rotation.y -= deltaMove.x * sensitivity;
          camera.rotation.x -= deltaMove.y * sensitivity;

          previousMousePosition = {
            x: event.clientX,
            y: event.clientY,
          };
        }
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      window.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

  

      const animate = function () {
        requestAnimationFrame(animate);

        if (keys['w']) camera.position.z -= cameraSpeed;
        if (keys['s']) camera.position.z += cameraSpeed;
        if (keys['a']) camera.position.x -= cameraSpeed;
        if (keys['d']) camera.position.x += cameraSpeed;

        cubes.forEach(({ cube, sound, light }) => {
          sound.position.copy(cube.position);
          light.position.copy(cube.position);
        });

        cubes.forEach(({ cube }) => {
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
        });

        // Render using the composer for post-processing effects
        composer.render();
      };

      animate();

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        composer.setSize(window.innerWidth, window.innerHeight);
      });
    };

    return {
      canvas,
      initializeAudio,
    };

    // Inside your setup function, after defining scene and camera

// Create a moving spotlight
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 5, 0); // Initial position
spotLight.castShadow = true; // Enable shadows
scene.add(spotLight);

// Helper to visualize the spotlight position
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// Move the spotlight in a circular path
let angle = 0; // Starting angle

const animate = function () {
  requestAnimationFrame(animate);

  if (keys['w']) camera.position.z -= cameraSpeed;
  if (keys['s']) camera.position.z += cameraSpeed;
  if (keys['a']) camera.position.x -= cameraSpeed;
  if (keys['d']) camera.position.x += cameraSpeed;

  // Update spotlight position
  angle += 0.01; // Adjust speed here
  spotLight.position.x = 5 * Math.sin(angle);
  spotLight.position.z = 5 * Math.cos(angle);
  spotLight.position.y = 5; // Keep it above the scene

  // Update the helper position
  spotLightHelper.update();

  cubes.forEach(({ cube, sound, light }) => {
    sound.position.copy(cube.position);
    light.position.copy(cube.position);
  });

  cubes.forEach(({ cube }) => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  });

  // Render using the composer for post-processing effects
  composer.render();
};
  },
  
};
</script>

<style>
body {
  margin: 0;
  overflow: hidden;
}
canvas {
  display: block;
}
button {
  position: absolute;
  z-index: 1;
}
</style>