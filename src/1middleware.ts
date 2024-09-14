import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session"; // Assuming you have a decrypt function in your lib
import { redirect } from "next/navigation"; // Used for navigation redirects
import { revalidatePath } from "next/cache"; // Not needed unless you're doing cache invalidation

const protectedRoutes = [
  "/",
  "/customer",
  "/items",
  "/invoice",
  "/expenses",
  "/payments",
  "/estimate",
  "/deliverychallan",
];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  let isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  let c;
  if (!isProtectedRoute) {
    c = protectedRoutes.slice(1).some((route) => path.startsWith(route));
    isProtectedRoute = c;
  }

  // console.log("IsProtectedRoute", isProtectedRoute);
  // console.log("IsPublicRoute", isPublicRoute);

  // Get session cookie
  const cookie = cookies().get("session")?.value;
  // console.log("Cookie", cookie);

  // Decrypt session cookie (this should give you the user session data)
  const session = cookie ? await decrypt(cookie) : null;
  // console.log("Session after Decrypting=>", session);

  // Redirect if user is authenticated and tries to access the login page
  if (session?.userId && isPublicRoute) {
    console.log("User is authenticated, redirecting to home");
    return NextResponse.redirect(new URL("/", req.nextUrl)); // Redirect to home if authenticated
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!session?.userId && isProtectedRoute) {
    console.log("User is not authenticated, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.nextUrl)); // Redirect to login if not authenticated
  }

  // Allow access to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: "/(.*)", // This applies the middleware to all pages in the app
};
