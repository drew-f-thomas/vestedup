"use server"

import { initializeSystemPrompt } from "@/lib/init/system-prompt"

export default async function PromptsLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Initialize system prompt when admin visits the prompts page
  await initializeSystemPrompt()

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">System Prompts Management</h1>
      <p className="text-muted-foreground mb-6">
        Manage the system prompts used by the AI assistant. You can create new
        prompts and set which one is active.
      </p>
      {children}
    </div>
  )
}
