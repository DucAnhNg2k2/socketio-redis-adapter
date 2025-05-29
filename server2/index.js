import { createClient } from "redis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

async function startServer2() {
  const pubClient = createClient({ url: "redis://localhost:6379" });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  const io = new Server({
    adapter: createAdapter(pubClient, subClient),
  });

  io.on("connection", (socket) => {
    console.log("A user connected");
    console.log(`Socket ID: ${socket.id}`);

    socket.on("newmessage", (data) => {
      console.log("Message received:", data);
    });
  });

  const allSocket = await io.in("room:ducanh2305").fetchSockets();
  console.log('All sockets in room "room:ducanh2305":', allSocket);

  io.listen(3001);
  console.log("Server is running on port 3001");

  setTimeout(() => {
    io.timeout(5000).to("room:ducanh2305").emit("newmessage", {
      text: "Hello, room!",
    });
  }, 10000);
}
startServer2();
