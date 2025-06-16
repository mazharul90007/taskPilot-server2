"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const team_validation_1 = require("./team.validation");
const team_controller_1 = require("./team.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.leader), (0, validateRequest_1.default)(team_validation_1.TeamValidation.createTeamValidationSchema), team_controller_1.teamController.createTeam);
router.get("/", (0, auth_1.default)(client_1.UserRole.admin), team_controller_1.teamController.getAllTeams);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.leader), team_controller_1.teamController.deleteTeam);
exports.teamRoutes = router;
