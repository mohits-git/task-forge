'use client';
import { getProjectTeamMembers, upsertTicket } from "@/lib/queries";
import { TicketWithAssigned } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2 } from "lucide-react";
import { Button } from "../ui/button";
import Loading from "../global/loading";

type Props = {
  laneId: string;
  projectId: string;
  getNewTicket: (ticket: TicketWithAssigned) => void;
}

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;

const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: 'Value must be valid price.'
  })
})

const TicketForm: React.FC<Props> = ({ getNewTicket, laneId, projectId }) => {
  const { data: defaultData, setClose } = useModal();
  const router = useRouter();
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState(
    defaultData?.ticket?.Assigned?.id || ''
  );
  const form = useForm<z.infer<typeof TicketFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      name: defaultData.ticket?.name ?? '',
      description: defaultData.ticket?.description ?? '',
      value: String(defaultData.ticket?.value ?? "0"),
    }
  });
  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
    if (!laneId) return;

    try {
      let payload;
      if (assignedTo === "") {
        payload = {
          ...values,
          laneId,
          id: defaultData.ticket?.id,
        };
      } else {
        payload = {
          ...values,
          laneId,
          id: defaultData.ticket?.id,
          assignedUserId: assignedTo,
        };
      }

      const response = await upsertTicket(payload);

      toast('Success', {
        description: 'Ticket saved successfully'
      });
      if (response) getNewTicket(response);
      router.refresh();
    } catch (error) {
      toast('Oopsse!', {
        description: 'Something went wrong.'
      });
    }

    setClose();
  }

  useEffect(() => {
    if (projectId) {
      const fetchData = async () => {
        const response = await getProjectTeamMembers(projectId);
        if (response) setAllTeamMembers(response);
      }
      fetchData();
    }
  }, [projectId]);

  useEffect(() => {
    if (defaultData.ticket) {
      form.reset({
        name: defaultData.ticket?.name || '',
        description: defaultData.ticket?.description || '',
        value: String(defaultData.ticket?.value) || '',
      });
    }
  }, [defaultData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormLabel>Assigned To Team Member</FormLabel>
            <Select
              onValueChange={setAssignedTo}
              defaultValue={assignedTo}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage alt="contact" />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">
                        Not Assigned
                      </span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {allTeamMembers.map((teamMember) => (
                  <SelectItem
                    key={teamMember.id}
                    value={teamMember.id}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          alt="contact"
                          src={teamMember.avatarUrl}
                        />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">
                        {teamMember.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-20 mt-4"
              disabled={isLoading}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loading variant="small" /> : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default TicketForm;
