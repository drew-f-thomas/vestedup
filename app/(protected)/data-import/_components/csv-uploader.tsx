/**
 * @description
 * A client component that provides a form for CSV file upload.
 * When the user submits the form, it calls the `parseCsvAction` server action
 * with the uploaded CSV file.
 *
 * Key features:
 * - Simple form with file input (type="file")
 * - Accepts .csv files
 * - Calls parseCsvAction from "equity-data-actions.ts" to parse the CSV rows
 * - Refreshes the page on completion so the newly added data is visible
 *
 * @dependencies
 * - parseCsvAction (server action) from "@/actions/db/equity-data-actions"
 * - useRouter from "next/navigation" for refreshing the page or redirecting
 *
 * @notes
 * - The parseCsvAction will parse each row, create new records in `equity_data`,
 *   and return a success/failure result.
 * - We rely on Next.js 13+ server actions for multipart form submission support.
 * - Additional CSV validations or advanced parsing can be added as needed.
 */

"use client"

import { useRouter } from "next/navigation"
import { parseCsvAction } from "@/actions/db/equity-data-actions"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CsvUploaderProps {
  userId: string
}

export default function CsvUploader({ userId }: CsvUploaderProps) {
  // We'll track a local message for success/error feedback if desired
  const [errorMessage, setErrorMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  /**
   * @function handleChange
   * We clear out any previous error messages when a new file is chosen.
   */
  function handleChange() {
    setErrorMessage("")
  }

  /**
   * @function handleSubmit
   * We intercept the form submission to show a loading state.
   * The actual parsing is handled in parseCsvAction server action.
   */
  async function handleSubmit() {
    setIsUploading(true)
  }

  return (
    <div className="mt-6">
      <h3 className="mb-2 text-lg font-semibold">Upload CSV</h3>

      <form
        action={async formData => {
          // This function automatically executes parseCsvAction with the formData
          // Then we handle the returned result to show success/error
          setIsUploading(true)
          setErrorMessage("")

          const res = await parseCsvAction(formData)

          setIsUploading(false)

          if (!res.isSuccess) {
            setErrorMessage(res.message)
            return
          }

          // If success, refresh the page to see new entries
          router.refresh()
        }}
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="flex flex-col space-y-2"
      >
        <input type="hidden" name="userId" value={userId} />

        <input
          type="file"
          name="csvFile"
          accept=".csv"
          onChange={handleChange}
          className="file:mr-2 file:rounded file:border file:px-2 file:py-1"
        />

        {errorMessage && (
          <p className="text-destructive text-sm">{errorMessage}</p>
        )}

        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Import CSV"}
        </Button>
      </form>
    </div>
  )
}
