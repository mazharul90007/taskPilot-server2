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
exports.projectRoutes = void 0;
const express_1 = require("express");
const project_controller_1 = require("./project.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const project_validation_1 = require("./project.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_2.PrismaClient();
// Create project - only admin
router.post("/create", (0, auth_1.default)(client_1.UserRole.admin), (0, validateRequest_1.default)(project_validation_1.ProjectValidation.createProjectZodSchema), project_controller_1.projectController.createProject);
// Get projects - all authenticated users
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.leader, client_1.UserRole.coleader, client_1.UserRole.member), project_controller_1.projectController.getAllProjects);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.leader, client_1.UserRole.coleader, client_1.UserRole.member), project_controller_1.projectController.getSingleProject);
// Update project - admin, leader, coleader
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.leader, client_1.UserRole.coleader), (0, validateRequest_1.default)(project_validation_1.ProjectValidation.updateProjectZodSchema), project_controller_1.projectController.updateProject);
// Delete project - only admin
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin), project_controller_1.projectController.deleteProject);
const updateProjectInDB = (id, payload, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamName, members, removeMember } = payload;
    // First get the project to check team ownership
    const project = yield prisma.project.findUnique({
        where: { id },
        include: { team: true }
    });
    if (!project) {
        throw new Error("Project not found");
    }
    // Authorization check
    if (userRole !== client_1.UserRole.admin) {
        // For leader and coleader, check if they belong to the project's team
        if (userRole === client_1.UserRole.leader || userRole === client_1.UserRole.coleader) {
            // Check if project has a team assigned
            if (!project.teamId) {
                throw new Error("This project is not assigned to any team");
            }
            const userTeam = yield prisma.userAssignedTeam.findFirst({
                where: {
                    userId: userId,
                    teamId: project.teamId
                }
            });
            if (!userTeam) {
                throw new Error("You can only update projects from your own team");
            }
        }
        else {
            throw new Error("You are not authorized to update projects");
        }
    }
    // Rest of your update logic...
    // ... existing code ...
});
exports.projectRoutes = router;
