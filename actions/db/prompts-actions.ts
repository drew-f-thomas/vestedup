/**
 * @description
 * Provides server actions for managing system prompts in the `prompts` table.
 * We can store multiple named prompts, mark one as active, etc.
 *
 * Key Features:
 * - createPromptAction: Insert a new prompt revision
 * - updatePromptAction: Partial update (like content or isActive)
 * - getAllPromptsAction: List all prompts
 * - setActivePromptAction: Helper to mark exactly one prompt as active
 *
 * @dependencies
 * - db from "@/db/db"
 * - promptsTable from "@/db/schema/prompts-schema"
 * - eq from "drizzle-orm"
 * - ActionState from "@/types"
 */

"use server"

import { db } from "@/db/db"
import {
  promptsTable,
  InsertPrompt,
  SelectPrompt
} from "@/db/schema/prompts-schema"
import { ActionState } from "@/types"
import { eq, and, desc } from "drizzle-orm"

/**
 * @function createPromptAction
 * @async
 * @description
 *  Inserts a new row into promptsTable. Typically used when admins add a new revision.
 *
 * @param {InsertPrompt} promptData - The name, content, and isActive (optional)
 * @returns {Promise<ActionState<SelectPrompt>>}
 */
export async function createPromptAction(
  prompt: InsertPrompt
): Promise<ActionState<SelectPrompt>> {
  try {
    const [newPrompt] = await db.insert(promptsTable).values(prompt).returning()
    return {
      isSuccess: true,
      message: "Prompt created successfully",
      data: newPrompt
    }
  } catch (error) {
    console.error("Error creating prompt:", error)
    return { isSuccess: false, message: "Failed to create prompt" }
  }
}

/**
 * @function getAllPromptsAction
 * @async
 * @description
 *  Retrieves all prompt records, optionally sorted by createdAt desc.
 *
 * @returns {Promise<ActionState<SelectPrompt[]>>}
 */
export async function getPromptsAction(): Promise<ActionState<SelectPrompt[]>> {
  try {
    const prompts = await db.query.prompts.findMany({
      orderBy: (prompts, { desc }) => [desc(prompts.updatedAt)]
    })
    return {
      isSuccess: true,
      message: "Prompts retrieved successfully",
      data: prompts
    }
  } catch (error) {
    console.error("Error getting prompts:", error)
    return { isSuccess: false, message: "Failed to get prompts" }
  }
}

/**
 * @function getPromptByIdAction
 * @async
 * @description
 *  Retrieves a prompt record by its ID.
 *
 * @param {string} id - the UUID of the prompt to retrieve
 * @returns {Promise<ActionState<SelectPrompt>>}
 */
export async function getPromptByIdAction(
  id: string
): Promise<ActionState<SelectPrompt>> {
  try {
    const prompt = await db.query.prompts.findFirst({
      where: eq(promptsTable.id, id)
    })
    
    if (!prompt) {
      return { isSuccess: false, message: "Prompt not found" }
    }
    
    return {
      isSuccess: true,
      message: "Prompt retrieved successfully",
      data: prompt
    }
  } catch (error) {
    console.error("Error getting prompt by id:", error)
    return { isSuccess: false, message: "Failed to get prompt" }
  }
}

/**
 * @function getActivePromptByTypeAction
 * @async
 * @description
 *  Retrieves the active prompt of a specified type.
 *
 * @param {string} type - the type of the prompt to retrieve
 * @returns {Promise<ActionState<SelectPrompt>>}
 */
export async function getActivePromptByTypeAction(
  type: "system" | "user" | "assistant"
): Promise<ActionState<SelectPrompt>> {
  try {
    const prompt = await db.query.prompts.findFirst({
      where: and(
        eq(promptsTable.type, type),
        eq(promptsTable.isActive, "true")
      )
    })
    
    if (!prompt) {
      return { isSuccess: false, message: `No active ${type} prompt found` }
    }
    
    return {
      isSuccess: true,
      message: "Active prompt retrieved successfully",
      data: prompt
    }
  } catch (error) {
    console.error("Error getting active prompt:", error)
    return { isSuccess: false, message: "Failed to get active prompt" }
  }
}

/**
 * @function updatePromptAction
 * @async
 * @description
 *  Partially updates a prompt by ID. Allows changing content, isActive, etc.
 *
 * @param {string} promptId - the UUID of the prompt to update
 * @param {Partial<InsertPrompt>} data - new content or isActive
 * @returns {Promise<ActionState<SelectPrompt>>}
 */
