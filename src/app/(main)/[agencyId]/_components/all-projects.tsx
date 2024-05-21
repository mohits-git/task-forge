import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Project } from "@prisma/client";
import { AuthUserDetails } from "@/lib/types";
import Link from "next/link";
import React from "react";
import DeleteButton from "./delete-button";
import CreateProjectButton from "./create-project-button";
import { Pencil, Trash } from "lucide-react";
import EditProjectButton from "./edit-project-button";

type Props = {
  agencyId: string;
  user: AuthUserDetails;
}

const AllProjects: React.FC<Props> = async ({ agencyId, user }) => {
  if (!user) return;
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Projects: </h2>
        <CreateProjectButton
          className="w-[200px] self-end m-6"
        />
      </div>
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
                    className="!bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                  >
                    <Link href={`/project/${project.id}`}
                      className="flex gap-4 w-full h-full items-center"
                    >
                      <div className="flex flex-col text-lg  hover:text-blue-300">
                        {project.name}
                      </div>
                    </Link>
                    <div className="flex items-center gap-3">
                      <EditProjectButton projectDetails={project} className="" />
                      <AlertDialogTrigger asChild>
                        <Button
                          size={'sm'}
                          variant={'destructive'}
                          className="text-white px-2 py-4 bg-red-700 hover:bg-red-600 hover:text-white"
                        >
                          <Trash size={15} />
                        </Button>
                      </AlertDialogTrigger>
                    </div>
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
