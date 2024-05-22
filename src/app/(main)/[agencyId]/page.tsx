import React from "react";
import AppBar from "./_components/app-bar";
import { getAuthUserDetails, verifyUserAndInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";
import Unauthorized from "@/components/global/unauthorized";
import AllProjects from "./_components/all-projects";
import DataTable from "./_components/data-table";
import { PlusIcon } from "lucide-react";
import { columns } from "./_components/columns";
import { db } from "@/lib/db";
import SendInvitation from "@/components/forms/send-invitation";

type Props = {
  params: { agencyId: string; }
}

const Page: React.FC<Props> = async ({ params }) => {
  const agencyId = await verifyUserAndInvitation();
  const user = await getAuthUserDetails();

  if (!agencyId || !user) return <Unauthorized />;

  if (user?.role === "TEAM_MEMBER") {
    return redirect("/project");
  } else if (user?.role !== "AGENCY_OWNER") {
    return <Unauthorized />;
  }

  if (agencyId !== params.agencyId) return <Unauthorized />;

  const agency = user.Agency;
  if (!agency) return <Unauthorized />;

  const teamMembers = await db.user.findMany({
    where: {
      Agency: { id: params.agencyId },
      role: "TEAM_MEMBER",
    },
    include: {
      Agency: {
        include: { Projects: true },
      },
      Permissions: {
        include: { Project: true },
      },
    }
  });

  return (
    <main className="min-h-screen">
      <AppBar data={{ id: agency?.id, name: agency?.name }} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
        <div className="md:col-span-5 overflow-hidden md:min-h-[calc(100vh-106px)] md:border-r-[1px] md:pr-3">
          <AllProjects
            user={user}
            agencyId={params.agencyId}
          />
        </div>
        <div className="md:col-span-7 md:min-h-[calc(100vh-104px)]">
          <DataTable
            actionButtonText={
              <>
                <PlusIcon size={15} />
                Send Invitation
              </>
            }
            modalChildren={<SendInvitation agencyId={agency.id} />}
            filterValue='name'
            columns={columns}
            data={teamMembers}
          />
        </div>
      </div>
    </main>
  )
}

export default Page
