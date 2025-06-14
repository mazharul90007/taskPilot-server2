import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createUserValidation } from './user.validation';

const router = Router();
const userController = new UserController();

// Create user route
router.post(
  '/',
  validateRequest(createUserValidation),
  userController.createUser.bind(userController)
);

export default router; 