// sunset.js

import * as THREE from 'three';

// Horizon Line
export function createHorizon(scene) {
  const horizonGeometry = new THREE.PlaneGeometry(100, 100); // Large plane for horizon
  const horizonMaterial = new THREE.MeshBasicMaterial({ color: 0x25203b, side: THREE.DoubleSide }); // Light blue for day sky
  const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
  horizon.rotation.x = -Math.PI / 2; // Rotate to lie flat on the ground
  horizon.position.y = -5; // Set horizon below the scene's main objects
  scene.add(horizon);

  return horizon;
}

// Skybox Creation
export function createSky(scene) {
  const skyMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000, // Starting color (light blue sky)
    side: THREE.BackSide // Ensure it is on the inside of the scene
  });
  const skyGeometry = new THREE.SphereGeometry(100, 32, 32); // Large sphere for sky
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);

  return sky;
}

// Sunset Effect (Animation of sky and lighting)
export function animateSunset(sky, ambientLight, spotlight, sunsetProgress) {
  sunsetProgress += 0.0002; // Slow progression of the sunset

  // Interpolate the sky color based on sunset progress
  const startColor = new THREE.Color(0x000000); // Light blue (daytime)
  const endColor = new THREE.Color(0x2b0626); // Tomato red (sunset)
  
  const currentColor = startColor.lerp(endColor, sunsetProgress); // Gradually transition
  sky.material.color = currentColor;

  // Gradually darken the environment light (simulate the evening)
  const ambientColor = new THREE.Color(0x404040); // Dimming gray color
  const eveningColor = new THREE.Color(0x1a1a1a); // Darker gray for night time
  ambientLight.color = ambientColor.lerp(eveningColor, sunsetProgress);

  // Gradually dim the spotlight to simulate sunset
  spotlight.intensity = THREE.MathUtils.lerp(2, 0.5, sunsetProgress); // Start bright, fade out

  // Set the sun position (Optional: you could animate a sun object for realism)
  spotlight.position.set(0, 10 - sunsetProgress * 10, 0); // Sun moves lower as sunset progresses

  return sunsetProgress; // Return updated sunsetProgress
}