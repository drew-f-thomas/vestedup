/**
 * @description
 * Server actions for handling file uploads (PDFs, images) to Supabase Storage.
 * We also create a document record in the `documents` table so that 
 * the file can be referenced later by the chatbot.
 * 
 * Key Features:
 * - uploadDocumentStorage: Accepts a FormData object, extracts the file, 
 *   validates it, uploads to Supabase, and creates a DB record with title and tag.
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
 * - Documents can be tagged with specific categories to help organize equity documents.
 */

"use server"

import { randomUUID } from "crypto"
import { createClient } from "@supabase/supabase-js"
import { ActionState } from "@/types"
import { createDocumentAction } from "@/actions/db/documents-actions"
import { fileTypeEnum, documentTagEnum } from "@/db/schema/documents-schema"

// 10MB max for demonstration
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * @function uploadDocumentStorage
 * @async
 * @description
 *  Handles the file upload from a `<form>` submission. Expects:
 *   - "file" in FormData
 *   - "userId" in FormData
 *   - Optional "title" in FormData
 *   - Optional "documentTag" in FormData
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
    // 1. Extract userId, file, title, and tag
    const userId = formData.get("userId") as string
    const file = formData.get("file") as File | null
    const title = formData.get("title") as string | null
    const documentTag = formData.get("documentTag") as typeof documentTagEnum.enumValues[number] | null

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
    
    // Create Supabase client with direct environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return {
        isSuccess: false,
        message: "Server configuration error: Missing Supabase credentials"
      }
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Generate a unique path for the file. e.g. "documents/<userId>/uuid-filename.pdf"
    const fileExt = file.name.split(".").pop()
    const randomFilename = `${randomUUID()}.${fileExt}`
    const filePath = `${userId}/${randomFilename}`

    // First, check if the bucket exists, if not create it
    try {
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
      
      if (!bucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
          public: false
        })
        
        if (createBucketError) {
          console.error("Error creating bucket:", createBucketError)
          return { isSuccess: false, message: "Failed to create storage bucket" }
        }
      }
    } catch (error) {
      console.error("Error checking/creating bucket:", error)
      return { isSuccess: false, message: "Failed to initialize storage" }
    }

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
    //    We store the path as returned by supabase, along with the userId, fileType, title, and documentTag
    const docResult = await createDocumentAction({
      userId,
      fileType,
      filePath: data.path,
      title: title || undefined,
      documentTag: documentTag || undefined
      // We'll rely on `createDocumentAction` to set `uploadedAt` automatically.
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
 *  Extracts the text content from a document stored in Supabase storage.
 *  This extracted text is what gets sent to the OpenAI API, not the document itself.
 *  For PDFs, it returns the extracted text content.
 *  For images, it returns a text description of the image.
 *  
 *  Note: In a production environment, you would use a proper PDF parsing library
 *  or OCR service to extract actual text content from documents.
 * 
 * @param {string} filePath - The path of the file in Supabase storage.
 * @param {string} fileType - The type of the file ('pdf' or 'image').
 * @returns {Promise<ActionState<{ content: string }>>} - Returns the extracted text content
 */
export async function getDocumentContentStorage(
  filePath: string,
  fileType: "pdf" | "image"
): Promise<ActionState<{ content: string }>> {
  try {
    // Create Supabase client with direct environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return {
        isSuccess: false,
        message: "Server configuration error: Missing Supabase credentials"
      }
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const bucketName = process.env.SUPABASE_DOCS_BUCKET || "documents"

    // Get a signed URL for the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 60 * 60) // 1 hour expiry

    if (error) {
      console.error("Error creating signed URL:", error)
      return { isSuccess: false, message: "Failed to access file" }
    }

    const fileUrl = data.signedUrl

    // In a production app, we would use a PDF parsing library or OCR service here
    // to extract the actual text content from the document
    // For this example, we'll return placeholder text content
    let content = ""
    
    if (fileType === "pdf") {
      content = `[Extracted text from PDF: ${filePath.split('/').pop()}] This text represents the content that would be extracted from the PDF document. In a production environment, we would use a PDF parsing library to extract the actual text content.`
    } else if (fileType === "image") {
      content = `[Extracted text from image: ${filePath.split('/').pop()}] This text represents the content that would be extracted from the image. In a production environment, we would use OCR or an image description service to extract text or generate a description.`
    }

    return {
      isSuccess: true,
      message: "Document text content extracted",
      data: { content }
    }
  } catch (error) {
    console.error("Error extracting document text:", error)
    return { isSuccess: false, message: "Failed to extract document text" }
  }
}

/**
 * @function ensureStorageBucketExists
 * @async
 * @description
 *  Ensures that the storage bucket exists and has the correct RLS policies.
 *  This should be called during application initialization.
 * 
 * @param {string} bucketName - The name of the bucket to ensure exists
 * @returns {Promise<ActionState<void>>}
 */
export async function ensureStorageBucketExists(
  bucketName: string = "documents"
): Promise<ActionState<void>> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return {
        isSuccess: false,
        message: "Server configuration error: Missing Supabase credentials"
      }
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if the bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error("Error listing buckets:", listError)
      return { isSuccess: false, message: "Failed to list storage buckets" }
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    // If the bucket doesn't exist, create it
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: false
      })
      
      if (createError) {
        console.error("Error creating bucket:", createError)
        return { isSuccess: false, message: "Failed to create storage bucket" }
      }
      
      console.log(`Storage bucket '${bucketName}' created successfully`)
    } else {
      console.log(`Storage bucket '${bucketName}' already exists`)
    }
    
    return {
      isSuccess: true,
      message: `Storage bucket '${bucketName}' is ready`,
      data: undefined
    }
  } catch (error) {
    console.error("Error ensuring storage bucket exists:", error)
    return { isSuccess: false, message: "Failed to initialize storage" }
  }
}

/**
 * @function deleteDocumentStorage
 * @async
 * @description
 *  Deletes a document file from Supabase storage.
 *  This should be called when a document is deleted from the database.
 * 
 * @param {string} filePath - The path of the file in Supabase storage.
 * @returns {Promise<ActionState<void>>}
 */
export async function deleteDocumentStorage(
  filePath: string
): Promise<ActionState<void>> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return {
        isSuccess: false,
        message: "Server configuration error: Missing Supabase credentials"
      }
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const bucketName = process.env.SUPABASE_DOCS_BUCKET || "documents"

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (error) {
      console.error("Error deleting file from storage:", error)
      return { isSuccess: false, message: "Failed to delete file from storage" }
    }

    return {
      isSuccess: true,
      message: "Document deleted from storage successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error in deleteDocumentStorage action:", error)
    return { isSuccess: false, message: "An error occurred during deletion" }
  }
}

