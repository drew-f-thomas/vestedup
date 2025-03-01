/**
 * @description
 * This server layout provides an admin-only area. We check the user's membership
 * to ensure it's "pro" before allowing access. Otherwise, we redirect them to
 * "/pricing" (or you could do a 403 page).
 *
 * Key Features:
 * - Auth check using Clerk
 * - Profile membership check using getProfileByUserIdAction
 * - Minimal admin header for a consistent look
 *
 * @dependencies
 * - auth from "@clerk/nextjs/server"
 * - getProfileByUserIdAction from "@/actions/db/profiles-actions"
 * - redirect from "next/navigation"
 *
 * @notes
 * - This approach is simplistic. Production apps might require an explicit admin role
 *   or a separate table for admin users. We use membership='pro' as a stand-in.
 */

"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // 1. Clerk auth for user ID
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  // 2. Retrieve user profile
  const profileRes = await getProfileByUserIdAction(userId)
  if (!profileRes.isSuccess || !profileRes.data) {
    return redirect("/signup")
  }

  // 3. Basic membership check => must be "pro"
  if (profileRes.data.membership !== "pro") {
    return redirect("/pricing")
  }

  // 4. Render a minimal layout
  return (
    <div className="min-h-screen p-4">
      <div className="mb-6 border-b pb-2">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          View and manage all user conversations
        </p>
      </div>

      {children}
    </div>
  )
}
