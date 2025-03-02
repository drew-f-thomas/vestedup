/**
 * @description
 * Layout for admin routes that checks if the user has admin privileges.
 * Redirects non-admin users to the dashboard.
 */

"use server"

import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Check if user has admin privileges
  const { isSuccess, data: profile } = await getProfileByUserIdAction(userId)

  if (!isSuccess || profile.membership !== "admin") {
    redirect("/chat")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="mr-4 font-bold">Admin Dashboard</div>
          <nav className="flex items-center space-x-4 text-sm">
            <a href="/admin" className="hover:text-foreground/80 transition">
              Dashbaord
            </a>
            <a
              href="/admin/review"
              className="hover:text-foreground/80 transition"
            >
              Review
            </a>
            <a
              href="/admin/users"
              className="hover:text-foreground/80 transition"
            >
              Users
            </a>
            <a
              href="/admin/conversations"
              className="hover:text-foreground/80 transition"
            >
              Conversation Details
            </a>
            <a
              href="/admin/prompts"
              className="hover:text-foreground/80 transition"
            >
              Prompts
            </a>
            <a
              href="/admin/analytics"
              className="hover:text-foreground/80 transition"
            >
              Analytics
            </a>
          </nav>
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  )
}
