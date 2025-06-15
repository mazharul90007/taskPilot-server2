import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";

// const prisma = new PrismaClient();

// Create user
const createUserIntoDB = async (payload: Partial<User>) => {
  const { userId, userName, email, password, role } = payload;

  if (!userId || !userName || !email || !password || !role) {
    throw new Error("Missing required user fields");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await prisma.user.create({
    data: {
      userId,
      userName,
      email,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      userId: true,
      userName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Get all user
const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};

// Get single user from db
const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
  });

  if (!result) {
    throw new Error("User not found");
  }

  return result;
};

// Update User
const updateUserInDB = async (id: string, payload: Partial<User>) => {
  const isExist = await prisma.user.findUnique({ where: { id } });

  if (!isExist) {
    throw new Error("User not found");
  }

  if (payload.password) {
    // If password is being updated, hash it
    payload.password = await bcrypt.hash(payload.password, 12);
  }

  const result = await prisma.user.update({
    where: { id },
    data: payload,
  });

  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
};
