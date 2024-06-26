"use client";
import React from "react";
import { useModal } from "@/providers/modal-provider";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";
import CustomModal from "@/components/global/custom-modal";
import ProjectDetails from "@/components/forms/project-details";
import { PlusIcon } from "lucide-react";

type Props = {
  className: string
}

const CreateProjectButton: React.FC<Props> = ({ className }) => {
  const { setOpen } = useModal();
  return (
    <div>
      <Button className={twMerge('gap-4 flex', className)}
        onClick={() => {
          setOpen(
            <CustomModal
              title="Create a subaccount"
              subheading="You can switch between subaccounts"
            >
              <ProjectDetails />
            </CustomModal>
          )
        }}
      >
        <PlusIcon size={15} />
        Create Project
      </Button>
    </div>
  )
}

export default CreateProjectButton;
