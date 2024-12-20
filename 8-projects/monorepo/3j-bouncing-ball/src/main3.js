import * as THREE from "three";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import React from "react";
import ReactDOM from "react-dom/client";

// Create custom shader material
const CircleShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      
      // Create smooth circle
      float circle = smoothstep(0.3, 0.29, dist);
      
      // Add pulsing effect
      float pulse = sin(uTime * 2.0) * 0.05;
      circle *= 1.0 + pulse;
      
      // Add color
      vec3 color = vec3(0.5 + sin(uTime) * 0.5, 0.0, 0.5 + cos(uTime) * 0.5);
      
      gl_FragColor = vec4(color * circle, circle);
    }
  `
);

// Extend to make it available in JSX
extend({ CircleShaderMaterial });

// Create a plane with the shader
function ShaderPlane() {
  const materialRef = React.useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <circleShaderMaterial ref={materialRef} transparent />
    </mesh>
  );
}

// Main App component
function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ShaderPlane />
      </Canvas>
    </div>
  );
}

// Add styles to make it fullscreen
const style = document.createElement("style");
style.textContent = `
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  #root {
    width: 100vw;
    height: 100vh;
  }
`;
document.head.appendChild(style);

// Create root and render
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
