/**
 * @description
 * A client component that lists all conversations. Each row shows the conversation's
 * ID, userId, startedAt, updatedAt. Admins could expand to rate or flag the conversation.
 *
 * Key Features:
 * - Accepts an array of SelectConversation objects
 * - Renders them in a simple table
 * - Provides a placeholder for admin feedback or rating
 *
 * @dependencies
 * - React useState if needed (we do minimal usage)
 * - Possibly can import a "flagConversationAction" if we want to implement that
 *
 * @notes
 * - For large data sets, consider pagination. This is a minimal MVP.
 * - Timestamps are displayed as strings. In real usage, format them with date-fns or similar.
 */

"use client"

import { useState } from "react"
import { SelectConversation } from "@/db/schema/conversations-schema"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import ConversationReviewModal from "./conversation-review-modal"

interface AdminConversationListProps {
  conversations: SelectConversation[]
}

export default function AdminConversationList({
  conversations
}: AdminConversationListProps) {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null)

  if (conversations.length === 0) {
    return <div>No conversations found.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="bg-muted border-b">
            <th className="p-2 text-left font-semibold">ID</th>
            <th className="p-2 text-left font-semibold">User ID</th>
            <th className="p-2 text-left font-semibold">Started At</th>
            <th className="p-2 text-left font-semibold">Updated At</th>
            <th className="p-2 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {conversations.map(convo => (
            <tr key={convo.id} className="border-b">
              <td className="p-2 text-sm">{convo.id}</td>
              <td className="p-2 text-sm">{convo.userId}</td>
              <td className="p-2 text-sm">
                {convo.startedAt?.toISOString().split("T")[0]}
              </td>
              <td className="p-2 text-sm">
                {convo.updatedAt?.toISOString().split("T")[0]}
              </td>
              <td className="space-x-2 p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedConversation(convo.id)}
                >
                  Review
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Conversation Review Modal */}
      {selectedConversation && (
        <ConversationReviewModal
          conversationId={selectedConversation}
          open={!!selectedConversation}
          onClose={() => setSelectedConversation(null)}
        />
      )}
    </div>
  )
}