export async function updatePromptAction(
  id: string,
  data: Partial<InsertPrompt>
): Promise<ActionState<SelectPrompt>> {
  try {
    const [updatedPrompt] = await db
      .update(promptsTable)
      .set(data)
      .where(eq(promptsTable.id, id))
      .returning()
    
    if (!updatedPrompt) {
      return { isSuccess: false, message: "Prompt not found" }
    }
    
    return {
      isSuccess: true,
      message: "Prompt updated successfully",
      data: updatedPrompt
    }
  } catch (error) {
    console.error("Error updating prompt:", error)
    return { isSuccess: false, message: "Failed to update prompt" }
  }
}

/**
 * @function setActivePromptAction
 * @async
 * @description
 *  Marks the specified prompt as active, and optionally unsets all others.
 *  This ensures only one prompt is active at a time if desired.
 *
 * @param {string} promptId - the UUID of the prompt to activate
 * @returns {Promise<ActionState<void>>}
 */
export async function setPromptAsActiveAction(
  id: string,
  type: "system" | "user" | "assistant"
): Promise<ActionState<SelectPrompt>> {
  try {
    // First, set all prompts of this type to inactive
    await db
      .update(promptsTable)
      .set({ isActive: "false" })
      .where(eq(promptsTable.type, type))
    
    // Then set the specified prompt to active
    const [activatedPrompt] = await db
      .update(promptsTable)
      .set({ isActive: "true" })
      .where(eq(promptsTable.id, id))
      .returning()
    
    if (!activatedPrompt) {
      return { isSuccess: false, message: "Prompt not found" }
    }
    
    return {
      isSuccess: true,
      message: "Prompt set as active successfully",
      data: activatedPrompt
    }
  } catch (error) {
    console.error("Error setting prompt as active:", error)
    return { isSuccess: false, message: "Failed to set prompt as active" }
  }
}

/**
 * @function deletePromptAction
 * @async
 * @description
 *  Deletes a prompt record from the database.
 *
 * @param {string} id - the UUID of the prompt to delete
 * @returns {Promise<ActionState<void>>}
 */
export async function deletePromptAction(
  id: string
): Promise<ActionState<void>> {
  try {
    await db.delete(promptsTable).where(eq(promptsTable.id, id))
    return {
      isSuccess: true,
      message: "Prompt deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting prompt:", error)
    return { isSuccess: false, message: "Failed to delete prompt" }
  }
}

/**
 * @function ensureDefaultSystemPromptAction
 * @async
 * @description
 *  Ensures that a default system prompt exists in the database.
 *  If no prompts exist, creates a default one and sets it as active.
 *  If prompts exist but none are active, sets the most recent one as active.
 *
 * @returns {Promise<ActionState<SelectPrompt>>}
 */
export async function ensureDefaultSystemPromptAction(): Promise<
  ActionState<SelectPrompt>
> {
  try {
    // Check if any prompts exist
    const promptsResult = await getPromptsAction()
    if (!promptsResult.isSuccess) {
      return { isSuccess: false, message: promptsResult.message }
    }

    const prompts = promptsResult.data
    
    // If no prompts exist, create a default one
    if (prompts.length === 0) {
      const defaultPrompt = {
        name: "system-prompt",
        content: `You are a helpful AI assistant. Answer questions accurately, truthfully, and be as helpful as possible.

You should provide detailed, well-structured responses that directly address the user's query.

When appropriate, include examples, step-by-step instructions, or additional context to enhance understanding.

If you don't know the answer to something, be honest about it rather than making up information.`,
        isActive: "true",
        type: "system" as const
      }
      
      return await createPromptAction(defaultPrompt)
    }
    
    // If prompts exist but none are active, set the most recent one as active
    const activePrompt = prompts.find(p => p.isActive === "true")
    if (!activePrompt && prompts.length > 0) {
      const mostRecentPrompt = prompts[0] // Already sorted by updatedAt desc
      const result = await setPromptAsActiveAction(mostRecentPrompt.id, "system")
      
      if (!result.isSuccess) {
        return { isSuccess: false, message: result.message }
      }
      
      return {
        isSuccess: true,
        message: "Set most recent prompt as active",
        data: result.data
      }
    }
    
    // If an active prompt already exists, return it
    if (activePrompt) {
      return {
        isSuccess: true,
        message: "Active prompt already exists",
        data: activePrompt
      }
    }
    
    // This should never happen, but just in case
    return { 
      isSuccess: false, 
      message: "Failed to ensure default system prompt" 
    }
  } catch (error) {
    console.error("Error ensuring default system prompt:", error)
    return { isSuccess: false, message: "Failed to ensure default system prompt" }
  }
}

