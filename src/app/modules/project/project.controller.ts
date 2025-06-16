import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { projectService } from "./project.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

//===============create a Project===============
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

//==========get all Projects===========
const getAllProjects = catchAsync(async (req: Request, res: Response) => {
    const result = await projectService.getAllProjectsfromDB();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Projects retrieved successfully",
        data: result
    })
})

//============get single Project ===========
const getSingleProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await projectService.getSingleProjectFromDB(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Project retrieved successfully",
        data: result
    })
})

//============update Project ==============
const updateProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await projectService.updateProjectInDB(id, payload);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Project updated Successfully",
        data: result
    })
})

//===========delete a Project =============
const deleteProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await projectService.deleteProjectFromDB(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Project deleted successfully",
        data: result
    })
})

export const projectController = {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    getSingleProject
}