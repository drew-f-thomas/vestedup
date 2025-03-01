/**
 * @description
 * Server page for admin to manage all system prompts (from the `prompts` table).
 * We can list existing prompts, add a new one, and set one as active.
 *
 * Key Features:
 * - getAllPromptsAction to fetch the list
 * - createPromptAction to add a new one
 * - setActivePromptAction to switch active prompt
 * - ensureDefaultSystemPromptAction to ensure a default prompt exists
 *
 * @dependencies
 * - getAllPromptsAction, createPromptAction, setActivePromptAction
 * - React Suspense if needed
 *
 * @notes
 * - This is a minimal example. For more sophisticated editing, you could add
 *   a route for editing prompt content or do it inline.
 */

"use server"

import { Suspense } from "react"
import { getAllPromptsAction } from "@/actions/db/prompts-actions"
import PromptsAdminClient from "./_components/prompts-admin-client"

export default async function PromptsPage() {
  return (
    <Suspense fallback={<div>Loading prompts...</div>}>
      <PromptsContent />
    </Suspense>
  )
}

async function PromptsContent() {
  const promptsResult = await getAllPromptsAction()

  if (!promptsResult.isSuccess) {
    return (
      <div className="bg-destructive/10 border-destructive rounded-md border p-4">
        <h3 className="text-destructive font-medium">Error loading prompts</h3>
        <p>{promptsResult.message}</p>
      </div>
    )
  }

  return <PromptsAdminClient initialPrompts={promptsResult.data} />
}
