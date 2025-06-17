"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectAuth = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
// Define allowed roles for project updates
const ALLOWED_UPDATE_ROLES = [client_1.UserRole.admin, client_1.UserRole.leader, client_1.UserRole.coleader];
exports.projectAuth = {
    // Only admin can create projects
    createProject: (req, res, next) => {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== client_1.UserRole.admin) {
            return res.status(http_status_1.default.FORBIDDEN).json({
                success: false,
                message: 'Only admin can create projects',
            });
        }
        next();
    },
    // Admin, leader, and coleader can update projects
    updateProject: (req, res, next) => {
        if (!req.user || !ALLOWED_UPDATE_ROLES.includes(req.user.role)) {
            return res.status(http_status_1.default.FORBIDDEN).json({
                success: false,
                message: 'You are not authorized to update projects',
            });
        }
        next();
    },
    // Only admin can delete projects
    deleteProject: (req, res, next) => {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== client_1.UserRole.admin) {
            return res.status(http_status_1.default.FORBIDDEN).json({
                success: false,
                message: 'Only admin can delete projects',
            });
        }
        next();
    }
};
