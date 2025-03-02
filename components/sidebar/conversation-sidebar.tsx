"use client"

import { MessageSquarePlus } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { SelectConversation } from "@/db/schema"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar"
import DocumentSidebarTrigger from "@/components/document/document-sidebar-trigger"

interface ConversationSidebarProps {
  conversations: SelectConversation[]
  title?: string
  userId: string
}

export function ConversationSidebar({
  conversations,
  title = "Conversations",
  userId
}: ConversationSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isNewChat = pathname === "/chat/new"

  const handleNewChat = () => {
    // Navigate to the new chat page without creating a conversation yet
    router.push("/chat/new")
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            title="New Chat"
          >
            <MessageSquarePlus className="size-5" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <div className="px-2 py-1">
            <h3 className="text-muted-foreground mb-2 px-2 text-xs font-semibold uppercase">
              Recent Conversations
            </h3>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {/* Show new conversation placeholder when on /chat/new */}
              {isNewChat && (
                <SidebarMenuItem className="mb-1">
                  <div
                    className={cn(
                      "bg-accent text-accent-foreground flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium"
                    )}
                  >
                    <MessageSquarePlus className="mr-2 size-4" />
                    <span className="truncate">New Conversation</span>
                  </div>
                </SidebarMenuItem>
              )}

              {conversations.length > 0 ? (
                conversations.map(conversation => (
                  <SidebarMenuItem key={conversation.id} className="mb-1">
                    <Link
                      href={`/chat/${conversation.id}`}
                      className={cn(
                        "flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium",
                        "hover:bg-accent hover:text-accent-foreground",
                        pathname === `/chat/${conversation.id}` &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <MessageSquarePlus className="mr-2 size-4" />
                      <span className="truncate">
                        Conversation {conversation.id.slice(0, 8)}
                      </span>
                    </Link>
                  </SidebarMenuItem>
                ))
              ) : !isNewChat ? (
                <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                  No conversations yet. Start a new chat!
                </div>
              ) : null}
            </ScrollArea>
          </div>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <DocumentSidebarTrigger userId={userId} />
        <div className="text-muted-foreground px-4 py-2 text-xs">
          Use the + button to start a new chat
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
