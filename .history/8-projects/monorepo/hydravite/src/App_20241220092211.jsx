import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import * as Tone from "tone";

function RotatingCube({ texture }) {
  const cubeRef = useRef();

  useFrame((state, delta) => {
    cubeRef.current.rotation.x += delta * 0.5;
    cubeRef.current.rotation.y += delta * 0.10;
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

function App() {
  const hydraCanvasRef = useRef(null);
  const textureRef = useRef(new THREE.Texture());
  // const { camera } = useThree();  // Accessing the camera from Three.js

  const [counterActive, setCounterActive] = useState(false);  // Estado para activar/desactivar contador
  const [seconds, setSeconds] = useState(0);  // Estado para llevar el conteo
  const [counter, setCounter] = useState(null);  // Referencia del temporizador de Tone.js

  // Configurar Tone.js para el contador
useEffect(() => {
    // Inicializar el contador solo cuando se active
    if (counterActive) {
      const newCounter = new Tone.Loop((time) => {
        setSeconds((prev) => prev + 1);
      }, 1); // 1 segundo por loop

      newCounter.start(0); // Comienza el contador inmediatamente
      Tone.Transport.start(); // Asegura que el transporte de Tone.js esté corriendo

      setCounter(newCounter); // Guarda la referencia al contador

      return () => {
        newCounter.stop(); // Detiene el contador cuando se desactive
        Tone.Transport.stop();
      };
    } else {
      // Si el contador no está activo, resetea el contador
      setSeconds(0);
    }
  }, [counterActive]); // Solo se activa cuando 'counterActive' cambia

  // Manejar el evento de la barra espaciadora
  useEffect(() => {
    const handleSpaceBar = (e) => {
      if (e.key === " ") {
        setCounterActive((prev) => !prev); // Alternar el estado de la activación del contador
      }
    };

    window.addEventListener("keydown", handleSpaceBar);

    return () => {
      window.removeEventListener("keydown", handleSpaceBar); // Limpiar el evento cuando el componente se desmonte
    };
  }, []);

  useEffect(() => {
    const hydraCanvas = hydraCanvasRef.current;

    if (hydraCanvas) {
      // Iniciar Hydra en el canvas oculto
      const hydra = new Hydra({ canvas: hydraCanvas });
      osc(1, -0.125)
      .modulate(voronoi(10))
      .diff(voronoi(10).mult(gradient(-1).luma(125)))
      .luma(125)
      .add(
        shape(2, 2)
          .mult(voronoi(10, 2).blend(o0).diff(gradient(1)).modulate(voronoi()))
      )
      // .scrollY(-0.1)
      // .scrollX(0.125)
      .blend(o0)
      .blend(o1)
      .out();

      // Actualizar la textura en cada frame
      const updateTexture = () => {
        textureRef.current.needsUpdate = true;
        textureRef.current.image = hydraCanvas;
      };

      // Forzar actualización periódica
      const intervalId = setInterval(updateTexture, 16); // Aproximadamente 60 fps

      return () => clearInterval(intervalId); // Limpiar al desmontar
    }
  }, []);

  return (
    <>
      {/* Canvas de Hydra, fuera de la pantalla */}
      <canvas
        ref={hydraCanvasRef}
        style={{
          position: "absolute",
          top: "-100vh", // Mover fuera de la pantalla
          left: "-100vw",
          width: "512px", // Tamaño pequeño para ahorrar recursos
          height: "512px",
        }}
      />

      {/* Canvas de Three.js a pantalla completa */}
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <RotatingCube texture={textureRef.current} />
      </Canvas>

      {/* Mostrar el contador en la pantalla */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          fontSize: "30px",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {counterActive ? `Time: ${seconds}s` : `Counter is OFF`}
      </div>
    </>
  );
}

export default App;