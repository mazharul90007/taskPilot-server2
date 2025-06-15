import {z} from "zod";

const createTeamValidationSchema = z.object({
    body: z.object({
        teamName: z.string({
            required_error: "Team name is required",
        }),
        members: z.array(z.string(), {
            required_error: "At least one member is required"
        }),
    }),
});


export const TeamValidation = {
    createTeamValidationSchema
}