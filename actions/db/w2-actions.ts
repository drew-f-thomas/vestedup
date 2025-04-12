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
  console.log("[W2] Creating new W2 record with tax base ID:", w2Data.taxBaseId)
  
  try {
    console.log("[W2] Executing insert query...")
    const [newW2] = await db
      .insert(w2Table)
      .values(w2Data)
      .returning()

    console.log("[W2] Successfully created W2 record. Fields present:", 
      Object.keys(newW2).join(", "))

    return {
      isSuccess: true,
      message: "W2 data created successfully",
      data: newW2
    }
  } catch (error) {
    console.error("[W2] Error creating W2 record:", error)
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
  console.log(`[W2] Fetching W2 for taxBaseId: ${taxBaseId}`)
  
  try {
    console.log("[W2] Executing database query...")
    const [w2Data] = await db
      .select()
      .from(w2Table)
      .where(eq(w2Table.taxBaseId, taxBaseId))
      .limit(1)
    
    console.log("[W2] Query completed. Result:", 
      w2Data ? "Document found" : "No document found")

    if (!w2Data) {
      console.log("[W2] No W2 found for taxBaseId:", taxBaseId)
      return {
        isSuccess: false,
        message: "W2 data not found"
      }
    }

    console.log("[W2] Successfully retrieved W2. Fields present:", 
      Object.keys(w2Data).join(", "))

    return {
      isSuccess: true,
      message: "W2 data retrieved successfully",
      data: w2Data
    }
  } catch (error) {
    console.error("[W2] Error retrieving W2:", error)
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
  console.log(`[W2] Updating W2 record: ${w2Id}`)
  console.log("[W2] Update fields:", Object.keys(data).join(", "))
  
  try {
    console.log("[W2] Executing update query...")
    const [updated] = await db
      .update(w2Table)
      .set(data)
      .where(eq(w2Table.id, w2Id))
      .returning()

    if (!updated) {
      console.log("[W2] No W2 found with ID:", w2Id)
      return {
        isSuccess: false,
        message: "No matching W2 record found"
      }
    }

    console.log("[W2] Successfully updated W2. Updated fields present:", 
      Object.keys(updated).join(", "))

    return {
      isSuccess: true,
      message: "W2 data updated successfully",
      data: updated
    }
  } catch (error) {
    console.error("[W2] Error updating W2:", error)
    return {
      isSuccess: false,
      message: "Failed to update W2 data"
    }
  }
} 