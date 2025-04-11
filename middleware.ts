/*
<ai_context>
Contains middleware for protecting routes, checking user authentication, and redirecting as needed.
</ai_context>
*/

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from "next/server"

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/(protected)/(.*)",
  "/dashboard/(.*)",
  "/profile/(.*)",
  "/data-import/(.*)",
  "/settings/(.*)",
  "/chat/(.*)",
  "/api/scrape/(.*)"
])

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health",
  "/_next/static/(.*)"
])

// Export the middleware
export default clerkMiddleware(async (auth, request) => {
  // For debugging - add info about the current route and auth status
  console.log(`[Middleware] Path: ${request.nextUrl.pathname} | Protected: ${isProtectedRoute(request)} | Public: ${isPublicRoute(request)}`)

  if (isProtectedRoute(request)) {
    const { userId } = await auth()
    
    // If user is not authenticated, redirect to sign-in
    if (!userId) {
      // Get the origin (protocol + hostname + port)
      const origin = request.nextUrl.origin
      // Build the full URL to redirect back to after sign-in
      const returnBackUrl = `${origin}${request.nextUrl.pathname}${request.nextUrl.search}`
      // URL encode the return URL
      const encodedReturnUrl = encodeURIComponent(returnBackUrl)
      
      // Create the sign-in URL with return_back_to parameter
      const signInUrl = new URL(`/sign-in?return_back_to=${encodedReturnUrl}`, request.nextUrl.origin)
      
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
})

// Export the config with comprehensive matcher
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Skip all static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Include API routes
    "/api/(.*)"
  ]
}
