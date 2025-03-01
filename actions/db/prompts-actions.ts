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

