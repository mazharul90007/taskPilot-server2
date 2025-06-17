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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const prisma_1 = __importDefault(require("../../../lib/prisma"));
const client_1 = require("@prisma/client");
const createProjectIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectName, projectId, station, deadline, value } = payload;
    // Create project with only required fields and default statuses
    const result = yield prisma_1.default.project.create({
        data: {
            projectName,
            projectId,
            station,
            deadline: new Date(deadline),
            value,
            projectStatus: client_1.ProjectStatus.new,
            clientStatus: client_1.ClientStatus.active,
            estimateDelivery: null,
            figmaLink: null,
            liveLink: null,
            requirementsLink: null,
            note: null,
            teamId: null
        },
    });
    return result;
});
//==============================get all project============
const getAllProjectsfromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.project.findMany({
        include: {
            team: true,
            uiMembers: {
                include: {
                    user: true
                }
            },
            frontendMembers: {
                include: {
                    user: true
                }
            },
            backendMembers: {
                include: {
                    user: true
                }
            }
        }
    });
    return result;
});
//=====================get a single Project ================
const getSingleProjectFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.project.findUnique({
        where: { id },
        include: {
            team: true,
            uiMembers: {
                include: {
                    user: true
                }
            },
            frontendMembers: {
                include: {
                    user: true
                }
            },
            backendMembers: {
                include: {
                    user: true
                }
            }
        }
    });
    if (!result) {
        throw new Error('Project not found');
    }
    return result;
});
//=======================Update Project ====================
const updateProjectInDB = (id, payload, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const { uiMemberIds, frontendMemberIds, backendMemberIds } = payload, otherFields = __rest(payload, ["uiMemberIds", "frontendMemberIds", "backendMemberIds"]);
    // First get the project to check team ownership
    const project = yield prisma_1.default.project.findUnique({
        where: { id },
        include: {
            team: {
                include: { members: true }
            }
        }
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
            const userTeam = yield prisma_1.default.userAssignedTeam.findFirst({
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
    // If team is assigned, verify all member IDs belong to the team
    if (project.teamId && project.team) { // Check both teamId and team
        const teamMemberIds = project.team.members.map(member => member.userId);
        // Check UI members
        if (uiMemberIds) {
            for (const memberId of uiMemberIds) {
                if (!teamMemberIds.includes(memberId)) {
                    throw new Error(`User ${memberId} is not a member of this team`);
                }
            }
        }
        // Check Frontend members
        if (frontendMemberIds) {
            for (const memberId of frontendMemberIds) {
                if (!teamMemberIds.includes(memberId)) {
                    throw new Error(`User ${memberId} is not a member of this team`);
                }
            }
        }
        // Check Backend members
        if (backendMemberIds) {
            for (const memberId of backendMemberIds) {
                if (!teamMemberIds.includes(memberId)) {
                    throw new Error(`User ${memberId} is not a member of this team`);
                }
            }
        }
    }
    // Update project with member assignments
    const result = yield prisma_1.default.project.update({
        where: { id },
        data: Object.assign(Object.assign({}, otherFields), { 
            // Update UI members
            uiMembers: uiMemberIds ? {
                deleteMany: {},
                create: uiMemberIds.map(userId => ({
                    userId
                }))
            } : undefined, 
            // Update Frontend members
            frontendMembers: frontendMemberIds ? {
                deleteMany: {},
                create: frontendMemberIds.map(userId => ({
                    userId
                }))
            } : undefined, 
            // Update Backend members
            backendMembers: backendMemberIds ? {
                deleteMany: {},
                create: backendMemberIds.map(userId => ({
                    userId
                }))
            } : undefined }),
        include: {
            uiMembers: {
                include: { user: true }
            },
            frontendMembers: {
                include: { user: true }
            },
            backendMembers: {
                include: { user: true }
            }
        }
    });
    return result;
});
//=====================delete a Project =============
const deleteProjectFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //first delete all releted members
    yield prisma_1.default.projectUIMember.deleteMany({
        where: { projectId: id }
    });
    yield prisma_1.default.projectFrontendMember.deleteMany({
        where: { projectId: id }
    });
    yield prisma_1.default.projectBackendMember.deleteMany({
        where: { projectId: id }
    });
    //delete project assignments
    yield prisma_1.default.userAssignedProject.deleteMany({
        where: { projectId: id }
    });
    //now delete the project
    const result = yield prisma_1.default.project.delete({
        where: { id }
    });
    return result;
});
exports.projectService = {
    createProjectIntoDB,
    getAllProjectsfromDB,
    updateProjectInDB,
    deleteProjectFromDB,
    getSingleProjectFromDB
};
