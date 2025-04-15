/**
 * @description
 * Server page for admin to view a single conversation in detail, including
 * the messages. Also allows rating and leaving feedback via a modal.
 *
 * Key Features:
 * - Fetches conversation data from getConversationByIdAction
 * - Fetches associated messages from getMessagesByConversationAction
 * - Fetches feedback (if any) from getFeedbackByConversationAction
 * - Renders a conversation detail and a <ConversationFeedbackModal />
 *
 * @dependencies
 * - auth from "@clerk/nextjs/server" if we want to re-check membership, though
 *   the layout might handle gating already
 * - getConversationByIdAction, getMessagesByConversationAction
 * - getFeedbackByConversationAction
 *
 * @notes
 * - This route is nested under (admin)/conversations/[conversationId], so the user
 *   should already pass the admin layout checks.
 * - We show a minimal read-only view of messages for the sake of demonstration.
 */

"use server"

import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft } from "lucide-react"

import {
  getConversationByIdAction,
  getMessagesByConversationAction
} from "@/actions/db/conversation-actions"
import { getFeedbackByConversationAction } from "@/actions/db/feedback-actions"
import { db } from "@/db/db"
import { eq } from "drizzle-orm"
import {
  conversationsTable,
  messagesTable
} from "@/db/schema/conversations-schema"

import ConversationFeedbackModal from "./_compontents/conversation-feedback-modal"

interface AdminConversationPageProps {
  params: Promise<{
    conversationId: string
  }>
}

export default async function AdminConversationPage({
  params
}: AdminConversationPageProps) {
  const { conversationId } = await params

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/conversations">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Conversation Details</h1>
      </div>

      <Suspense fallback={<div>Loading conversation...</div>}>
        <ConversationDetail conversationId={conversationId} />
      </Suspense>
    </div>
  )
}

async function ConversationDetail({
  conversationId
}: {
  conversationId: string
}) {
  // Fetch the conversation
  const conversation = await db.query.conversations.findFirst({
    where: eq(conversationsTable.id, conversationId)
  })

  if (!conversation) {
    notFound()
  }

  // Fetch all messages for this conversation
  const messages = await db.query.messages.findMany({
    where: eq(messagesTable.conversationId, conversationId),
    orderBy: (messages, { asc }) => [asc(messages.createdAt)]
  })

  return (
    <div className="space-y-6">
      <div className="rounded-md border p-4">
        <h2 className="mb-4 text-lg font-semibold">Conversation Info</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium">ID:</div>
          <div className="font-mono">{conversation.id}</div>

          <div className="font-medium">User ID:</div>
          <div className="font-mono">{conversation.userId}</div>

          <div className="font-medium">Started:</div>
          <div>{new Date(conversation.startedAt).toLocaleString()}</div>

          <div className="font-medium">Ended:</div>
          <div>
            {conversation.endedAt
              ? new Date(conversation.endedAt).toLocaleString()
              : "Active"}
          </div>

          <div className="font-medium">Created:</div>
          <div>{new Date(conversation.createdAt).toLocaleString()}</div>

          <div className="font-medium">Last Updated:</div>
          <div>{new Date(conversation.updatedAt).toLocaleString()}</div>
        </div>
      </div>

      <div className="rounded-md border">
        <h2 className="border-b p-4 text-lg font-semibold">
          Messages ({messages.length})
        </h2>

        <div className="divide-y">
          {messages.length === 0 ? (
            <div className="text-muted-foreground p-4 text-center">
              No messages in this conversation
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`p-4 ${
                  message.role === "assistant" ? "bg-muted/50" : ""
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      message.role === "assistant"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary/10 text-secondary-foreground"
                    }`}
                  >
                    {message.role}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true
                    })}
                  </span>
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
