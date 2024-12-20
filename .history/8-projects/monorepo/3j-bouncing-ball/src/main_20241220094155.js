
import * as THREE from 'three';
import * as Tone from 'tone';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import {  * } from './sunset.js'; // Import from sunset.js
// import { createWebSocketService } from './websocketService.js';
import { initializeSounds, updateDrone, collisionSynth, whooshingSynth, audioContext } from './sounds.js';



// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
renderer.domElement.style.display = 'none';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


// Vertex Shader
const trailVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader
const trailFragmentShader = `
  uniform float time;
  varying vec2 vUv;

  // Simple fractal noise function
  float fractalNoise(vec2 uv) {
    float n = 0.0;
    float scale = 1.0;
    for (int i = 0; i < 5; i++) {
      n += sin(uv.x * scale + time) * cos(uv.y * scale - time);
      scale *= 2.0;
    }
    return n * 0.5 + 0.5;
  }

  void main() {
    vec2 uv = vUv * 10.0; // Scale UV coordinates
    float intensity = fractalNoise(uv);

    gl_FragColor = vec4(vec3(intensity), 1.0);
    gl_FragColor.rgb *= intensity; // Add glow effect
  }
`;


// Shader for Glowing Effect
const glowVertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = `
  uniform vec3 glowColor;
  uniform float glowIntensity;
  void main() {
    gl_FragColor = vec4(glowColor, 1.0);
    gl_FragColor.rgb *= glowIntensity;
  }
`;

//avatar
// const loader = new THREE.GLTFLoader();
// loader.load('./avatar1.glb', function (gltf) {
//   scene.add(gltf.scene);
// });


