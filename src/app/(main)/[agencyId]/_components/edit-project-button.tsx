"use client";
import React from "react";
import { useModal } from "@/providers/modal-provider";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";
import CustomModal from "@/components/global/custom-modal";
import ProjectDetails from "@/components/forms/project-details";
import { Pencil } from "lucide-react";
import { Project } from "@prisma/client";

type Props = {
  projectDetails: Partial<Project>;
  className?: string
}

const EditProjectButton: React.FC<Props> = ({ className, projectDetails }) => {
  const { setOpen } = useModal();
  if (!projectDetails) return;
  return (
    <Button
      size={'sm'}
      variant={'outline'}
      className={twMerge(`text-white px-2 py-4 bg-secondary hover:bg-primary-foreground hover:text-white`, className)}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create a subaccount"
            subheading="You can switch between subaccounts"
          >
            <ProjectDetails
              data={projectDetails}
            />
          </CustomModal>
        )
      }}
    >
      <Pencil size={15} />
    </Button>
  )
}

export default EditProjectButton;
