import { Socket } from "socket.io-client";
import socketService from ".";

class SocketHandler {
    socketService = socketService;
    socket: Socket | null = null;

    constructor() {
        this.socket = socketService.getSocket();
    }

    async ensureSocket() {
        if (!this.socket) {
            await this.socketService.initializeSocket();
            this.socket = this.socketService.getSocket();
        }
    }

    async handleRead(fileId: string) {
        await this.ensureSocket(); // Ensure socket is initialized
        if (this.socket) {
            this.socket.emit("markAsRead", { fileId });
        } else {
            console.error("Socket is not initialized");
        }
    }
}

const socketHandler = new SocketHandler();
export default socketHandler;
