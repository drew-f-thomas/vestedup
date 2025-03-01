/**
 * @description
 * The main admin dashboard page. Displays a list of all conversations
 * (across all users). Only accessible to membership="pro" users as enforced by layout.
 *
 * Key Features:
 * - Calls getAllConversationsAction to fetch data
 * - Displays them using a client component <AdminConversationList />
 *
 * @dependencies
 * - getAllConversationsAction from "@/actions/db/conversation-actions"
 * - AdminConversationList from "./_components/conversation-list"
 *
 * @notes
 * - In production, you might add search, pagination, filtering by user, etc.
 */

"use server"

import { getAllConversationsAction } from "@/actions/db/conversation-actions"
import AdminConversationList from "../_components/conversation-list"

export default async function AdminPage() {
  const allConvos = await getAllConversationsAction()

  if (!allConvos.isSuccess) {
    return (
      <div className="text-red-500">
        Error fetching conversations: {allConvos.message}
      </div>
    )
  }

  // We have all conversations in allConvos.data
  return (
    <div>
      <AdminConversationList conversations={allConvos.data} />
    </div>
  )
}
