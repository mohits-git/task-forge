import { db } from "@/lib/db";
import React from "react";

type Props = {
  searchParams: {
    token: string;
  }
}

const Page: React.FC<Props> = async ({ searchParams }) => {
  const { token } = searchParams;

  if (!token?.length) return (
    <div className="flex items-center justify-center h-screen w-full">
      <h2 className="text-xl font-bold">Not Found :(</h2>
    </div>
  );

  const response = await db.invitation.delete({
    where: { id: token }
  });

  if(!response) return (
    <div className="flex items-center justify-center h-screen w-full">
      <h2 className="text-xl font-bold">Not Found :(</h2>
    </div>
  );

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <h2 className="text-xl font-bold">Invitation Rejected successfully</h2>
    </div>
  )
}

export default Page
