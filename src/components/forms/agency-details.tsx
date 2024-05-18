'use client';

import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Agency } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
} from "../ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import {
  deleteAgency,
  initUser,
  upsertAgency
} from "@/lib/queries";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { v4 } from "uuid";
import { toast } from "sonner"

type Props = {
  data?: Partial<Agency>
}

const FormSchema = z.object({
  name: z.string().min(2, { message: "Agency name must be at least 2 characters." }),
});

export default function AgencyDetails({ data }: Props) {
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name,
    }
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await initUser({ role: 'AGENCY_OWNER' });

      await upsertAgency({
        id: data?.id ? data.id : v4(),
        name: values.name,
        createdAt: new Date(),
        updatedAt: new Date(),

      });

      if (data?.id) toast("Updated Agency")
      else toast("Created agency");

      return router.refresh();

    } catch (error) {
      console.log(error);
      toast("OOPS!!", {
        description: "Could not save data",
      });
    }
  }

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);
    try {
      await deleteAgency(data.id);
      toast("Deleted agency", {
        description: "Deleted your agency and all sub accounts",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast("OOPS!!", {
        description: "Could not delete your agency",
      });
    }
    finally {
      setDeletingAgency(false);
    }
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Agency Information
          </CardTitle>
          <CardDescription>
            {data?.id ? "Update your Agency details" : "Get Started with creating your Agency"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Agency Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loading variant="small"  /> : "Save"}
              </Button>

            </form>
          </Form>

          {data?.id && (
            <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
              <div className="text-muted-foreground">
                <div className="text-white font-semibold"> Danger Zone </div>
                Deleting your agency cannot be undone. This will also delete all
                projects and all data related to your projects.
              </div>
              <AlertDialogTrigger disabled={isLoading || deletingAgency} className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap" >
                {deletingAgency ? "Deleting..." : "Delete Agency"}
              </AlertDialogTrigger>
            </div>
          )}

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the
                Agency account and all related Projects.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAgency}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}
