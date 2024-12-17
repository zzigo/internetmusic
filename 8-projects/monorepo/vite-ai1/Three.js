import * as THREE from 'three';
import { generateAIImage } from './useAIImageGenerator.js';

async function addAICubeToScene(scene) {
  const prompt = "A futuristic metal texture";
  const imageUrl = await generateAIImage(prompt);
  
  if (imageUrl) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl);
    
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
    scene.add(cube);
  }
}