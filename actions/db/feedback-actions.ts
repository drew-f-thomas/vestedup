/**
 * @description
 * Provides server actions for CRUD operations on conversation feedback.
 * The table is `conversation_feedback`. Each record references a conversation,
 * has an integer rating, and free-text notes.
 *
 * Key Features:
 * - createOrUpdateFeedbackAction: Insert or update a single feedback entry for a conversation
 * - getFeedbackByConversationAction: Retrieve the existing feedback for a conversation
 *
 * @dependencies
 * - db from "@/db/db"
 * - conversationFeedbackTable, InsertConversationFeedback, SelectConversationFeedback
 * - eq from "drizzle-orm" for WHERE clause
 * - ActionState from "@/types"
 *
 * @notes
 * - For MVP, we assume one feedback record per conversation. If a row exists, we update it.
 * - Ratings: You might do 1 for thumbs up, 0 for thumbs down, or any scale you want.
 */

"use server"

import { db } from "@/db/db"
import {
  conversationFeedbackTable,
  InsertConversationFeedback,
  SelectConversationFeedback
} from "@/db/schema/feedback-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * @function createOrUpdateFeedbackAction
 * @async
 * @description
 *  Creates a new feedback record if none exists for the conversation, or updates
 *  the existing record. For MVP we assume only one record per conversation.
 *
 * @param {string} conversationId - the conversation to which the feedback belongs
 * @param {number} rating - numeric rating (0 or 1, but you can do any scale)
 * @param {string} notes - optional free-text critique
 *
 * @returns {Promise<ActionState<SelectConversationFeedback>>}
 */
export async function createOrUpdateFeedbackAction(
  conversationId: string,
  rating: number,
  notes?: string
): Promise<ActionState<SelectConversationFeedback>> {
  try {
    // Check if there's already feedback for this conversation
    const existing = await db.query.conversationFeedback.findFirst({
      where: eq(conversationFeedbackTable.conversationId, conversationId)
    })

    if (!existing) {
      // Create a new record
      const [newFeedback] = await db
        .insert(conversationFeedbackTable)
        .values({
          conversationId,
          rating,
          notes
        })
        .returning()
      return {
        isSuccess: true,
        message: "Feedback created successfully",
        data: newFeedback
      }
    } else {
      // Update the existing record
      const [updatedFeedback] = await db
        .update(conversationFeedbackTable)
        .set({ rating, notes })
        .where(eq(conversationFeedbackTable.conversationId, conversationId))
        .returning()
      return {
        isSuccess: true,
        message: "Feedback updated successfully",
        data: updatedFeedback
      }
    }
  } catch (error) {
    console.error("Error creating/updating feedback:", error)
    return { isSuccess: false, message: "Failed to save feedback" }
  }
}

/**
 * @function getFeedbackByConversationAction
 * @async
 * @description
 *  Retrieves the feedback record (if any) for a specific conversation.
 *
 * @param {string} conversationId - The conversation UUID
 * @returns {Promise<ActionState<SelectConversationFeedback>>}
 */
export async function getFeedbackByConversationAction(
  conversationId: string
): Promise<ActionState<SelectConversationFeedback>> {
  try {
    const feedback = await db.query.conversationFeedback.findFirst({
      where: eq(conversationFeedbackTable.conversationId, conversationId)
    })
    if (!feedback) {
      return { isSuccess: false, message: "No feedback for this conversation" }
    }

    return {
      isSuccess: true,
      message: "Feedback retrieved",
      data: feedback
    }
  } catch (error) {
    console.error("Error retrieving feedback:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve feedback"
    }
  }
}

