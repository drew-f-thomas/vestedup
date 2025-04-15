"use server"

import { db } from "@/db/db"
import { form1099MiscTable as form1099MiscSchema } from "@/db/schema/1099-misc-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"
import { SelectForm1099Misc } from "@/db/schema/1099-misc-schema"

export async function getForm1099MiscByTaxBaseIdAction(
  taxBaseId: string
): Promise<ActionState<SelectForm1099Misc>> {
  console.log(`[1099-MISC] Fetching form for taxBaseId: ${taxBaseId}`)
  
  try {
    console.log("[1099-MISC] Executing database query...")
    const form1099Misc = await db.query.form1099MiscData.findFirst({
      where: eq(form1099MiscSchema.taxBaseId, taxBaseId)
    })
    
    console.log("[1099-MISC] Query completed. Result:", 
      form1099Misc ? "Document found" : "No document found")

    if (!form1099Misc) {
      console.log("[1099-MISC] No form found for taxBaseId:", taxBaseId)
      return {
        isSuccess: false,
        message: "1099-MISC form not found"
      }
    }

    console.log("[1099-MISC] Successfully retrieved form. Fields present:", 
      Object.keys(form1099Misc).join(", "))
    
    return {
      isSuccess: true,
      message: "1099-MISC form retrieved successfully",
      data: form1099Misc
    }
  } catch (error) {
    console.error("[1099-MISC] Error retrieving form:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve 1099-MISC form"
    }
  }
}