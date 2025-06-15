import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const result = await authService.loginUser(email, password);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const authController = {
  login,
};
