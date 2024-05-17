import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

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
