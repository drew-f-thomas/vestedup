/**
 * @description
 * Provides server actions for CRUD operations on the `documentsTable`.
 * Each record references a user (userId) and stores metadata about an uploaded file (fileType, filePath).
 * 
 * Key Features:
 * - createDocumentAction: Inserts a new document reference (PDF/image).
 * - getDocumentByIdAction: Retrieves metadata for a single document by UUID.
 * - getDocumentsForUserAction: Lists all documents for a user.
 * - updateDocumentAction: Partial update for fields like fileType, filePath, or userId.
 * - deleteDocumentAction: Removes a document record from the DB (should also remove the file from storage if needed).
 * 
 * @dependencies
 * - db from "@/db/db"
 * - documentsTable, InsertDocument, SelectDocument from "@/db/schema/documents-schema"
 * - eq from "drizzle-orm" for building WHERE clauses
 * - ActionState<T> from "@/types" for success/failure return structure
 * 
 * @notes
 * - This does not directly handle file uploads to Supabase storage. It only creates/manages the DB record.
 * - To actually store a file, see the storage actions in `actions/storage` (if implemented).
 * - The `user_id` reference is cascade-deleted if the user is removed.
 */

"use server"

import { db } from "@/db/db"
import {
  documentsTable,
  InsertDocument,
  SelectDocument
} from "@/db/schema/documents-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * @function createDocumentAction
 * @async
 * @description
 *  Inserts a new document record in the documents table.
 *  Typically called after uploading a file to storage and obtaining its file path.
 * 
 * @param {InsertDocument} documentData - The document data to insert (includes userId, fileType, filePath).
 * @returns {Promise<ActionState<SelectDocument>>}
 */
export async function createDocumentAction(
  documentData: InsertDocument
): Promise<ActionState<SelectDocument>> {
  try {
    const [newDoc] = await db
      .insert(documentsTable)
      .values(documentData)
      .returning()

    return {
      isSuccess: true,
      message: "Document created successfully",
      data: newDoc
    }
  } catch (error) {
    console.error("Error creating document:", error)
    return {
      isSuccess: false,
      message: "Failed to create document"
    }
  }
}

/**
 * @function getDocumentByIdAction
 * @async
 * @description
 *  Fetches a single document by its UUID from the documents table.
 * 
 * @param {string} documentId - The UUID of the document to retrieve.
 * @returns {Promise<ActionState<SelectDocument>>}
 */
export async function getDocumentByIdAction(
  documentId: string
): Promise<ActionState<SelectDocument>> {
  try {
    const doc = await db.query.documents.findFirst({
      where: eq(documentsTable.id, documentId)
    })

    if (!doc) {
      return {
        isSuccess: false,
        message: "Document not found"
      }
    }

    return {
      isSuccess: true,
      message: "Document retrieved successfully",
      data: doc
    }
  } catch (error) {
    console.error("Error retrieving document by ID:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve document"
    }
  }
}

/**
 * @function getDocumentsForUserAction
 * @async
 * @description
 *  Returns all documents belonging to a specific user, ordered by upload date descending.
 * 
 * @param {string} userId - The ID of the user whose documents will be fetched.
 * @returns {Promise<ActionState<SelectDocument[]>>}
 */
export async function getDocumentsForUserAction(
  userId: string
): Promise<ActionState<SelectDocument[]>> {
  try {
    const docs = await db.query.documents.findMany({
      where: eq(documentsTable.userId, userId),
      orderBy: (tbl, { desc }) => [desc(tbl.uploadedAt)]
    })

    return {
      isSuccess: true,
      message: "User documents retrieved successfully",
      data: docs
    }
  } catch (error) {
    console.error("Error retrieving documents for user:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve documents for user"
    }
  }
}

/**
 * @function updateDocumentAction
 * @async
 * @description
 *  Partially updates a document record by its UUID.
 *  The Partial<InsertDocument> allows updating fields like fileType or filePath.
 * 
 * @param {string} documentId - The UUID of the document to update.
 * @param {Partial<InsertDocument>} data - Fields to update.
 * @returns {Promise<ActionState<SelectDocument>>}
 */
export async function updateDocumentAction(
  documentId: string,
  data: Partial<InsertDocument>
): Promise<ActionState<SelectDocument>> {
  try {
    const [updated] = await db
      .update(documentsTable)
      .set(data)
      .where(eq(documentsTable.id, documentId))
      .returning()

    if (!updated) {
      return {
        isSuccess: false,
        message: "No matching document found"
      }
    }

    return {
      isSuccess: true,
      message: "Document updated successfully",
      data: updated
    }
  } catch (error) {
    console.error("Error updating document:", error)
    return {
      isSuccess: false,
      message: "Failed to update document"
    }
  }
}

/**
 * @function deleteDocumentAction
 * @async
 * @description
 *  Deletes a single document record by its UUID.
 *  The corresponding file should also be removed from Supabase storage by another action if necessary.
 * 
 * @param {string} documentId - The UUID of the document to delete.
 * @returns {Promise<ActionState<void>>}
 */
export async function deleteDocumentAction(
  documentId: string
): Promise<ActionState<void>> {
  try {
    const result = await db
      .delete(documentsTable)
      .where(eq(documentsTable.id, documentId))
      .execute()

    if (result.length === 0) {
      return {
        isSuccess: false,
        message: "No matching document found to delete"
      }
    }

    return {
      isSuccess: true,
      message: "Document deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting document:", error)
    return {
      isSuccess: false,
      message: "Failed to delete document"
    }
  }
}
