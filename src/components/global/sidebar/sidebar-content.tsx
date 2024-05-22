'use client';

import React from "react";
import { AuthUserDetails, ProjectWithLanes } from "@/lib/types";
import { useEffect, useMemo, useState } from "react"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../../ui/button";
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon, SquareArrowOutUpRight } from "lucide-react";
import clsx from "clsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import Link from "next/link";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/global/custom-modal";
import { Separator } from "@/components/ui/separator";
import { Project } from "@prisma/client";
import ProjectDetails from "@/components/forms/project-details";
import LaneDetails from "@/components/forms/lane-details";

type Props = {
  defaultOpen?: boolean;
  user: AuthUserDetails;
  projects: Project[];
  currentProject: ProjectWithLanes | null;
  agencyName?: string;
}

export default function SidebarContent({
  defaultOpen,
  user,
  projects,
  currentProject,
  agencyName,
}: Props) {

  const { setOpen } = useModal();

  const [isMounted, setIsMounted] = useState(false);
  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return;

  return (
    <>
      <Sheet
        modal={false}
        {...openState}
      >
        <SheetTrigger asChild className="absolute left-4 top-4 z-[100] md:!hidden flex">
          <Button variant={"outline"} size={"icon"}>
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent
          showX={!defaultOpen}
          side={'left'}
          className={clsx("bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",
            {
              "hidden md:inline-block z-0 w-[300px]": defaultOpen,
              "inline-block md:hidden z-[100] w-full": !defaultOpen
            }
          )}
        >
          <div className="relative">
            {user?.role === "AGENCY_OWNER" && (
              <Link href={"/"} className="hover:bg-secondary group text-lg font-semibold p-3 rounded-lg flex items-center">
                <span className="mr-2">Agency Dashboard</span>
                <SquareArrowOutUpRight
                  size={18}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200"
                />
              </Link>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-full flex items-center justify-between py-8 mt-2" variant={'ghost'}>
                  <div className="flex items-center text-left gap-2">
                    <Compass />
                    <div className="flex flex-col">
                      {currentProject?.name}
                      <span className="text-muted-foreground">
                        {agencyName}
                      </span>
                    </div>
                  </div>

                  <div>
                    <ChevronsUpDown size={16} className="text-muted-foreground" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 h-80 mt-4 z-[200]">
                <Command className="rounded-lg">
                  <CommandInput placeholder="Search Accounts..." />
                  <CommandList className="pb-16">
                    <CommandEmpty>No list found</CommandEmpty>
                    <CommandGroup heading="Projects">
                      {!!projects
                        ? projects.map(project =>
                          <CommandItem key={project.id}>
                            {defaultOpen ? (
                              <Link href={`/project/${project.id}`} className="flex gap-4 w-full h-full">
                                <div className="flex flex-col flex-1 font-medium">
                                  {project.name}
                                  <span className="text-muted-foreground font-normal">{agencyName}</span>
                                </div>
                              </Link>
                            ) : (
                              <SheetClose asChild>
                                <Link href={`/project/${project.id}`} className="flex gap-4 w-full h-full">
                                  <div className="flex flex-col flex-1 font-medium">
                                    {project.name}
                                    <span className="text-muted-foreground font-normal">{agencyName}</span>
                                  </div>
                                </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        )
                        : "No Projects"}
                    </CommandGroup>
                  </CommandList>
                  {(user?.role === "AGENCY_OWNER") && (
                    <SheetClose>
                      <Button
                        className="w-full flex gap-2"
                        onClick={() => {
                          setOpen(<CustomModal
                            title="Create a Project"
                            subheading="You can switch between your projects from the sidebar"
                          >
                            <ProjectDetails />
                          </CustomModal>)
                        }}
                      >
                        <PlusCircleIcon size={15} />
                        Create New Project
                      </Button>
                    </SheetClose>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground text-xs mt-4 mb-2">Lists:</p>
            <Separator className="mb-4" />
            <nav className="relative">
              <Command className="rounded-lg overflow-visible">
                <CommandInput placeholder="Search..." />
                <CommandList className="py-4 overflow-visible">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup className="overflow-visible">
                    {currentProject?.Lane?.map((lane) => {
                      return (
                        <CommandItem key={lane.id} className="w-full md:w-[250px] aria-selected:!bg-transparent !py-0">
                          <p
                            onClick={() => {
                              window.location.hash = `#${lane.id.toString()}`;
                            }}
                            className="h-full p-1.5 hover:bg-primary-foreground flex items-center gap-2 rounded-md transition-all md:w-full w-[250px]">
                            <span>{lane.name}</span>
                          </p>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="fixed bottom-4 w-[250px]">
                <Button
                  className="w-full flex gap-2"
                  onClick={() => {
                    setOpen(<CustomModal
                      title="Create a List"
                      subheading="You can create as many lists you want."
                    >
                      <LaneDetails projectId={currentProject?.id || ''} />
                    </CustomModal>)
                  }}
                >
                  <PlusCircleIcon size={15} />
                  Create New List
                </Button>
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
