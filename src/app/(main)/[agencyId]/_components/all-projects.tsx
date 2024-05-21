import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Project } from "@prisma/client";
import { AuthUserDetails } from "@/lib/types";
import Link from "next/link";
import React from "react";
import DeleteButton from "./delete-button";
import CreateProjectButton from "./create-project-button";
import { Trash } from "lucide-react";

type Props = {
  agencyId: string;
  user: AuthUserDetails;
}

const AllProjects: React.FC<Props> = async ({ agencyId, user }) => {
  if (!user) return;
  return (
    <div className="flex flex-col">
      <CreateProjectButton
        user={user}
        id={agencyId}
        className="w-[200px] self-end m-6"
      />
      <Command className="rounded-lg bg-transparent">
        <CommandInput placeholder="Search Projects..." />
        <CommandList className="invisible-scrollbar !max-h-screen">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Projects">
            {!!user.Agency?.Projects.length ? (
              user.Agency.Projects.map((project: Project) => (
                <AlertDialog key={project.id}>
                  <CommandItem
                    key={project.id}
                    className="h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                  >
                    <Link href={`/project/${project.id}`}
                      className="flex gap-4 w-full h-full"
                    >
                      <div className="flex flex-col justify-between ">
                        <div className="flex flex-col">
                          {project.name}
                        </div>
                      </div>
                    </Link>
                    <AlertDialogTrigger asChild>
                      <Button
                        size={'sm'}
                        variant={'destructive'}
                        className="text-white w-20 bg-red-700 hover:bg-red-600 hover:text-white"
                      >
                        <Trash size={20} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader className="">
                        <AlertDialogTitle className="text-left">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                          This action can not be undone. This will delete project and all data related to project.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center">
                        <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive">
                          <DeleteButton projectId={project.id} />
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </CommandItem>
                </AlertDialog >
              ))
            ) : (
              <div className="text-muted-foreground text-center p-4">No Projects</div>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </div >
  )
}

export default AllProjects;
