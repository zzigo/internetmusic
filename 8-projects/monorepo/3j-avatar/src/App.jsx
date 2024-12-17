import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useEffect, useState } from 'react';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as Tone from 'tone';

function Avatar() {
  const avatarRef = useRef();
  const { scene, animations } = useGLTF('/avatar1.glb');  // Path to your GLB file
  const mixer = useRef();
  const [bones, setBones] = useState({});
  const rotationSpeed = useRef(0.02); // Starting speed
  const rotationBounds = useRef({ min: -Math.PI / 6, max: Math.PI / 6 }); // Starting bounds
  const rotationDirection = useRef(1); // 1 for left, -1 for right



  // Animation
  useEffect(() => {
    if (animations && animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        mixer.current.clipAction(clip).play();
      });
    }
  // Extract bones for easier manipulation
  const extractedBones = {};
   const boneNames = [];
  scene.traverse((object) => {
    if (object.isBone) {
      boneNames.push(object.name);
      if (object.name === 'forearmL') extractedBones.leftArm = object;
      if (object.name === 'forearmR') extractedBones.rightArm = object;
      if (object.name === 'head') extractedBones.head = object;
    }
  });
  console.log('Bone Names:', boneNames);
  setBones(extractedBones);
}, [animations, scene]);

  // Floating, rotating and bouncing motion using useFrame hook
  const [bounds, setBounds] = useState({ x: 0, y: 0, z: 0 });
  useFrame((state, delta) => {
    mixer.current?.update(delta);
    
    // Get current time for oscillating movement
    const time = state.clock.elapsedTime;

    const maxRotation = Math.PI / 6; // Maximum rotation angle (30 degrees)
    const minRotation = -Math.PI / 6; // Minimum rotation angle (-30 degrees)
      const speed = 0.02; // Rotation speed

    // Example of moving the arms
    if (bones.leftArm) { bones.leftArm.rotation.z = Math.sin(Date.now() * speed) / 20; randomizeMovement(); }
    if (bones.rightArm) { bones.rightArm.rotation.z = Math.cos(Date.now() * speed) / 20; randomizeMovement();}
    if (bones.head) { 
      
      bones.head.rotation.y += rotationDirection.current * speed;
      if (bones.head.rotation.y >= maxRotation) {
        bones.head.rotation.y = maxRotation;
        rotationDirection.current = -1; // Reverse direction
        randomizeMovement(); // Randomize next movement
      }
      if (bones.head.rotation.y <= minRotation) {
        bones.head.rotation.y = minRotation;
        rotationDirection.current = 1; // Reverse direction
        randomizeMovement(); // Randomize next movement
      }
    }

    
    // Update floating (sinusoidal)
    avatarRef.current.position.y = Math.sin(time) * 0.1;
    
    // Rotate the avatar continuously on all axes
    // avatarRef.current.rotation.x += 0.001;
    // avatarRef.current.rotation.y += 0.002;
    // avatarRef.current.rotation.z += 0.003;

    // Apply bouncing limits for the avatar on all axes
    avatarRef.current.position.x = Math.sin(time) * 5;
    avatarRef.current.position.z = Math.cos(time) * 5;
    
    // Ensure avatar bounces within screen limits
    if (avatarRef.current.position.x > 5) avatarRef.current.position.x = 5;
    if (avatarRef.current.position.x < -5) avatarRef.current.position.x = -5;
    if (avatarRef.current.position.z > 5) avatarRef.current.position.z = 5;
    if (avatarRef.current.position.z < -5) avatarRef.current.position.z = -5;
  });

  function randomizeMovement() {
    // Randomize speed (between 0.01 and 0.05)
    rotationSpeed.current = 0.01 + Math.random() * 0.04;

    // Randomize bounds (between 15 and 45 degrees)
    const maxRotation = Math.PI / 4; // 45 degrees
    const minRotation = Math.PI / 12; // 15 degrees
    const randomMax = minRotation + Math.random() * (maxRotation - minRotation);
    const randomMin = -randomMax;
    rotationBounds.current = { min: randomMin, max: randomMax };
  }


  return <primitive ref={avatarRef} object={scene} />;
}

function DroneSynth() {
  useEffect(() => {
    const startSynth = async () => {
      // Wait for Tone to be ready
      await Tone.start();

      // Create synths
      const synth1 = new Tone.Synth().toDestination();
      const synth2 = new Tone.Synth().toDestination();
      const synth3 = new Tone.Synth().toDestination();

      // Layered rhythm and timing
      Tone.Transport.bpm.value = 120;

      // Schedule note triggers
      Tone.Transport.scheduleRepeat((time) => {
        synth1.triggerAttackRelease("C2", "4n", time);
      }, "1m");

      Tone.Transport.scheduleRepeat((time) => {
        synth2.triggerAttackRelease("E1", "8n", time);
      }, "2m");

      Tone.Transport.scheduleRepeat((time) => {
        synth3.triggerAttackRelease("F#1", "1n", time);
      }, "4m");

      // Start the transport
      Tone.Transport.start();

      // Clean up
      return () => {
        Tone.Transport.stop();
      };
    };

    startSynth();
  }, []);

  return null;
}

function App() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Start the audio context when the user clicks anywhere on the screen
  useEffect(() => {
    const startAudioContext = () => {
      Tone.start();  // Ensure the audio context is started
      window.removeEventListener('click', startAudioContext); // Remove listener after it's triggered
    };
    
    window.addEventListener('click', startAudioContext); // Add event listener on window click

    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ height: '100vh', margin: 0, overflow: 'hidden' }}>
      <Canvas
        style={{
          width: '100vw',
          height: '100vh',
        }}
        camera={{
          position: [0, 2, 5],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <Suspense fallback={null}>
          <Avatar />
          <DroneSynth />
          <OrbitControls />
          <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;