// server.js
const { Server } = require("socket.io");

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("hello from client", (...args) => {
    console.log("hello from client", ...args);
    socket.emit("hello from server", ...args);
  });

  socket.on("noteOn", (data) => {
    console.log("noteOn", data);
    io.emit("noteOn", data);
  });

  socket.on("noteOff", (data) => {
    console.log("noteOff", data);
    io.emit("noteOff", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
