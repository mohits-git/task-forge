import Infobar from "@/components/global/infobar";
import Unauthorized from "@/components/global/unauthorized";
import { getAuthUserDetails, verifyUserAndInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode,
  params: {
    projectId: string;
  }
}

const Layout: React.FC<Props> = async ({ children, params }) => {
  const agencyId = await verifyUserAndInvitation();
  if (!agencyId) return <Unauthorized />;

  const user = await currentUser();
  if (!user?.privateMetadata?.role) return <Unauthorized />;

  const userDetails = await getAuthUserDetails();
  if (!userDetails || userDetails.agencyId !== agencyId) {
    return <Unauthorized />;
  }

  const hasPermission = userDetails.Permissions.find((p) => p.access && p.projectId === params.projectId);

  if (!hasPermission) return <Unauthorized />;

  const project = userDetails.Agency?.Projects.find(p => p.id === params.projectId);

  return (
    <div className="h-screen overflow-hidden">
      <div className="md:pl-[300px]">
        <Infobar 
          projectName={project?.name}
          agencyName={userDetails.Agency?.name}
        />
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

export default Layout