// Ball CREATION
const ballRadius = 0.2;
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
const ballMaterial = new THREE.ShaderMaterial({
  vertexShader: glowVertexShader,
  fragmentShader: glowFragmentShader,
  uniforms: {
    glowColor: { value: new THREE.Color(0xff0000) },
    glowIntensity: { value: 2 },
  },
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.castShadow = true;
scene.add(ball);


// Audio Setup using Tone.js
const listener = new THREE.AudioListener();
camera.add(listener); // Attach listener to the camera

// Create a PositionalAudio for the ball
const ballPositionalAudio = new THREE.PositionalAudio(listener);
ball.add(ballPositionalAudio); // Attach the positional audio to the ball

// Connect the Tone.js synth to the PositionalAudio
const collisionMediaStream = audioContext.createMediaStreamDestination();
collisionSynth.connect(collisionMediaStream);
ballPositionalAudio.setMediaStreamSource(collisionMediaStream.stream);


let isAudioStarted = false;


// Cube (Wireframe with Glow)
const cubeSize = 5;
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMaterial = new THREE.ShaderMaterial({
  vertexShader: glowVertexShader,
  fragmentShader: glowFragmentShader,
  uniforms: {
    glowColor: { value: new THREE.Color(0x00ff00) },
    glowIntensity: { value: 1 },
  },
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
  wireframe: true,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.receiveShadow = true;
scene.add(cube);

// Random rotation speeds for the cube
const cubeRotationSpeed = new THREE.Vector3(
  (Math.random() - 0.5) * 0.002, // Random speed for X axis
  (Math.random() - 0.5) * 0.002, // Random speed for Y axis
  (Math.random() - 0.5) * 0.002  // Random speed for Z axis
);

// Lighting Setup
const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Dim gray light
scene.add(ambientLight);

// Spotlight for dynamic lighting
const spotlight = new THREE.SpotLight(0xffffff, 2); 
spotlight.position.set(0, 5, 5); 
spotlight.castShadow = true;
spotlight.color.set(0xffaa00);
scene.add(spotlight);

// Create Horizon and Sky (Sunset Elements)
// const horizon = createHorizon(scene);
const sky = createSky(scene);

// Sunset Progress (from day to night)
let sunsetProgress = 0;


// Spotlight Target to Follow Ball
spotlight.target = ball;

// Physics
let ballVelocity = new THREE.Vector3(0.02, 0.03, 0.01);
let ballPreviousVelocity = new THREE.Vector3(); // To calculate acceleration



// Mapping sides of the cube to specific pitches
const sideToPitch = {
  bottom: 'C3',
  top: 'A#3',
  front: 'D3',
  back: 'F3',
  left: 'E3',
  right: 'G3'
};



// Start Audio and Hide Start Screen not before buttons are created
// Assuming you're appending buttons asynchronously
setTimeout(() => {
  const startButton = document.getElementById('startButton');
  if (startButton) {
    startButton.addEventListener('click', async () => {
      await initializeSounds();
      document.getElementById('startScreen').style.display = 'none';
      renderer.domElement.style.display = 'block';
      isAudioStarted = true;
      animate();
    });
  }
}, 100);  // Delay to give time for button creation


//SOCKET
// const audioObjects = [collisionSynth, whooshingSynth]; // Add all controllable audio objects here

// // Initialize WebSocket Service
// createWebSocketService(scene, audioObjects);


// Utility: Map a value range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Doppler Effect: Adjust pitch based on velocity relative to the camera
function dopplerEffect(velocity) {
  const listenerPosition = camera.position;
  const ballPosition = ball.position;
  const relativeVelocity = velocity.dot(listenerPosition.clone().sub(ballPosition).normalize());
  return mapRange(relativeVelocity, -0.05, 0.05, 400, 1000); // Frequency range
}

// Postprocessing Setup (Bloom/Gloom Effect)
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Create UnrealBloomPass (Bloom/Gloom effect)
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  2,  // Increased Bloom strength
  0.1,  // Increased Bloom radius for larger glow
  0 // Lower Bloom threshold to allow more of the glow
);
composer.addPass(bloomPass);

// Trajectory Glow (Halo) Effect - Create a path
let trajectoryPoints = [];

//normal material
// const trailMaterial = new THREE.LineBasicMaterial({
//   color: 0x00ffFF,  // Green glowing color
//   linewidth: 1000,  // Line thickness
// });

//shader material
// Trail Material with Shader
const trailMaterial = new THREE.ShaderMaterial({
  vertexShader: trailVertexShader,
  fragmentShader: trailFragmentShader,
  uniforms: {
    time: { value: 0.0 }, // Time uniform for animation
  },
  transparent: true,
  blending: THREE.AdditiveBlending,
});

const trailGeometry = new THREE.BufferGeometry();
const trailLine = new THREE.Line(trailGeometry, trailMaterial);
scene.add(trailLine);

 // Function to check collision and trigger sound
 function checkCollision() {
  const now = Tone.now();

  // for (let axis of ['x', 'y', 'z']) {
  //   if (Math.abs(ball.position[axis]) + ballRadius > cubeSize / 2) {
  //     // Reverse direction upon collision
  //     ballVelocity[axis] *= -1; 
  //     ball.position[axis] = Math.sign(ball.position[axis]) * (cubeSize / 2 - ballRadius);

  //     // Determine which side the ball collided with and assign a pitch
  //     let collisionSide = '';
  //     if (axis === 'x') {
  //       collisionSide = ball.position[axis] > 0 ? 'right' : 'left';
  //     } else if (axis === 'y') {
  //       collisionSide = ball.position[axis] > 0 ? 'top' : 'bottom';
  //     } else if (axis === 'z') {
  //       collisionSide = ball.position[axis] > 0 ? 'front' : 'back';
  //     }

  // Get the ball's position in the cube's local space
  const ballLocalPosition = ball.position.clone();
  // cube.worldToLocal(ballLocalPosition);

  for (let axis of ['x', 'y', 'z']) {
    if (Math.abs(ballLocalPosition[axis]) + ballRadius > cubeSize / 2) {
      // Reverse direction upon collision
      ballVelocity[axis] *= -1;

      // Keep the ball inside the cube boundaries
      ballLocalPosition[axis] = Math.sign(ballLocalPosition[axis]) * (cubeSize / 2 - ballRadius);

      // Transform the ball's position back to world space
      cube.localToWorld(ballLocalPosition);
      ball.position.copy(ballLocalPosition);

      // Determine which side the ball collided with and assign a pitch
      let collisionSide = '';
      if (axis === 'x') {
        collisionSide = ballLocalPosition[axis] > 0 ? 'right' : 'left';
      } else if (axis === 'y') {
        collisionSide = ballLocalPosition[axis] > 0 ? 'top' : 'bottom';
      } else if (axis === 'z') {
        collisionSide = ballLocalPosition[axis] > 0 ? 'front' : 'back';
      }

      // Get the pitch from the mapping
      const pitch = sideToPitch[collisionSide];

      // Trigger the synth sound at the corresponding pitch
      if (isAudioStarted && now - lastCollisionTime > 0.2) {
        collisionSynth.triggerAttackRelease(pitch, '8n', now);
        ballPositionalAudio.play(); // Play sound at the ball's position
        lastCollisionTime = now;
      }
    }
  }
}

// Gravity Constant
const GRAVITY = -0.000002;  // A small constant that simulates gravitational pull

// Apply Gravity to Ball Movement
function applyGravity() {
  // Apply gravity only if the ball is not colliding with the cube
  if (Math.abs(ball.position.y) + ballRadius <= cubeSize / 2) {
    ballVelocity.y += GRAVITY;  // Gravity affects the Y-axis velocity
  } else {
    ballVelocity.y = 0.2;  // Stop downward velocity if on the surface of the cube
  }
}


// Function to update ball position and handle cube movement
function updateBallPosition() {
  // Move the ball by applying the velocity
  ball.position.add(ballVelocity);
  
  // Handle gravity after ball movement
  applyGravity();
  
  // Apply cube's movement to the ball
  // Assuming cube is moving, let's simulate a simple interaction with the ball
  const cubeSpeed = 1.2;  // Adjust as necessary
  
  // If the cube is moving, apply a small velocity to the ball based on the cube's position
  if (Math.abs(cube.position.x) < cubeSize / 2) {
    ballVelocity.x += cubeSpeed * Math.sign(cube.position.x);  // Influence from cube's X position
  }

  if (Math.abs(cube.position.z) < cubeSize / 2) {
    ballVelocity.z += cubeSpeed * Math.sign(cube.position.z);  // Influence from cube's Z position
  }
  
  // Update the ball's velocity with the gravity and cube's interaction
  ball.position.add(ballVelocity);
}


// Animate
let lastCollisionTime = 0;
let lastWhooshTime = 0;

function animate() {
  requestAnimationFrame(animate);

  // Update Ball Position
  // ball.position.add(ballVelocity);
    // Update Ball Position with Gravity and Cube Movement
    updateBallPosition();

      // Update time for trail shader
    trailMaterial.uniforms.time.value += 0.1;


    // Call collision check function
    checkCollision();

  // Store the ball’s trajectory for the trail
  trajectoryPoints.push(ball.position.clone());
  if (trajectoryPoints.length > 100) trajectoryPoints.shift(); 

  // Update the trail geometry
  const positions = [];
  for (let point of trajectoryPoints) {
    positions.push(point.x, point.y, point.z);
  }
  trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  // Calculate Acceleration
  const acceleration = ballVelocity.clone().sub(ballPreviousVelocity).length();
  ballPreviousVelocity.copy(ballVelocity);

  const now = Tone.now();

    // Update cube rotation
  cube.rotation.x += cubeRotationSpeed.x;
  cube.rotation.y += cubeRotationSpeed.y;
  cube.rotation.z += cubeRotationSpeed.z;


  // Whooshing Sound Based on Acceleration
  if (acceleration > 0.001 && now - lastWhooshTime > 0.4) {
    const frequency = dopplerEffect(ballVelocity); // Doppler pitch shift
    whooshingSynth.set({ noise: { type: 'pink' }, envelope: { sustain: acceleration * 2 } });
    whooshingSynth.triggerAttackRelease(acceleration * 0.5, '8n', now);
    lastWhooshTime = now;
  }



  // Update Spotlight Position and Target
  spotlight.position.set(ball.position.x, ball.position.y + 5, ball.position.z);
  spotlight.target.position.copy(ball.position);

  // Update Spotlight Target's Matrix World
  spotlight.target.updateMatrixWorld();

  // Default Camera Rotation
  camera.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.001); // Rotate around Z-axis
  camera.lookAt(scene.position);
  controls.update();


  // Update the sunset effect and drone
  sunsetProgress = animateSunset (sky, ambientLight, spotlight, sunsetProgress);
  // Update drone synth with sunset progress
  updateDrone(sunsetProgress);

  // Render with Postprocessing (Bloom)
  composer.render();
}

