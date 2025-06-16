import { Router } from "express";
import { projectController } from "./project.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ProjectValidation } from "./project.validation";

const router = Router();

router.post("/create",
    validateRequest(ProjectValidation.createProjectZodSchema),
    projectController.createProject);

export const projectRoutes = router;