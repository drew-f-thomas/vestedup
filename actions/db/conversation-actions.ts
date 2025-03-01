/**
 * @description
 * Provides server actions for creating and managing Conversations and Messages.
 * 
 * The `conversationsTable` stores each conversation and references the `profilesTable`.
 * The `messagesTable` stores each chat message and references its parent conversation.
 * 
 * Key Features:
 * - Create, Read, Update, Delete (CRUD) for Conversation records
 * - Create, Read, Update, Delete (CRUD) for Message records
 * - A new getAllConversationsAction for admin to see all user conversations
 * 
 * @dependencies
 * - db from "@/db/db" for Drizzle ORM
 * - InsertConversation, SelectConversation, InsertMessage, SelectMessage from "@/db/schema/conversations-schema"
 * - eq, desc from "drizzle-orm" for building WHERE or ORDER BY clauses
 * 
 * @notes
 * - Return types follow the ActionState<T> pattern from "@/types/server-action-types"
 * - The conversation <-> messages relationship is cascaded on delete, so deleting a conversation will remove its messages.
 * - getAllConversationsAction is restricted to Admin usage in the plan, so use it carefully in the Admin route only.
 */

"use server"

import { db } from "@/db/db"
import {
  conversationsTable,
  messagesTable,
  InsertConversation,
  SelectConversation,
  InsertMessage,
  SelectMessage
} from "@/db/schema/conversations-schema"
import { ActionState } from "@/types"
import { eq, desc } from "drizzle-orm"

/**
 * @function createConversationAction
 * @async
 * @description
 *  Inserts a new record in the conversations table for a given userId.
 *  By default, startedAt is set to "now" and endedAt is null until the conversation is ended.
 * 
 * @param {string} userId - The ID of the user who owns this conversation.
 * @returns {Promise<ActionState<SelectConversation>>}
 */
export async function createConversationAction(
  userId: string
): Promise<ActionState<SelectConversation>> {
  try {
    const [conversation] = await db
      .insert(conversationsTable)
      .values({ userId })
      .returning()

    return {
      isSuccess: true,
      message: "Conversation created successfully",
      data: conversation
    }
  } catch (error) {
    console.error("Error creating conversation:", error)
    return {
      isSuccess: false,
      message: "Failed to create conversation"
    }
  }
}

/**
 * @function getConversationsByUserAction
 * @async
 * @description
 *  Fetches all conversations that belong to the specified userId.
 * 
 * @param {string} userId - The ID of the user whose conversations to retrieve.
 * @returns {Promise<ActionState<SelectConversation[]>>}
 */
export async function getConversationsByUserAction(
  userId: string
): Promise<ActionState<SelectConversation[]>> {
  try {
    const conversations = await db.query.conversations.findMany({
      where: eq(conversationsTable.userId, userId),
      orderBy: (convo, { desc }) => [desc(convo.createdAt)]
    })

    return {
      isSuccess: true,
      message: "Conversations retrieved successfully",
      data: conversations
    }
  } catch (error) {
    console.error("Error retrieving conversations by user:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve conversations"
    }
  }
}

/**
 * @function getConversationByIdAction
 * @async
 * @description
 *  Fetches a single conversation by its UUID.
 *  Does not include messages. For messages, call getMessagesByConversationAction separately.
 * 
 * @param {string} conversationId - The UUID of the conversation.
 * @returns {Promise<ActionState<SelectConversation>>}
 */
export async function getConversationByIdAction(
  conversationId: string
): Promise<ActionState<SelectConversation>> {
  try {
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversationsTable.id, conversationId)
    })

    if (!conversation) {
      return {
        isSuccess: false,
        message: "Conversation not found"
      }
    }

    return {
      isSuccess: true,
      message: "Conversation retrieved successfully",
      data: conversation
    }
  } catch (error) {
    console.error("Error retrieving conversation by ID:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve conversation"
    }
  }
}

/**
 * @function updateConversationAction
 * @async
 * @description
 *  Partially updates a conversation record by ID. 
 *  Any valid fields from InsertConversation may be passed in `data`.
 * 
 * @param {string} conversationId - The UUID of the conversation to update.
 * @param {Partial<InsertConversation>} data - Fields to update (e.g., endedAt).
 * @returns {Promise<ActionState<SelectConversation>>}
 */
export async function updateConversationAction(
  conversationId: string,
  data: Partial<InsertConversation>
): Promise<ActionState<SelectConversation>> {
  try {
    const [updated] = await db
      .update(conversationsTable)
      .set(data)
      .where(eq(conversationsTable.id, conversationId))
      .returning()

    if (!updated) {
      return {
        isSuccess: false,
        message: "No matching conversation found"
      }
    }

    return {
      isSuccess: true,
      message: "Conversation updated successfully",
      data: updated
    }
  } catch (error) {
    console.error("Error updating conversation:", error)
    return {
      isSuccess: false,
      message: "Failed to update conversation"
    }
  }
}

