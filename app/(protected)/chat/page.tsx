"use server"
/**
 * @description
 * A new server page that shows the chat for a specific conversation. It fetches messages,
 * user insights, and passes them to a client ChatInterface. Also integrates the "multi-modal"
 * context by letting the user upload PDFs/images from the chat input.
 *
 * Key features:
 * 1. Dynamic route param: conversationId from [conversationId].
 * 2. Auth check via Clerk.
 * 3. Retrieve messages, user insights.
 * 4. Render ChatInterface with an "Upload File" button, integrated with OpenAI GPT logic.
 *
 * @dependencies
 * - getConversationByIdAction, getMessagesByConversationAction from conversation-actions
 * - getInsightsAction from insights-actions
 * - ChatInterface from the _components folder
 *
 * @notes
 * - This is the main recommended approach for the "Enhanced Chat Experience" from step 15.
 * - The existing /chat/page.tsx can remain or be replaced, depending on your preference.
 */

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import EmptyState from "./_components/empty-state"
import { newChatServerAction } from "./layout"

export default async function ChatPage() {
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  return <EmptyState onNewChat={newChatServerAction} />
}
