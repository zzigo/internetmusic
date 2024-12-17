import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'; // Hook to load GLTF models
import * as THREE from 'three';

// Component to Load the GLB Model
const Model = () => {
  const { scene } = useGLTF('./avatar1.glb'); // Path to your GLB file

  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
};

// Main App Component
const App = () => {
  return (
    <Canvas>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Model */}
      <Model />

      {/* Optional: Add a camera */}
      <camera position={[0, 0, 5]} />
    </Canvas>
  );
};

export default App;