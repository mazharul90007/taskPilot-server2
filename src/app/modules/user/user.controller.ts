import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { CreateUserInput } from './user.validation';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: CreateUserInput = req.body;
      const user = await this.userService.createUser(userData);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error: any) {
      next(error);
    }
  }
}
