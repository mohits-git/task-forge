import Infobar from "@/components/global/infobar";
import Sidebar from "@/components/global/sidebar";
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
      <Sidebar
        user={userDetails}
        projectId={params.projectId}
        agencyId={agencyId}
      />
      <div className="md:pl-[300px]">
        <Infobar
          projectName={project?.name}
          agencyName={userDetails.Agency?.name}
        />
        <div className="relative">
          <div
            className="h-full scrollbar backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black mx-auto pt-12 p-4 absolute top-0 right-0 left-0 bottom-0 z-[11]"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
