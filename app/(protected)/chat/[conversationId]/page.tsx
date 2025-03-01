"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import {
  getConversationByIdAction,
  getMessagesByConversationAction
} from "@/actions/db/conversation-actions"
import { getInsightsAction } from "@/actions/insights-actions"
import ChatInterface from "../_components/chat-interface"
import ConversationError from "../_components/conversation-error"

interface ChatConversationPageProps {
  params: { conversationId: string }
}

export default async function ChatConversationPage({
  params
}: ChatConversationPageProps) {
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  const { conversationId } = params
  const convoRes = await getConversationByIdAction(conversationId)

  if (!convoRes.isSuccess) {
    return <ConversationError message={convoRes.message} />
  }

  // fetch messages
  const msgsRes = await getMessagesByConversationAction(conversationId)
  const messages = msgsRes.isSuccess ? msgsRes.data : []

  // fetch user insights
  const insightsRes = await getInsightsAction(userId)
  const userInsights = insightsRes.isSuccess ? insightsRes.data : []

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 border-b pb-2">
        <h1 className="truncate text-xl font-semibold">
          Conversation {conversationId.slice(0, 8)}...
        </h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatInterface
          userId={userId}
          conversationId={conversationId}
          existingMessages={messages}
          insights={userInsights}
        />
      </div>
    </div>
  )
}
