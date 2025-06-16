import prisma from "../../../lib/prisma"

const createProjectIntoDB = async (payload: {
    projectName: string;
    projectId: string;
    station: string;
    deadline: Date;
    value: number;
    teamId?: string;
    uiMemberIds?: string[];
    frontendMemberIds?: string[];
    backendMemberIds?: string[];
    estimateDelivery: string;
    projectStatus?: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'delivered' | 'cancelled';
    clientStatus?: 'active' | 'satisfied' | 'follow_up' | 'dissatisfied' | 'inactive';
    figmaLink?: string;
    liveLink?: string;
    requirementsLink?: string;
    note?: string;
}) => {
    const { uiMemberIds, frontendMemberIds, backendMemberIds, ...projectData } = payload;

    // Create project with basic data
    const project = await prisma.project.create({
        data: {
            ...projectData,
            deadline: new Date(projectData.deadline)
        }
    });

    // Add UI members if provided
    if (uiMemberIds?.length) {
        for (const userId of uiMemberIds) {
            await prisma.projectUIMember.create({
                data: {
                    projectId: project.id,
                    userId
                }
            });
        }
    }

    // Add Frontend members if provided
    if (frontendMemberIds?.length) {
        for (const userId of frontendMemberIds) {
            await prisma.projectFrontendMember.create({
                data: {
                    projectId: project.id,
                    userId
                }
            });
        }
    }

    // Add Backend members if provided
    if (backendMemberIds?.length) {
        for (const userId of backendMemberIds) {
            await prisma.projectBackendMember.create({
                data: {
                    projectId: project.id,
                    userId
                }
            });
        }
    }

    // Return project with all relations
    const result = await prisma.project.findUnique({
        where: { id: project.id },
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

    return result;
}

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
const updateProjectInDB = async (id: string, payload: {
    projectName?: string;
    projectId?: string;
    station?: string;
    deadline?: Date;
    value?: number;
    teamId?: string;
    uiMemberIds?: string[];
    frontendMemberIds?: string[];
    backendMemberIds?: string[];
    estimateDelivery?: string;
    projectStatus?: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'delivered' | 'cancelled';
    clientStatus?: 'active' | 'satisfied' | 'follow_up' | 'dissatisfied' | 'inactive';
    figmaLink?: string;
    liveLink?: string;
    requirementsLink?: string;
    note?: string;
}) => {
    const { uiMemberIds, frontendMemberIds, backendMemberIds, ...projectData } = payload;

    // Update basic project data
    await prisma.project.update({
        where: { id },
        data: {
            ...projectData,
            deadline: projectData.deadline ? new Date(projectData.deadline) : undefined
        }
    });

    // Update UI members if provided
    if (uiMemberIds) {
        // Delete existing UI members
        await prisma.projectUIMember.deleteMany({
            where: { projectId: id }
        });
        // Add new UI members
        for (const userId of uiMemberIds) {
            await prisma.projectUIMember.create({
                data: {
                    projectId: id,
                    userId
                }
            });
        }
    }

    // Update Frontend members if provided
    if (frontendMemberIds) {
        // Delete existing Frontend members
        await prisma.projectFrontendMember.deleteMany({
            where: { projectId: id }
        });
        // Add new Frontend members
        for (const userId of frontendMemberIds) {
            await prisma.projectFrontendMember.create({
                data: {
                    projectId: id,
                    userId
                }
            });
        }
    }

    // Update Backend members if provided
    if (backendMemberIds) {
        // Delete existing Backend members
        await prisma.projectBackendMember.deleteMany({
            where: { projectId: id }
        });
        // Add new Backend members
        for (const userId of backendMemberIds) {
            await prisma.projectBackendMember.create({
                data: {
                    projectId: id,
                    userId
                }
            });
        }
    }

    // Return updated project with all relations
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

    return result;
}

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