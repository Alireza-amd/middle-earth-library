import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "./auth/session";

const adminRoutes = ["admin"];
const authRoutes = ["sign-in", "sign-up"];
const privateRoutes = ["/plans/purchased"];
const bannedRoute = "banned";

export default async function proxy(request: NextRequest) {
  return await routeMatcher(request);
}

async function routeMatcher(request: NextRequest) {
  const path = request.nextUrl.pathname.split("/")[1];
  const user = await getUserFromSession(request.cookies);

  if (user?.banned && path !== bannedRoute) {
    return NextResponse.redirect(new URL("/banned", request.url));
  }

  if (authRoutes.includes(path)) {
    if (user) return NextResponse.redirect(new URL("/", request.url));
  }

  if (privateRoutes.includes(request.nextUrl.pathname)) {
    if (user == null)
      return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (adminRoutes.includes(path)) {
    if (!user || user.role !== "admin")
      return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
