import express from 'express';
import { paymentController } from './payment.controller';

const router = express.Router();

router.post('/create-checkout-session', paymentController.createCheckoutSession);
router.get('/confirm', paymentController.confirmPayment);

export const paymentRoutes = router;
