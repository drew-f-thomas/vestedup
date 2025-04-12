import { z } from "zod"

// W2 Form Schemas
export const W2EmployeeSchema = z.object({
  name: z.string().nullable(),
  address: z.string().nullable(),
  ssn: z.string().nullable()
})

export const W2EmployerSchema = z.object({
  name: z.string().nullable(),
  address: z.string().nullable(),
  fed_id_number: z.string().nullable(),
  state_id_number: z.string().nullable()
})

export const W2WagesSchema = z.object({
  box_1_wages_tips_other_comp: z.string().nullable(),
  box_2_federal_income_tax_withheld: z.string().nullable(),
  box_3_social_security_wages: z.string().nullable(),
  box_4_social_security_tax_withheld: z.string().nullable(),
  box_5_medicare_wages_and_tips: z.string().nullable(),
  box_6_medicare_tax_withheld: z.string().nullable(),
  box_7_social_security_tips: z.string().nullable(),
  box_8_allocated_tips: z.string().nullable(),
  box_10_dependent_care_benefits: z.string().nullable(),
  box_11_nonqualified_plans: z.string().nullable(),
  box_16_state_wages_tips_etc: z.string().nullable(),
  box_17_state_income_tax: z.string().nullable(),
  box_18_local_wages_tips_etc: z.string().nullable(),
  box_19_local_income_tax: z.string().nullable(),
  box_20_locality_name: z.string().nullable()
})

export const W2Box12Schema = z.array(
  z.object({
    code: z.string().nullable(),
    amount: z.string().nullable(),
    description: z.string().nullable()
  })
)

export const W2Box13Schema = z.object({
  statutory_employee: z.boolean().nullable(),
  retirement_plan: z.boolean().nullable(),
  third_party_sick_pay: z.boolean().nullable()
})

export const W2Box14Schema = z.array(
  z.object({
    description: z.string().nullable(),
    amount: z.string().nullable()
  })
)

export const W2Box15Schema = z.array(
  z.object({
    state: z.string().nullable(),
    state_id: z.string().nullable()
  })
)

export const W2SummarySchema = z.object({
  gross_pay: z.string().nullable(),
  adjustments: z.object({
    cafe_125: z.string().nullable(),
    hsa: z.string().nullable(),
    other: z.string().nullable()
  }),
  reported_w2_wages: z.string().nullable()
})

export const W2Analysis = z.object({
  year: z.string().nullable(),
  employee: W2EmployeeSchema,
  filing_status: z.string().nullable(),
  employer: W2EmployerSchema,
  control_number: z.string().nullable(),
  wages: W2WagesSchema,
  box_9_verification_code: z.string().nullable(),
  box_12: W2Box12Schema,
  box_13: W2Box13Schema,
  box_14: W2Box14Schema,
  box_15_state_info: W2Box15Schema,
  box_21_third_party_sick_pay_not_reported: z.string().nullable(),
  summary: W2SummarySchema
})

// 1099 Form Schemas
export const Form1099PayerSchema = z.object({
  name: z.string().nullable(),
  address: z.string().nullable(),
  tin: z.string().nullable() // Taxpayer Identification Number
})

export const Form1099RecipientSchema = z.object({
  name: z.string().nullable(),
  address: z.string().nullable(),
  tin: z.string().nullable()
})

export const Form1099MiscSchema = z.object({
  box_1_rents: z.string().nullable(),
  box_2_royalties: z.string().nullable(),
  box_3_other_income: z.string().nullable(),
  box_4_federal_income_tax_withheld: z.string().nullable(),
  box_5_fishing_boat_proceeds: z.string().nullable(),
  box_6_medical_payments: z.string().nullable(),
  box_7_nonemployee_compensation: z.string().nullable(),
  box_8_substitute_payments: z.string().nullable(),
  box_9_payer_direct_sales: z.string().nullable(),
  box_10_crop_insurance: z.string().nullable(),
  box_12_section_409a_deferrals: z.string().nullable(),
  box_13_excess_golden_parachute: z.string().nullable(),
  box_14_gross_proceeds_attorney: z.string().nullable(),
  box_15_section_409a_income: z.string().nullable(),
  box_16_state_tax_withheld: z.string().nullable(),
  box_17_state_number: z.string().nullable(),
  box_18_state_income: z.string().nullable()
})

export const Form1099Analysis = z.object({
  year: z.string().nullable(),
  form_type: z.literal("1099-MISC"),
  payer: Form1099PayerSchema,
  recipient: Form1099RecipientSchema,
  payments: Form1099MiscSchema,
  account_number: z.string().nullable(),
  fatca_filing_requirement: z.boolean().nullable(),
  second_tin_notice: z.boolean().nullable()
})

// Union type for all supported document types
export const DocumentAnalysis = z.discriminatedUnion("form_type", [
  W2Analysis.extend({ form_type: z.literal("W2") }),
  Form1099Analysis
])

export type DocumentAnalysisType = z.infer<typeof DocumentAnalysis>
