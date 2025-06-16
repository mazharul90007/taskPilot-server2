// import Stripe from "stripe";
// import config from "../../../config";

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
// //   apiVersion: "2023-10-16" as any,
// // });



// const stripe = new Stripe(config.stripe_secret_key as string, {
//   apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
// });

// interface IPaymentPayload {
//   productName: string;
//   amount: number;
//    userId: string;
// }

// const createCheckoutSession = async (payload: IPaymentPayload, origin: string) => {
//   const { productName, amount,userId  } = payload;

//   if (!productName || !amount || !userId ) {
//     throw new Error("Product name and amount and user id are required");
//   }

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: productName,
//           },
//           unit_amount: amount,
//         },
//         quantity: 1,
//       },
//     ],
//     success_url: `${origin}/success`,
//     cancel_url: `${origin}/cancel`,
//   });

//    // Save to DB
//   await prisma.payment.create({
//     data: {
//       stripeSessionId: session.id,
//       productName,
//       amount,
//       userId, 
//     },
//   });


//   return { url: session.url };
// };

// export const paymentService = {
//   createCheckoutSession,
// };



import Stripe from 'stripe';
import config from '../../../config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

interface IPaymentPayload {
  productName: string;
  amount: number;
  userId: string;
}

const createCheckoutSession = async (payload: IPaymentPayload, origin: string) => {
  const { productName, amount, userId } = payload;

  if (!productName || !amount || !userId) {
    throw new Error('Product name, amount, and userId are required');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    metadata: { userId, productName, amount: amount.toString() },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: productName },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
  });

  return { url: session.url };
};

const confirmPaymentAndSave = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    throw new Error('Payment not successful');
  }

  const { userId, productName, amount } = session.metadata || {};

  if (!userId || !productName || !amount) {
    throw new Error('Missing metadata');
  }

  // Save payment to database
  const saved = await prisma.payment.create({
    data: {
      stripeSessionId: sessionId,
      productName,
      amount: Number(amount),
      status: 'paid',
      userId,
    },
  });

  return saved;
};

export const paymentService = {
  createCheckoutSession,
  confirmPaymentAndSave,
};
