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
const createProjectIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { uiMemberIds, frontendMemberIds, backendMemberIds } = payload, projectData = __rest(payload, ["uiMemberIds", "frontendMemberIds", "backendMemberIds"]);
    // Create project with basic data
    const project = yield prisma_1.default.project.create({
        data: Object.assign(Object.assign({}, projectData), { deadline: new Date(projectData.deadline) })
    });
    // Add UI members if provided
    if (uiMemberIds === null || uiMemberIds === void 0 ? void 0 : uiMemberIds.length) {
        for (const userId of uiMemberIds) {
            yield prisma_1.default.projectUIMember.create({
                data: {
                    projectId: project.id,
                    userId
                }
            });
        }
    }
    // Add Frontend members if provided
    if (frontendMemberIds === null || frontendMemberIds === void 0 ? void 0 : frontendMemberIds.length) {
        for (const userId of frontendMemberIds) {
            yield prisma_1.default.projectFrontendMember.create({
                data: {
                    projectId: project.id,
                    userId
                }
            });
        }
    }
    // Add Backend members if provided
    if (backendMemberIds === null || backendMemberIds === void 0 ? void 0 : backendMemberIds.length) {
        for (const userId of backendMemberIds) {
            yield prisma_1.default.projectBackendMember.create({
                data: {
                    projectId: project.id,
                    userId
                }
            });
        }
    }
    // Return project with all relations
    const result = yield prisma_1.default.project.findUnique({
        where: { id: project.id },
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
    const { uiMemberIds, frontendMemberIds, backendMemberIds } = payload, projectData = __rest(payload, ["uiMemberIds", "frontendMemberIds", "backendMemberIds"]);
    // Update basic project data
    yield prisma_1.default.project.update({
        where: { id },
        data: Object.assign(Object.assign({}, projectData), { deadline: projectData.deadline ? new Date(projectData.deadline) : undefined })
    });
    // Update UI members if provided
    if (uiMemberIds) {
        // Delete existing UI members
        yield prisma_1.default.projectUIMember.deleteMany({
            where: { projectId: id }
        });
        // Add new UI members
        for (const userId of uiMemberIds) {
            yield prisma_1.default.projectUIMember.create({
                data: {
                    projectId: id,
                    userId
                }
            });
        }
    }
    // Update Frontend members if provided
    if (frontendMemberIds) {
        // Delete existing Frontend members
        yield prisma_1.default.projectFrontendMember.deleteMany({
            where: { projectId: id }
        });
        // Add new Frontend members
        for (const userId of frontendMemberIds) {
            yield prisma_1.default.projectFrontendMember.create({
                data: {
                    projectId: id,
                    userId
                }
            });
        }
    }
    // Update Backend members if provided
    if (backendMemberIds) {
        // Delete existing Backend members
        yield prisma_1.default.projectBackendMember.deleteMany({
            where: { projectId: id }
        });
        // Add new Backend members
        for (const userId of backendMemberIds) {
            yield prisma_1.default.projectBackendMember.create({
                data: {
                    projectId: id,
                    userId
                }
            });
        }
    }
    // Return updated project with all relations
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
