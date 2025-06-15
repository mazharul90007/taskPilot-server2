import { PrismaClient } from '@prisma/client';
import { CreateUserInput } from './user.validation';
import * as bcrypt from 'bcrypt';

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(userData: CreateUserInput) {
    // Check if user with email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw {
        status: 400,
        message: 'User with this email already exists'
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        userId: userData.userId,
        userName: userData.userName,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      }
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
