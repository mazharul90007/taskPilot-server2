import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { teamService } from "./team.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";


//create team
const createTeam = catchAsync(async(req: Request, res: Response)=>{
const payload = req.body;
const result = await teamService.createTeamIntoDB(payload);

sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Team created Successfully',
    data: result,
});
})

export const teamController = {
    createTeam
}