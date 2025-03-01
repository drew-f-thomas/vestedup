/**
 * @description
 * This file provides server actions for generating actionable insights and
 * recommendations related to a user's equity data. For now, we return placeholder
 * messages to demonstrate how we might guide the user about exercising options,
 * upcoming tax considerations, or general vesting reminders.
 * 
 * Key Features:
 * - getInsightsAction: Fetches user equity data, returns basic placeholder insights.
 * 
 * @dependencies
 * - db from "@/db/db": to retrieve the user's equity data
 * - eq from "drizzle-orm": for DB filtering
 * - ActionState from "@/types": to return success/failure states
 * - InsertEquityData, SelectEquityData from "@/db/schema/equity-schema"
 * 
 * @notes
 * - This is an MVP approach. Future expansions might incorporate real tax logic, 
 *   actual vesting schedule calculations, or tie into external APIs.
 * - If the user has no equity data, we can return an empty array or basic disclaimers.
 */

"use server"

import { ActionState } from "@/types"
import { db } from "@/db/db"
import { equityDataTable, SelectEquityData } from "@/db/schema/equity-schema"
import { eq } from "drizzle-orm"

/**
 * @function getInsightsAction
 * @async
 * @description
 *  Reads the user's equity data from the DB and generates a small set of 
 *  placeholder insights or recommendations. 
 *
 * @param {string} userId - The user's ID (from Clerk).
 * @returns {Promise<ActionState<string[]>>} - An array of insight strings, or empty if none.
 */
export async function getInsightsAction(
  userId: string
): Promise<ActionState<string[]>> {
  try {
    // 1. Retrieve user equity data
    const records: SelectEquityData[] = await db.query.equityData.findMany({
      where: eq(equityDataTable.userId, userId)
    })

    if (!records || records.length === 0) {
      // If no equity data, return a friendly placeholder
      return {
        isSuccess: true,
        message: "No equity records found.",
        data: [
          "We don't see any equity data yet. Add data or upload a CSV to get insights."
        ]
      }
    }

    // 2. Build placeholder insights
    //    We do naive logic or just generic disclaimers for this MVP
    const insights: string[] = []

    // Example: For each record, mention vesting, tax, etc.
    records.forEach((record, index) => {
      const details = record.equityDetails as Record<string, any>
      const grantType = details.grantType ?? "Grant"
      const shares = details.shares ?? 0
      const strikePrice = details.strikePrice ?? 0

      insights.push(
        `Equity #${index + 1}: You have a ${grantType} grant with ${shares} shares at a strike price of $${strikePrice}.`
      )
    })

    // Add a few general placeholders
    insights.push(
      "Remember to monitor upcoming vesting events for potential tax considerations.",
      "Consider your personal liquidity needs before exercising. Consult a tax professional if unsure."
    )

    return {
      isSuccess: true,
      message: "Insights generated successfully",
      data: insights
    }
  } catch (error) {
    console.error("Error generating insights:", error)
    return {
      isSuccess: false,
      message: "Failed to generate insights"
    }
  }
}
