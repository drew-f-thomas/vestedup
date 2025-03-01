"use server"
/**
 * @description
 * This server layout wraps the chat route in a sidebar layout. It fetches the user's
 * conversations for display and includes a "New Chat" button. Each conversation is listed
 * and navigates to a dynamic route /chat/[conversationId].
 *
 * Key features:
 * 1. Auth check for userId.
 * 2. Fetch user's conversations from the DB.
 * 3. Provide an inline server action or a reference to create new chat sessions.
 * 4. Display a sidebar with conversation list (client component).
 *
 * @dependencies
 * - auth from "@clerk/nextjs/server" to ensure user is logged in.
 * - getConversationsByUserAction, createConversationAction from "@/actions/db/conversation-actions".
 * - ChatSidebar (a new client component) to render the conversation list in the sidebar.
 *
 * @notes
 * - The user can click "New Chat" to create a conversation and then be redirected to that new conversation route.
 * - We'll show placeholders if no conversations exist.
 */

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import {
  createConversationAction,
  getConversationsByUserAction
} from "@/actions/db/conversation-actions"
import { ChatSidebar } from "./_components/chat-sidebar"
import { MobileSidebar } from "./_components/mobile-sidebar"

/**
 * @function newChatServerAction
 * @description
 *  A small server action that creates a new conversation for the current user and
 *  returns the conversationId so we can redirect to it.
 */
export async function newChatServerAction() {
  const { userId } = await auth()
  if (!userId) {
    return { ok: false, conversationId: "" }
  }
  const res = await createConversationAction(userId)
  if (!res.isSuccess) {
    return { ok: false, conversationId: "" }
  }
  return { ok: true, conversationId: res.data.id }
}

export default async function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  // fetch user's conversations
  const convosRes = await getConversationsByUserAction(userId)
  const conversations = convosRes.isSuccess ? convosRes.data : []

  return (
    <div className="flex h-[calc(100vh_-_4rem)] overflow-hidden">
      {/* Mobile sidebar - shown on small screens */}
      <MobileSidebar
        conversations={conversations}
        onNewChat={newChatServerAction}
      />

      {/* Desktop sidebar - hidden on small screens */}
      <div className="bg-muted hidden h-full w-64 shrink-0 overflow-y-auto border-r md:block">
        <div className="h-full p-4">
          <ChatSidebar
            conversations={conversations}
            onNewChat={newChatServerAction}
          />
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden p-4 pb-0">
        {children}
      </div>
    </div>
  )
}
