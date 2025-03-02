"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import {
  getConversationByIdAction,
  getMessagesByConversationAction
} from "@/actions/db/conversation-actions"
import {
  getFeedbackByConversationAction,
  createOrUpdateFeedbackAction
} from "@/actions/db/feedback-actions"
import { SelectMessage } from "@/db/schema/conversations-schema"
import { toast } from "@/lib/hooks/use-toast"

interface ConversationReviewModalProps {
  conversationId: string
  open: boolean
  onClose: () => void
}

export default function ConversationReviewModal({
  conversationId,
  open,
  onClose
}: ConversationReviewModalProps) {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<SelectMessage[]>([])
  const [rating, setRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [existingFeedbackId, setExistingFeedbackId] = useState<string | null>(
    null
  )
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open && conversationId) {
      loadConversationData()
    }
  }, [open, conversationId])

  async function loadConversationData() {
    setLoading(true)
    try {
      // Load messages
      const msgsRes = await getMessagesByConversationAction(conversationId)
      if (msgsRes.isSuccess) {
        setMessages(msgsRes.data)
      }

      // Load existing feedback if any
      const fbRes = await getFeedbackByConversationAction(conversationId)
      if (fbRes.isSuccess && fbRes.data) {
        setRating(fbRes.data.rating)
        setFeedback(fbRes.data.notes || "")
        setExistingFeedbackId(fbRes.data.id)
      } else {
        // Reset if no feedback exists
        setRating(null)
        setFeedback("")
        setExistingFeedbackId(null)
      }
    } catch (error) {
      console.error("Error loading conversation data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitFeedback() {
    if (rating === null) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    try {
      // Use the single createOrUpdateFeedbackAction for both create and update
      const result = await createOrUpdateFeedbackAction(
        conversationId,
        rating,
        feedback
      )

      if (result.isSuccess) {
        toast({
          title: existingFeedbackId ? "Feedback updated" : "Feedback submitted",
          description: existingFeedbackId
            ? "Your feedback has been updated successfully"
            : "Your feedback has been submitted successfully"
        })

        // Close modal after successful submission
        onClose()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="flex max-h-[80vh] max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Review Conversation</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">Loading conversation data...</div>
        ) : (
          <div className="flex h-full flex-col">
            {/* Messages section - scrollable */}
            <div className="mb-4 flex-1 space-y-2 overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="text-muted-foreground py-4 text-center">
                  No messages in this conversation.
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                        : "bg-muted text-muted-foreground mr-auto max-w-[80%]"
                    }`}
                  >
                    <span className="mb-1 block text-xs font-semibold">
                      {msg.role === "user" ? "USER" : "AI ASSISTANT"}
                    </span>
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  </div>
                ))
              )}
            </div>

            {/* Rating and feedback section - fixed at bottom */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-center space-x-4">
                <Button
                  variant={rating === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRating(1)}
                  className="flex items-center"
                >
                  <ThumbsUp className="mr-2 size-4" />
                  Good
                </Button>
                <Button
                  variant={rating === 0 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRating(0)}
                  className="flex items-center"
                >
                  <ThumbsDown className="mr-2 size-4" />
                  Needs Improvement
                </Button>
              </div>

              <Textarea
                placeholder="Add your feedback or critique here..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={3}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitFeedback} disabled={submitting}>
                  {submitting
                    ? "Submitting..."
                    : existingFeedbackId
                      ? "Update Feedback"
                      : "Submit Feedback"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
