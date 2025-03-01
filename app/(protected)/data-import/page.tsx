/**
 * @description
 * Server page for the Data Import route. It handles:
 * - User authentication (via Clerk)
 * - Fetching existing equity data from the DB
 * - Rendering client components for adding and listing/editing that data.
 *
 * Key features:
 * - Protects route: redirects to /login if user is not authenticated
 * - Retrieves user's equity data from `equity-data-actions.ts`
 * - Renders two client components:
 *   1) ManualEntryForm for inserting new equity records
 *   2) EquityDataTable for listing, editing, and deleting existing records
 *
 * @dependencies
 * - auth from "@clerk/nextjs/server"
 * - redirect from "next/navigation"
 * - getEquityDataByUserAction from "@/actions/db/equity-data-actions"
 * - ManualEntryForm from "./_components/manual-entry-form"
 * - EquityDataTable from "./_components/equity-data-table"
 *
 * @notes
 * - This page does NOT gate membership level, so free users can access data import.
 * - If you need membership gating, add it after fetching the user profile.
 */

"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getEquityDataByUserAction } from "@/actions/db/equity-data-actions"
import ManualEntryForm from "./_components/manual-entry-form"
import CsvUploader from "./_components/csv-uploader"
import EquityDataTable from "./_components/equity-data-table"
import CredentialInput from "./_components/credential-input"

export default async function DataImportPage() {
  // Check user session
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  // Fetch existing equity data for this user
  const equityDataRes = await getEquityDataByUserAction(userId)
  if (!equityDataRes.isSuccess) {
    // You could display an error message or debug info here
    // For now, let's treat it as an empty array
    console.error("Failed to retrieve equity data:", equityDataRes.message)
  }

  const userEquityData = equityDataRes.data || []

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Data Import & Manual Input</h1>

      {/** Form to add a new equity record */}
      <ManualEntryForm userId={userId} />
      <hr className="my-6" />

      <CsvUploader userId={userId} />
      <hr className="my-6" />

      <CredentialInput userId={userId} />
      <hr className="my-6" />

      {/** Table to list existing equity data (with update/delete) */}
      <EquityDataTable userId={userId} initialData={userEquityData} />
    </div>
  )
}
