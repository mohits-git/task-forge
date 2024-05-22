"use client";
import { deleteProject, getProjectDetails } from "@/lib/queries";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type Props = {
  projectId: string,
}

const DeleteButton: React.FC<Props> = ({ projectId }) => {
  const router = useRouter();
  return (
    <div onClick={async () => {
      try {
        const project = await getProjectDetails(projectId);
        const response = await deleteProject(projectId);
        if (!project || !response) {
          toast("Oops!! Couldn't delete the project");
        }
        else {
          toast("Deleted Project successfully");
        }
        router.refresh();
      } catch (error) {
        toast("Something went wrong");
      }
    }}>
      Delete Project
    </div>
  )
}

export default DeleteButton
