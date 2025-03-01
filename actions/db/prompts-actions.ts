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
import { eq } from "drizzle-orm"

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
  promptData: InsertPrompt
): Promise<ActionState<SelectPrompt>> {
  try {
    const [created] = await db.insert(promptsTable).values(promptData).returning()
    return {
      isSuccess: true,
      message: "Prompt created successfully",
      data: created
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
export async function getAllPromptsAction(): Promise<
  ActionState<SelectPrompt[]>
> {
  try {
    // For simplicity, sort newest first
    const prompts = await db.query.prompts.findMany({
      orderBy: (tbl, { desc }) => [desc(tbl.createdAt)]
    })
    return {
      isSuccess: true,
      message: "Prompts retrieved successfully",
      data: prompts
    }
  } catch (error) {
    console.error("Error fetching prompts:", error)
    return { isSuccess: false, message: "Failed to fetch prompts" }
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
  promptId: string,
  data: Partial<InsertPrompt>
): Promise<ActionState<SelectPrompt>> {
  try {
    const [updated] = await db
      .update(promptsTable)
      .set(data)
      .where(eq(promptsTable.id, promptId))
      .returning()

    if (!updated) {
      return { isSuccess: false, message: "Prompt not found" }
    }

    return {
      isSuccess: true,
      message: "Prompt updated successfully",
      data: updated
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
export async function setActivePromptAction(
  promptId: string
): Promise<ActionState<void>> {
  try {
    // First, set all prompts to isActive = false
    await db.update(promptsTable).set({ isActive: false }).execute()

    // Then set the chosen prompt to isActive = true
    const [activated] = await db
      .update(promptsTable)
      .set({ isActive: true })
      .where(eq(promptsTable.id, promptId))
      .returning()

    if (!activated) {
      return { isSuccess: false, message: "Prompt not found to activate" }
    }

    return { isSuccess: true, message: "Prompt activated", data: undefined }
  } catch (error) {
    console.error("Error setting active prompt:", error)
    return { isSuccess: false, message: "Failed to activate prompt" }
  }
}

/**
 * @function getActivePromptAction
 * @async
 * @description
 *  Retrieves the currently active prompt from the database.
 *  Returns null if no active prompt is found.
 *
 * @returns {Promise<ActionState<SelectPrompt | null>>}
 */
export async function getActivePromptAction(): Promise<
  ActionState<SelectPrompt | null>
> {
  try {
    const activePrompt = await db.query.prompts.findFirst({
      where: eq(promptsTable.isActive, true)
    })
    
    return {
      isSuccess: true,
      message: activePrompt 
        ? "Active prompt retrieved successfully" 
        : "No active prompt found",
      data: activePrompt || null
    }
  } catch (error) {
    console.error("Error fetching active prompt:", error)
    return { isSuccess: false, message: "Failed to fetch active prompt" }
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
    const promptsResult = await getAllPromptsAction()
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
        isActive: true
      }
      
      return await createPromptAction(defaultPrompt)
    }
    
    // If prompts exist but none are active, set the most recent one as active
    const activePrompt = prompts.find(p => p.isActive)
    if (!activePrompt && prompts.length > 0) {
      const mostRecentPrompt = prompts[0] // Already sorted by createdAt desc
      const result = await setActivePromptAction(mostRecentPrompt.id)
      
      if (!result.isSuccess) {
        return { isSuccess: false, message: result.message }
      }
      
      return {
        isSuccess: true,
        message: "Set most recent prompt as active",
        data: { ...mostRecentPrompt, isActive: true }
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

