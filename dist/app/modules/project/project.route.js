"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = void 0;
const express_1 = require("express");
const project_controller_1 = require("./project.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const project_validation_1 = require("./project.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Create project - only admin
router.post("/create", (0, auth_1.default)(client_1.UserRole.admin), (0, validateRequest_1.default)(project_validation_1.ProjectValidation.createProjectZodSchema), project_controller_1.projectController.createProject);
// Get projects - all authenticated users
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.leader, client_1.UserRole.coleader, client_1.UserRole.member), project_controller_1.projectController.getAllProjects);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.leader, client_1.UserRole.coleader, client_1.UserRole.member), project_controller_1.projectController.getSingleProject);
// Update project - admin, leader, coleader
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.leader, client_1.UserRole.coleader), (0, validateRequest_1.default)(project_validation_1.ProjectValidation.updateProjectZodSchema), project_controller_1.projectController.updateProject);
// Delete project - only admin
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin), project_controller_1.projectController.deleteProject);
exports.projectRoutes = router;
