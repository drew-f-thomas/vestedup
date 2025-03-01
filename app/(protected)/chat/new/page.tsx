"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getInsightsAction } from "@/actions/insights-actions"
import ChatInterface from "../_components/chat-interface"

export default async function NewChatPage() {
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  // fetch user insights
  const insightsRes = await getInsightsAction(userId)
  const userInsights = insightsRes.isSuccess ? insightsRes.data : []

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 border-b pb-2">
        <h1 className="truncate text-xl font-semibold">New Conversation</h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatInterface
          userId={userId}
          conversationId={null}
          existingMessages={[]}
          insights={userInsights}
        />
      </div>
    </div>
  )
}
