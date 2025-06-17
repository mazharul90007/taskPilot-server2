"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../../../config"));
const prisma = new client_1.PrismaClient();
const stripe = new stripe_1.default(config_1.default.stripe_secret_key, {
    apiVersion: "2023-10-16",
});
const createCheckoutSession = (payload, origin) => __awaiter(void 0, void 0, void 0, function* () {
    const { productName, amount, userId } = payload;
    if (!productName || !amount || !userId) {
        throw new Error("Product name, amount, and userId are required");
    }
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        metadata: { userId, productName, amount: amount.toString() },
        line_items: [
            {
                price_data: {
                    currency: "usd",
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
});
const confirmPaymentAndSave = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
        throw new Error("Payment not successful");
    }
    const { userId, productName, amount } = session.metadata || {};
    if (!userId || !productName || !amount) {
        throw new Error("Missing metadata");
    }
    const saved = yield prisma.payment.create({
        data: {
            stripeSessionId: sessionId,
            productName,
            amount: Number(amount),
            status: "paid",
            userId,
        },
    });
    return saved;
});
// Get user payment data
const getPaymentsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield prisma.payment.findMany({
        where: {
            userId,
        },
        orderBy: {
            // optional: latest first
            createdAt: "desc",
        },
    });
    return payments;
});
exports.paymentService = {
    createCheckoutSession,
    confirmPaymentAndSave,
    getPaymentsByUserId,
};
