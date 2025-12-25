import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
    "/login",
    "/forget-password",
    "/verify-email",
    "/reset-password",
];

// Check if path starts with any public route
const isPublicRoute = (pathname: string) => {
    return publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies
    const token = request.cookies.get("famsched-access-token")?.value;

    // If on a public route and has token, redirect to dashboard
    if (isPublicRoute(pathname) && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If on a protected route and no token, redirect to login
    if (!isPublicRoute(pathname) && !token) {
        // Exclude static files and API routes
        if (
            !pathname.startsWith("/_next") &&
            !pathname.startsWith("/api") &&
            !pathname.includes(".")
        ) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
    ],
};
