/**
 * @description
 * A client component that handles the display and manipulation of prompt revisions.
 * Shows a list of existing prompts, allows creating a new one, and setting active.
 *
 * Key Features:
 * - Accepts an initial list of prompts from the server
 * - create new prompt (calls createPromptAction)
 * - set a prompt as active (calls setPromptAsActiveAction)
 *
 * @dependencies
 * - React useState
 * - createPromptAction, setPromptAsActiveAction from "@/actions/db/prompts-actions"
 */

"use client"

import { useState } from "react"
import { SelectPrompt } from "@/db/schema/prompts-schema"
import {
  createPromptAction,
  setPromptAsActiveAction
} from "@/actions/db/prompts-actions"
import { toast } from "@/lib/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

interface PromptsAdminClientProps {
  initialPrompts: SelectPrompt[]
}

export default function PromptsAdminClient({
  initialPrompts
}: PromptsAdminClientProps) {
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
      type: "system",
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
    const res = await setPromptAsActiveAction(promptId, "system")
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
      description:
        "This prompt is now active and will be used as the system message for the AI assistant."
    })
  }

  // Get the active prompt for display
  const activePrompt = prompts.find(p => p.isActive)

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 mb-4 rounded-lg p-4">
        <h3 className="mb-2 text-lg font-medium">About System Prompts</h3>
        <p className="text-muted-foreground mb-2 text-sm">
          The active system prompt is used as the system message for the AI
          assistant in chat conversations. It defines the AI's personality,
          capabilities, and constraints.
        </p>
        <p className="text-muted-foreground text-sm">
          When a user sends a message, the active system prompt is included at
          the beginning of the conversation to guide the AI's responses. You can
          create multiple prompts and switch between them to change the AI's
          behavior without modifying your code.
        </p>
      </div>

      {activePrompt && (
        <div className="bg-muted/30 rounded border p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              Current Active Prompt
              <Badge variant="default" className="ml-2">
                Active
              </Badge>
            </h3>
            <span className="text-muted-foreground text-sm">
              {new Date(activePrompt.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-sm font-medium">{activePrompt.name}</span>
          </div>
          <p className="border-primary whitespace-pre-line border-l-2 py-1 pl-3 text-sm">
            {activePrompt.content}
          </p>
        </div>
      )}

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
            className="min-h-[150px]"
          />
        </div>

        <Button onClick={handleCreatePrompt} disabled={isSavingNew}>
          {isSavingNew ? "Saving..." : "Create Prompt"}
        </Button>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">All Prompts</h3>
        {prompts.length === 0 ? (
          <p className="text-sm italic">No prompts found.</p>
        ) : (
          <ul className="space-y-2">
            {prompts.map(prompt => (
              <li
                key={prompt.id}
                className={`space-y-2 rounded border p-3 ${
                  prompt.isActive
                    ? "bg-muted/50 border-primary/30"
                    : "bg-muted/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{prompt.name}</span>
                    {prompt.isActive && (
                      <CheckCircle className="text-primary size-4" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </span>
                    <Button
                      variant={prompt.isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSetActive(prompt.id)}
                      disabled={prompt.isActive}
                    >
                      {prompt.isActive ? "Active" : "Set Active"}
                    </Button>
                  </div>
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
