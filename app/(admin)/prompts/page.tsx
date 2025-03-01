/**
 * @description
 * Server page for admin to manage all system prompts (from the `prompts` table).
 * We can list existing prompts, add a new one, and set one as active.
 *
 * Key Features:
 * - getAllPromptsAction to fetch the list
 * - createPromptAction to add a new one
 * - setActivePromptAction to switch active prompt
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

import { getAllPromptsAction } from "@/actions/db/prompts-actions"
import PromptsAdminClientPage from "./_components/prompts-admin-client"

export default async function AdminPromptsPage() {
  // We fetch all prompts
  const promptsRes = await getAllPromptsAction()
  const allPrompts = promptsRes.isSuccess ? promptsRes.data : []

  return (
    <div className="space-y-4">
      <h2 className="mb-2 text-xl font-semibold">Manage System Prompts</h2>
      <PromptsAdminClientPage initialPrompts={allPrompts} />
    </div>
  )
}
