// import { Request, Response } from "express";

// import status from "http-status";
// import { paymentService } from "./payment.service";
// import catchAsync from "../../../shared/catchAsync";
// import sendResponse from "../../../shared/sendResponse";
// import config from "../../../config";

// // const createCheckoutSession = catchAsync(
// //   async (req: Request, res: Response) => {
// //     const result = await paymentService.createCheckoutSession(
// //       req.body,
// //       req.headers.origin as string
// //     );

// //     sendResponse(res, {
// //       statusCode: status.OK,
// //       success: true,
// //       message: "Stripe checkout session created successfully",
// //       data: result,
// //     });
// //   }
// // );

// const createCheckoutSession = catchAsync(
//   async (req: Request, res: Response) => {
//     const origin =
//       (req.headers.origin as string) ||
//       config.frontend_base_url || // fallback
//       "http://localhost:3000"; // default

//     const result = await paymentService.createCheckoutSession(req.body, origin);
    

//     sendResponse(res, {
//       statusCode: status.OK,
//       success: true,
//       message: "Stripe checkout session created successfully",
//       data: result,
//     });
//   }
// );

// export const paymentController = {
//   createCheckoutSession,
// };




import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';
import config from '../../../config';
import { paymentService } from './payment.service';

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const origin =
    (req.headers.origin as string) ||
    config.frontend_base_url ||
    'http://localhost:3000';

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

  if (!sessionId) {
    throw new Error('Session ID is required');
  }

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
