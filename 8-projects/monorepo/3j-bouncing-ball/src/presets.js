// preset.js
import * as THREE from 'three';
import * as Tone from 'tone';

// Function to load JSON file containing presets
export async function loadPresetFile(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.presets;
}

// Function to apply a preset to the scene
export function applyPreset(preset, cube, ball, collisionSynth, whooshingSynth, sunsetSpeed) {
  // Apply cube settings
  cube.scale.set(preset.cube.size, preset.cube.size, preset.cube.size);
  cube.material.uniforms.glowColor.value.set(preset.cube.material.glowColor);
  cube.material.uniforms.glowIntensity.value = preset.cube.material.glowIntensity;

  // Apply ball settings
  ball.scale.set(preset.ball.radius, preset.ball.radius, preset.ball.radius);
  ball.material.uniforms.glowColor.value.set(preset.ball.material.glowColor);
  ball.material.uniforms.glowIntensity.value = preset.ball.material.glowIntensity;
  ball.velocity.set(preset.ball.velocity.x, preset.ball.velocity.y, preset.ball.velocity.z);

  // Apply audio settings (e.g., collisionSynth, whooshingSynth)
  collisionSynth.set({
    volume: preset.audio.collisionSynth.volume,
    pitchDecay: preset.audio.collisionSynth.pitchDecay
  });

  whooshingSynth.set({
    volume: preset.audio.whooshingSynth.volume,
    envelope: preset.audio.whooshingSynth.envelope
  });

  // Apply sunset settings
  sunsetSpeed = preset.sunset.speed;
  scene.background = new THREE.Color(preset.sunset.color);
}

// Function to generate a random preset
export function generateRandomPreset() {
  const randomPreset = {
    cube: {
      size: Math.random() * 10, // Random cube size between 0 and 10
      material: {
        glowColor: new THREE.Color(Math.random(), Math.random(), Math.random()), // Random color
        glowIntensity: Math.random() * 2 // Random glow intensity
      }
    },
    ball: {
      radius: Math.random() * 1, // Random ball radius between 0 and 1
      velocity: {
        x: Math.random() * 0.1,
        y: Math.random() * 0.1,
        z: Math.random() * 0.1
      },
      material: {
        glowColor: new THREE.Color(Math.random(), Math.random(), Math.random()), // Random color
        glowIntensity: Math.random() * 2 // Random glow intensity
      }
    },
    audio: {
      collisionSynth: {
        volume: -Math.random() * 20, // Random volume between -20 and 0
        pitchDecay: Math.random() * 0.1 // Random pitch decay between 0 and 0.1
      },
      whooshingSynth: {
        volume: -Math.random() * 30, // Random volume between -30 and -10
        envelope: {
          attack: Math.random() * 0.1,
          decay: Math.random() * 0.2,
          sustain: Math.random() * 0.3,
          release: Math.random() * 0.5
        }
      }
    },
    sunset: {
      speed: Math.random() * 0.1,
      color: new THREE.Color(Math.random(), Math.random(), Math.random()) // Random sunset color
    }
  };
  return randomPreset;
}