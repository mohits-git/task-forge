import Unauthorized from "@/components/global/unauthorized";
import { getAuthUserDetails, verifyUserAndInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";

export default async function Home() {
  const agencyId = await verifyUserAndInvitation();
  const user = await getAuthUserDetails();

  if (agencyId) {
    if (user?.role === "TEAM_MEMBER") {
      return redirect("/project");
    } else if (user?.role === "AGENCY_OWNER") {
      return redirect(`/${agencyId}`);
    } else {
      return <Unauthorized />;
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1>Get Started</h1>
      <h2>Create Your Agency</h2>
      {/* TODO: Add agency form */}
      {/* AgencyDetails */}
    </main>
  );
}
