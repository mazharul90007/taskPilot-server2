import { Server } from "http";
import app from "./app";
import config from "./config";
import { Server as SocketIO } from "socket.io";

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log("Sever is running on port ", config.port);
  });
}

main();
