"use client"
/**
 * @description
 * Updated ChatInterface that creates a conversation only when the first message is sent.
 * It includes:
 * 1. A file upload button to directly attach PDFs/images from the chat input bar.
 * 2. Logic to create a new conversation when the first message is sent.
 * 3. Integration with OpenAI's GPT-4o model for AI responses.
 * 4. Ability to include document content when sending messages to GPT-4o.
 * 5. Immediate display of user messages with loading state for AI responses.
 *
 * Key features:
 * - Creates a conversation in the database only when the first message is sent
 * - "Upload" icon button near the text input for file uploads
 * - Displays user insights if available
 * - Uses OpenAI's GPT-4o model for AI responses
 * - Includes document content in messages when a document is uploaded
 * - Shows user messages immediately and displays a loader for AI responses
 *
 * @dependencies
 * - useState, useRef from React
 * - useRouter from Next navigation
 * - toast for notifications
 * - sendMessageAction from chat-actions
 * - createConversationAction from conversation-actions
 * - uploadDocumentStorage, getDocumentContentStorage from storage-actions
 */

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/hooks/use-toast"
import { sendMessageAction } from "@/actions/chat-actions"
import {
  uploadDocumentStorage,
  getDocumentContentStorage
} from "@/actions/storage/storage-actions"
import { createConversationAction } from "@/actions/db/conversation-actions"
import { SelectMessage } from "@/db/schema/conversations-schema"
import {
  UploadCloud,
  ChevronDown,
  ChevronRight,
  Loader2,
  Paperclip,
  Send
} from "lucide-react"
import { getDocumentByIdAction } from "@/actions/db/documents-actions"
import { getMessagesByConversationAction } from "@/actions/db/conversation-actions"
import DocumentUploader from "./document-uploader"

interface ChatInterfaceProps {
  userId: string
  conversationId: string | null
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
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(
    null
  )
  const [messages, setMessages] = useState<SelectMessage[]>(existingMessages)
  const [isWaitingForAI, setIsWaitingForAI] = useState(false)
  const [tempConversationId, setTempConversationId] = useState<string | null>(
    null
  )
  const [showFileUpload, setShowFileUpload] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  /**
   * @function handleSendMessage
   * Called when user presses "Send" or hits Enter in the input.
   * If no conversationId exists, creates a new conversation first.
   * Uses OpenAI's GPT-4o model for AI responses.
   * If a document was uploaded, extracts its text content and includes it with the message.
   */
  async function handleSendMessage() {
    if (!messageText.trim() && !uploadedDocumentId) {
      return
    }
    setIsSending(true)

    try {
      let activeConversationId = conversationId || tempConversationId
      let finalMessage = messageText.trim()
      let documentContent = ""

      // If a document was uploaded, extract its text content
      if (uploadedDocumentId) {
        // Get document details from the database
        const docResult = await getDocumentByIdAction(uploadedDocumentId)

        if (docResult.isSuccess && docResult.data) {
          const { filePath, fileType, isEncrypted } = docResult.data

          // Extract document text content from storage
          const contentResult = await getDocumentContentStorage(
            filePath,
            fileType,
            isEncrypted || false
          )

          if (contentResult.isSuccess) {
            // Store extracted text content separately
            documentContent = contentResult.data.content

            // Add a note to the message that a document was uploaded
            if (finalMessage) {
              finalMessage = `${finalMessage}\n\n[Document text extracted from: ${docResult.data.filePath.split("/").pop()}]`
            } else {
              finalMessage = `[Document text extracted from: ${docResult.data.filePath.split("/").pop()}]`
            }
          } else {
            toast({
              title: "Warning",
              description:
                "Could not extract document text content. Sending message without it.",
              variant: "default"
            })
          }
        }

        // Reset the uploaded document ID
        setUploadedDocumentId(null)
      }

      // Create a temporary user message to display immediately
      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        conversationId: activeConversationId || "pending",
        role: "user" as const,
        content: finalMessage,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Add the user message to the UI immediately
      setMessages(prevMessages => [
        ...prevMessages,
        tempUserMessage as SelectMessage
      ])

      // Clear the input field
      setMessageText("")

      // If no conversation exists yet, create one
      if (!activeConversationId) {
        const convoRes = await createConversationAction(userId)
        if (!convoRes.isSuccess) {
          toast({
            title: "Error creating conversation",
            description: convoRes.message,
            variant: "destructive"
          })
          setIsSending(false)
          return
        }

        activeConversationId = convoRes.data.id
        setTempConversationId(activeConversationId)
      }

      // Show AI is thinking
      setIsWaitingForAI(true)

      // Send the message using the conversation ID
      // This passes the extracted document text content separately to the OpenAI API
      const res = await sendMessageAction({
        conversationId: activeConversationId,
        userId,
        content: finalMessage,
        documentContent: documentContent || undefined
      })

      if (!res.isSuccess) {
        toast({
          title: "Error sending message",
          description: res.message,
          variant: "destructive"
        })
        // Remove the temporary message if there was an error
        setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id))
        setIsSending(false)
        setIsWaitingForAI(false)
        return
      }

