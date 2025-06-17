import { Message, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const saveMessageToDB = async (payload: Prisma.MessageCreateInput): Promise<Message> => {
  const result = await prisma.message.create({
    data: payload,
    include: {
      sender: true,
      room: true
    }
  });
  return result;
};

const getMessagesFromDB = async (roomId: string) => {
  const result = await prisma.message.findMany({
    where: { roomId },
    include: {
      sender: true,
      room: true
    },
    orderBy: { createdAt: 'asc' }
  });
  return result;
};

export const chatService = {
  saveMessageToDB,
  getMessagesFromDB,
};