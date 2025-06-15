"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
// Create user route
router.post('/', (0, validateRequest_1.default)(user_validation_1.createUserValidation), userController.createUser.bind(userController));
exports.default = router;
