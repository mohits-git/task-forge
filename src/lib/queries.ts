"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";
import { Agency, Lane, Prisma, Project, Ticket, User } from "@prisma/client";
import { Omit } from "@prisma/client/runtime/library";
import { v4 } from "uuid";

export const createTeamUser = async (user: User) => {
  if (user.role === "AGENCY_OWNER") return null;

  const response = await db.user.create({ data: { ...user } });

  return response;
}

export const verifyUserAndInvitation = async () => {
  const user = await currentUser();
  if (!user) return redirect('/sign-in');
  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING"
    }
  });

  if (invitationExists) {
    const userDetails = await createTeamUser({
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || "TEAM_MEMBER",
        },
      });

      await db.invitation.delete({
        where: {
          email: userDetails?.email
        }
      });

      return userDetails.agencyId;

    } else return null;
  }
  else {
    const userDetails = await db.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress }
    });
    return userDetails ? userDetails.agencyId : null;
  }
}

export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) return;

  const userData = db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress
    },
    include: {
      Permissions: true,
      Agency: {
        include: {
          Projects: true,
        },
      },
    },
  });

  return userData;
}

export const deleteAgency = async (agencyId: string) => {
  const response = await db.agency.delete({
    where: { id: agencyId }
  });

  return response;
}

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || "TEAM_MEMBER",
    }
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || "TEAM_MEMBER",
    }
  });

  return userData;
}

export const upsertAgency = async (agency: Agency) => {
  const user = await currentUser();
  if(!user) return null;
  try {
    const agencyDetails = await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        team: {
          connect: { email: user.emailAddresses[0].emailAddress },
        },
        ...agency,
      }
    });

    return agencyDetails;

  } catch (error) {
    console.log(error);
  }
}

export const deleteProject = async (projectId: string) => {
  const user = await currentUser();
  if(user?.privateMetadata.role !== "TEAM_OWNER") return null;
  const response = await db.project.delete({ where: { id: projectId }});
  return response;
}

export const upsertProject = async (project: Omit<Project, "agencyId">) => {
  const user = await currentUser();
  if(!user) return null;
  try {
    const userDetails = await db.user.findUnique({
      where: { id: user.id }
    });
    if(!userDetails?.agencyId) return null;
    const projectDetails = await db.project.upsert({
      where: {
        id: project.id,
      },
      update: project,
      create: {
        ...project,
        agencyId: userDetails.agencyId,
      }
    });

    const permissionExist = await db.permissions.findFirst({
      where: {
        email: userDetails.email,
        projectId: projectDetails.id,
        access: true
      }
    });
    if(!permissionExist) {
      await db.permissions.create({
        data: {
          email: userDetails.email,
          projectId: projectDetails.id,
          access: true,
        }
      });
    }

    return projectDetails;

  } catch (error) {
    console.log(error);
  }
}

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number;

  if (!lane.order) {
    const lanes = await db.lane.findMany({
      where: {
        projectId: lane.projectId
      },
    });
    order = lanes.length;
  } else {
    order = lane.order;
  }

  const response = await db.lane.upsert({
    where: { id: lane.id || v4() },
    update: lane,
    create: {
      ...lane,
      order,
    },
  });

  return response;
}

export const getProjectDetails = async (projectId: string) => {
  const response = await db.project.findUnique({
    where: { id: projectId },
  });
  return response;
}

export const getLanesWithTicket = async (projectId: string) => {
  const response = await db.lane.findMany({
    where: {
      projectId,
    },
    orderBy: { order: "asc" },
    include: {
      Tickets: {
        orderBy: { order: 'asc' },
        include: {
          Assigned: true,
        },
      },
    }
  });

  return response;
}

export const updateLanesOrder = async (lanes: Lane[]) => {
  try {
    const updateTransactions = lanes.map((lane) => {
      return db.lane.update({
        where: { id: lane.id },
        data: { order: lane.order },
      });
    });

    await db.$transaction(updateTransactions);
  } catch (error) {
    console.log(error);
  }
}

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTransactions = tickets.map((ticket) => {
      return db.ticket.update({
        where: { id: ticket.id },
        data: { order: ticket.order, laneId: ticket.laneId },
      });
    });
    await db.$transaction(updateTransactions);
  } catch (error) {
    console.log(error);
  }
}

export const deleteTicket = async (ticketId: string) => {
  const response = await db.ticket.delete({
    where: { id: ticketId },
  });
  return response;
}

export const getProjectTeamMembers = async (projectId: string) => {
  const response = await db.user.findMany({
    where: {
      role: "TEAM_MEMBER",
      Permissions: {
        some: {
          projectId: projectId,
          access: true,
        }
      }
    }
  });

  return response;
}

export const upsertTicket = async (
  ticket: Prisma.TicketUncheckedCreateInput,
) => {
  let order: number;
  if (!ticket.order) {
    const tickets = await db.ticket.findMany({
      where: { laneId: ticket.laneId },
    });
    order = tickets.length;
  } else {
    order = ticket.order;
  }

  const response = await db.ticket.upsert({
    where: { id: ticket.id || v4() },
    update: { ...ticket },
    create: { ...ticket, order },
    include: {
      Assigned: true,
      Lane: true,
    },
  });

  return response;
}

export const deleteLane = async (laneId: string) => {
  const response = await db.lane.delete({
    where: { id: laneId },
  });
  return response;
}
