import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.currentRoom = null;
    this.listeners = new Map(); // Track listeners per event
  }

  // Connect to socket server
  connect(userId, userName) {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.socket && !this.socket.connected) {
      this.socket.connect();
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      this.connected = true;
    });

    this.socket.on("disconnect", () => {
      this.connected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return this.socket;
  }

  // Join a chat room
  joinRoom(department, semester, userId, userName) {
    if (!this.socket) {
      console.error("❌ Socket not connected");
      return;
    }

    const roomId = `${department}_${semester}`;

    // Don't rejoin if already in this room
    if (this.currentRoom === roomId) {
      return;
    }

    this.socket.emit("join_room", {
      department,
      semester,
      userId,
      userName,
    });

    this.currentRoom = roomId;
  }

  // Leave a chat room
  leaveRoom(department, semester, userId, userName) {
    if (this.socket) {
      const roomId = `${department}_${semester}`;
      this.socket.emit("leave_room", {
        roomId,
        userId,
        userName,
      });

      if (this.currentRoom === roomId) {
        this.currentRoom = null;
      }
    }
  }

  // Send a message
  sendMessage(
    department,
    semester,
    message,
    userId,
    userName,
    userEmail,
    replyTo = null
  ) {
    if (this.socket) {
      this.socket.emit("send_message", {
        department,
        semester,
        message,
        userId,
        userName,
        userEmail,
        replyTo,
      });
    }
  }

  // Send typing indicator
  startTyping(roomId, userName) {
    if (this.socket) {
      this.socket.emit("typing", { roomId, userName });
    }
  }

  stopTyping(roomId) {
    if (this.socket) {
      this.socket.emit("stop_typing", { roomId });
    }
  }

  // Delete message
  deleteMessage(messageId, roomId) {
    if (this.socket) {
      this.socket.emit("delete_message", { messageId, roomId });
    }
  }

  // ✅ FIXED: Add listener with automatic deduplication
  addListener(event, callback) {
    if (!this.socket) return;

    // Get existing listeners for this event
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const eventListeners = this.listeners.get(event);

    // Check if callback already registered
    if (eventListeners.has(callback)) {
      return;
    }

    // Add new listener
    this.socket.on(event, callback);
    eventListeners.add(callback);
  }

  // ✅ FIXED: Remove specific listener
  removeListener(event, callback) {
    if (!this.socket) return;

    const eventListeners = this.listeners.get(event);
    if (eventListeners && eventListeners.has(callback)) {
      this.socket.off(event, callback);
      eventListeners.delete(callback);
    }
  }

  // ✅ FIXED: Remove all listeners for specific component
  removeListenersForComponent(componentId) {
    // This would require tracking which component owns which listener
    // For now, we'll keep global listeners since both components need them
  }

  // Listen for events (wrapper methods)
  onReceiveMessage(callback) {
    this.addListener("receive_message", callback);
  }

  onUserJoined(callback) {
    this.addListener("user_joined", callback);
  }

  onUserLeft(callback) {
    this.addListener("user_left", callback);
  }

  onActiveUsers(callback) {
    this.addListener("active_users", callback);
  }

  onUserTyping(callback) {
    this.addListener("user_typing", callback);
  }

  onUserStopTyping(callback) {
    this.addListener("user_stop_typing", callback);
  }

  onMessageDeleted(callback) {
    this.addListener("message_deleted", callback);
  }

  onError(callback) {
    this.addListener("error", callback);
  }

  // ⚠️ DANGEROUS: Only use when truly needed (logout, user switch)
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.listeners.clear();
    }
  }

  // Disconnect socket (use only on logout)
  disconnect() {
    if (this.socket) {
      this.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.currentRoom = null;
    }
  }

  // Check if connected
  isConnected() {
    return this.connected && this.socket?.connected;
  }

  // Get current room
  getCurrentRoom() {
    return this.currentRoom;
  }
}

// Export singleton instance
export default new SocketService();
