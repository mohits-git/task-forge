import { getLanesWithTicket, getProjectDetails } from "@/lib/queries";
import { LaneDetail } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";
import ProjectView from "../_components/project-view";

type Props = {
  params: { projectId: string },
}

const ProjectPage: React.FC<Props> = async ({ params }) => {
  const projectDetails = await getProjectDetails(params.projectId);

  if (!projectDetails) {
    return redirect(`/project`);
  }

  const lanes = (await getLanesWithTicket(
    params.projectId,
  )) as LaneDetail[];

  return (
    <div className="relative">
      <ProjectView
        lanes={lanes}
        projectId={params.projectId}
        project={projectDetails}
      />
    </div>
  )
}

export default ProjectPage;
