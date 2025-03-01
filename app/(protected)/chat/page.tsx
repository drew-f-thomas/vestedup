"use server"
/**
 * @description
 * A server page that shows an empty state for the chat interface.
 * It provides a button to start a new conversation, which navigates to /chat/new.
 *
 * Key features:
 * 1. Auth check via Clerk.
 * 2. Render EmptyState with a button to start a new chat.
 *
 * @dependencies
 * - EmptyState from the _components folder
 *
 * @notes
 * - Conversations are only created when the first message is sent.
 */

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import EmptyState from "./_components/empty-state"

export default async function ChatPage() {
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  return <EmptyState />
}
