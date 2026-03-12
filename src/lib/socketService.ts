import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting) {
      return this.socket as Socket;
    }

    this.isConnecting = true;

    const userId = localStorage.getItem("userId");
    // Try to read JWT token from cookie or localStorage (common name: token)
    const tokenFromLocal = localStorage.getItem("token");
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    const token = cookieToken || tokenFromLocal || null;

    if (!userId && !token) {
      console.warn("No userId or token found for socket auth");
    }

    this.socket = io(`${import.meta.env.VITE_SOCKET_URL}/chat`, {
      auth: { userId: userId || "", token: token || "" },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      this.isConnecting = false;
    });

    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
