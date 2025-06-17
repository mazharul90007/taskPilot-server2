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
exports.authService = void 0;
// import { PrismaClient } from "@prisma/client";
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../../config"));
const prisma_1 = __importDefault(require("../../../lib/prisma"));
// const prisma = new PrismaClient();
const loginUser = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({ where: { userId } });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    const payload = {
        userId: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
    };
    const token = auth_utils_1.JwtUtils.createToken(payload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        user: {
            id: user.id,
            userId: user.userId,
            userName: user.userName,
            email: user.email,
            role: user.role,
            image: user.image,
        },
        token,
    };
});
exports.authService = {
    loginUser,
};
