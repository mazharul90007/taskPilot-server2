"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidation = void 0;
const zod_1 = require("zod");
const createProjectZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        projectName: zod_1.z.string({
            required_error: "Project name is required",
        }),
        projectId: zod_1.z.string({
            required_error: "Project ID is required",
        }),
        station: zod_1.z.string({
            required_error: "Station is required",
        }),
        deadline: zod_1.z.string({
            required_error: "Deadline is required",
        }),
        value: zod_1.z.number({
            required_error: "Value is required",
        }),
        teamId: zod_1.z.string().optional(),
        uiMemberIds: zod_1.z.array(zod_1.z.string()).optional(),
        frontendMemberIds: zod_1.z.array(zod_1.z.string()).optional(),
        backendMemberIds: zod_1.z.array(zod_1.z.string()).optional(),
        estimateDelivery: zod_1.z.string().optional(),
        projectStatus: zod_1.z.enum(['new', 'ui_ux', 'wip', 'qa', 'delivered', 'revision', 'cancelled']).default('new'),
        clientStatus: zod_1.z.enum(['active', 'satisfied', 'neutral', 'dissatisfied', 'inactive']).default('active'),
        figmaLink: zod_1.z.string().optional(),
        liveLink: zod_1.z.string().optional(),
        requirementsLink: zod_1.z.string().optional(),
        note: zod_1.z.string().optional(),
    }),
});
//====================Project Update validation==================
const updateProjectZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        projectName: zod_1.z.string().optional(),
        projectId: zod_1.z.string().optional(),
        station: zod_1.z.string().optional(),
        deadline: zod_1.z.string().optional(),
        value: zod_1.z.number().optional(),
        teamId: zod_1.z.string().optional(),
        uiMemberIds: zod_1.z.array(zod_1.z.string()).optional(),
        frontendMemberIds: zod_1.z.array(zod_1.z.string()).optional(),
        backendMemberIds: zod_1.z.array(zod_1.z.string()).optional(),
        estimateDelivery: zod_1.z.string().optional(),
        projectStatus: zod_1.z.enum(['new', 'ui_ux', 'wip', 'qa', 'delivered', 'revision', 'cancelled']).optional(),
        clientStatus: zod_1.z.enum(['active', 'satisfied', 'neutral', 'dissatisfied', 'inactive']).optional(),
        figmaLink: zod_1.z.string().optional(),
        liveLink: zod_1.z.string().optional(),
        requirementsLink: zod_1.z.string().optional(),
        note: zod_1.z.string().optional(),
    }),
});
exports.ProjectValidation = {
    createProjectZodSchema,
    updateProjectZodSchema
};
