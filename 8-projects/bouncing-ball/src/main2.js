import * as THREE from 'three';
import * as Tone from 'tone';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();

// Orthographic Camera Setup
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  -aspect * 5, // left
  aspect * 5,  // right
  5,           // top
  -5,          // bottom
  0.1,         // near plane
  1000         // far plane
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Orbit
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


// Red Cube (Moving)
const redCubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const redCubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const redCube = new THREE.Mesh(redCubeGeometry, redCubeMaterial);
scene.add(redCube);

// Green Cube (Blinking)
const greenCubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const greenCubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const greenCube = new THREE.Mesh(greenCubeGeometry, greenCubeMaterial);
scene.add(greenCube);
greenCube.visible = false; // Initially invisible

// Positioning
camera.position.z = 5;
greenCube.position.set(0, 0, 0);

// Variables for Animation
const redCubeSpeed = 4; // Speed of red cube (units per second)
const greenCubeBlinkTime = 0.02; // Green cube blink time (seconds)
const redCubeStartX = -5; // Starting X position of red cube
const redCubeEndX = 5; // Ending X position of red cube
const redCubeDuration = (redCubeEndX - redCubeStartX) / redCubeSpeed; // Total time for one loop
const blinkTimeStart = redCubeDuration / 2 - greenCubeBlinkTime / 2;
const blinkTimeEnd = redCubeDuration / 2 + greenCubeBlinkTime / 2;

// Tone.js Synth for Beep
const beepSynth = new Tone.Synth({
    envelope: {
        attack: 0.0001,
        decay: 1,
        sustain: 0,
        release: 0.1,
    }
}).toDestination();

// Animation Variables
let redCubeTime = 0; // Tracks time for red cube's movement
let blinked = false; // Tracks if the green cube blinked in the current loop

// Calculate Y position for red cube (40 pixels above the middle)
const middleY = 0; // middle of the screen
const redCubeYOffset = 80 / window.innerHeight * 10; // 40 pixels offset, normalized for the orthographic camera

// Set red cube position 40px above the middle
redCube.position.set(redCubeStartX, middleY + redCubeYOffset, 0);

// Set green cube's position (same Y as red cube)
// greenCube.position.set(0, middleY + redCubeYOffset, 0);

// Reset Animation Parameters
function resetAnimation() {
  redCubeTime = 0;
  blinked = false;
  greenCube.visible = false;
}

// Animate Function
function animate(delta) {
  redCubeTime += delta / 1000; // Convert delta (ms) to seconds

  // Reset when red cube completes its loop
  if (redCubeTime > redCubeDuration) {
    resetAnimation();
  }

  // Update red cube's position
  redCube.position.x = redCubeStartX + (redCubeTime / redCubeDuration) * (redCubeEndX - redCubeStartX);

  // Blink the green cube during the specified time window
  if (redCubeTime >= blinkTimeStart && redCubeTime <= blinkTimeEnd) {
    if (!blinked) {
      greenCube.visible = true; // Show the green cube
      beepSynth.triggerAttackRelease('C4', greenCubeBlinkTime); // Play beep
      blinked = true; // Prevent multiple blinks in the same loop
    }
  } else {
    greenCube.visible = false; // Hide the green cube outside the blink window
  }

  // Render the scene
  renderer.render(scene, camera);
}

// Handle window resize to ensure proper scaling and camera aspect ratio
function onWindowResize() {
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Update camera aspect ratio and projection matrix
  const newAspect = window.innerWidth / window.innerHeight;
  camera.left = -newAspect * 5;
  camera.right = newAspect * 5;
  camera.top = 5;
  camera.bottom = -5;
  camera.updateProjectionMatrix();
}

// Start the animation
let lastTime = 0;
function render(time) {
  const delta = time - lastTime;
  lastTime = time;
  animate(delta);
  requestAnimationFrame(render);
}

resetAnimation(); // Ensure parameters are initialized before starting
render(0);

// Add event listener for window resizing
window.addEventListener('resize', onWindowResize);
