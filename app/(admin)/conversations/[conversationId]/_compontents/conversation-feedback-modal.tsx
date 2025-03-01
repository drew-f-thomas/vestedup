/**
 * @description
 * A client component that allows an admin to rate a conversation (thumbs up/down)
 * and leave a free-text critique. We fetch the existing rating if provided,
 * display it in the UI, and update it on submission.
 *
 * Key Features:
 * - Renders a simple form for rating and notes
 * - Calls createOrUpdateFeedbackAction on submit
 * - Optionally displayed as a modal or just an inline block (here, we do inline)
 *
 * @dependencies
 * - createOrUpdateFeedbackAction from "@/actions/db/feedback-actions"
 * - React useState
 * - toast for notifications
 *
 * @notes
 * - rating: we store as 0 or 1 for thumbs down or up, but you can expand as needed.
 */

"use client"

import { useState } from "react"
import { createOrUpdateFeedbackAction } from "@/actions/db/feedback-actions"
import { SelectConversationFeedback } from "@/db/schema/feedback-schema"
import { toast } from "@/lib/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ConversationFeedbackModalProps {
  conversationId: string
  existingFeedback: SelectConversationFeedback | null
}

export default function ConversationFeedbackModal({
  conversationId,
  existingFeedback
}: ConversationFeedbackModalProps) {
  // We'll keep rating as 0 or 1
  const [rating, setRating] = useState<number>(
    existingFeedback ? existingFeedback.rating : 0
  )
  const [notes, setNotes] = useState<string>(existingFeedback?.notes || "")

  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    setIsSaving(true)

    const res = await createOrUpdateFeedbackAction(
      conversationId,
      rating,
      notes
    )
    setIsSaving(false)

    if (!res.isSuccess) {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Feedback saved",
      description: "Your rating and critique have been saved."
    })
  }

  return (
    <div className="space-y-4 rounded-md border p-2">
      <h3 className="text-lg font-semibold">Conversation Feedback</h3>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="thumbsDown"
            name="rating"
            checked={rating === 0}
            onChange={() => setRating(0)}
            className="mr-1"
          />
          <label htmlFor="thumbsDown">Thumbs Down</label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id="thumbsUp"
            name="rating"
            checked={rating === 1}
            onChange={() => setRating(1)}
            className="mr-1"
          />
          <label htmlFor="thumbsUp">Thumbs Up</label>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Critique</label>
        <Textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Leave a free-text critique here..."
        />
      </div>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Feedback"}
      </Button>
    </div>
  )
}
