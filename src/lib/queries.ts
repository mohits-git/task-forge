"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";
import { Agency, User } from "@prisma/client";

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
