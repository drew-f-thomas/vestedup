"use client"
/**
 * @description
 * Updated ChatInterface for step 15. Now includes:
 * 1. A file upload button to directly attach PDFs/images from the chat input bar.
 * 2. A reference to a new server action `sendOpenAIMessageAction` that calls GPT-4o (currently stubbed).
 *
 * Key features:
 * - "Upload" icon button near the text input. On click, triggers a hidden file input. Then we handle the file in code.
 * - If you want the user to mention the doc in the conversation, you can store the doc ID in a new message or context.
 * - sendOpenAIMessageAction is similar to sendMessageAction but calls an external GPT API.
 *
 * @dependencies
 * - useState, useRef from React
 * - useRouter from Next navigation
 * - toast for notifications
 * - Possibly the new "sendOpenAIMessageAction" if you'd like to demonstrate an external LLM call.
 *
 * @notes
 * - This is a minimal example, not necessarily a final design. Some teams might prefer a separate modal for file uploads.
 */

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/hooks/use-toast"
import { sendMessageAction } from "@/actions/chat-actions"
import { uploadDocumentStorage } from "@/actions/storage/storage-actions"
import { SelectMessage } from "@/db/schema/conversations-schema"
import { UploadCloud, ChevronDown, ChevronRight } from "lucide-react"

interface ChatInterfaceProps {
  userId: string
  conversationId: string
  existingMessages: SelectMessage[]
  insights: string[]
}

export default function ChatInterface({
  userId,
  conversationId,
  existingMessages,
  insights
}: ChatInterfaceProps) {
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const router = useRouter()

  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * @function handleSendMessage
   * Called when user presses "Send" or hits Enter in the input.
   * We call the existing sendMessageAction for now, which mocks an AI reply.
   * If you want to call GPT-4o, you can do so in a different server action,
   * e.g., "sendOpenAIMessageAction".
   */
  async function handleSendMessage() {
    if (!messageText.trim()) {
      return
    }
    setIsSending(true)

    // Use the original sendMessageAction which does a mock LLM response
    const res = await sendMessageAction({
      conversationId,
      userId,
      content: messageText.trim()
    })

    setIsSending(false)
    setMessageText("")

    if (!res.isSuccess) {
      toast({
        title: "Error sending message",
        description: res.message,
        variant: "destructive"
      })
      return
    }

    // Refresh to see the new messages
    router.refresh()
  }

  /**
   * @function handleFileUploadClick
   * Called when the "Upload" button is clicked, triggers the hidden file input.
   */
  function handleFileUploadClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  /**
   * @function handleFileSelected
   * Called when a file is selected from the input. We call our "uploadDocumentStorage"
   * server action. On success, we might optionally insert a new "system" or "assistant" message referencing the doc.
   */
  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Prepare formData for our server action
    const formData = new FormData()
    formData.append("userId", userId)
    formData.append("file", file)

    const res = await uploadDocumentStorage(formData)
    if (!res.isSuccess) {
      toast({
        title: "Error uploading",
        description: res.message,
        variant: "destructive"
      })
      return
    }

    toast({ title: "Uploaded", description: "File uploaded successfully." })

    // Optionally, create a message referencing the doc...
    // e.g. "User uploaded doc with ID: res.data.documentId"
    // We'll skip for brevity, but you could call sendMessageAction or store a special system message.

    router.refresh()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Show user insights if any */}
      {insights && insights.length > 0 && (
        <div className="bg-secondary/10 mb-3 rounded p-2 text-sm">
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="flex w-full items-center text-left font-medium"
          >
            {showInsights ? (
              <ChevronDown className="mr-1 size-4" />
            ) : (
              <ChevronRight className="mr-1 size-4" />
            )}
            Equity Insights ({insights.length})
          </button>

          {showInsights && (
            <ul className="mt-2 list-inside list-disc space-y-1 pl-5 text-sm">
              {insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mb-4 flex-1 space-y-2 overflow-y-auto pr-2">
        {existingMessages.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            No messages yet. Start the conversation!
          </div>
        ) : (
          existingMessages.map(msg => (
            <div
              key={msg.id}
              className={`rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto max-w-[80%] sm:max-w-[70%]"
                  : "bg-muted text-muted-foreground mr-auto max-w-[80%] sm:max-w-[70%]"
              }`}
            >
              <span className="mb-1 block text-xs font-semibold">
                {msg.role === "user" ? "YOU" : "AI ASSISTANT"}
              </span>
              <span className="whitespace-pre-wrap">{msg.content}</span>
            </div>
          ))
        )}
      </div>

      {/* Hidden file input for PDF/image */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf, image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div className="flex items-center gap-2 pb-4">
        {/* Upload file button */}
        <Button
          variant="outline"
          type="button"
          disabled={isSending}
          onClick={handleFileUploadClick}
          size="icon"
          className="shrink-0"
        >
          <UploadCloud className="size-4" />
        </Button>

        <Input
          type="text"
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
        />

        <Button
          onClick={handleSendMessage}
          disabled={isSending}
          className="shrink-0"
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  )
}
