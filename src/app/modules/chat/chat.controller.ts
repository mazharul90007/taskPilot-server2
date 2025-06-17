import { Request, Response } from "express";
import status from "http-status";
import { Server as SocketServer } from 'socket.io';
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { chatService } from "./chat.service";

// Send message
const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { roomId, senderId, content } = req.body;
  const io: SocketServer = req.app.get('io');
  
  // Save message to database
  const result = await chatService.saveMessageToDB({ roomId, senderId, content });

  // Emit the message to all clients in the room
  io.to(`chat_${roomId}`).emit('newMessage', result);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Message sent successfully",
    data: result,
  });
});

// Get messages for a room
const getRoomMessages = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const result = await chatService.getMessagesFromDB(roomId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Messages retrieved successfully",
    data: result,
  });
});

// Join chat room
const joinRoom = catchAsync(async (req: Request, res: Response) => {
  const { roomId, userId } = req.body;
  const io: SocketServer = req.app.get('io');
  
  // In a real app, you would verify the user has access to this room
  const socketId = req.headers['socket-id']; // Frontend should send this
  if (socketId && typeof socketId === 'string') {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(`chat_${roomId}`);
    }
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Joined room successfully",
    data: null,
  });
});

export const chatController = {
  sendMessage,
  getRoomMessages,
  joinRoom,
};