/**
 * @function deleteConversationAction
 * @async
 * @description
 *  Deletes a conversation by its UUID, including all messages (via cascade).
 * 
 * @param {string} conversationId - The UUID of the conversation to delete.
 * @returns {Promise<ActionState<void>>}
 */
export async function deleteConversationAction(
  conversationId: string
): Promise<ActionState<void>> {
  try {
    const result = await db
      .delete(conversationsTable)
      .where(eq(conversationsTable.id, conversationId))
      .execute()

    if (result.length === 0) {
      return {
        isSuccess: false,
        message: "No matching conversation found to delete"
      }
    }

    return {
      isSuccess: true,
      message: "Conversation deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting conversation:", error)
    return {
      isSuccess: false,
      message: "Failed to delete conversation"
    }
  }
}

/**
 * @function createMessageAction
 * @async
 * @description
 *  Creates a new message in a specific conversation. 
 *  The role is typically either "user" or "assistant".
 * 
 * @param {string} conversationId - The UUID of the conversation to which we add the message.
 * @param {"user" | "assistant"} role - The role of the message (user or assistant).
 * @param {string} content - The text content of the message.
 * @returns {Promise<ActionState<SelectMessage>>}
 */
export async function createMessageAction(
  conversationId: string,
  role: "user" | "assistant",
  content: string
): Promise<ActionState<SelectMessage>> {
  try {
    const [msg] = await db
      .insert(messagesTable)
      .values({
        conversationId,
        role,
        content
      })
      .returning()

    return {
      isSuccess: true,
      message: "Message created successfully",
      data: msg
    }
  } catch (error) {
    console.error("Error creating message:", error)
    return {
      isSuccess: false,
      message: "Failed to create message"
    }
  }
}

/**
 * @function getMessagesByConversationAction
 * @async
 * @description
 *  Retrieves all messages belonging to a specific conversation ID, typically sorted by creation time.
 * 
 * @param {string} conversationId - The UUID of the conversation whose messages are being retrieved.
 * @returns {Promise<ActionState<SelectMessage[]>>}
 */
export async function getMessagesByConversationAction(
  conversationId: string
): Promise<ActionState<SelectMessage[]>> {
  try {
    const messages = await db.query.messages.findMany({
      where: eq(messagesTable.conversationId, conversationId),
      orderBy: (msg, { asc }) => [asc(msg.createdAt)]
    })

    return {
      isSuccess: true,
      message: "Messages retrieved successfully",
      data: messages
    }
  } catch (error) {
    console.error("Error retrieving messages by conversation:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve messages"
    }
  }
}

/**
 * @function updateMessageAction
 * @async
 * @description
 *  Partially updates a message record by its UUID. 
 *  Accepts partial InsertMessage fields (role, content).
 * 
 * @param {string} messageId - The UUID of the message to update.
 * @param {Partial<InsertMessage>} data - The fields to update.
 * @returns {Promise<ActionState<SelectMessage>>}
 */
export async function updateMessageAction(
  messageId: string,
  data: Partial<InsertMessage>
): Promise<ActionState<SelectMessage>> {
  try {
    const [updated] = await db
      .update(messagesTable)
      .set(data)
      .where(eq(messagesTable.id, messageId))
      .returning()

    if (!updated) {
      return {
        isSuccess: false,
        message: "No matching message found to update"
      }
    }

    return {
      isSuccess: true,
      message: "Message updated successfully",
      data: updated
    }
  } catch (error) {
    console.error("Error updating message:", error)
    return {
      isSuccess: false,
      message: "Failed to update message"
    }
  }
}

/**
 * @function deleteMessageAction
 * @async
 * @description
 *  Deletes a single message record by UUID.
 * 
 * @param {string} messageId - The UUID of the message to delete.
 * @returns {Promise<ActionState<void>>}
 */
export async function deleteMessageAction(
  messageId: string
): Promise<ActionState<void>> {
  try {
    const result = await db
      .delete(messagesTable)
      .where(eq(messagesTable.id, messageId))
      .execute()

    if (result.length === 0) {
      return {
        isSuccess: false,
        message: "No matching message found to delete"
      }
    }

    return {
      isSuccess: true,
      message: "Message deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting message:", error)
    return {
      isSuccess: false,
      message: "Failed to delete message"
    }
  }
}

/**
 * @function getAllConversationsAction
 * @async
 * @description
 *  Retrieves all conversations in the system (for admin only). 
 *  Sorted by createdAt descending. Use with caution.
 * 
 * @returns {Promise<ActionState<SelectConversation[]>>}
 */
export async function getAllConversationsAction(): Promise<
  ActionState<SelectConversation[]>
> {
  try {
    const conversations = await db.query.conversations.findMany({
      orderBy: (tbl, { desc }) => [desc(tbl.createdAt)]
    })

    return {
      isSuccess: true,
      message: "All conversations retrieved successfully",
      data: conversations
    }
  } catch (error) {
    console.error("Error retrieving all conversations:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve all conversations"
    }
  }
}

