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
    <div
      className="h-screen overflow-scroll scrollbar backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black mx-auto pt-6 p-4 absolute top-0 right-0 left-0 bottom-0 z-[11]"
    >

      <ProjectView
        lanes={lanes}
        projectId={params.projectId}
        project={projectDetails}
      />
    </div>
  )
}

export default ProjectPage;
