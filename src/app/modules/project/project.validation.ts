import { z } from "zod";

const createProjectZodSchema = z.object({
    body: z.object({
        projectName: z.string({
            required_error: "Project name is required",
        }),
        projectId: z.string({
            required_error: "Project ID is required",
        }),
        station: z.string({
            required_error: "Station is required",
        }),
        deadline: z.string({
            required_error: "Deadline is required",
        }),
        value: z.number({
            required_error: "Value is required",
        }),
        teamId: z.string().optional(),
        uiMemberIds: z.array(z.string()).optional(),  // Changed to array
        frontendMemberIds: z.array(z.string()).optional(),  // Changed to array
        backendMemberIds: z.array(z.string()).optional(),  // Changed to array
        estimateDelivery: z.string({
            required_error: "Estimated delivery is required",
        }),
        projectStatus: z.enum(['planning', 'in_progress', 'on_hold', 'completed', 'delivered', 'cancelled']).optional(),
        clientStatus: z.enum(['active', 'satisfied', 'follow_up', 'dissatisfied', 'inactive']).optional(),
        figmaLink: z.string().optional(),
        liveLink: z.string().optional(),
        requirementsLink: z.string().optional(),
        note: z.string().optional(),
    }),
});

export const ProjectValidation = {
    createProjectZodSchema,
};