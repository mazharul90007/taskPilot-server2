import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { TeamValidation } from "./team.validation";
import { teamController } from "./team.controller";

const router = express.Router();

router.post(
    "/create",
    // auth(UserRole.admin, UserRole.leader),
    validateRequest(TeamValidation.createTeamValidationSchema),
    teamController.createTeam
);

router.get("/", teamController.getAllTeams)

router.delete(
    "/:id",
    // auth(UserRole.admin, UserRole.leader),
    teamController.deleteTeam
)

export const teamRoutes = router;