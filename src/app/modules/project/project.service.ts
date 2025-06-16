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

export const projectService = {
    createProjectIntoDB
}