import { twMerge } from "tailwind-merge"
import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "./mode-toggle"

type Props = {
  className?: string;
  projectName?: string;
  agencyName?: string;
}
export default function Infobar({ projectName, agencyName, className }: Props) {
  return (
    <>
      <div className={twMerge(
        'fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px]',
        className
      )}>
        <div className="flex items-center pl-[50px] md:pl-0 gap-2">
          <span>{agencyName || "Agency"}</span>
          <span>{"/"}</span>
          <span>{projectName || "Project"}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <UserButton afterSignOutUrl="/" />
          <ModeToggle />
        </div>
      </div>
    </>
  )
}
