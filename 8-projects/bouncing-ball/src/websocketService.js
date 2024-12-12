import { WebSocketServer } from 'ws';

export function createWebSocketService(scene, audioObjects) {
  const wss = new WebSocketServer({ port: 8080 });

  console.log('WebSocket server running on ws://localhost:8080');

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        // Handle rotation commands
        if (data.type === 'rotate') {
          const { axis, angle } = data;
          if (axis && angle) {
            rotateScene(scene, axis, angle);
          }
        }

        // Handle volume commands
        if (data.type === 'volume') {
          const { volume } = data;
          if (typeof volume === 'number' && volume >= 0 && volume <= 1) {
            setVolume(audioObjects, volume);
          }
        }
      } catch (err) {
        console.error('Invalid message received:', message, err);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}

// Rotate the entire scene or specific objects
function rotateScene(scene, axis, angle) {
  const rotationAxis = new THREE.Vector3(
    axis === 'x' ? 1 : 0,
    axis === 'y' ? 1 : 0,
    axis === 'z' ? 1 : 0
  );
  scene.rotateOnWorldAxis(rotationAxis, angle);
  console.log(`Rotated scene on ${axis} axis by ${angle} radians`);
}

// Set the volume of audio objects
function setVolume(audioObjects, volume) {
  audioObjects.forEach((audioObject) => {
    if (audioObject.volume) {
      audioObject.volume.value = THREE.MathUtils.lerp(-60, 0, volume); // Map 0-1 to dB range
    }
  });
  console.log(`Set volume to ${volume}`);
}