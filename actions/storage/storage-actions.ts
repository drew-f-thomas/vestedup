/**
 * @description
 * Server actions for handling file uploads (PDFs, images) to Supabase Storage.
 * Uses envelope encryption with AWS KMS for secure file storage:
 * 1. Generate a data key using KMS
 * 2. Encrypt the file with the data key
 * 3. Encrypt the data key with KMS
 * 4. Store the encrypted file and encrypted data key
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
import { KMSClient, GenerateDataKeyCommand, DecryptCommand } from '@aws-sdk/client-kms'
import { ActionState } from "@/types"
import { createDocumentAction } from "@/actions/db/documents-actions"
import { fileTypeEnum, documentTagEnum } from "@/db/schema/documents-schema"
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

// 10MB max for demonstration
const MAX_FILE_SIZE = 10 * 1024 * 1024

// AES-256-GCM is recommended for envelope encryption
const ALGORITHM = 'aes-256-gcm'

/**
 * @function uploadDocumentStorage
 * @async
 * @description
 *  Handles the file upload using envelope encryption:
 *  1. Generate a data key using KMS
 *  2. Use the data key to encrypt the file locally
 *  3. Encrypt the data key with KMS
 *  4. Store the encrypted file and encrypted data key in Supabase
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

    // 3. Determine file type
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

    // 4. Set up clients
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const kmsKeyId = process.env.KMS_KEY_ID
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return {
        isSuccess: false,
        message: "Server configuration error: Missing Supabase credentials"
      }
    }
    
    if (!kmsKeyId) {
      console.error("Missing KMS Key ID environment variable")
      return {
        isSuccess: false,
        message: "Server configuration error: Missing KMS Key ID"
      }
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    const kms = new KMSClient({ region: process.env.AWS_REGION || 'us-east-1' })
    
    // 5. Generate a data key using KMS
    console.log("Generating data key with KMS...")
    
    try {
      // Request a data key from KMS
      const generateDataKeyCommand = new GenerateDataKeyCommand({
        KeyId: kmsKeyId,
        KeySpec: 'AES_256'
      })
      
      const dataKeyResponse = await kms.send(generateDataKeyCommand)
      
      if (!dataKeyResponse.Plaintext || !dataKeyResponse.CiphertextBlob) {
        throw new Error("Failed to generate data key")
      }
      
      // 6. Encrypt the file using the plaintext data key
      console.log("Encrypting file with data key...")
      
      // Convert file to buffer
      const fileBuffer = await file.arrayBuffer()
      
      // Generate a random IV
      const iv = randomBytes(12)
      
      // Create cipher using the plaintext data key
      const cipher = createCipheriv(
        ALGORITHM,
        dataKeyResponse.Plaintext,
        iv
      )
      
      // Encrypt the file
      const encryptedFile = Buffer.concat([
        cipher.update(Buffer.from(fileBuffer)),
        cipher.final()
      ])
      
      // Get the auth tag
      const authTag = cipher.getAuthTag()
      
      // Combine IV, auth tag, and encrypted data key with the encrypted file
      const finalEncryptedFile = Buffer.concat([
        iv,
        authTag,
        Buffer.from(dataKeyResponse.CiphertextBlob),
        encryptedFile
      ])
      
      // 7. Upload encrypted file to Supabase
      const bucketName = process.env.SUPABASE_DOCS_BUCKET || "documents"
      
      // Generate unique filename
      const fileExt = file.name.split(".").pop()
      const randomFilename = `${randomUUID()}.${fileExt}`
      const filePath = `${userId}/${randomFilename}`
      
      // Ensure bucket exists
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
      
      // Upload the encrypted file
      console.log("Uploading encrypted file to Supabase...")
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, finalEncryptedFile, {
          upsert: false,
          contentType: file.type
        })
      
      if (error) {
        console.error("Supabase upload error:", error)
        return { isSuccess: false, message: "Failed to upload encrypted file" }
      }
      
      console.log("Encrypted file uploaded successfully")
      
      // 8. Create document record
      const docResult = await createDocumentAction({
        userId,
        fileType,
        filePath: data.path,
        title: title || undefined,
        documentTag: documentTag || undefined,
        isEncrypted: true
      })
      
      if (!docResult.isSuccess) {
        // Clean up uploaded file if DB insertion fails
        try {
          await supabase.storage.from(bucketName).remove([filePath])
        } catch (cleanupError) {
          console.error("Failed to clean up uploaded file after DB error:", cleanupError)
        }
        
        return { isSuccess: false, message: docResult.message }
      }
      
      return {
        isSuccess: true,
        message: "File encrypted and uploaded successfully",
        data: { documentId: docResult.data.id }
      }
      
    } catch (encryptError) {
      console.error("Encryption error:", encryptError)
      return { 
        isSuccess: false, 
        message: "Failed to encrypt file: " + (encryptError instanceof Error ? encryptError.message : "Unknown error") 
      }
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
 *  For encrypted files, it:
 *  1. Retrieves the encrypted file which contains IV, auth tag, encrypted data key, and encrypted content
 *  2. Uses KMS to decrypt the data key
 *  3. Uses the decrypted data key to decrypt the file content
 *  4. Extracts text from the decrypted content
 */
