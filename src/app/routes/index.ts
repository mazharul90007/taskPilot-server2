<<<<<<< HEAD
import express from 'express';
import userRoutes from '../modules/user/user.routes';

// import { AdminRoutes } from '../modules/Admin/admin.routes';
// import { AuthRoutes } from '../modules/Auth/auth.routes';
=======
import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
>>>>>>> e67216b38336348834fad1f9723562caf6dd63d6

const router = express.Router();

const moduleRoutes = [
<<<<<<< HEAD
    {
        path: '/users',
        route: userRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
=======
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
>>>>>>> e67216b38336348834fad1f9723562caf6dd63d6
