"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z
            .string({
            required_error: "User ID is required",
            invalid_type_error: "User ID must be a string",
        })
            .min(1, "User ID cannot be empty"),
        userName: zod_1.z
            .string({
            required_error: "User Name is required",
            invalid_type_error: "User Name must be a string",
        })
            .min(2, "User Name should be at least 2 characters"),
        email: zod_1.z
            .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        })
            .email("Invalid email address"),
        password: zod_1.z
            .string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        })
            .min(6, "Password should be at least 6 characters"),
        role: zod_1.z.enum(["admin", "leader", "member"], {
            required_error: "Role is required",
            invalid_type_error: "Role must be one of admin, leader, member",
        }),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.UserValidation = {
    userValidationSchema,
};
