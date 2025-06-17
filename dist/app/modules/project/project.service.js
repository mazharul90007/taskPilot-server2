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
            // Explicitly set other fields as null
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
const updateProjectInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.project.findUnique({ where: { id } });
    if (!isExist) {
        throw new Error("Project not found");
    }
    // Update project with any provided fields
    const result = yield prisma_1.default.project.update({
        where: { id },
        data: payload,
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
