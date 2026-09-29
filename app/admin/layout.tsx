import { getCurrentUser } from "@/auth/currentUser";
import { NavbarSkeleton } from "@/components/NavbarSkeleton";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/UserProfile";
import Link from "next/link";
import { ReactNode, Suspense } from "react";

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div>
      <Suspense fallback={<NavbarSkeleton />}>
        <AdminNabar />
      </Suspense>
      {children}
    </div>
  );
}

async function AdminNabar() {
  const user = await getCurrentUser({
    getFullUser: true,
    redirectIfNotFound: true,
  });

  return (
    <div className="container my-6 flex items-center justify-between">
      <h1 className="font-mono text-2x">MiddleEarthLibary</h1>

      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-3">
          <Link
            href="/admin/comments"
            className="hover:underline underline-offset-4"
          >
            Comments
          </Link>
          <Link
            href="/admin/users"
            className="hover:underline underline-offset-4"
          >
            Users
          </Link>
          <Link
            href="/admin/plans"
            className="hover:underline underline-offset-4"
          >
            Plans
          </Link>
          <Link
            href="/admin/books"
            className="hover:underline underline-offset-4"
          >
            Books
          </Link>
          <Link
            href="/admin/reserves"
            className="hover:underline underline-offset-4"
          >
            Reserve
          </Link>
          <Link
            href="/admin/slider"
            className="hover:underline underline-offset-4"
          >
            Slider
          </Link>
        </nav>
        <div className="flex gap-2 items-center">
          {user ? (
            <UserProfile />
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/sign-in">sign in</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/sign-up">sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
