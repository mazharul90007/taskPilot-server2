"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const team_validation_1 = require("./team.validation");
const team_controller_1 = require("./team.controller");
const router = express_1.default.Router();
router.post("/create", 
// auth(UserRole.admin, UserRole.leader),
(0, validateRequest_1.default)(team_validation_1.TeamValidation.createTeamValidationSchema), team_controller_1.teamController.createTeam);
exports.teamRoutes = router;
