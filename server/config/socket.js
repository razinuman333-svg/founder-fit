import express from "express";
import http from "http";
import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, { cors: { origin: [allowedOrigin], credentials: true } });

function getReceiverRoom(userId) {
  return userSocketMap.has(userId) ? `user:${userId}` : null;
}

const userSocketMap = new Map();

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token || !process.env.CLERK_SECRET_KEY) {
    next(new Error("Unauthorized"));
    return;
  }

  try {
    const { data, errors } = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      authorizedParties: [allowedOrigin],
    });
    if (errors?.length || !data?.sub) {
      next(new Error("Unauthorized"));
      return;
    }
    socket.data.userId = data.sub;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  const userSockets = userSocketMap.get(userId) || new Set();
  userSockets.add(socket.id);
  userSocketMap.set(userId, userSockets);
  socket.join(`user:${userId}`);
  io.emit("getOnlineUsers", [...userSocketMap.keys()]);

  socket.on("disconnect", () => {
    const activeSockets = userSocketMap.get(userId);
    activeSockets?.delete(socket.id);
    if (!activeSockets?.size) userSocketMap.delete(userId);
    io.emit("getOnlineUsers", [...userSocketMap.keys()]);
  });
});

export { app, server, io, getReceiverRoom };