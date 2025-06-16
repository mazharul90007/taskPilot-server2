import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { paymentService } from './payment.service';
import config from '../../../config';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';


const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const origin = req.headers.origin || config.frontend_base_url || 'http://localhost:3000';
  const result = await paymentService.createCheckoutSession(req.body, origin);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Stripe checkout session created successfully',
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;
  if (!sessionId) throw new Error('Session ID is required');

  const result = await paymentService.confirmPaymentAndSave(sessionId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Payment confirmed and saved successfully',
    data: result,
  });
});

export const paymentController = {
  createCheckoutSession,
  confirmPayment,
};
