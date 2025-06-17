import { Server } from 'http';
import app from './app'
import config from './config';
import { Server as SocketIO } from 'socket.io';

async function main() {
    const server: Server = app.listen(config.port, () => {
        console.log("Sever is running on port ", config.port);
    })

     // Initialize Socket.IO
    const io = new SocketIO(server, {
        cors: {
            origin: config.frontend_base_url,
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    

    // Attach Socket.IO to app
    app.set('io', io);

    // Socket.IO connection handling
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

}

main();