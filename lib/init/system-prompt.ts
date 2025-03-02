/**
 * @description
 * Handles initialization of the system prompt.
 * This file provides a function to ensure a default system prompt exists
 * without coupling it to middleware or other unrelated concerns.
 */

"use server"

import { ensureDefaultSystemPromptAction } from "@/actions/db/prompts-actions"
import { ensureStorageBucketExists } from "@/actions/storage/storage-actions"

// Track initialization state
let isInitialized = false

/**
 * Ensures that a default system prompt exists in the database.
 * This function is idempotent and can be called multiple times safely.
 * It will only attempt to initialize once per server instance.
 */
export async function initializeSystemPrompt() {
  if (isInitialized) {
    return
  }

  try {
    const result = await ensureDefaultSystemPromptAction()

    // Also ensure the storage bucket exists
    const bucketResult = await ensureStorageBucketExists()

    isInitialized = result.isSuccess && bucketResult.isSuccess

    if (result.isSuccess) {
      console.log("Default system prompt initialized successfully")
    } else {
      console.error(
        "Failed to initialize default system prompt:",
        result.message
      )
    }

    if (bucketResult.isSuccess) {
      console.log("Storage bucket initialized successfully")
    } else {
      console.error(
        "Failed to initialize storage bucket:",
        bucketResult.message
      )
    }
  } catch (error) {
    console.error("Error initializing system:", error)
  }
}
