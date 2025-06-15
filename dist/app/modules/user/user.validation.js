"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserValidation = void 0;
const zod_1 = require("zod");
// Create user validation schema
exports.createUserValidation = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'User ID is required'),
    userName: zod_1.z.string().min(1, 'Username is required'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['admin', 'leader', 'member']).default('member')
});
// export const CreateUserInput = {createUserValidation};
