"use client";
import { deleteProject, getProjectDetails } from "@/lib/queries";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  projectId: string,
}

const DeleteButton: React.FC<Props> = ({ projectId }) => {
  const router = useRouter();
  return (
    <div onClick={async () => {
      await getProjectDetails(projectId);
      await deleteProject(projectId);
      router.refresh();
    }}>
      Delete Project
    </div>
  )
}

export default DeleteButton
