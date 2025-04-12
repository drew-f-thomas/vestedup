"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SendHorizontal } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { useState } from "react"
import { toast } from "@/lib/hooks/use-toast"
import { initializeConversationWithTaxDataAction } from "@/actions/chat-actions"

export default function EmptyState() {
  const router = useRouter()
  const { userId } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartChat = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to start a chat",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      // Initialize a new conversation with tax data
      console.log("Starting new chat with tax data...")
      const result = await initializeConversationWithTaxDataAction(userId)

      if (result.isSuccess) {
        // Navigate to the new conversation
        router.push(`/chat/${result.data.conversationId}`)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to start chat",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error starting chat:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-4 text-center">
        <h1 className="mb-2 text-2xl font-bold">Welcome to the Chat</h1>
        <p className="text-muted-foreground mb-4">
          Start a new conversation with our AI assistant.
          <br />
          We'll automatically include your tax documents for context.
        </p>
      </div>
      <Button onClick={handleStartChat} disabled={isLoading}>
        {isLoading ? (
          "Initializing..."
        ) : (
          <>
            Start Chat <SendHorizontal className="ml-2 size-4" />
          </>
        )}
      </Button>
    </div>
  )
}
