import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes by role
const protectedRoutes: Record<string, string[]> = {
  ADMIN: ["/dashboard", "/sales", "/purchase", "/Inventory-management", "/store", "/user", "/settings"],
  MANAGER: ["/dashboard", "/sales", "/purchase", "/Inventory-management"],
  CASHIER: ["/sales", "/dashboard"],
  SALESPERSON: ["/sales", "/dashboard"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get user info from cookies/session (customize as needed)
  const userCookie = request.cookies.get("user");
  if (!userCookie) {
    // Not logged in, redirect to login
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const user = JSON.parse(userCookie.value);
  const allowedRoutes = protectedRoutes[user.role] || [];

  // Check if user is allowed to access the route
  const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));
  if (!isAllowed) {
    // Redirect to dashboard or show forbidden page
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Optionally, check if user has assigned stores/counters for store-specific pages
  if (
    ["/sales", "/purchase", "/Inventory-management"].some((route) => pathname.startsWith(route)) &&
    (!user.stores || user.stores.length === 0)
  ) {
    // No store assigned, redirect or show message
    return NextResponse.redirect(new URL("/me", request.url));
  }

  return NextResponse.next();
}