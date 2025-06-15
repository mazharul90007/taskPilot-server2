import { PrismaClient, Team } from "@prisma/client";

const prisma = new PrismaClient();

//create a team
const createTeamIntoDB = async (payload: { teamName: string; members: string[] }) => {
    const { teamName, members } = payload;
    // console.log(teamName, members)

    // First verify all users exist
    for (const userId of members) {
        const user = await prisma.user.findUnique({
            where: { userId }
        });
        if (!user) {
            throw new Error(`User with userId ${userId} not found`);
        }
    }

    //create team
    const team = await prisma.team.create({
        data: {
            teamName,
        }
    });

    //add members to the team
    for (const userId of members) {
        await prisma.userAssignedTeam.create({
            data: {
                userId,
                teamId: team.id,
            }
        });
    }

    // Return the team with its members
    const result = await prisma.team.findUnique({
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
    return result
}

export const teamService = {
    createTeamIntoDB
}
