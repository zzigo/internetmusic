import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Mouth({ speechText }) {
  const upperLipRef = useRef();
  const lowerLipRef = useRef();
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Function to start text-to-speech and control the mouth movement
    const speak = (text) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      // Start speaking
      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      // Stop speaking
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      // Speak the text
      synth.speak(utterance);
    };

    if (speechText) {
      speak(speechText);
    }
  }, [speechText]);

  // Animate the mouth opening and closing based on whether the character is speaking
  useFrame(() => {
    if (upperLipRef.current && lowerLipRef.current) {
      const mouthMovement = isSpeaking ? Math.sin(Date.now() * 0.01) * 0.1 : 0;

      // Adjust the position of the upper and lower lips to simulate mouth movement
      upperLipRef.current.position.y = 0.1 + mouthMovement; // Move up and down
      lowerLipRef.current.position.y = -0.1 - mouthMovement; // Move down and up
    }
  });

  return (
    <>
      {/* Upper lip */}
      <mesh ref={upperLipRef} position={[0, 0.1, 0]}>
        <planeGeometry args={[0.3, 0.05]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {/* Lower lip */}
      <mesh ref={lowerLipRef} position={[0, -0.1, 0]}>
        <planeGeometry args={[0.3, 0.05]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
}

export default function App() {
  const [text, setText] = useState('Hello! This is a text-to-speech demo.');

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        <Mouth speechText={text} />
      </Canvas>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ position: 'absolute', bottom: '20px', left: '20px', width: '200px' }}
      />
      <button
        onClick={() => window.speechSynthesis.cancel()}
        style={{ position: 'absolute', bottom: '20px', left: '240px' }}
      >
        Stop Speech
      </button>
    </div>
  );
}