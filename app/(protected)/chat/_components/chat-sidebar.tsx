"use client"
/**
 * @description
 * A client component that displays a list of the user's existing conversations.
 * Each conversation links to a dynamic route ("/chat/[conversationId]").
 * There's also a "New Chat" button that calls a server action to create a new conversation,
 * then navigates to it.
 *
 * Key features:
 * 1. Renders conversation list in a simple <ul>.
 * 2. "New Chat" button calls onNewChat() server action, then uses router.push() to go to the new chat route.
 *
 * @dependencies
 * - Next.js client side router for navigation.
 * - React for rendering.
 *
 * @notes
 * - We accept onNewChat as a prop. This is a server action that returns {ok: boolean, conversationId: string}.
 * - We can display a placeholder if there are no conversations.
 */

import { useRouter, usePathname } from "next/navigation"
import { SelectConversation } from "@/db/schema/conversations-schema"
import { Button } from "@/components/ui/button"
import { MessageSquarePlus } from "lucide-react"

interface ChatSidebarProps {
  conversations: SelectConversation[]
  onNewChat: () => Promise<{ ok: boolean; conversationId: string }>
}

export function ChatSidebar({ conversations, onNewChat }: ChatSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  async function handleNewChat() {
    const result = await onNewChat()
    if (result.ok) {
      // navigate to the newly created conversation
      router.push(`/chat/${result.conversationId}`)
    } else {
      // handle error
      alert("Failed to create a new chat. Check logs.")
    }
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <Button
        onClick={handleNewChat}
        variant="default"
        className="w-full justify-start"
      >
        <MessageSquarePlus className="mr-2 size-4" />
        New Chat
      </Button>

      <div className="flex-1 space-y-1 overflow-y-auto">
        <h3 className="text-muted-foreground mb-2 px-2 text-xs font-semibold">
          Recent Conversations
        </h3>

        {conversations.length === 0 ? (
          <p className="text-muted-foreground px-2 text-sm italic">
            No conversations yet
          </p>
        ) : (
          <ul className="space-y-1">
            {conversations.map(convo => {
              const isActive = pathname === `/chat/${convo.id}`
              return (
                <li key={convo.id}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => router.push(`/chat/${convo.id}`)}
                  >
                    <span className="truncate">
                      Conversation {convo.id.slice(0, 8)}...
                    </span>
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
