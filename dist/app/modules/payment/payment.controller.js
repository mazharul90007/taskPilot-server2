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
exports.paymentController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const payment_service_1 = require("./payment.service");
const config_1 = __importDefault(require("../../../config"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const createCheckoutSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   const origin = req.headers.origin || config.frontend_base_url || 'https://task-pilot-client-eight.vercel.app';
    const origin = config_1.default.frontend_base_url || 'https://task-pilot-client-eight.vercel.app';
    //   console.log(origin);
    const result = yield payment_service_1.paymentService.createCheckoutSession(req.body, origin);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Stripe checkout session created successfully',
        data: result,
    });
}));
const confirmPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = req.query.session_id;
    if (!sessionId)
        throw new Error('Session ID is required');
    const result = yield payment_service_1.paymentService.confirmPaymentAndSave(sessionId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment confirmed and saved successfully',
        data: result,
    });
}));
exports.paymentController = {
    createCheckoutSession,
    confirmPayment,
};