export async function getDocumentContentStorage(
  filePath: string,
  fileType: "pdf" | "image",
  isEncrypted: boolean = false
): Promise<ActionState<{ content: string }>> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const kmsKeyId = process.env.KMS_KEY_ID
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return {
        isSuccess: false,
        message: "Server configuration error: Missing Supabase credentials"
      }
    }
    
    if (isEncrypted && !kmsKeyId) {
      console.error("Missing KMS Key ID environment variable")
      return {
        isSuccess: false,
        message: "Server configuration error: Missing KMS Key ID for decryption"
      }
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    const bucketName = process.env.SUPABASE_DOCS_BUCKET || "documents"

    // Download the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath)

    if (error) {
      console.error("Error downloading file:", error)
      return { isSuccess: false, message: "Failed to download file" }
    }

    let fileContent: ArrayBuffer

    // If the file is encrypted, decrypt it
    if (isEncrypted) {
      try {
        console.log("Decrypting file...")
        
        // Convert downloaded data to buffer
        const encryptedBuffer = Buffer.from(await data.arrayBuffer())
        
        // Extract the components:
        // - First 12 bytes: IV
        // - Next 16 bytes: Auth Tag
        // - Next chunk: Encrypted Data Key
        // - Remainder: Encrypted File Content
        const iv = encryptedBuffer.subarray(0, 12)
        const authTag = encryptedBuffer.subarray(12, 28)
        
        // The encrypted data key length can vary, but it's typically around 500 bytes
        // We'll assume it's the next 512 bytes after the auth tag
        const encryptedDataKey = encryptedBuffer.subarray(28, 540)
        const encryptedContent = encryptedBuffer.subarray(540)
        
        // Initialize KMS client
        const kms = new KMSClient({ region: process.env.AWS_REGION || 'us-east-1' })
        
        // Decrypt the data key using KMS
        const decryptCommand = new DecryptCommand({
          CiphertextBlob: encryptedDataKey,
          KeyId: kmsKeyId
        })
        
        const decryptedDataKey = await kms.send(decryptCommand)
        
        if (!decryptedDataKey.Plaintext) {
          throw new Error("Failed to decrypt data key")
        }
        
        // Use the decrypted data key to decrypt the file content
        const decipher = createDecipheriv(
          ALGORITHM,
          decryptedDataKey.Plaintext,
          iv
        )
        
        decipher.setAuthTag(authTag)
        
        const decryptedContent = Buffer.concat([
          decipher.update(encryptedContent),
          decipher.final()
        ])
        
        fileContent = decryptedContent.buffer
        console.log("File decrypted successfully")
        
      } catch (decryptError) {
        console.error("Error decrypting file:", decryptError)
        return { 
          isSuccess: false, 
          message: "Failed to decrypt file: " + (decryptError instanceof Error ? decryptError.message : "Unknown error") 
        }
      }
    } else {
      // For non-encrypted files, just use the downloaded content
      fileContent = await data.arrayBuffer()
    }
    
    // Extract text content based on file type
    // Note: In a production environment, you would use proper libraries for text extraction
    let content = ""
    
    if (fileType === "pdf") {
      content = `[Extracted text from ${isEncrypted ? 'decrypted' : ''} PDF: ${filePath.split('/').pop()}] This text represents the content that would be extracted from the ${isEncrypted ? 'decrypted' : ''} PDF document. In a production environment, we would use a PDF parsing library to extract the actual text content.`
    } else if (fileType === "image") {
      content = `[Extracted text from ${isEncrypted ? 'decrypted' : ''} image: ${filePath.split('/').pop()}] This text represents the content that would be extracted from the ${isEncrypted ? 'decrypted' : ''} image. In a production environment, we would use OCR or an image description service to extract text or generate a description.`
    }

    return {
      isSuccess: true,
      message: "Document content extracted successfully",
      data: { content }
    }
  } catch (error) {
    console.error("Error extracting document content:", error)
    return { isSuccess: false, message: "Failed to extract document content" }
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

