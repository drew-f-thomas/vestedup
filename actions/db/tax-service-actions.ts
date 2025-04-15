"use server"

import { db } from "@/db/db"
import { taxBaseTable } from "@/db/schema/tax-base-schema"
import { w2Table } from "@/db/schema/w2-schema"
import { form1099MiscTable } from "@/db/schema/1099-misc-schema"
import { ActionState } from "@/types"
import { eq, desc } from "drizzle-orm"
import { createTaxBaseAction, getTaxBaseByDocumentIdAction } from "./tax-base-actions"
import { createW2Action, getW2ByTaxBaseIdAction } from "./w2-actions"
import { SelectDocument } from "@/db/schema/documents-schema"
import { SelectForm1099Misc } from "@/db/schema/1099-misc-schema"
import { SelectTaxBase } from "@/db/schema/tax-base-schema"
import { SelectW2 } from "@/db/schema/w2-schema"
import { getDocumentByIdAction } from "@/actions/db/documents-actions"
import { getUserTaxBasesByYearAction } from "@/actions/db/tax-base-actions"
import { getForm1099MiscByTaxBaseIdAction } from "@/actions/db/1099-misc-actions"
import { get1099MiscDataAction } from "@/actions/db/1099-misc-actions"

/**
 * @function getCompleteW2DataAction
 * @async
 * @description
 *  Retrieves complete W2 data including both tax base and W2-specific data
 * 
 * @param {string} documentId - The ID of the document
 * @returns {Promise<ActionState<any>>}
 */
export async function getCompleteW2DataAction(
  documentId: string
): Promise<ActionState<any>> {
  try {
    // Get the tax base record
    const taxBaseResult = await getTaxBaseByDocumentIdAction(documentId)
    
    if (!taxBaseResult.isSuccess) {
      return taxBaseResult
    }
    
    // Get the W2 data
    const w2Result = await getW2ByTaxBaseIdAction(taxBaseResult.data.id)
    
    if (!w2Result.isSuccess) {
      return w2Result
    }
    
    // Combine the data
    const completeData = {
      ...taxBaseResult.data,
      w2: w2Result.data
    }
    
    return {
      isSuccess: true,
      message: "Complete W2 data retrieved successfully",
      data: completeData
    }
  } catch (error) {
    console.error("Error retrieving complete W2 data:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve complete W2 data"
    }
  }
}

/**
 * @function createW2WithTaxBaseAction
 * @async
 * @description
 *  Creates both a tax base record and a W2 record in a single transaction
 * 
 * @param {any} parsedW2Data - The parsed W2 data from the document
 * @param {string} userId - The user ID
 * @param {string} documentId - The document ID
 * @returns {Promise<ActionState<any>>}
 */
