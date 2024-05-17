import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="p-4 text-center h-screen w-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl md:text-6xl">Unauthorized Access</h1>
      <p>Please login with different emailId or get an invitation from your Agency Owner.</p>
      <Link
        href={'/'}
        className="mt-4 p-2 bg-primary"
      >
        Back to Home
      </Link>
    </div>
  )
}
