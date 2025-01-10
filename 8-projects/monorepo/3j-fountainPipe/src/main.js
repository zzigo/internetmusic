// IMPORTING LIBRARIES
import * as THREE from "three";
import { WebMidi } from "webmidi";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

// VARIABLE DECLARATION
let camera, scene, renderer, clock;
let particleSystem, particleMaterial, particleGeometry;
let lights = [];
keys = {};
let midiSelectMenu, videoTexture;
let handPosition = { x: 0, y: 0, z: 0 };
const videoElement = document.creatElement("video");
const noteColorMap = {
  C: 0xff0000, // Red
  D: 0xff7f00, // Orange
  E: 0xffff00, // Yellow
  F: 0x00ff00, // Green
  G: 0x0000ff, // Blue
  A: 0x4b0082, // Indigo
  B: 0x9400d3, // Violet
};

// PLAY
init();
animate();

// INIT
function init() {
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 10);

  // Clock
  clock = new THREE.Clock();

  // Lights
  for (let i = 0; i < 30; i++) {
    const light = new THREE.SpotLight(0xffffff, 5);
    light.power = 5000;
    light.position.set(
      Math.random() * 20 - 10,
      Math.random() * 20 - 10,
      Math.random() * 20 - 10
    );
    scene.add(light);
    lights.push(light);
  }

  // Video Texture for Particles
  videoElement.src = "../public/essaieeau.mov";
  videoElement.autoplay = true;
  videoElement.muted = false;
  videoElement.loop = true;
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;
      videoElement.play();
    })
    .catch((err) => console.error("Video capture failed:", err));

  videoTexture = new THREE.VideoTexture(videoElement);

  // Particle System
  const particleCount = 1000;
  particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = Math.random() * 10 - 5; // X
    positions[i * 3 + 1] = Math.random() * 10 - 5; // Y
    positions[i * 3 + 2] = Math.random() * 10 - 5; // Z
  }
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  particleMaterial = new THREE.PointsMaterial({
    map: videoTexture,
    size: 1,
    transparent: true,
    opacity: 0.7,
  });

  particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Event Listeners FOR WINDOW RESIZE AND KEYS
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", (e) => (keys[e.key] = true));
  window.addEventListener("keyup", (e) => (keys[e.key] = false));

  //WINDOW RESIZE
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

//END INIT

// ANIMATE

function initMediapipeHands() {
  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 2,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults((results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const hand = results.multiHandLandmarks[0];
      handPosition.x = (hand[9].x - 0.5) * 10; // Normalize to -5 to 5
      handPosition.y = (0.5 - hand[9].y) * 10;
      handPosition.z = hand[9].z * 10;
    }
  });

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
  });

  camera.start();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // Update Particle System
  const positions = particleGeometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += (Math.random() - 0.5) * delta + handPosition.x * 0.01; // X
    positions[i + 1] += (Math.random() - 0.5) * delta + handPosition.y * 0.01; // Y
    positions[i + 2] += (Math.random() - 0.5) * delta + handPosition.z * 0.01; // Z
  }
  particleGeometry.attributes.position.needsUpdate = true;

  // WASD Navigation
  if (keys["w"]) camera.position.z -= delta * 5;
  if (keys["s"]) camera.position.z += delta * 5;
  if (keys["a"]) camera.position.x -= delta * 5;
  if (keys["d"]) camera.position.x += delta * 5;

  renderer.render(scene, camera);
}
