"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtUtils {
    /**
     * Creates a JWT token
     */
    static createToken(payload, secret, expiresIn) {
        if (!secret)
            throw new Error('JWT secret is required');
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
    }
    /**
     * Verifies a JWT token
     */
    static verifyToken(token, secret) {
        if (!token)
            throw new Error('Token is required');
        if (!secret)
            throw new Error('JWT secret is required');
        try {
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new Error('Token expired');
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new Error('Invalid token');
            }
            throw new Error('Token verification failed');
        }
    }
    /**
     * Decodes a JWT token without verification
     */
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch (_a) {
            return null;
        }
    }
}
exports.JwtUtils = JwtUtils;
