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
const router = (0, express_1.Router)();
router.post("/create", (0, validateRequest_1.default)(project_validation_1.ProjectValidation.createProjectZodSchema), project_controller_1.projectController.createProject);
router.get('/', project_controller_1.projectController.getAllProjects);
router.get('/:id', project_controller_1.projectController.getSingleProject);
router.patch('/:id', (0, validateRequest_1.default)(project_validation_1.ProjectValidation.updateProjectZodSchema), project_controller_1.projectController.updateProject);
router.delete('/:id', project_controller_1.projectController.deleteProject);
exports.projectRoutes = router;
