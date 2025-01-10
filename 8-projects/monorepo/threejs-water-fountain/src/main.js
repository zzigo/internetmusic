import * as THREE from "three";
import { WebMidi } from "webmidi";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

let camera, scene, renderer;
let particleSystem, particleMaterial, particleGeometry, clock, gridHelper;
let particleSpeed = 1; // Default particle speed
let particleSize = 0.1; // Default particle size
let lights = [];
let keys = {};
let midiSelectMenu;
let font;

// MIDI note-to-color mapping (Newtonian relationship: CDEFGAB)
const noteColorMap = {
  C: 0xff0000, // Red
  D: 0xff7f00, // Orange
  E: 0xffff00, // Yellow
  F: 0x00ff00, // Green
  G: 0x0000ff, // Blue
  A: 0x4b0082, // Indigo
  B: 0x9400d3, // Violet
};

// Load Font
const fontLoader = new FontLoader();
fontLoader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  (loadedFont) => {
    font = loadedFont;
  }
);

init();
animate();

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
  for (let i = 0; i < 10; i++) {
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

  // Grid Helper
  gridHelper = new THREE.GridHelper(50, 50, 0x0077ff, 0x0077ff);
  scene.add(gridHelper);

  // Particle System (Water Fountain)
  particleGeometry = new THREE.BufferGeometry();
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = Math.random() * 2 - 1; // X
    positions[i * 3 + 1] = Math.random() * 5; // Y
    positions[i * 3 + 2] = Math.random() * 2 - 1; // Z
  }
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  particleMaterial = new THREE.PointsMaterial({
    color: 0x0077ff,
    size: particleSize,
    transparent: true,
    opacity: 0.7,
  });

  particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // MIDI Setup
  createMidiSelectMenu();
  setupMidi();

  // Event Listeners
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", (e) => (keys[e.key] = true));
  window.addEventListener("keyup", (e) => (keys[e.key] = false));
}

function createMidiSelectMenu() {
  // Create dropdown menu for MIDI input selection
  midiSelectMenu = document.createElement("select");
  midiSelectMenu.style.position = "absolute";
  midiSelectMenu.style.top = "10px";
  midiSelectMenu.style.left = "10px";
  midiSelectMenu.style.zIndex = "1000";
  document.body.appendChild(midiSelectMenu);

  // Event listener to handle MIDI port selection
  midiSelectMenu.addEventListener("change", () => {
    const selectedInput = WebMidi.getInputByName(midiSelectMenu.value);
    if (selectedInput) {
      selectedInput.removeListener();
      attachMidiListener(selectedInput);
    }
  });
}

function setupMidi() {
  WebMidi.enable((err) => {
    if (err) {
      console.error("MIDI could not be enabled:", err);
      return;
    }

    // Populate MIDI port options
    WebMidi.inputs.forEach((input) => {
      const option = document.createElement("option");
      option.value = input.name;
      option.textContent = input.name;
      midiSelectMenu.appendChild(option);
    });

    // Automatically select the first input if available
    if (WebMidi.inputs.length > 0) {
      const defaultInput = WebMidi.inputs[0];
      midiSelectMenu.value = defaultInput.name;
      attachMidiListener(defaultInput);
    }
  });
}

function attachMidiListener(input) {
  input.addListener("noteon", (e) => {
    // Map MIDI note to color
    const note = e.note.name[0]; // Get note name (C, D, E, etc.)
    const color = noteColorMap[note] || 0x0077ff; // Default color if note not in map

    // Adjust particle size and color
    particleSize = e.velocity * 2; // Scale size by velocity
    particleMaterial.size = particleSize;
    particleMaterial.color.setHex(color);

    // Update text with note and velocity
    displayMidiInfo(`Note: ${e.note.name} Velocity: ${e.velocity.toFixed(2)}`);
  });

  input.addListener("controlchange", (e) => {
    if (e.controller.number === 1) {
      // Assuming controller 1 is used for water flow
      gridHelper.visible = e.value > 64; // Toggle grid visibility
    }
  });
}

function displayMidiInfo(text) {
  if (!font) return;

  const textGeometry = new TextGeometry(text, {
    font: font,
    size: 0.5,
    height: 0.1,
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Random position in the scene for the text
  textMesh.position.set(
    Math.random() * 10 - 5,
    Math.random() * 5,
    Math.random() * 10 - 5
  );

  scene.add(textMesh);

  // Remove the text after 3 seconds
  setTimeout(() => {
    scene.remove(textMesh);
    textGeometry.dispose();
    textMaterial.dispose();
  }, 3000);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // Move Spotlights
  lights.forEach((light) => {
    light.position.x += Math.sin(clock.elapsedTime) * 0.1;
    light.position.y += Math.cos(clock.elapsedTime) * 0.1;
  });

  // Update Particle System (Fountain Flow)
  const positions = particleSystem.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += delta * 10 * particleSpeed; // Move particles up with speed controlled by MIDI velocity
    if (positions[i + 1] > 5) {
      positions[i + 1] = 0; // Reset particle to bottom
    }
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;

  // WASD Navigation
  const moveSpeed = 10 * delta;
  if (keys["w"]) camera.position.z -= moveSpeed;
  if (keys["s"]) camera.position.z += moveSpeed;
  if (keys["a"]) camera.position.x -= moveSpeed;
  if (keys["d"]) camera.position.x += moveSpeed;

  renderer.render(scene, camera);
}
