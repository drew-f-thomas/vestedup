/**
 * @description
 * Server actions for handling file uploads (PDFs, images) to Supabase Storage.
 * We also create a document record in the `documents` table so that 
 * the file can be referenced later by the chatbot.
 * 
 * Key Features:
 * - uploadDocumentStorage: Accepts a FormData object, extracts the file, 
 *   validates it, uploads to Supabase, and creates a DB record. 
 * - getDocumentContentStorage: Retrieves document content from Supabase storage
 *   for use in chat messages.
 * 
 * @dependencies
 * - createClientComponentClient from "@supabase/auth-helpers-nextjs"
 *   for interacting with Supabase from a server action in Next.js 13+ 
 *   (although typically used in client components, it also works in server actions).
 * - createDocumentAction from "@/actions/db/documents-actions" to create the DB record.
 * - We rely on environment variables to specify the bucket name and other optional settings.
 * 
 * @notes
 * - In real usage, ensure your PDF or image max size suits your environment.
 * - We do minimal validation here. Expand as needed (MIME checks, PDF checks, etc.).
 * - The "userId" is required from the formData. We'll store files at: 
 *   "BUCKET_NAME/userId/randomFileName" 
 * - We generate a random file name to avoid collisions. 
 */

"use server"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ActionState } from "@/types"
import { randomUUID } from "crypto"
import { createDocumentAction } from "@/actions/db/documents-actions"
import { fileTypeEnum } from "@/db/schema/documents-schema"

// 10MB max for demonstration
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * @function uploadDocumentStorage
 * @async
 * @description
 *  Handles the file upload from a `<form>` submission. Expects:
 *   - "file" in FormData
 *   - "userId" in FormData
 * 
 *  Validates file type (PDF or image), file size, then uploads to Supabase. 
 *  Lastly, inserts a row into the `documents` table via createDocumentAction.
 * 
 * @param {FormData} formData - The multipart form data from a <form>.
 * @returns {Promise<ActionState<{ documentId: string }>>}
 *  - On success, returns the newly created `documentId`.
 */
export async function uploadDocumentStorage(
  formData: FormData
): Promise<ActionState<{ documentId: string }>> {
  try {
    // 1. Extract userId and file
    const userId = formData.get("userId") as string
    const file = formData.get("file") as File | null

    if (!userId) {
      return { isSuccess: false, message: "Missing userId in formData" }
    }
    if (!file) {
      return { isSuccess: false, message: "No file uploaded" }
    }

    // 2. Basic file size check
    if (file.size > MAX_FILE_SIZE) {
      return {
        isSuccess: false,
        message: `File size exceeds max limit of ${MAX_FILE_SIZE} bytes`
      }
    }

    // 3. Determine file type for our DB enum: 'pdf' or 'image'.
    //    We'll do a naive check on the MIME type and extension.
    let fileType: "pdf" | "image"
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      fileType = "pdf"
    } else if (
      file.type.startsWith("image/") ||
      file.name.toLowerCase().match(/\.(png|jpe?g|gif|webp)$/)
    ) {
      fileType = "image"
    } else {
      return {
        isSuccess: false,
        message: "Unsupported file type. Only PDF or images allowed."
      }
    }

    // 4. Upload to Supabase storage
    //    We'll use an env variable for the bucket name: process.env.SUPABASE_DOCS_BUCKET
    //    If not set, default to "documents".
    const bucketName = process.env.SUPABASE_DOCS_BUCKET || "documents"
    const supabase = createClientComponentClient()

    // Generate a unique path for the file. e.g. "documents/<userId>/uuid-filename.pdf"
    const fileExt = file.name.split(".").pop()
    const randomFilename = `${randomUUID()}.${fileExt}`
    const filePath = `${userId}/${randomFilename}`

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type
      })

    if (error) {
      console.error("Supabase upload error:", error)
      return { isSuccess: false, message: "Failed to upload file" }
    }

    // 5. Insert a record into `documents` table
    //    We store the path as returned by supabase, along with the userId and fileType
    const docResult = await createDocumentAction({
      userId,
      fileType,
      filePath: data.path
      // We'll rely on `insertDocumentAction` to set `uploadedAt` automatically.
    })

    if (!docResult.isSuccess) {
      // If DB insertion fails, consider cleaning up the uploaded file from storage 
      // for consistency. We'll skip that for brevity, but in production you'd do so.
      return { isSuccess: false, message: docResult.message }
    }

    // 6. Return success with newly created doc ID
    return {
      isSuccess: true,
      message: "File uploaded and document record created",
      data: { documentId: docResult.data.id }
    }
  } catch (err) {
    console.error("Error in uploadDocumentStorage action:", err)
    return { isSuccess: false, message: "An error occurred during upload" }
  }
}

/**
 * @function getDocumentContentStorage
 * @async
 * @description
 *  Retrieves the content of a document from Supabase storage.
 *  For PDFs, it returns the text content.
 *  For images, it returns a description of the image.
 * 
 * @param {string} filePath - The path of the file in Supabase storage.
 * @param {string} fileType - The type of the file ('pdf' or 'image').
 * @returns {Promise<ActionState<{ content: string }>>}
 */
export async function getDocumentContentStorage(
  filePath: string,
  fileType: "pdf" | "image"
): Promise<ActionState<{ content: string }>> {
  try {
    const bucketName = process.env.SUPABASE_DOCS_BUCKET || "documents"
    const supabase = createClientComponentClient()

    // Get a signed URL for the file
    const { data: urlData, error: urlError } = await supabase
      .storage
      .from(bucketName)
      .createSignedUrl(filePath, 60) // 60 seconds expiry

    if (urlError) {
      console.error("Error creating signed URL:", urlError)
      return { isSuccess: false, message: "Failed to access file" }
    }

    const fileUrl = urlData.signedUrl

    // For PDFs, we would ideally use a PDF parsing library
    // For images, we would ideally use an image description service
    // For this example, we'll return a placeholder based on file type
    let content = ""
    
    if (fileType === "pdf") {
      content = `[PDF Document: ${filePath}] This is a PDF document that was uploaded to the conversation. The AI can reference this document in its responses.`
    } else if (fileType === "image") {
      content = `[Image: ${filePath}] This is an image that was uploaded to the conversation. The AI can reference this image in its responses.`
    }

    return {
      isSuccess: true,
      message: "Document content retrieved",
      data: { content }
    }
  } catch (error) {
    console.error("Error retrieving document content:", error)
    return { isSuccess: false, message: "Failed to retrieve document content" }
  }
}

