import prisma from "../../../lib/prisma"
import { ProjectStatus, ClientStatus } from "@prisma/client";

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
const updateProjectInDB = async (id: string, payload: any) => {
    const isExist = await prisma.project.findUnique({ where: { id } });
    if (!isExist) {
        throw new Error("Project not found");
    }

    // Update project with any provided fields
    const result = await prisma.project.update({
        where: { id },
        data: payload,
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