/**
 * @description
 * This file provides server actions for personalized "what-if" simulations.
 * For Step 12, we implement a basic scenario where a user inputs a hypothetical
 * company valuation, and we compute a naive potential equity value based on
 * the user's total shares from the database.
 *
 * Key Features:
 * - simulateValuationAction: Fetches user's total shares, multiplies by newValuation
 *   to compute a simplified "potentialValue."
 *
 * @dependencies
 * - db from "@/db/db": used to query user equity data
 * - eq from "drizzle-orm": for DB filtering
 * - equityDataTable from "@/db/schema/equity-schema": to find how many shares the user owns
 * - ActionState from "@/types": standard success/failure structure
 *
 * @notes
 * - This is a barebones example. Real calculations may consider vesting schedules,
 *   strike prices, tax treatments, or partial ownership. For now, we just sum shares
 *   and multiply by newValuation.
 * - The `newValuation` is provided in the UI as a single number. We assume it's a
 *   "per share" figure or a simplified price. We do not enforce advanced checks.
 */

"use server"

import { eq } from "drizzle-orm"
import { db } from "@/db/db"
import { equityDataTable } from "@/db/schema/equity-schema"
import { ActionState } from "@/types"

/**
 * @interface SimulateValuationProps
 * @property {string} userId - The ID of the user from Clerk.
 * @property {number} newValuation - The hypothetical price per share (or simple valuation metric).
 */
interface SimulateValuationProps {
  userId: string
  newValuation: number
}

/**
 * @function simulateValuationAction
 * @async
 * @description
 *  Fetches all equity data for the given user, sums up total shares,
 *  multiplies by the provided newValuation, and returns a naive "potentialValue."
 *
 * @param {SimulateValuationProps} props - The simulation inputs (userId, newValuation).
 * @returns {Promise<ActionState<{ potentialValue: number; totalShares: number }>>}
 *  On success, returns the computed potentialValue and the total number of shares.
 */
export async function simulateValuationAction(
  props: SimulateValuationProps
): Promise<ActionState<{ potentialValue: number; totalShares: number }>> {
  try {
    const { userId, newValuation } = props

    if (!userId || newValuation <= 0) {
      return {
        isSuccess: false,
        message: "Invalid userId or newValuation."
      }
    }

    // 1. Fetch all equity_data for the user
    const userEquity = await db.query.equityData.findMany({
      where: eq(equityDataTable.userId, userId)
    })

    // 2. Sum up the total number of shares
    let totalShares = 0
    userEquity.forEach(record => {
      const details = record.equityDetails as Record<string, any>
      const shares = details.shares ? Number(details.shares) : 0
      totalShares += shares
    })

    // 3. Potential value = totalShares * newValuation
    const potentialValue = totalShares * newValuation

    return {
      isSuccess: true,
      message: "Simulation successful",
      data: { potentialValue, totalShares }
    }
  } catch (error) {
    console.error("Error in simulateValuationAction:", error)
    return {
      isSuccess: false,
      message: "Failed to run simulation"
    }
  }
}
