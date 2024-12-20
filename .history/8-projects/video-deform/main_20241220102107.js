class VideoDeformer {
  constructor() {
    this.video = document.getElementById("webcam");
    this.canvas = document.getElementById("output");
    this.ctx = this.canvas.getContext("2d");
    this.hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });
    this.camera = null;
    this.handLandmarks = [];
    this.init();
  }

  async init() {
    // Set up canvas size
    this.canvas.width = 640;
    this.canvas.height = 480;

    // Configure hands
    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.hands.onResults(this.onResults.bind(this));

    // Set up camera
    this.camera = new Camera(this.video, {
      onFrame: async () => {
        await this.hands.send({ image: this.video });
      },
      width: 640,
      height: 480,
    });

    await this.camera.start();
  }

  onResults(results) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw video frame
    this.ctx.save();
    this.ctx.drawImage(
      results.image,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.ctx.restore();

    if (results.multiHandLandmarks) {
      this.handLandmarks = results.multiHandLandmarks;
      this.applyDeformation();
    }
  }

  applyDeformation() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const pixels = imageData.data;

    for (const landmarks of this.handLandmarks) {
      // Use index finger tip (landmark 8) for deformation
      const fingerTip = landmarks[8];
      const x = Math.floor(fingerTip.x * this.canvas.width);
      const y = Math.floor(fingerTip.y * this.canvas.height);

      // Define deformation radius
      const radius = 50;

      // Apply deformation around finger tip
      for (let dy = -radius; dy < radius; dy++) {
        for (let dx = -radius; dx < radius; dx++) {
          const distSq = dx * dx + dy * dy;
          if (distSq < radius * radius) {
            const targetX = x + dx;
            const targetY = y + dy;

            if (
              targetX >= 0 &&
              targetX < this.canvas.width &&
              targetY >= 0 &&
              targetY < this.canvas.height
            ) {
              // Calculate displacement based on distance from finger
              const displacement = 1 - Math.sqrt(distSq) / radius;
              const offsetX = Math.floor(dx * displacement * 0.5);
              const offsetY = Math.floor(dy * displacement * 0.5);

              // Source pixel coordinates
              const sourceX = Math.min(
                Math.max(targetX + offsetX, 0),
                this.canvas.width - 1
              );
              const sourceY = Math.min(
                Math.max(targetY + offsetY, 0),
                this.canvas.height - 1
              );

              // Copy pixel from source to target
              const targetIndex = (targetY * this.canvas.width + targetX) * 4;
              const sourceIndex = (sourceY * this.canvas.width + sourceX) * 4;

              pixels[targetIndex] = pixels[sourceIndex]; // R
              pixels[targetIndex + 1] = pixels[sourceIndex + 1]; // G
              pixels[targetIndex + 2] = pixels[sourceIndex + 2]; // B
              pixels[targetIndex + 3] = pixels[sourceIndex + 3]; // A
            }
          }
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }
}

// Start the application
window.onload = () => {
  new VideoDeformer();
};
