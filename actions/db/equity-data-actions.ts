/**
 * @description
 * This server actions file provides CRUD operations for the equity_data table,
 * plus a new parseCsvAction for handling CSV file imports.
 * 
 * Key Features & Functions:
 * 1. createEquityDataAction: Inserts a new equity data record.
 * 2. getEquityDataByUserAction: Retrieves all equity data rows for a given user.
 * 3. updateEquityDataAction: Partially updates a single equity data record.
 * 4. deleteEquityDataAction: Deletes a single equity data record.
 * 5. parseCsvAction: Parses rows from an uploaded CSV and inserts them as new records with dataSource="csv".
 *
 * @dependencies
 * - db from "@/db/db"
 * - equityDataTable from "@/db/schema/equity-schema"
 * - eq from "drizzle-orm"
 * - ActionState from "@/types/server-action-types"
 * 
 * @notes
 * - parseCsvAction uses minimal CSV parsing and expects lines with columns:
 *   grantType, shares, strikePrice
 * - For more robust parsing, consider a CSV library like papaparse or 'csv-parse'.
 */

"use server"

import { db } from "@/db/db"
import { equityDataTable, InsertEquityData, SelectEquityData } from "@/db/schema/equity-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * @function createEquityDataAction
 * Inserts a new equity data record. 
 */
export async function createEquityDataAction(
  equityRecord: InsertEquityData
): Promise<ActionState<SelectEquityData>> {
  try {
    const [newRecord] = await db.insert(equityDataTable).values(equityRecord).returning()
    return {
      isSuccess: true,
      message: "Equity data created successfully",
      data: newRecord
    }
  } catch (error) {
    console.error("Error creating equity data record:", error)
    return { isSuccess: false, message: "Failed to create equity data record" }
  }
}

/**
 * @function getEquityDataByUserAction
 * Retrieves all equity data entries for a given userId.
 */
export async function getEquityDataByUserAction(
  userId: string
): Promise<ActionState<SelectEquityData[]>> {
  try {
    const records = await db.query.equityData.findMany({
      where: eq(equityDataTable.userId, userId)
    })
    return {
      isSuccess: true,
      message: "Equity data retrieved successfully",
      data: records
    }
  } catch (error) {
    console.error("Error retrieving equity data:", error)
    return { isSuccess: false, message: "Failed to retrieve equity data" }
  }
}

/**
 * @function updateEquityDataAction
 * Partially updates an existing equity data record by its ID.
 */
export async function updateEquityDataAction(
  id: string,
  data: Partial<InsertEquityData>
): Promise<ActionState<SelectEquityData>> {
  try {
    const [updatedRecord] = await db
      .update(equityDataTable)
      .set(data)
      .where(eq(equityDataTable.id, id))
      .returning()

    if (!updatedRecord) {
      return { isSuccess: false, message: "No matching record found to update" }
    }

    return {
      isSuccess: true,
      message: "Equity data updated successfully",
      data: updatedRecord
    }
  } catch (error) {
    console.error("Error updating equity data:", error)
    return { isSuccess: false, message: "Failed to update equity data" }
  }
}

/**
 * @function deleteEquityDataAction
 * Deletes a single equity data record by its ID.
 */
export async function deleteEquityDataAction(
  id: string
): Promise<ActionState<void>> {
  try {
    const deletedCount = await db
      .delete(equityDataTable)
      .where(eq(equityDataTable.id, id))
      .execute()

    if (deletedCount.length === 0) {
      return { isSuccess: false, message: "No matching record found to delete" }
    }

    return {
      isSuccess: true,
      message: "Equity data deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting equity data:", error)
    return { isSuccess: false, message: "Failed to delete equity data" }
  }
}

/**
 * @function parseCsvAction
 * @async
 * @description
 *  Parses an uploaded CSV file from formData (field name: "csvFile"), 
 *  expects a userId in formData as well, then inserts each row in `equity_data`
 *  with `dataSource="csv"`. Minimal CSV logic is used for demonstration.
 * 
 * @param {FormData} formData - The multipart form data, containing "csvFile" and "userId".
 * @returns {Promise<ActionState<void>>} - Returns success or failure message.
 * 
 * @example
 *  <form action={parseCsvAction} encType="multipart/form-data">
 *    <input type="hidden" name="userId" value="user_123" />
 *    <input type="file" name="csvFile" accept=".csv" />
 *    <button type="submit">Import</button>
 *  </form>
 */
export async function parseCsvAction(formData: FormData): Promise<ActionState<void>> {
  try {
    const file = formData.get("csvFile") as File | null
    const userId = formData.get("userId") as string

    // Basic validation
    if (!file || !userId) {
      return { isSuccess: false, message: "Missing file or userId" }
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return { isSuccess: false, message: "Uploaded file must be a .csv" }
    }

    // Convert file to text
    const csvContent = await file.text()
    const lines = csvContent.split(/\r?\n/) // naive splitting by newline

    if (lines.length < 2) {
      return { isSuccess: false, message: "CSV file is empty or invalid" }
    }

    // Optional: parse header row
    // We assume columns: grantType, shares, strikePrice
    const header = lines[0].split(",").map(col => col.trim().toLowerCase())
    // e.g. ["granttype", "shares", "strikeprice"]

    // We'll do minimal checking
    if (header.length < 3) {
      return { isSuccess: false, message: "CSV must have at least 3 columns" }
    }

    // Parse each row. Start from line index 1 (skip header).
    const rowsToInsert: InsertEquityData[] = []

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].trim()
      if (!row) continue // skip empty lines

      const cols = row.split(",")
      if (cols.length < 3) {
        // skip or handle partial row
        continue
      }

      const grantType = cols[0].trim()
      const sharesStr = cols[1].trim()
      const strikePriceStr = cols[2].trim()

      // Convert shares, strikePrice
      const shares = Number(sharesStr)
      const strikePrice = Number(strikePriceStr)

      // Minimal validation
      if (!grantType || isNaN(shares) || isNaN(strikePrice)) {
        // skip invalid row or handle error
        continue
      }

      const equityDetails = { grantType, shares, strikePrice }
      rowsToInsert.push({
        userId,
        dataSource: "csv",
        equityDetails
      })
    }

    if (rowsToInsert.length === 0) {
      return { isSuccess: false, message: "No valid rows found in CSV" }
    }

    // Insert all rows
    await db.insert(equityDataTable).values(rowsToInsert)

    return {
      isSuccess: true,
      message: `${rowsToInsert.length} rows inserted from CSV`,
      data: undefined
    }
  } catch (error) {
    console.error("Error parsing CSV:", error)
    return { isSuccess: false, message: "Failed to parse CSV" }
  }
}

