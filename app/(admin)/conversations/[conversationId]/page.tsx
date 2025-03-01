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

import {
  getConversationByIdAction,
  getMessagesByConversationAction
} from "@/actions/db/conversation-actions"
import { getFeedbackByConversationAction } from "@/actions/db/feedback-actions"

import ConversationFeedbackModal from "./_compontents/conversation-feedback-modal"

interface AdminConversationPageProps {
  params: Promise<{ conversationId: string }>
}

export default async function AdminConversationPage({
  params
}: AdminConversationPageProps) {
  // Wait for route params
  const { conversationId } = await params

  // Optionally re-check user in case layout doesn't do it
  const { userId } = await auth()
  if (!userId) {
    return notFound()
  }

  // 1. Fetch the conversation
  const convoRes = await getConversationByIdAction(conversationId)
  if (!convoRes.isSuccess || !convoRes.data) {
    return (
      <div className="text-red-500">
        Conversation not found or error loading.
      </div>
    )
  }
  const conversation = convoRes.data

  // 2. Fetch the messages for that conversation
  const msgsRes = await getMessagesByConversationAction(conversationId)
  const messages = msgsRes.isSuccess ? msgsRes.data : []

  // 3. Fetch existing feedback
  const fbRes = await getFeedbackByConversationAction(conversationId)
  const existingFeedback = fbRes.isSuccess ? fbRes.data : null

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Conversation Detail</h2>
      <div className="text-muted-foreground text-sm">
        <p>
          <strong>Conversation ID:</strong> {conversation.id}
        </p>
        <p>
          <strong>User ID:</strong> {conversation.userId}
        </p>
        <p>
          <strong>Started At:</strong> {conversation.startedAt?.toISOString()}
        </p>
        <p>
          <strong>Updated At:</strong> {conversation.updatedAt?.toISOString()}
        </p>
      </div>

      <hr />

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Messages</h3>
        {messages.length === 0 ? (
          <p className="text-sm italic">No messages found.</p>
        ) : (
          <ul className="space-y-2">
            {messages.map(msg => (
              <li key={msg.id} className="bg-muted rounded p-2">
                <span className="mr-2 text-sm font-bold">{msg.role}:</span>
                <span className="text-sm">{msg.content}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr />

      {/* The feedback modal or form - pass existing feedback if any */}
      <ConversationFeedbackModal
        conversationId={conversationId}
        existingFeedback={existingFeedback}
      />
    </div>
  )
}
