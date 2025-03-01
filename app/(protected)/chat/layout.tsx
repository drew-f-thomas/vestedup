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
 * 3. Display a sidebar with conversation list (client component).
 *
 * @dependencies
 * - auth from "@clerk/nextjs/server" to ensure user is logged in.
 * - getConversationsByUserAction from "@/actions/db/conversation-actions".
 * - ConversationSidebar to render the conversation list in the sidebar.
 *
 * @notes
 * - The user can click "New Chat" to navigate to a temporary route without creating a conversation.
 * - Conversations are only created when the first message is sent.
 * - We'll show placeholders if no conversations exist.
 */

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getConversationsByUserAction } from "@/actions/db/conversation-actions"
import { ConversationSidebar } from "@/components/sidebar/conversation-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"

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
    <SidebarProvider>
      <ConversationSidebar conversations={conversations} title="AI Chat" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>Chat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden p-4 pb-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
