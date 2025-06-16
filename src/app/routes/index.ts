import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { teamRoutes } from "../modules/team/team.route";
import { projectRoutes } from "../modules/project/project.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/team",
    route: teamRoutes,
  },
  {
    path: "/project",
    route: projectRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
