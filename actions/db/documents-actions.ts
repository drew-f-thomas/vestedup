/**
 * @description
 * Provides server actions for CRUD operations on the `documentsTable`.
 * Each record references a user (userId) and stores metadata about an uploaded file (fileType, filePath).
 * Documents can be tagged with specific categories to help organize equity documents.
 * 
 * Key Features:
 * - createDocumentAction: Inserts a new document reference (PDF/image).
 * - getDocumentByIdAction: Retrieves metadata for a single document by UUID.
 * - getDocumentsForUserAction: Lists all documents for a user.
 * - updateDocumentAction: Partial update for fields like fileType, filePath, title, or documentTag.
 * - deleteDocumentAction: Removes a document record from the DB (should also remove the file from storage if needed).
 * - getDocumentsByTagAction: Retrieves documents filtered by tag for a specific user.
 * 
 * @dependencies
 * - db from "@/db/db"
 * - documentsTable, InsertDocument, SelectDocument, documentTagEnum from "@/db/schema/documents-schema"
 * - eq, and from "drizzle-orm" for building WHERE clauses
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
  SelectDocument,
  documentTagEnum
} from "@/db/schema/documents-schema"
import { ActionState } from "@/types"
import { eq, and } from "drizzle-orm"

// Type assertion for the db to satisfy TypeScript
const typedDb = db as any;

/**
 * @function createDocumentAction
 * @async
 * @description
 *  Inserts a new document record in the documents table.
 *  Typically called after uploading a file to storage and obtaining its file path.
 *  Can include a title and document tag for better organization.
 * 
 * @param {InsertDocument} documentData - The document data to insert (includes userId, fileType, filePath, title, documentTag).
 * @returns {Promise<ActionState<SelectDocument>>}
 */
export async function createDocumentAction(
  documentData: InsertDocument
): Promise<ActionState<SelectDocument>> {
  try {
    const [newDoc] = await typedDb
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
  console.log(`[DB_DOCUMENT] Fetching document with ID: ${documentId}`)
  
  try {
    console.log("[DB_DOCUMENT] Executing database query...")
    const document = await typedDb.query.documents.findFirst({
      where: eq(documentsTable.id, documentId)
    })
    
    console.log("[DB_DOCUMENT] Query completed. Result:", 
      document ? "Document found" : "No document found")

    if (!document) {
      console.log("[DB_DOCUMENT] No document found with ID:", documentId)
      return {
        isSuccess: false,
        message: "Document not found"
      }
    }

    console.log("[DB_DOCUMENT] Successfully retrieved document. Fields present:", 
      Object.keys(document).join(", "))

    return {
      isSuccess: true,
      message: "Document retrieved successfully",
      data: document
    }
  } catch (error) {
    console.error("[DB_DOCUMENT] Error retrieving document:", error)
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
    const docs = await typedDb.query.documents.findMany({
      where: eq(documentsTable.userId, userId),
      orderBy: (tbl: any, { desc }: any) => [desc(tbl.uploadedAt)]
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
 * @function getDocumentsByTagAction
 * @async
 * @description
 *  Returns documents belonging to a specific user filtered by document tag.
 * 
 * @param {string} userId - The ID of the user whose documents will be fetched.
 * @param {typeof documentTagEnum.enumValues[number]} tag - The document tag to filter by.
 * @returns {Promise<ActionState<SelectDocument[]>>}
 */
export async function getDocumentsByTagAction(
  userId: string,
  tag: typeof documentTagEnum.enumValues[number]
): Promise<ActionState<SelectDocument[]>> {
  try {
    const docs = await typedDb.query.documents.findMany({
      where: and(
        eq(documentsTable.userId, userId),
        eq(documentsTable.documentTag, tag)
      ),
      orderBy: (tbl: any, { desc }: any) => [desc(tbl.uploadedAt)]
    })

    return {
      isSuccess: true,
      message: `Documents with tag '${tag}' retrieved successfully`,
      data: docs
    }
  } catch (error) {
    console.error("Error retrieving documents by tag:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve documents by tag"
    }
  }
}

/**
 * @function updateDocumentAction
 * @async
 * @description
 *  Partially updates a document record by its UUID.
 *  The Partial<InsertDocument> allows updating fields like fileType, filePath, title, or documentTag.
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
    const [updated] = await typedDb
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
 *  Also removes the corresponding file from Supabase storage.
 * 
 * @param {string} documentId - The UUID of the document to delete.
 * @returns {Promise<ActionState<void>>}
 */
export async function deleteDocumentAction(
  documentId: string
): Promise<ActionState<void>> {
  try {
    // First, get the document to retrieve its filePath
    const doc = await typedDb.query.documents.findFirst({
      where: eq(documentsTable.id, documentId)
    })

    if (!doc) {
      return {
        isSuccess: false,
        message: "No matching document found to delete"
      }
    }

    // Delete the document from the database
    await typedDb
      .delete(documentsTable)
      .where(eq(documentsTable.id, documentId))
      .execute()

    // Import the storage action to delete the file
    const { deleteDocumentStorage } = await import("@/actions/storage/storage-actions")
    
    // Delete the file from storage
    const storageResult = await deleteDocumentStorage(doc.filePath)
    
    if (!storageResult.isSuccess) {
      console.error("Warning: Document deleted from database but not from storage:", storageResult.message)
      return {
        isSuccess: true,
        message: "Document deleted from database, but there was an issue removing the file from storage",
        data: undefined
      }
    }

    return {
      isSuccess: true,
      message: "Document and associated file deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting document:", error)
    return { isSuccess: false, message: "Failed to delete document" }
  }
}
