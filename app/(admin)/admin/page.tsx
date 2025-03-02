"use server"

/**
 * @description
 * Admin dashboard page showing summary statistics and quick links.
 * Provides an overview of the platform's usage and activity.
 */

import { Suspense } from "react"
import Link from "next/link"
import { db } from "@/db/db"
import { count, eq } from "drizzle-orm"
import { profilesTable } from "@/db/schema/profiles-schema"
import {
  conversationsTable,
  messagesTable
} from "@/db/schema/conversations-schema"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, BarChart } from "lucide-react"

export default async function AdminDashboardPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Overview of platform statistics and quick access to management tools.
      </p>

      <Suspense fallback={<div>Loading statistics...</div>}>
        <DashboardStats />
      </Suspense>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <QuickLinkCard
          title="User Management"
          description="View and manage user accounts and roles"
          icon={<Users className="size-5" />}
          href="/admin/users"
        />
        <QuickLinkCard
          title="Conversations"
          description="Browse all user conversations"
          icon={<MessageSquare className="size-5" />}
          href="/admin/conversations"
        />
        <QuickLinkCard
          title="Analytics"
          description="View detailed platform analytics"
          icon={<BarChart className="size-5" />}
          href="/admin/analytics"
        />
      </div>
    </div>
  )
}

async function DashboardStats() {
  // Get total users count
  const [usersResult] = await db.select({ count: count() }).from(profilesTable)

  // Get total conversations count
  const [conversationsResult] = await db
    .select({ count: count() })
    .from(conversationsTable)

  // Get total messages count
  const [messagesResult] = await db
    .select({ count: count() })
    .from(messagesTable)

  // Get admin users count
  const [adminsResult] = await db
    .select({ count: count() })
    .from(profilesTable)
    .where(eq(profilesTable.membership, "admin"))

  // Get pro users count
  const [proUsersResult] = await db
    .select({ count: count() })
    .from(profilesTable)
    .where(eq(profilesTable.membership, "pro"))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={usersResult.count}
        description="Registered accounts"
      />
      <StatCard
        title="Conversations"
        value={conversationsResult.count}
        description="Total chat sessions"
      />
      <StatCard
        title="Messages"
        value={messagesResult.count}
        description="Total exchanged messages"
      />
      <StatCard
        title="Pro Users"
        value={proUsersResult.count}
        description={`${adminsResult.count} admins included`}
      />
    </div>
  )
}

function StatCard({
  title,
  value,
  description
}: {
  title: string
  value: number
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  )
}

function QuickLinkCard({
  title,
  description,
  icon,
  href
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={href}>View</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