      // Add the AI response to the messages state
      const aiMessage: SelectMessage = {
        id: res.data.assistantMessageId,
        conversationId: activeConversationId,
        role: "assistant",
        content: "Loading response...", // Placeholder until we fetch the actual content
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Fetch the actual message content
      try {
        const messagesRes =
          await getMessagesByConversationAction(activeConversationId)
        if (messagesRes.isSuccess) {
          const aiMessageContent = messagesRes.data.find(
            msg => msg.id === res.data.assistantMessageId
          )

          if (aiMessageContent) {
            // Update the AI message with actual content
            setMessages(prev => [
              ...prev.filter(msg => msg.id !== aiMessage.id), // Remove placeholder if it exists
              aiMessageContent // Add the actual message
            ])
          }
        }
      } catch (error) {
        console.error("Error fetching AI message content:", error)
      }

      // If this was a new conversation, redirect to the conversation page
      if (!conversationId) {
        router.push(`/chat/${activeConversationId}`)
      } else {
        // Otherwise just refresh to see the new messages
        router.refresh()
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
      setIsWaitingForAI(false)
    }
  }

  /**
   * @function handleFileUploadClick
   * Called when the "Upload" button is clicked, triggers the hidden file input.
   */
  function handleFileUploadClick() {
    setShowFileUpload(!showFileUpload)
  }

  /**
   * @function handleFileSelected
   * Called when a file is selected from the input. We call our "uploadDocumentStorage"
   * server action. On success, we store the document ID to include in the next message.
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

    // Store the document ID to include in the next message
    setUploadedDocumentId(res.data.documentId)

    toast({
      title: "Uploaded",
      description:
        "File uploaded successfully. It will be included in your next message."
    })

    router.refresh()
  }

  const handleDocumentUploaded = (documentId: string) => {
    setUploadedDocumentId(documentId)
    toast({
      title: "Document Ready",
      description:
        "Your document has been uploaded and is ready to be included in your next message.",
      variant: "default"
    })
  }

  // Handle keyboard events in the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
        {messages.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(msg => (
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

        {/* AI Typing Indicator */}
        {isWaitingForAI && (
          <div className="bg-muted text-muted-foreground mr-auto max-w-[80%] rounded-lg p-3 sm:max-w-[70%]">
            <span className="mb-1 block text-xs font-semibold">
              AI ASSISTANT
            </span>
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Hidden file input for PDF/image */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf, image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div className="mt-auto">
        {/* Message input */}
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="bg-background min-h-[60px] w-full resize-none rounded-md border p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSending}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={(!messageText.trim() && !uploadedDocumentId) || isSending}
            className="size-[60px] rounded-md p-2"
          >
            {isSending ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <Send className="size-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
