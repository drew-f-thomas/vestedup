"use server"

/**
 * @description
 * Admin page for viewing all user conversations.
 * Allows admins to browse and manage conversations across the platform.
 */

import { Suspense } from "react"
import Link from "next/link"
import { db } from "@/db/db"
import { conversationsTable } from "@/db/schema/conversations-schema"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"

export default async function ConversationsAdminPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Conversation Management</h1>
      <p className="text-muted-foreground mb-6">
        View and manage all user conversations across the platform.
      </p>

      <Suspense fallback={<div>Loading conversations...</div>}>
        <ConversationsTable />
      </Suspense>
    </div>
  )
}

async function ConversationsTable() {
  // Fetch all conversations
  const conversations = await db.query.conversations.findMany({
    orderBy: (conversations, { desc }) => [desc(conversations.createdAt)]
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No conversations found
              </TableCell>
            </TableRow>
          ) : (
            conversations.map(conversation => (
              <TableRow key={conversation.id}>
                <TableCell className="font-mono text-xs">
                  {conversation.id}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {conversation.userId}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(conversation.startedAt), {
                    addSuffix: true
                  })}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(conversation.createdAt), {
                    addSuffix: true
                  })}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/conversations/${conversation.id}`}>
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
