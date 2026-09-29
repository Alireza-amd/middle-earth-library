"use client";

import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActionButton } from "./ActionButton";
import { signOut as signOutDB } from "@/auth/action";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/user";
import { fetchCurrentUser } from "@/auth/clientCurrentUser";
import { UserActivePlan } from "./UserActivePlan";
import Link from "next/link";

export function UserProfile() {
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut);
  const [showProfile, setShowProfile] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    fetchCurrentUser().then((user) => user && setUser(user));
  }, [setUser]);

  return user ? (
    <div className="relative">
      <Button
        onClick={() => setShowProfile((prev) => !prev)}
        variant="secondary"
        className="hover:cursor-pointer"
      >
        <PersonIcon className="size-4" />
      </Button>
      {showProfile && (
        <Card className="absolute top-full w-[300px] right-0 z-20">
          <CardHeader>
            <CardTitle className="font-pop">{user.name}</CardTitle>
            <CardDescription className="font-mono">
              {user.email}
            </CardDescription>
            <span>Role: {user.role}</span>
          </CardHeader>
          <CardContent>
            {user.role == "admin" ? (
              <Button asChild>
                <Link href="/admin">Admin Panel</Link>
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <UserActivePlan id={user.id} />
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    asChild
                    className="bg-secondary font-mono"
                  >
                    <Link
                      href="/profile/reserves"
                      className="hover:underline underline-offset-4"
                    >
                      MyReserves
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <ActionButton
              action={async () => {
                signOut();
                return await signOutDB();
              }}
            >
              <ExitIcon />
            </ActionButton>
          </CardFooter>
        </Card>
      )}
    </div>
  ) : (
    <Button variant="secondary" disabled={true} className="animate-pulse">
      <PersonIcon className="size-4" />
    </Button>
  );
}
