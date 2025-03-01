"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { SelectConversation } from "@/db/schema/conversations-schema"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChatSidebar } from "./chat-sidebar"

interface MobileSidebarProps {
  conversations: SelectConversation[]
  onNewChat: () => Promise<{ ok: boolean; conversationId: string }>
}

export function MobileSidebar({
  conversations,
  onNewChat
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size="icon" className="ml-2 mt-2">
          <Menu className="size-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="h-full w-72 p-0 pt-10">
        <div className="h-[calc(100%-2.5rem)] overflow-y-auto p-4">
          <ChatSidebar
            conversations={conversations}
            onNewChat={async () => {
              const result = await onNewChat()
              if (result.ok) {
                setOpen(false)
              }
              return result
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
