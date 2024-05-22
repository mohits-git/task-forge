import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="p-4 text-center h-screen w-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl md:text-6xl">Unauthorized Access</h1>
      <p className="max-w-xl mt-2">Please login with different emailId or get an invitation from your Agency Owner.</p>
      <Link
        href={'/'}
        className="mt-4 p-2 bg-secondary rounded-lg hover:bg-secondary/50"
      >
        Back to Home
      </Link>
      <div className="my-3 text-xl font-semibold flex items-center gap-3">
        <span>User Profile: </span>
        <UserButton />
      </div>
    </div>
  )
}
