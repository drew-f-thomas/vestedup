/**
 * @description
 * A client component that handles the display and manipulation of prompt revisions.
 * Shows a list of existing prompts, allows creating a new one, and setting active.
 *
 * Key Features:
 * - Accepts an initial list of prompts from the server
 * - create new prompt (calls createPromptAction)
 * - set a prompt as active (calls setActivePromptAction)
 *
 * @dependencies
 * - React useState
 * - createPromptAction, setActivePromptAction from "@/actions/db/prompts-actions"
 */

"use client"

import { useState } from "react"
import { SelectPrompt } from "@/db/schema/prompts-schema"
import {
  createPromptAction,
  setActivePromptAction
} from "@/actions/db/prompts-actions"
import { toast } from "@/lib/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface PromptsAdminClientPageProps {
  initialPrompts: SelectPrompt[]
}

export default function PromptsAdminClientPage({
  initialPrompts
}: PromptsAdminClientPageProps) {
  const [prompts, setPrompts] = useState<SelectPrompt[]>(initialPrompts)

  // For new prompt creation
  const [newName, setNewName] = useState("")
  const [newContent, setNewContent] = useState("")
  const [isSavingNew, setIsSavingNew] = useState(false)

  async function handleCreatePrompt() {
    if (!newName.trim() || !newContent.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter both name and content",
        variant: "destructive"
      })
      return
    }

    setIsSavingNew(true)
    const result = await createPromptAction({
      name: newName.trim(),
      content: newContent.trim(),
      isActive: false
    })

    setIsSavingNew(false)
    if (!result.isSuccess) {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      })
      return
    }

    // Insert the new prompt into local state
    setPrompts(prev => [result.data, ...prev])

    // Clear out the form
    setNewName("")
    setNewContent("")

    toast({
      title: "Prompt created",
      description: "New prompt added to the database."
    })
  }

  async function handleSetActive(promptId: string) {
    const res = await setActivePromptAction(promptId)
    if (!res.isSuccess) {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive"
      })
      return
    }

    // Reflect changes in local state: only that prompt has isActive = true
    setPrompts(prev => prev.map(p => ({ ...p, isActive: p.id === promptId })))

    toast({
      title: "Prompt activated",
      description: "This prompt is now active."
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded border p-4">
        <h3 className="mb-2 text-lg font-semibold">Create New Prompt</h3>
        <div className="mb-2">
          <label className="mb-1 block text-sm font-medium">Prompt Name</label>
          <Input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="system-prompt"
          />
        </div>
        <div className="mb-2">
          <label className="mb-1 block text-sm font-medium">
            Prompt Content
          </label>
          <Textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="Enter the system prompt text here..."
          />
        </div>

        <Button onClick={handleCreatePrompt} disabled={isSavingNew}>
          {isSavingNew ? "Saving..." : "Create Prompt"}
        </Button>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Existing Prompts</h3>
        {prompts.length === 0 ? (
          <p className="text-sm italic">No prompts found.</p>
        ) : (
          <ul className="space-y-2">
            {prompts.map(prompt => (
              <li
                key={prompt.id}
                className="bg-muted space-y-2 rounded border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{prompt.name}</span>
                  <Button
                    variant={prompt.isActive ? "default" : "outline"}
                    onClick={() => handleSetActive(prompt.id)}
                  >
                    {prompt.isActive ? "Active" : "Set Active"}
                  </Button>
                </div>
                <p className="whitespace-pre-line text-sm">{prompt.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
