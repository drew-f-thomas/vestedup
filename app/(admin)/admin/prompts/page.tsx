/**
 * @description
 * Admin page for managing system prompts.
 * Allows admins to view, create, edit, and activate different prompts.
 */

"use server"

import { Suspense } from "react"
import { getPromptsAction } from "@/actions/db/prompts-actions"
import PromptsTable from "./_components/prompts-table"
import CreatePromptButton from "./_components/create-prompt-button"

export default async function PromptsAdminPage() {
  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prompt Management</h1>
        <CreatePromptButton />
      </div>

      <p className="text-muted-foreground mb-6">
        Manage system prompts used by the AI assistant. Only one prompt of each
        type can be active at a time.
      </p>

      <Suspense fallback={<div>Loading prompts...</div>}>
        <PromptsTableWrapper />
      </Suspense>
    </div>
  )
}

async function PromptsTableWrapper() {
  const { data: prompts, isSuccess } = await getPromptsAction()

  if (!isSuccess) {
    return <div>Failed to load prompts</div>
  }

  return <PromptsTable prompts={prompts} />
}