export async function createW2WithTaxBaseAction(
  parsedW2Data: any,
  userId: string,
  documentId: string
): Promise<ActionState<any>> {
  try {
    // Extract year from the parsed data, defaulting to current year if not found
    const filingYear = parsedW2Data.year || new Date().getFullYear().toString()
    
    // First create the tax base record
    const taxBaseResult = await createTaxBaseAction({
      userId,
      documentId,
      docType: "W2" as const,
      filingYear,
      rawParsedContent: JSON.stringify(parsedW2Data),
      isVerified: false,
      isAmended: false
    })
    
    if (!taxBaseResult.isSuccess) {
      return taxBaseResult
    }
    
    // Then create the W2-specific record
    const w2Result = await createW2Action({
      taxBaseId: taxBaseResult.data.id,
      employeeName: parsedW2Data.employee?.name,
      employeeAddress: parsedW2Data.employee?.address,
      employeeSsn: parsedW2Data.employee?.ssn,
      filingStatus: parsedW2Data.filing_status,
      employerName: parsedW2Data.employer?.name,
      employerAddress: parsedW2Data.employer?.address,
      employerFedIdNumber: parsedW2Data.employer?.fed_id_number,
      employerStateIdNumber: parsedW2Data.employer?.state_id_number,
      controlNumber: parsedW2Data.control_number,
      verificationCode: parsedW2Data.box_9_verification_code,
      wagesBox1: parsedW2Data.wages?.box_1_wages_tips_other_comp,
      fedIncomeTaxBox2: parsedW2Data.wages?.box_2_federal_income_tax_withheld,
      socialSecurityWagesBox3: parsedW2Data.wages?.box_3_social_security_wages,
      socialSecurityTaxBox4: parsedW2Data.wages?.box_4_social_security_tax_withheld,
      medicareWagesBox5: parsedW2Data.wages?.box_5_medicare_wages_and_tips,
      medicareTaxBox6: parsedW2Data.wages?.box_6_medicare_tax_withheld,
      socialSecurityTipsBox7: parsedW2Data.wages?.box_7_social_security_tips,
      allocatedTipsBox8: parsedW2Data.wages?.box_8_allocated_tips,
      dependentCareBenefitsBox10: parsedW2Data.wages?.box_10_dependent_care_benefits,
      nonqualifiedPlansBox11: parsedW2Data.wages?.box_11_nonqualified_plans,
      box12Codes: JSON.stringify(parsedW2Data.box_12 || []),
      statutoryEmployeeBox13: parsedW2Data.box_13?.statutory_employee,
      retirementPlanBox13: parsedW2Data.box_13?.retirement_plan,
      thirdPartySickPayBox13: parsedW2Data.box_13?.third_party_sick_pay,
      box14Items: JSON.stringify(parsedW2Data.box_14 || []),
      stateWagesBox16: parsedW2Data.wages?.box_16_state_wages_tips_etc,
      stateIncomeTaxBox17: parsedW2Data.wages?.box_17_state_income_tax,
      localWagesBox18: parsedW2Data.wages?.box_18_local_wages_tips_etc,
      localIncomeTaxBox19: parsedW2Data.wages?.box_19_local_income_tax,
      localityNameBox20: parsedW2Data.wages?.box_20_locality_name,
      stateInformation: JSON.stringify(parsedW2Data.box_15_state_info || []),
      // Summary data
      grossPay: parsedW2Data.summary?.gross_pay,
      cafe125Adjustments: parsedW2Data.summary?.adjustments?.cafe_125,
      hsaAdjustments: parsedW2Data.summary?.adjustments?.hsa,
      otherAdjustments: parsedW2Data.summary?.adjustments?.other,
      reportedW2Wages: parsedW2Data.summary?.reported_w2_wages
    })
    
    if (!w2Result.isSuccess) {
      // Clean up tax base record if W2 creation fails
      try {
        await db.delete(taxBaseTable).where(eq(taxBaseTable.id, taxBaseResult.data.id))
      } catch (cleanupError) {
        console.error("Warning: Failed to clean up tax base after W2 creation error:", cleanupError)
      }
      
      return w2Result
    }
    
    // Return combined data
    return {
      isSuccess: true,
      message: "W2 tax data created successfully",
      data: {
        taxBase: taxBaseResult.data,
        w2: w2Result.data
      }
    }
  } catch (error) {
    console.error("Error creating W2 with tax base:", error)
    return {
      isSuccess: false,
      message: "Failed to create W2 tax data"
    }
  }
}

/**
 * @function getUserTaxDocumentsAction
 * @async
 * @description
 *  Retrieves all tax documents for the user.
 *  This includes W2s, 1099-MISCs, and any other tax document types.
 * 
 * @param {string} userId - The ID of the user
 * @returns {Promise<ActionState<{
 *   taxBase: SelectTaxBase;
 *   document: SelectDocument;
 *   w2?: SelectW2;
 *   form1099Misc?: SelectForm1099Misc;
 * }[]>>}
 */
export async function getUserTaxDocumentsAction(
  userId: string
): Promise<
  ActionState<{
    taxBase: SelectTaxBase
    document: SelectDocument
    w2?: SelectW2
    form1099Misc?: SelectForm1099Misc
  }[]>
> {
  try {
    // Get all tax bases for the user without year filtering
    const taxBases = await db.query.taxBase.findMany({
      where: eq(taxBaseTable.userId, userId),
      orderBy: desc(taxBaseTable.createdAt)
    })

    const results = await Promise.all(
      taxBases.map(async (taxBase: SelectTaxBase) => {
        try {
          const documentResult = await getDocumentByIdAction(taxBase.documentId)
          if (!documentResult.isSuccess) return null

          // Only fetch the specific tax document based on docType
          let w2Data: SelectW2 | undefined
          let form1099MiscData: SelectForm1099Misc | undefined

          if (taxBase.docType === "W2") {
            const w2Result = await getW2ByTaxBaseIdAction(taxBase.id)
            if (w2Result.isSuccess) {
              w2Data = w2Result.data
            }
          } else if (taxBase.docType === "1099_MISC") {
            const form1099MiscResult = await getForm1099MiscByTaxBaseIdAction(taxBase.id)
            if (form1099MiscResult.isSuccess) {
              form1099MiscData = form1099MiscResult.data
            }
          }

          return {
            taxBase,
            document: documentResult.data,
            w2: w2Data,
            form1099Misc: form1099MiscData
          }
        } catch (error) {
          console.error("Error processing tax document:", error)
          return null
        }
      })
    )

    const validResults = results.filter(
      (result): result is NonNullable<typeof result> => result !== null
    )

    return {
      isSuccess: true,
      message: `Successfully retrieved ${validResults.length} tax documents`,
      data: validResults
    }
  } catch (error) {
    console.error("Error getting user tax documents:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve tax documents"
    }
  }
} 