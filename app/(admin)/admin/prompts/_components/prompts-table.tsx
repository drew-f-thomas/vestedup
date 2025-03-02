"use client"

import { useState } from "react"
import { SelectPrompt } from "@/db/schema/prompts-schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { Check, Edit, Trash } from "lucide-react"
import {
  setPromptAsActiveAction,
  deletePromptAction
} from "@/actions/db/prompts-actions"
import { toast } from "@/components/ui/use-toast"
import EditPromptDialog from "./edit-prompt-dialog"

interface PromptsTableProps {
  prompts: SelectPrompt[]
}

export default function PromptsTable({ prompts }: PromptsTableProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [editingPrompt, setEditingPrompt] = useState<SelectPrompt | null>(null)

  const handleSetActive = async (
    id: string,
    type: "system" | "user" | "assistant"
  ) => {
    setIsLoading(id)
    try {
      const result = await setPromptAsActiveAction(id, type)
      if (result.isSuccess) {
        toast({
          title: "Prompt activated",
          description: "The prompt has been set as active.",
          variant: "default"
        })
        // Refresh the page to show updated state
        window.location.reload()
      } else {
        toast({
          title: "Error activating prompt",
          description: result.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error activating prompt",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prompt?")) {
      return
    }

    setIsLoading(id)
    try {
      const result = await deletePromptAction(id)
      if (result.isSuccess) {
        toast({
          title: "Prompt deleted",
          description: "The prompt has been deleted.",
          variant: "default"
        })
        // Refresh the page to show updated state
        window.location.reload()
      } else {
        toast({
          title: "Error deleting prompt",
          description: result.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error deleting prompt",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prompts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No prompts found
                </TableCell>
              </TableRow>
            ) : (
              prompts.map(prompt => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium">{prompt.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{prompt.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {prompt.isActive === "true" ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(prompt.updatedAt), {
                      addSuffix: true
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {prompt.isActive !== "true" && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleSetActive(prompt.id, prompt.type)
                          }
                          disabled={isLoading === prompt.id}
                        >
                          <Check className="size-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingPrompt(prompt)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(prompt.id)}
                        disabled={isLoading === prompt.id}
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingPrompt && (
        <EditPromptDialog
          prompt={editingPrompt}
          onClose={() => setEditingPrompt(null)}
        />
      )}
    </>
  )
}
