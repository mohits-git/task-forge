'use client';
import TicketForm from "@/components/forms/ticket-form";
import CustomModal from "@/components/global/custom-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deleteTicket } from "@/lib/queries";
import { useModal } from "@/providers/modal-provider";
import { useSortable } from "@dnd-kit/sortable";
import { Edit, MoreHorizontalIcon, Trash, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";
import { TicketWithAssigned } from "@/lib/types";

type Props = {
  setAllTickets: Dispatch<SetStateAction<TicketWithAssigned[]>>;
  ticket: TicketWithAssigned;
  projectId: string;
  allTickets: TicketWithAssigned[];
}

const ProjectTicket: React.FC<Props> = ({
  setAllTickets,
  ticket,
  projectId,
  allTickets
}) => {

  const router = useRouter()
  const { setOpen } = useModal()

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: ticket.id.toString(),
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition
  } : undefined;


  const editNewTicket = (ticket: TicketWithAssigned) => {
    setAllTickets(() =>
      allTickets.map((t) => {
        if (t.id === ticket.id) {
          return ticket
        }
        return t
      })
    )
  }

  const handleClickEdit = async () => {
    setOpen(
      <CustomModal
        title="Update Ticket Details"
        subheading=""
      >
        <TicketForm
          getNewTicket={editNewTicket}
          laneId={ticket.laneId}
          projectId={projectId}
        />
      </CustomModal>,
      async () => {
        return { ticket: ticket }
      }
    )
  }

  const handleDeleteTicket = async () => {
    try {
      setAllTickets((tickets) => tickets.filter((t) => t.id !== ticket.id))
      const response = await deleteTicket(ticket.id);
      toast('Deleted', {
        description: 'Deleted ticket from lane.',
      })

      router.refresh()
    } catch (error) {
      toast('Oppse!', {
        description: 'Could not delete the ticket.',
      })
      console.log(error)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <AlertDialog>
        <DropdownMenu>
          <Card
            className="my-4 dark:bg-slate-900 bg-white cursor-grab shadow-none transition-all"
            {...attributes}
            {...listeners}
          >
            <CardHeader className="p-[12px]" >
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg w-full">{ticket.name}</span>
                <DropdownMenuTrigger>
                  <MoreHorizontalIcon
                    className="text-muted-foreground"
                  />
                </DropdownMenuTrigger>
              </CardTitle>
              <span className="text-muted-foreground text-xs">
                {new Date().toLocaleDateString()}
              </span>
              <CardDescription className="w-full">
                {ticket.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="m-0 p-2 border-t-[1px] border-muted-foreground/20 felx-items-center justify-between">
              <div className="flex item-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    alt="contact"
                    src={ticket.Assigned?.avatarUrl}
                  />
                  <AvatarFallback className="bg-primary text-sm text-white">
                    {ticket.Assigned?.name}
                    {!ticket.assignedUserId && <User2 size={14} />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-muted-foreground">
                    {ticket.assignedUserId
                      ? 'Assigned to'
                      : 'Not Assigned'}
                  </span>
                  {ticket.assignedUserId && (
                    <span className="text-xs w-28  overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
                      {ticket.Assigned?.name}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-sm font-bold">
                {!!ticket.value &&
                  new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: 'USD',
                  }).format(+Number(ticket.value))}
              </span>
            </CardFooter>
          </Card>
          <DropdownMenuContent>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <AlertDialogTrigger>
              <DropdownMenuItem className="flex items-center gap-2">
                <Trash size={15} />
                Delete Ticket
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={handleClickEdit}
            >
              <Edit size={15} />
              Edit Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                the ticket and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive"
                onClick={handleDeleteTicket}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </DropdownMenu>
      </AlertDialog>
    </div>
  )
}

export default ProjectTicket;

export function TicketOverlay({ ticket }: { ticket: Partial<TicketWithAssigned> }) {
  return (
    <Card className="my-4 md:-ml-[300px] max-w-[270px] dark:bg-slate-900 bg-white shadow-none transition-all">
      <CardHeader className="p-[12px]">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg w-full">{ticket.name}</span>
          <div>
            <MoreHorizontalIcon
              className="text-muted-foreground"
            />
          </div>
        </CardTitle>
        <span className="text-muted-foreground text-xs">
          {new Date().toLocaleDateString()}
        </span>
        <CardDescription className="w-full">
          {ticket.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="m-0 p-2 border-t-[1px] border-muted-foreground/20 felx-items-center justify-between">
        <div className="flex item-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              alt="contact"
              src={ticket.Assigned?.avatarUrl}
            />
            <AvatarFallback className="bg-primary text-sm text-white">
              {ticket.Assigned?.name}
              {!ticket.assignedUserId && <User2 size={14} />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <span className="text-sm text-muted-foreground">
              {ticket.assignedUserId
                ? 'Assigned to'
                : 'Not Assigned'}
            </span>
            {ticket.assignedUserId && (
              <span className="text-xs w-28  overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
                {ticket.Assigned?.name}
              </span>
            )}
          </div>
        </div>
        <span className="text-sm font-bold">
          {!!ticket.value &&
            new Intl.NumberFormat(undefined, {
              style: 'currency',
              currency: 'USD',
            }).format(+ticket.value)}
        </span>
      </CardFooter>
    </Card>
  )
}
