/**
 * @description
 * A client component that provides an interface for uploading PDF or image documents
 * to Supabase storage and creating a `documents` table record.
 *
 * Key Features:
 * - Accepts a userId prop to tie documents to that user
 * - Renders a simple <form> that calls our uploadDocumentStorage server action
 * - On success, can refresh the page or do other logic
 *
 * @dependencies
 * - uploadDocumentStorage from "@/actions/storage/storage-actions"
 * - Next.js "useRouter" for page refresh
 *
 * @notes
 * - This is a minimal example. We can also show a preview, progress bar, etc.
 * - For more advanced usage, we might handle multiple files or chunk uploads for large PDFs.
 */

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { uploadDocumentStorage } from "@/actions/storage/storage-actions"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/hooks/use-toast"
import { UploadCloud } from "lucide-react"

interface DocumentUploaderProps {
  userId: string
}

export default function DocumentUploader({ userId }: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter()

  /**
   * @function handleSubmit
   *  Binds to a <form> action. We'll pass the FormData to our server action
   *  "uploadDocumentStorage". On success, we refresh or handle success.
   */
  async function handleSubmit(formData: FormData) {
    setIsUploading(true)
    setErrorMessage("")

    const res = await uploadDocumentStorage(formData)
    setIsUploading(false)

    if (!res.isSuccess) {
      setErrorMessage(res.message)
      toast({
        title: "Upload Error",
        description: res.message,
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Upload Success",
      description: "Document uploaded successfully."
    })

    // Refresh the page to see newly uploaded doc, if we choose to list them
    router.refresh()
  }

  return (
    <div className="bg-muted/30 mb-4 rounded-lg border p-4">
      <h2 className="mb-2 flex items-center text-lg font-semibold">
        <UploadCloud className="mr-2 size-5" />
        Upload a Document
      </h2>

      <form
        action={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col space-y-3"
      >
        <input type="hidden" name="userId" value={userId} />

        <input
          type="file"
          name="file"
          accept=".pdf,image/*"
          className="text-sm"
        />

        {errorMessage && (
          <div className="text-destructive text-sm">{errorMessage}</div>
        )}

        <Button
          type="submit"
          disabled={isUploading}
          className="w-full sm:w-auto"
        >
          {isUploading ? "Uploading..." : "Upload Document"}
        </Button>
      </form>
    </div>
  )
}
