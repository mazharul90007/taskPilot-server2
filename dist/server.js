"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: config_1.default.frontend_base_url,
        credentials: true,
    },
});
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Join a specific chat room
    socket.on('join-room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId }) {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
        const history = yield prisma.message.findMany({
            where: { roomId },
            include: { sender: true },
            orderBy: { createdAt: 'asc' },
        });
        socket.emit('chat-history', history);
    }));
    // Handle sending message to a room
    socket.on('chat-message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, senderId, content }) {
        const newMessage = yield prisma.message.create({
            data: { roomId, senderId, content },
            include: { sender: true },
        });
        io.to(roomId).emit('chat-message', newMessage);
    }));
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
server.listen(config_1.default.port, () => {
    console.log(`Server running on port ${config_1.default.port}`);
});
