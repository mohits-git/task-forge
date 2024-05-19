import ProjectDetails from "@/components/forms/project-details";
import Unauthorized from "@/components/global/unauthorized";
import { getAuthUserDetails, verifyUserAndInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";

const Page: React.FC = async () => {
  const agencyId = await verifyUserAndInvitation();
  if (!agencyId) return <Unauthorized />;
  const user = await getAuthUserDetails();
  if (!user) return <Unauthorized />;

  const firstProjectWithAccess = user.Permissions.find((p) => p.access === true);

  if (firstProjectWithAccess) {
    return redirect(`/project/${firstProjectWithAccess.projectId}`);
  }

  if (user.role === "AGENCY_OWNER") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
        <div className="max-w-xl">
          <ProjectDetails />
        </div>
      </main>
    );
  }

  return <Unauthorized />
}

export default Page
