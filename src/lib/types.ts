import { db } from "@/lib/db";
import { Lane, Prisma, Ticket, User } from "@prisma/client";
import { getAuthUserDetails, getLanesWithTicket } from "./queries";

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

export type TicketWithAssigned = Ticket & {
  Assigned: User | null;
}

export type LaneDetail = Lane & {
  Tickets: TicketWithAssigned[]
};
