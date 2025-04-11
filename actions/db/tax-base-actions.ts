"use server"

import { db } from "@/db/db"
import { InsertTaxBase, SelectTaxBase, taxBaseTable } from "@/db/schema/tax-base-schema"
import { ActionState } from "@/types"
import { eq, and, desc } from "drizzle-orm"

/**
 * @function createTaxBaseAction
 * @async
 * @description
 *  Creates a new tax base record
 * 
 * @param {InsertTaxBase} taxBase - Tax base data to insert
 * @returns {Promise<ActionState<SelectTaxBase>>}
 */
export async function createTaxBaseAction(
  taxBase: InsertTaxBase
): Promise<ActionState<SelectTaxBase>> {
  try {
    const [newTaxBase] = await db
      .insert(taxBaseTable)
      .values(taxBase)
      .returning()

    return {
      isSuccess: true,
      message: "Tax base record created successfully",
      data: newTaxBase
    }
  } catch (error) {
    console.error("Error creating tax base record:", error)
    return {
      isSuccess: false,
      message: "Failed to create tax base record"
    }
  }
}

/**
 * @function getTaxBaseByDocumentIdAction
 * @async
 * @description
 *  Retrieves tax base data for a specific document
 * 
 * @param {string} documentId - The ID of the document
 * @returns {Promise<ActionState<SelectTaxBase>>}
 */
export async function getTaxBaseByDocumentIdAction(
  documentId: string
): Promise<ActionState<SelectTaxBase>> {
  try {
    const taxBase = await db.query.taxBase.findFirst({
      where: eq(taxBaseTable.documentId, documentId)
    })

    if (!taxBase) {
      return {
        isSuccess: false,
        message: "Tax base not found for document"
      }
    }

    return {
      isSuccess: true,
      message: "Tax base retrieved successfully",
      data: taxBase
    }
  } catch (error) {
    console.error("Error retrieving tax base:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve tax base"
    }
  }
}

/**
 * @function getUserTaxBasesByYearAction
 * @async
 * @description
 *  Retrieves all tax base records for a user for a specific filing year
 * 
 * @param {string} userId - The ID of the user
 * @param {string} filingYear - The filing year to filter by (e.g., "2023")
 * @returns {Promise<ActionState<SelectTaxBase[]>>}
 */
export async function getUserTaxBasesByYearAction(
  userId: string,
  filingYear: string
): Promise<ActionState<SelectTaxBase[]>> {
  try {
    const taxBases = await db.query.taxBase.findMany({
      where: and(
        eq(taxBaseTable.userId, userId),
        eq(taxBaseTable.filingYear, filingYear)
      ),
      orderBy: desc(taxBaseTable.createdAt)
    })

    return {
      isSuccess: true,
      message: `Tax documents for ${filingYear} retrieved successfully`,
      data: taxBases
    }
  } catch (error) {
    console.error("Error retrieving user tax bases by year:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve tax documents"
    }
  }
}

/**
 * @function getUserTaxYearsAction
 * @async
 * @description
 *  Retrieves all distinct filing years for a user's tax documents
 * 
 * @param {string} userId - The ID of the user
 * @returns {Promise<ActionState<string[]>>}
 */
export async function getUserTaxYearsAction(
  userId: string
): Promise<ActionState<string[]>> {
  try {
    const result = await db
      .selectDistinct({ filingYear: taxBaseTable.filingYear })
      .from(taxBaseTable)
      .where(eq(taxBaseTable.userId, userId))
      .orderBy(desc(taxBaseTable.filingYear))

    const years = result.map(row => row.filingYear)

    return {
      isSuccess: true,
      message: "Tax years retrieved successfully",
      data: years
    }
  } catch (error) {
    console.error("Error retrieving user tax years:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve tax years"
    }
  }
}

/**
 * @function updateTaxBaseAction
 * @async
 * @description
 *  Updates a tax base record
 * 
 * @param {string} taxBaseId - The ID of the tax base record
 * @param {Partial<InsertTaxBase>} data - The fields to update
 * @returns {Promise<ActionState<SelectTaxBase>>}
 */
export async function updateTaxBaseAction(
  taxBaseId: string,
  data: Partial<InsertTaxBase>
): Promise<ActionState<SelectTaxBase>> {
  try {
    const [updated] = await db
      .update(taxBaseTable)
      .set(data)
      .where(eq(taxBaseTable.id, taxBaseId))
      .returning()

    if (!updated) {
      return {
        isSuccess: false,
        message: "No matching tax base found"
      }
    }

    return {
      isSuccess: true,
      message: "Tax base updated successfully",
      data: updated
    }
  } catch (error) {
    console.error("Error updating tax base:", error)
    return {
      isSuccess: false,
      message: "Failed to update tax base"
    }
  }
}

/**
 * @function deleteTaxBaseAction
 * @async
 * @description
 *  Deletes a tax base record (this will cascade delete related form-specific data)
 * 
 * @param {string} taxBaseId - The ID of the tax base record to delete
 * @returns {Promise<ActionState<void>>}
 */
export async function deleteTaxBaseAction(
  taxBaseId: string
): Promise<ActionState<void>> {
  try {
    await db
      .delete(taxBaseTable)
      .where(eq(taxBaseTable.id, taxBaseId))

    return {
      isSuccess: true,
      message: "Tax data deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting tax base:", error)
    return {
      isSuccess: false,
      message: "Failed to delete tax data"
    }
  }
} 