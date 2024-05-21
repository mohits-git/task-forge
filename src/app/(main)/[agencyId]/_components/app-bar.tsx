'use client'
import AgencyDetails from "@/components/forms/agency-details";
import CustomModal from "@/components/global/custom-modal";
import { useModal } from "@/providers/modal-provider";
import { UserButton } from "@clerk/nextjs";
import { Agency } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import React from "react";

type Props = {
  data: Partial<Agency>;
}

const AppBar: React.FC<Props> = ({ data }) => {
  const { setOpen } = useModal();
    return (
      <div className="flex items-center justify-between w-full px-4 py-3 backdrop-blur-md border-b-[1px]">
        <div className="flex gap-4 items-center">
          <h1 className="text-bold text-4xl">{data?.name || "Agency"}</h1>
          <button
            className="bg-primary-foreground rounded-full p-3"
            onClick={() => {
              setOpen(<CustomModal
                title="Edit Agency Details"
                subheading="Only you can edit your agency details."
              >
                <AgencyDetails
                  data={data}
                />
              </CustomModal>);
            }}
          >
            <PencilIcon className="text-secondary-foreground" size={20} />
          </button>
        </div>
        <div>
          <UserButton />
        </div>
      </div>
    )
}

export default AppBar;
