'use client';
import { AuthUserDetails, UserPermissionsDetails } from "@/lib/types"
import { useModal } from "@/providers/modal-provider"
import { Project } from "@prisma/client"
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { getAuthUserDetails, changeUserPermissions, getUserPermissions } from "@/lib/queries"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../ui/card"
import { Switch } from "../ui/switch";
import { v4 } from "uuid";
import Unauthorized from "../global/unauthorized";
import Loading from "../global/loading";

type Props = {
  projects?: Project[]
}

export default function UserPermissions({ projects }: Props) {
  const { data } = useModal();
  const router = useRouter();
  const [projectPermissions, setProjectPermissions] = useState<UserPermissionsDetails | null>(null);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [authUserData, setAuthUserData] = useState<AuthUserDetails | null>(null);

  useEffect(() => {
    if (data.user) {
      const fetchDetails = async () => {
        setLoadingPermissions(true);
        try {
          const response = await getAuthUserDetails();
          if (response) {
            setAuthUserData(response);
          }
        } catch (error) {
          toast("Something went wrong");
        }
        setLoadingPermissions(false);
      }
      fetchDetails();
    }
  }, [data])

  useEffect(() => {
    if (!data.user) { return }
    const getPermissions = async () => {
      setLoadingPermissions(true);
      try {
        if (!data.user) return;
        const permission = await getUserPermissions(data.user.id);
        setProjectPermissions(permission);
      } catch (error) {
        toast("Something went wrong");
      }
      setLoadingPermissions(false);
    }
    getPermissions();
  }, [data])

  const onChangePermission = async (projectId: string, val: boolean, permissionId: string | undefined) => {
    if (!data.user?.email) return;

    setLoadingPermissions(true);
    const response = await changeUserPermissions(
      permissionId ? permissionId : v4(),
      data.user.email,
      projectId,
      val
    );

    if (response) {
      toast("Success", {
        description: "The request was successful"
      });
      if (projectPermissions) {
        setProjectPermissions((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            Permissions: prev.Permissions.map(perm => {
              if (perm.projectId === projectId) {
                return { ...perm, access: !perm.access }
              }
              return perm;
            })
          }
        });
      }
    } else {
      toast("Failed", {
        description: "Could not update permissions",
      });
    }

    router.refresh();
    setLoadingPermissions(false);
  }

  if (authUserData?.role !== "AGENCY_OWNER") {
    if (loadingPermissions) return (
      <div className="flex items-center justify-center h-full w-full">
        <Loading />
      </div>
    );
    return <Unauthorized />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          User Permissions
        </CardTitle>
        <CardDescription>
          Grant or Revoke Access to the Projects.
          You can give Project access to team member by turning on access control to each Project.
          This is only visible to agency owners.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          {projects?.map((project) => {
            const projectPermissionsDetails = projectPermissions?.Permissions.find(p => p.projectId === project.id);
            return (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p>{project.name}</p>
                </div>
                <Switch
                  disabled={loadingPermissions}
                  checked={projectPermissionsDetails?.access}
                  onCheckedChange={(p) => {
                    onChangePermission(project.id, p, projectPermissionsDetails?.id);
                  }}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
