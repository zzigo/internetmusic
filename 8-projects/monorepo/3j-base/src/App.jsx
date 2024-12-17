import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Box, OrbitControls, PositionalAudio, Html } from "@react-three/drei";
import { a } from '@react-spring/three'
import * as THREE  from 'three';
import './App.css';

function CircularCamera() {
  const cameraRef = useRef();
  const radius = 5; // Distance from the center of the scene
  const speed = 0.05; // Speed of the camera rotation



  useFrame(({ clock, camera }) => {
    const elapsedTime = clock.getElapsedTime();
    const x = radius * Math.cos(elapsedTime * speed);
    const z = radius * Math.sin(elapsedTime * speed);

    // Update the camera position and make it look at the center (0, 0, 0)
    camera.position.set(x, 2, z); // Adjust height with the Y position (e.g., 2)
    camera.lookAt(0, 0, 0);
  });

  return null; // No need to render anything directly
}

// Scene 1: Cube moving randomly in x, y, z
function RandomMovingCube() {
  const cubeRef = useRef();
  const videoRef = useRef();



    // Create a texture from the video element
    const [videoTexture, setVideoTexture] = useState();

    useEffect(() => {
  // Create a video element and set up the video source
    const video = document.createElement('video');
    video.src = '/zztt-teaser-color1.mp4'; // Replace with the actual path to your video 
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.play();

    // Update the video texture when the video is playing
    const texture = new THREE.VideoTexture(video);
    setVideoTexture(texture);

    // Store a reference to the video element for cleanup
    videoRef.current = video;

    return () => {
      // Clean up video element when the component unmounts
      video.pause();
      video.src = '';
      video.load();
    };
  }, []);
  useFrame((clock) => {
   
    if (cubeRef.current) {
      // const elapsedTime = clock.getElapsedTime();
      // Move the cube randomly within a range of -2 to 2 in all directions
      const cubeSpeed = 0.01; // Adjust the speed as needed
      cubeRef.current.position.x += (Math.random() - 0.5) *  cubeSpeed;
      cubeRef.current.position.y += (Math.random() - 0.5) *  cubeSpeed;
      cubeRef.current.position.z += (Math.random() - 0.5) *  cubeSpeed;

      // Keep the cube within a certain range
      cubeRef.current.position.clamp(
        new THREE.Vector3(-2, -2, -2),
        new THREE.Vector3(2, 2, 2)
      );
    }
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[5, 5, 5]} />
      {/* <meshStandardMaterial color="royalblue" /> */}
      <meshStandardMaterial map={videoTexture} />


    </mesh>
  );
}

// Scene 2: Sphere growing and shrinking
function PulsatingSphere() {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      // Calculate the scale factor based on time for a pulsing effect
      const scale = 1 + 0.5 * Math.sin(clock.getElapsedTime());
      sphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="tomato" />
    </mesh>
  );
}

function Scene2({ sceneIndex }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Conditionally render the scenes */}
      {sceneIndex === 0 && <RandomMovingCube />}
      {sceneIndex === 1 && <PulsatingSphere />}

      {/* Optional: Grid and Axes Helpers */}
      <gridHelper args={[10, 10]} />
      <axesHelper args={[5]} />
    </>
  );
}


function VideoCube() {
  const meshRef = useRef();
  const audioRef = useRef();
  const [video] = useState(() => {
    // Create a video element
    const vid = document.createElement('video');
    vid.src = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Replace with your video URL
    vid.crossOrigin = 'anonymous';
    vid.loop = true;
    vid.muted = true; // Mute to allow autoplay
    vid.play();
    return vid;
  });

  useEffect(() => {
    // Create a video texture
    if (meshRef.current) {
      const videoTexture = new THREE.VideoTexture(video);
      meshRef.current.material.map = videoTexture;
      meshRef.current.material.needsUpdate = true;
    }
  }, [video]);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
      {/* Attach positional audio */}
      <PositionalAudio ref={audioRef} url="/zztt-teaser-color1.mp4" distance={5} loop />
    </mesh>
  );
}



// old square
function Square(props) {
  return (
    <mesh {...props} scale={0.5}>
      <ringBufferGeometry attach="geometry" args={[8.9, 9, 4]} />
      <meshStandardMaterial attach="material" color="#7ea7a8" metalness={0} />
    </mesh>
  )
}


