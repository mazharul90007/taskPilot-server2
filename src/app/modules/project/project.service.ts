import prisma from "../../../lib/prisma"
import { ProjectStatus, ClientStatus, UserRole } from "@prisma/client";

const createProjectIntoDB = async (payload: any) => {
    const { projectName, projectId, station, deadline, value } = payload;
    
    // Create project with only required fields and default statuses
    const result = await prisma.project.create({
        data: {
            projectName,
            projectId,
            station,
            deadline: new Date(deadline),
            value,
            projectStatus: ProjectStatus.new,
            clientStatus: ClientStatus.active,
            // Explicitly set other fields as null
            estimateDelivery: null,
            figmaLink: null,
            liveLink: null,
            requirementsLink: null,
            note: null,
            teamId: null
        },
    });

    return result;
};

//==============================get all project============
const getAllProjectsfromDB = async () => {
    const result = await prisma.project.findMany({
        include: {
            team: true,
            uiMembers: {
                include: {
                    user: true
                }
            },
            frontendMembers: {
                include: {
                    user: true
                }
            },
            backendMembers: {
                include: {
                    user: true
                }
            }
        }
    })
    return result;
}

//=====================get a single Project ================
const getSingleProjectFromDB = async (id: string)=>{
    const result = await prisma.project.findUnique({
        where: { id },
        include: {
            team: true,
            uiMembers: {
                include: {
                    user: true
                }
            },
            frontendMembers: {
                include: {
                    user: true
                }
            },
            backendMembers: {
                include: {
                    user: true
                }
            }
        }
    });
    if(!result){
        throw new Error ('Project not found');
    }
    return result;
}

//=======================Update Project ====================
const updateProjectInDB = async (id: string, payload: any, userId: string, userRole: UserRole) => {
    // First get the project to check team ownership
    const project = await prisma.project.findUnique({
        where: { id },
        include: { team: true }
    });

    if (!project) {
        throw new Error("Project not found");
    }

    // Authorization check
    if (userRole !== UserRole.admin) {
        // For leader and coleader, check if they belong to the project's team
        if (userRole === UserRole.leader || userRole === UserRole.coleader) {
            // Check if project has a team assigned
            if (!project.teamId) {
                throw new Error("This project is not assigned to any team");
            }

            const userTeam = await prisma.userAssignedTeam.findFirst({
                where: { 
                    userId: userId,
                    teamId: project.teamId 
                }
            });

            if (!userTeam) {
                throw new Error("You can only update projects from your own team");
            }
        } else {
            throw new Error("You are not authorized to update projects");
        }
    }

    // If authorization passes, proceed with update
    const result = await prisma.project.update({
        where: { id },
        data: {
            ...payload,
            teamId: payload.teamId === null ? null : payload.teamId
        },
    });

    return result;
};

//=====================delete a Project =============
const deleteProjectFromDB = async (id: string) => {
    //first delete all releted members
    await prisma.projectUIMember.deleteMany({
        where: { projectId: id }
    });

    await prisma.projectFrontendMember.deleteMany({
        where: { projectId: id }
    });

    await prisma.projectBackendMember.deleteMany({
        where: { projectId: id }
    })

    //delete project assignments
    await prisma.userAssignedProject.deleteMany({
        where: { projectId: id }
    })
    //now delete the project
    const result = await prisma.project.delete({
        where: { id }
    })

    return result;
}

export const projectService = {
    createProjectIntoDB,
    getAllProjectsfromDB,
    updateProjectInDB,
    deleteProjectFromDB,
    getSingleProjectFromDB
}