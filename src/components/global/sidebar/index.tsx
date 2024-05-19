import { AuthUserDetails } from "@/lib/types";
import React from "react";
import SidebarContent from "./sidebar-content";
import { db } from "@/lib/db";

type Props = {
  user: AuthUserDetails;
  projectId: string;
  agencyId: string;
}

const Sidebar: React.FC<Props> = async ({ user, projectId, agencyId }) => {

  const permissions = user?.Permissions;
  const projects = user?.Agency?.Projects.filter(project =>
    permissions?.find(p => p.access && p.projectId === project.id)
  );

  const currentProject = await db.project.findUnique({
    where: {
      id: projectId
    },
    include: {
      Lane: true
    }
  });

  if (currentProject?.Lane)
    currentProject.Lane = currentProject.Lane.sort((a, b) => a.order - b.order);

  const agencyName = user?.Agency?.name;

  return (
    <>
      <SidebarContent
        defaultOpen={true}
        user={user}
        agencyName={agencyName}
        projects={projects || []}
        currentProject={currentProject}
      />
      <SidebarContent
        user={user}
        agencyName={agencyName}
        projects={projects || []}
        currentProject={currentProject}
      />
    </>
  )
}

export default Sidebar
