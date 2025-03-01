"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ConversationErrorProps {
  message: string
}

export default function ConversationError({ message }: ConversationErrorProps) {
  const router = useRouter()

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-4 text-sm text-red-500 md:text-base">
          Conversation not found or error loading: {message}
        </div>
        <Button onClick={() => router.push("/chat")}>Back to Chat</Button>
      </div>
    </div>
  )
}
