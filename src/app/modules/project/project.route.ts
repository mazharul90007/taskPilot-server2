import { Router } from "express";
import { projectController } from "./project.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ProjectValidation } from "./project.validation";

const router = Router();

router.post("/create",
    validateRequest(ProjectValidation.createProjectZodSchema),
    projectController.createProject);

router.get('/', projectController.getAllProjects);

router.get('/:id', projectController.getSingleProject);

router.patch('/:id',
    validateRequest(ProjectValidation.updateProjectZodSchema),
    projectController.updateProject);

router.delete('/:id', projectController.deleteProject);

export const projectRoutes = router;