function Content() {
  const ref = useRef()

  useFrame(() => {
    ref.current.rotation.z += 0.001
  })

  return (
    <group ref={ref}>
      <Square position={[0, 0, 56]} />
      <Square position={[0, 0, 63]} />
      <Square position={[0, 0, 67]} />
      <Square position={[0, 0, 70]} />
    </group>
  )
}


const Scene = () => {
  const boxRef = useRef();
  useFrame((state, delta) => {
    boxRef.current.rotation.y += 0.02;
  });

  

  return (
    <>
      <Box ref={boxRef} args={[1, 1, 1]} rotation={[0.5, 0, 0]}>
        <meshNormalMaterial />
      </Box>
      <ambientLight />
    </>
  );
};

// const App = () => {

//   const [sceneIndex, setSceneIndex] = useState(0); // 0 for Scene 1, 1 for Scene 2


//   const positions = [
//     [0, 0, 0],  // Position 1
//     [2, 0, 0],  // Position 2
//     [-2, 0, 0]  // Position 3
//   ];

//     // State to track the current position index
//     const [positionIndex, setPositionIndex] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);

//     useEffect(() => {
//       let interval;
//       const handleKeyDown = (event) => {
//         if (event.code === 'Space') {
//           // Toggle between the two scenes
//           setSceneIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
//         }
//       };

//       if (isPlaying) {
//         interval = setInterval(() => {
//           // Update the position index, looping back to the start if at the end
//           setPositionIndex((prevIndex) => (prevIndex + 1) % positions.length);
//         }, 1000); // Change position every 1 second (1000ms)
//       }
//       window.addEventListener('keydown', handleKeyDown);

//       // Cleanup interval when component unmounts or stops
//       return () => clearInterval(interval);
//     }, [isPlaying]);
  
//     // Function to handle the start and stop of the animation
//     const handleStartStop = () => {
//       setIsPlaying((prev) => !prev);
//     };
  


//       // Function to handle position change
//   const changePosition = (index) => {
//     if (index >= 0 && index < positions.length) {
//       setPositionIndex(index);
//     }
//   };


//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       {/* Render the 3D Canvas */}
//       <Canvas style={{ width: '100%', height: '95vh' }}>
//       <CircularCamera />
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[5, 5, 5]} intensity={10} />
        
        
//         {/* Render the cube at the current position without texture */}
//         <mesh position={positions[positionIndex]}>
//           <boxGeometry args={[1, 1, 1]} />
//           <meshStandardMaterial color="green" />
//         </mesh>

//          {/* <VideoCube /> */}
        
//         <axesHelper args={[5]} />
//         <gridHelper args={[10, 10]} />
//         {/* <Scene /> */}
//         <Scene sceneIndex={sceneIndex} />
 
//         <OrbitControls enableRotate={false} enablePan={true} />

//       </Canvas>
      
//       {/* Timeline controls */}
//       {/* <div style={{ marginTop: '20px' }}>
//         <button onClick={() => changePosition(0)}>Position 1</button>
//         <button onClick={() => changePosition(1)}>Position 2</button>
//         <button onClick={() => changePosition(2)}>Position 3</button>
//       </div>
//     </div> */}

//        {/* Control to start or stop the timeline */}
//        <div style={{ marginTop: '20px' }}>
//         <button onClick={handleStartStop}>
//           {isPlaying ? 'Stop' : 'Start'}
//         </button>
//       </div>
//     </div>

function App() {
  const [sceneIndex, setSceneIndex] = useState(0); // 0 for Scene 1, 1 for Scene 2

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        // Toggle between the two scenes
        setSceneIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="scene-label">
        {/* Display the scene number */}
        Scene {sceneIndex + 1}
      </div>
      <Canvas style={{ width: '100%', height: '100vh' }}>
      <CircularCamera />
       <ambientLight intensity={0.5} />
       <directionalLight position={[5, 5, 5]} intensity={10} />
        
        <Scene2 sceneIndex={sceneIndex} />
        <OrbitControls />
      </Canvas>
    </>
  );
}


export default App;