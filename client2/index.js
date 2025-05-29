const { io } = require("socket.io-client");

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to server");
  console.log(`Socket ID: ${socket.id}`);
});

socket.on("newmessage", (data) => {
  console.log("Message received:", data);
});

setTimeout(() => {
    const message = { text: "Hello, server! I'm client2" };
    console.log("Sending message:", message);
    socket.emit("newmessage", message);
}, 2000);