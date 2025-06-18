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
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const socket_io_1 = require("socket.io");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = app_1.default.listen(config_1.default.port, () => {
            console.log("Sever is running on port ", config_1.default.port);
        });
        // Initialize Socket.IO
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: config_1.default.frontend_base_url,
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        // Attach Socket.IO to app
        app_1.default.set('io', io);
        // Socket.IO connection handling
        io.on('connection', (socket) => {
            console.log('New client connected:', socket.id);
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    });
}
main();
