import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { projectService } from "./project.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const createProject = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await projectService.createProjectIntoDB(payload);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Project created Successfully',
        data: result
    })
})

export const projectController = {
    createProject,
}