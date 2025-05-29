import { createClient } from "redis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

async function startServer() {
  const pubClient = createClient({ url: "redis://localhost:6379" });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  const io = new Server({
    adapter: createAdapter(pubClient, subClient),
  });

  io.on("connection", (socket) => {
    console.log("A user connected");
    console.log(`Socket ID: ${socket.id}`);
    socket.join("room:ducanh2305");

    socket.on("newmessage", (data) => {
      console.log("Message received:", data);
    });
  });

  io.listen(3000);
  console.log("Server is running on port 3000");
}
startServer();
