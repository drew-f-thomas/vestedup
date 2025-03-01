"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquarePlus } from "lucide-react"

interface EmptyStateProps {
  onNewChat: () => Promise<{ ok: boolean; conversationId: string }>
}

export default function EmptyState({ onNewChat }: EmptyStateProps) {
  const router = useRouter()

  async function handleNewChat() {
    const result = await onNewChat()
    if (result.ok) {
      router.push(`/chat/${result.conversationId}`)
    } else {
      alert("Failed to create a new chat. Please try again.")
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <MessageSquarePlus className="text-muted-foreground mx-auto mb-4 size-12" />
        <h2 className="mb-2 text-xl font-bold md:text-2xl">
          Start a New Conversation
        </h2>
        <p className="text-muted-foreground mb-6 text-sm md:text-base">
          Select a conversation from the sidebar or start a new one to begin
          chatting.
        </p>
        <Button onClick={handleNewChat} className="mx-auto">
          New Conversation
        </Button>
      </div>
    </div>
  )
}
