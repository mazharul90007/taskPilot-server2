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
exports.userService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
// Create user
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, userName, email, password, role } = payload;
    if (!userId || !userName || !email || !password || !role) {
        throw new Error("Missing required user fields");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    const result = yield prisma.user.create({
        data: {
            userId,
            userName,
            email,
            password: hashedPassword,
            role,
        },
    });
    return result;
});
// Get all user
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.findMany();
    return result;
});
// Get single user from db
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.findUnique({
        where: { id },
    });
    if (!result) {
        throw new Error("User not found");
    }
    return result;
});
// Update User
const updateUserInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma.user.findUnique({ where: { id } });
    if (!isExist) {
        throw new Error("User not found");
    }
    if (payload.password) {
        // If password is being updated, hash it
        payload.password = yield bcrypt_1.default.hash(payload.password, 12);
    }
    const result = yield prisma.user.update({
        where: { id },
        data: payload,
    });
    return result;
});
exports.userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserInDB,
};
