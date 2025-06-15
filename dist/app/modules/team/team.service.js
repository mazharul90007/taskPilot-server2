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
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
//create a team
const createTeamIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamName, members } = payload;
    // console.log(teamName, members)
    // First verify all users exist
    for (const userId of members) {
        const user = yield prisma.user.findUnique({
            where: { userId }
        });
        if (!user) {
            throw new Error(`User with userId ${userId} not found`);
        }
    }
    //create team
    const team = yield prisma.team.create({
        data: {
            teamName,
        }
    });
    //add members to the team
    for (const userId of members) {
        yield prisma.userAssignedTeam.create({
            data: {
                userId,
                teamId: team.id,
            }
        });
    }
    // Return the team with its members
    const result = yield prisma.team.findUnique({
        where: { id: team.id },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            userId: true,
                            userName: true,
                            email: true,
                            role: true
                        }
                    }
                }
            }
        }
    });
    return result;
});
exports.teamService = {
    createTeamIntoDB
};
