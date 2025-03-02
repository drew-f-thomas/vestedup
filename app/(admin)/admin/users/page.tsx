"use server"
/**
 * @description
 * Admin page for managing users and their roles.
 * Allows admins to view all users and change their membership status.
 */

import { Suspense } from "react"
import { db } from "@/db/db"
import { profilesTable } from "@/db/schema/profiles-schema"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { updateProfileAction } from "@/actions/db/profiles-actions"
import UserRoleForm from "./_components/user-role-form"

export default async function UsersAdminPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <p className="text-muted-foreground mb-6">
        View and manage user roles and membership status.
      </p>

      <Suspense fallback={<div>Loading users...</div>}>
        <UsersTable />
      </Suspense>
    </div>
  )
}

async function UsersTable() {
  // Fetch all profiles
  const profiles = await db.query.profiles.findMany({
    orderBy: (profiles, { desc }) => [desc(profiles.createdAt)]
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Membership</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            profiles.map(profile => (
              <TableRow key={profile.userId}>
                <TableCell className="font-mono text-xs">
                  {profile.userId}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      profile.membership === "admin"
                        ? "destructive"
                        : profile.membership === "pro"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {profile.membership}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(profile.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <UserRoleForm
                    userId={profile.userId}
                    currentRole={profile.membership}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
