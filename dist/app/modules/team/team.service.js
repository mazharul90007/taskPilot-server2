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
exports.teamService = void 0;
const prisma_1 = __importDefault(require("../../../lib/prisma"));
//create a team
const createTeamIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamName, members } = payload;
    // console.log(teamName, members)
    // First verify all users exist
    for (const userId of members) {
        const user = yield prisma_1.default.user.findUnique({
            where: { userId }
        });
        if (!user) {
            throw new Error(`User with userId ${userId} not found`);
        }
    }
    //create team
    const team = yield prisma_1.default.team.create({
        data: {
            teamName,
        }
    });
    //add members to the team
    for (const userId of members) {
        yield prisma_1.default.userAssignedTeam.create({
            data: {
                userId,
                teamId: team.id,
            }
        });
    }
    // Return the team with its members
    const result = yield prisma_1.default.team.findUnique({
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
//==================Get all Team ===============
const getAllTeamsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.team.findMany({
        include: {
            members: {
                include: {
                    user: true
                }
            }
        }
    });
    return result;
});
//==================Delete a Team =================
const deleteTeamFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //first delete all team assignment
    yield prisma_1.default.userAssignedTeam.deleteMany({
        where: { teamId: id }
    });
    //now delete the team
    const result = yield prisma_1.default.team.delete({
        where: { id }
    });
    return result;
});
//========Upsate a Team =========
const updateTeamInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamName, members, removeMember } = payload;
    // If removing a single member
    if (removeMember) {
        yield prisma_1.default.userAssignedTeam.deleteMany({
            where: {
                teamId: id,
                userId: removeMember
            }
        });
    }
    // If updating the entire members list
    else if (members) {
        // Verify all users exist
        for (const userId of members) {
            const user = yield prisma_1.default.user.findUnique({
                where: { userId }
            });
            if (!user) {
                throw new Error(`User with userId ${userId} not found`);
            }
        }
        // Delete existing team assignments
        yield prisma_1.default.userAssignedTeam.deleteMany({
            where: { teamId: id }
        });
        // Create new team assignments
        for (const userId of members) {
            yield prisma_1.default.userAssignedTeam.create({
                data: {
                    userId,
                    teamId: id,
                }
            });
        }
    }
    // Update team name if provided
    if (teamName) {
        yield prisma_1.default.team.update({
            where: { id },
            data: { teamName }
        });
    }
    // Return updated team with members
    const result = yield prisma_1.default.team.findUnique({
        where: { id },
        include: {
            members: {
                include: {
                    user: true
                }
            }
        }
    });
});
exports.teamService = {
    createTeamIntoDB,
    deleteTeamFromDB,
    getAllTeamsFromDB,
    updateTeamInDB
};
