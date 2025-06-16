"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamValidation = void 0;
const zod_1 = require("zod");
const createTeamValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        teamName: zod_1.z.string({
            required_error: "Team name is required",
        }),
        members: zod_1.z.array(zod_1.z.string(), {
            required_error: "At least one member is required"
        }),
    }),
});
const updateTeamValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        teamName: zod_1.z.string().optional(),
        members: zod_1.z.array(zod_1.z.string()).optional()
    })
});
exports.TeamValidation = {
    createTeamValidationSchema,
    updateTeamValidationSchema
};
