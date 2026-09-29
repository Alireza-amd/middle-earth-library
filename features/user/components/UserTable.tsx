import { PageHeader } from "@/components/PageHeader";
import { getUsers, getUsersCount } from "../db/user";
import { UserFilter } from "./UserFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { ActionButton } from "@/components/ActionButton";

import { updateUserBan, updateUserRole } from "../action/user";

import { userRoles } from "@/drizzle/schema";
import { getCurrentUser } from "@/auth/currentUser";

type Props = {
  email?: string;
  page: number;
};

export async function UserTable({ email, page }: Props) {
  const users = await getUsers({
    email,
    page,
  });
  const currentUser = await getCurrentUser({
    redirectIfNotFound: true,
  });
  const pageCount = await getUsersCount(email);

  return (
    <>
      <PageHeader title="Users" />
      <UserFilter />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>

            <TableHead>Email</TableHead>

            <TableHead>Role</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Created</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>

              <TableCell>{user.email}</TableCell>

              <TableCell>
                <Badge>{user.role}</Badge>
              </TableCell>

              <TableCell>
                <Badge variant={user.banned ? "destructive" : "default"}>
                  {user.banned ? "Banned" : "Active"}
                </Badge>
              </TableCell>

              <TableCell>{format(user.createdAt, "yyyy-MM-dd")}</TableCell>
              <TableCell>
                {user.id === currentUser.id ? (
                  <Badge variant="secondary">Current User</Badge>
                ) : user.role === "admin" ? (
                  <Badge>Admin</Badge>
                ) : (
                  <Popover>
                    <PopoverTrigger
                      className={cn(buttonVariants(), "cursor-pointer")}
                    >
                      Manage
                    </PopoverTrigger>

                    <PopoverContent className="flex flex-col gap-2 w-52">
                      {userRoles.map((role) => {
                        if (role === user.role) return null;

                        return (
                          <ActionButton
                            key={role}
                            variant="outline"
                            action={updateUserRole.bind(null, {
                              userId: user.id,
                              role,
                            })}
                          >
                            Make {role}
                          </ActionButton>
                        );
                      })}

                      <ActionButton
                        variant={user.banned ? "default" : "destructive"}
                        action={updateUserBan.bind(null, {
                          userId: user.id,
                          banned: !user.banned,
                        })}
                      >
                        {user.banned ? "Unban" : "Ban"}
                      </ActionButton>
                    </PopoverContent>
                  </Popover>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
