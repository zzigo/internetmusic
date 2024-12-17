import * as THREE from 'three';
import axios from 'axios';

const fetchTexture = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: prompt,
        n: 1,
        size: '512x512'
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      }
    );
    // Check if the response contains the URL
    const textureUrl = await fetchTexture("A futuristic metal texture");
if (textureUrl) {
  const texture = new THREE.TextureLoader().load(textureUrl, () => {
    console.log("Texture loaded successfully!");
    // Proceed with setting the texture on a material or mesh
  });
} else {
  console.error("Failed to fetch texture");
}

    return textureUrl;
  } catch (error) {
    console.error("Error fetching texture:", error);
    return null;
  }
};

async function setupScene() {
  console.log("API Key:", import.meta.env.VITE_API_KEY);

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  console.log("Initializing scene...");
  console.log("Renderer created...");
  const scene = new THREE.Scene();

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Example of using a fetched AI-generated texture
  const textureUrl = await fetchTexture("A futuristic metal texture");
  const texture = new THREE.TextureLoader().load(textureUrl);
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  
  animate();
}

setupScene();