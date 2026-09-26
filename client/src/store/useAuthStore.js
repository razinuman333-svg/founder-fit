import { create } from "zustand";
import axios from 'axios'
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  socketStatus: "disconnected",
  getToken: null,

  checkAuth: async (getToken) => {
    set({ isCheckingAuth: true });

    try {
      const tokenProvider = getToken || get().getToken;
      if (!tokenProvider) throw new Error("Clerk token provider is unavailable");
      set({ getToken: tokenProvider });
      const token = await tokenProvider();
      const res = await axios.get("/api/auth/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ authUser: res.data });

      get().connectSocket(res.data);
    } catch (error) {
      console.error("Error in checkAuth:", error.message);
      set({ authUser: null });
      get().disconnectSocket();
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  clearAuth: () => {
    set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
    get().disconnectSocket();
  },

  connectSocket: (user) => {
    const getToken = get().getToken;
    if (!user || !getToken || get().socket) return;

    set({ socketStatus: "connecting" });
    const socket = io(BASE_URL, {
      auth: (callback) => {
        getToken()
          .then((token) => callback({ token }))
          .catch(() => callback({ token: null }));
      },
    });

    set({ socket });

    socket.on("connect", () => set({ socketStatus: "connected" }));
    socket.on("disconnect", () => set({ socketStatus: "disconnected", onlineUsers: [] }));
    socket.on("connect_error", (error) => {
      console.error("Socket connection failed:", error.message);
      set({ socketStatus: "error" });
    });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    socket?.disconnect();
    set({ socket: null, onlineUsers: [], socketStatus: "disconnected" });
  },
}));