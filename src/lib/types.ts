import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getAuthUserDetails } from "./queries";

export const _getTicketsWithLaneAndUser = async (laneId: string) => {
  const response = await db.ticket.findMany({
    where: { laneId },
    include: {
      Assigned: true,
      Lane: true,
    },
  });

  return response;
}

export type TicketDetails = Prisma.PromiseReturnType<typeof _getTicketsWithLaneAndUser>;

export type AuthUserDetails = Prisma.PromiseReturnType<typeof getAuthUserDetails>

export const _getProjectDetails = async (projectId: string) => {
  const currentProject = await db.project.findUnique({
    where: {
      id: projectId
    },
    include: {
      Lane: true
    }
  });
  return currentProject;
}
export type ProjectWithLanes = Prisma.PromiseReturnType<typeof _getProjectDetails>;
