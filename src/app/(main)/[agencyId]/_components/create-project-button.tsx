"use client";
import React from "react";
import { useModal } from "@/providers/modal-provider";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";
import CustomModal from "@/components/global/custom-modal";
import ProjectDetails from "@/components/forms/project-details";
import { PlusCircleIcon } from "lucide-react";
import { AuthUserDetails } from "@/lib/types";

type Props = {
  user: AuthUserDetails;
  id: string
  className: string
}

const CreateProjectButton: React.FC<Props> = ({ className, user }) => {
  const { setOpen } = useModal();
  const agencyDetails = user?.Agency;
  if (!agencyDetails) return;
  return (
    <div>
      <Button className={twMerge('w-full gap-4 flex', className)}
        onClick={() => {
          setOpen(
            <CustomModal
              title="Create a subaccount"
              subheading="You can switch between subaccounts"
            >
              <ProjectDetails
                data={agencyDetails}
              />
            </CustomModal>
          )
        }}
      >
        <PlusCircleIcon size={15} />
        Create Project
      </Button>
    </div>
  )
}

export default CreateProjectButton;
