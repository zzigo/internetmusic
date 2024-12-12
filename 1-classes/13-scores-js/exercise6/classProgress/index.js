import kickPath from "../../assets/kick.wav";
import snarePath from "../../assets/snare.wav";
import hihatPath from "../../assets/closedHat.wav";
import ridePath from "../../assets/ride.wav";

import "zyklus";

const ctx = new AudioContext();
document.addEventListener("click", () => ctx.resume());

const app = document.querySelector("#app");

const pattern = {
  length: 11,
  kick: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  snare: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  ride: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  hihat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const paths = [kickPath, snarePath, hihatPath, ridePath];

const buffers = paths.map((path) =>
  fetch(path)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
);

Promise.all(buffers).then((decodedBuffers) => {
  decodedBuffers.forEach((b, i) => {
    // play with button
    const button = document.createElement("button");
    button.innerHTML = "Play " + i;
    button.addEventListener("click", () => {
      playBuffer(b);
    });
    app.appendChild(button);
    // play with keyboard
    document.addEventListener("keydown", (e) => {
      if (e.key === (i + 1).toString()) playBuffer(b);
    });
    // play with loop
    // const clock = ctx
    //   .createClock((time, duration, tick) => {
    //     playBuffer(b);
    //   }, Math.random() * 2 + 0.5)
    //   .start();
  });
  const clock = ctx
    .createClock((time, duration, tick) => {
      if (pattern.kick[tick % pattern.length] === 1)
        playBuffer(decodedBuffers[0]);
      if (pattern.snare[tick % pattern.length] === 1)
        playBuffer(decodedBuffers[1]);
      if (pattern.hihat[tick % pattern.length] === 1)
        playBuffer(decodedBuffers[2]);
      if (pattern.ride[tick % pattern.length] === 1)
        playBuffer(decodedBuffers[3]);
    }, 0.25)
    .start();
});

const playBuffer = (b) => {
  const source = ctx.createBufferSource();
  source.buffer = b;
  source.connect(ctx.destination);
  source.start(ctx.currentTime);
};
