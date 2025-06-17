import { Router } from "express";
import { projectController } from "./project.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ProjectValidation } from "./project.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Create project - only admin
router.post("/create",
    auth(UserRole.admin),
    validateRequest(ProjectValidation.createProjectZodSchema),
    projectController.createProject
);

// Get projects - all authenticated users
router.get('/', auth(UserRole.admin, UserRole.leader, UserRole.coleader, UserRole.member), projectController.getAllProjects);
router.get('/:id', auth(UserRole.admin, UserRole.leader, UserRole.coleader, UserRole.member), projectController.getSingleProject);

// Update project - admin, leader, coleader
router.patch('/:id',
    auth(UserRole.admin, UserRole.leader, UserRole.coleader),
    validateRequest(ProjectValidation.updateProjectZodSchema),
    projectController.updateProject
);

// Delete project - only admin
router.delete('/:id',
    auth(UserRole.admin),
    projectController.deleteProject
);

const updateProjectInDB = async (id: string, payload: { teamName?: string; members?: string[]; removeMember?: string }, userId: string, userRole: UserRole) => {
    const { teamName, members, removeMember } = payload;

    // First get the project to check team ownership
    const project = await prisma.project.findUnique({
        where: { id },
        include: { team: true }
    });

    if (!project) {
        throw new Error("Project not found");
    }

    // Authorization check
    if (userRole !== UserRole.admin) {
        // For leader and coleader, check if they belong to the project's team
        if (userRole === UserRole.leader || userRole === UserRole.coleader) {
            // Check if project has a team assigned
            if (!project.teamId) {
                throw new Error("This project is not assigned to any team");
            }

            const userTeam = await prisma.userAssignedTeam.findFirst({
                where: { 
                    userId: userId,
                    teamId: project.teamId 
                }
            });

            if (!userTeam) {
                throw new Error("You can only update projects from your own team");
            }
        } else {
            throw new Error("You are not authorized to update projects");
        }
    }

    // Rest of your update logic...
    // ... existing code ...
}

export const projectRoutes = router;