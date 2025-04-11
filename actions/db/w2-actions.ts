"use server"

import { db } from "@/db/db"
import { InsertW2, SelectW2, w2Table } from "@/db/schema/w2-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * @function createW2Action
 * @async
 * @description
 *  Creates a new W2 data record
 * 
 * @param {InsertW2} w2Data - W2 data to insert
 * @returns {Promise<ActionState<SelectW2>>}
 */
export async function createW2Action(
  w2Data: InsertW2
): Promise<ActionState<SelectW2>> {
  try {
    const [newW2] = await db
      .insert(w2Table)
      .values(w2Data)
      .returning()

    return {
      isSuccess: true,
      message: "W2 data created successfully",
      data: newW2
    }
  } catch (error) {
    console.error("Error creating W2 data:", error)
    return {
      isSuccess: false,
      message: "Failed to create W2 data"
    }
  }
}

/**
 * @function getW2ByTaxBaseIdAction
 * @async
 * @description
 *  Retrieves W2 data for a specific tax base record
 * 
 * @param {string} taxBaseId - The ID of the tax base record
 * @returns {Promise<ActionState<SelectW2>>}
 */
export async function getW2ByTaxBaseIdAction(
  taxBaseId: string
): Promise<ActionState<SelectW2>> {
  try {
    const w2Data = await db.query.w2Data.findFirst({
      where: eq(w2Table.taxBaseId, taxBaseId)
    })

    if (!w2Data) {
      return {
        isSuccess: false,
        message: "W2 data not found"
      }
    }

    return {
      isSuccess: true,
      message: "W2 data retrieved successfully",
      data: w2Data
    }
  } catch (error) {
    console.error("Error retrieving W2 data:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve W2 data"
    }
  }
}

/**
 * @function updateW2Action
 * @async
 * @description
 *  Updates a W2 data record
 * 
 * @param {string} w2Id - The ID of the W2 record
 * @param {Partial<InsertW2>} data - The fields to update
 * @returns {Promise<ActionState<SelectW2>>}
 */
export async function updateW2Action(
  w2Id: string,
  data: Partial<InsertW2>
): Promise<ActionState<SelectW2>> {
  try {
    const [updated] = await db
      .update(w2Table)
      .set(data)
      .where(eq(w2Table.id, w2Id))
      .returning()

    if (!updated) {
      return {
        isSuccess: false,
        message: "No matching W2 record found"
      }
    }

    return {
      isSuccess: true,
      message: "W2 data updated successfully",
      data: updated
    }
  } catch (error) {
    console.error("Error updating W2 data:", error)
    return {
      isSuccess: false,
      message: "Failed to update W2 data"
    }
  }
} 