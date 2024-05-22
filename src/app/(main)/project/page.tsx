import ProjectDetails from "@/components/forms/project-details";
import Unauthorized from "@/components/global/unauthorized";
import { getAuthUserDetails, verifyUserAndInvitation } from "@/lib/queries";
import { UserButton } from "@clerk/nextjs";
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
      <div className="max-w-xl">
        <ProjectDetails />
      </div>
    );
  }

  return (
    <div className="p-4 text-center h-screen w-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl md:text-6xl">No Project Access</h1>
      <p className="max-w-xl mt-2">Please contact your Agency Owner to grant access to a Project or Login with different emailId.</p>
      <div className="my-3 text-xl font-semibold flex items-center gap-3">
        <span>User Profile: </span>
        <UserButton />
      </div>
    </div>

  )
}

export default Page
