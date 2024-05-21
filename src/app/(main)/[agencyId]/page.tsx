import React from "react";
import AppBar from "./_components/app-bar";
import { getAuthUserDetails, verifyUserAndInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";
import Unauthorized from "@/components/global/unauthorized";
import AllProjects from "./_components/all-projects";

type Props = {
  params: { agencyId: string; }
}

const Page: React.FC<Props> = async ({ params }) => {
  const agencyId = await verifyUserAndInvitation();
  const user = await getAuthUserDetails();

  if(!agencyId || !user) return <Unauthorized />;

  if (user?.role === "TEAM_MEMBER") {
    return redirect("/project");
  } else if (user?.role !== "AGENCY_OWNER") {
    return <Unauthorized />;
  }

  if(agencyId !== params.agencyId) return <Unauthorized />;

  const agency = user.Agency;

  return (
    <main className="min-h-screen">
      <AppBar data={{ id: agency?.id, name: agency?.name }} />
      <div className="grid grid-cols-1 md:grid-cols-2 p-4">
        <div>
          <AllProjects
            user={user}
            agencyId={params.agencyId}
          />
        </div>
        <div>
          Team
        </div>
      </div>
    </main>
  )
}

export default Page
