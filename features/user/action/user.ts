"use server";

import { getCurrentUser } from "@/auth/currentUser";
import {
  updateUserBan as updateUserBanDB,
  updateUserRole as updateUserRoleDB,
} from "../db/user";
import { canBanUser, canUpdateUserRole } from "../permission/user";
import { TUserRoles } from "@/drizzle/schema";

export async function updateUserRole({
  userId,
  role,
}: {
  userId: string;
  role: TUserRoles;
}) {
  const currentUser = await getCurrentUser({
    redirectIfNotFound: true,
  });

  if (
    !(await canUpdateUserRole({
      currentUser,
      targetUserId: userId,
    }))
  ) {
    return {
      error: true,
      message: "You don't have permission to update this user.",
    };
  }

  await updateUserRoleDB(userId, role);

  return {
    error: false,
    message: "Role updated successfully.",
  };
}

export async function updateUserBan({
  userId,
  banned,
}: {
  userId: string;
  banned: boolean;
}) {
  const currentUser = await getCurrentUser({
    redirectIfNotFound: true,
  });

  if (
    !(await canBanUser({
      currentUser,
      targetUserId: userId,
    }))
  ) {
    return {
      error: true,
      message: "You don't have permission to update this user.",
    };
  }

  await updateUserBanDB(userId, banned);

  return {
    error: false,
    message: banned
      ? "User banned successfully."
      : "User unbanned successfully.",
  };
}
