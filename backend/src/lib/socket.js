import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return [...(userSocketMap[userId] || [])][0];
}

// used to store online users
const userSocketMap = {}; // {userId: Set<socketId>}

const emitOnlineUsers = () => {
  const onlineUsers = Object.entries(userSocketMap)
    .filter(([, socketIds]) => socketIds.size > 0)
    .map(([userId]) => userId);

  io.emit("getOnlineUsers", onlineUsers);
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (typeof userId === "string" && userId.trim()) {
    if (!userSocketMap[userId]) userSocketMap[userId] = new Set();
    userSocketMap[userId].add(socket.id);
  }

  // io.emit() is used to send events to all the connected clients
  emitOnlineUsers();

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);
      if (userSocketMap[userId].size === 0) delete userSocketMap[userId];
    }
    emitOnlineUsers();
  });
});

export { io, app, server };
