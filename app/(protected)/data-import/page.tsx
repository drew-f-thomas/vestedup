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
  console.log("DataImportPage: Starting page render")

  // Check user session
  console.log("DataImportPage: Checking authentication")
  const authResult = await auth()
  const { userId } = authResult

  console.log("DataImportPage: Auth result", {
    userId: userId ? `${userId.substring(0, 5)}...` : "null",
    isAuthenticated: !!userId
  })

  if (!userId) {
    console.log("DataImportPage: User not authenticated, redirecting to login")
    return redirect("/login")
  }

  console.log(
    `DataImportPage: User authenticated (${userId.substring(0, 5)}...), fetching equity data`
  )

  // Fetch existing equity data for this user
  try {
    console.log(
      `DataImportPage: Calling getEquityDataByUserAction for user ${userId.substring(0, 5)}...`
    )
    const equityDataRes = await getEquityDataByUserAction(userId)

    if (!equityDataRes.isSuccess) {
      console.error(
        "DataImportPage: Failed to retrieve equity data:",
        equityDataRes.message
      )
    } else {
      console.log(
        `DataImportPage: Successfully retrieved ${equityDataRes.data?.length || 0} equity records`
      )
    }

    const userEquityData = equityDataRes.data || []

    console.log("DataImportPage: Rendering page components")
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
  } catch (error) {
    console.error("DataImportPage: Unhandled error:", error)

    // Return a simple error UI instead of crashing
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Data Import & Manual Input</h1>
        <div className="bg-destructive/10 text-destructive mb-6 rounded p-4">
          <h2 className="mb-2 text-lg font-semibold">Error Loading Data</h2>
          <p>
            There was a problem loading your equity data. Please try again
            later.
          </p>
          <p className="mt-2 text-sm">
            Error details:{" "}
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>

        {/* Still show the credential input form since it doesn't depend on the database */}
        <CredentialInput userId={userId} />
      </div>
    )
  }
}
