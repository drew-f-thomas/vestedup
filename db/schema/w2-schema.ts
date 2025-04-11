import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { taxBaseTable } from "./tax-base-schema"

// W2 specific data table
export const w2Table = pgTable("w2_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  taxBaseId: uuid("tax_base_id")
    .notNull()
    .references(() => taxBaseTable.id, { onDelete: "cascade" }),

  // Employee information
  employeeName: text("employee_name"),
  employeeAddress: text("employee_address"),
  employeeSsn: text("employee_ssn"),
  filingStatus: text("filing_status"),

  // Employer information
  employerName: text("employer_name"),
  employerAddress: text("employer_address"),
  employerFedIdNumber: text("employer_fed_id_number"),
  employerStateIdNumber: text("employer_state_id_number"),

  // Control information
  controlNumber: text("control_number"),
  verificationCode: text("verification_code"),

  // Wage data
  wagesBox1: text("wages_box_1"),
  fedIncomeTaxBox2: text("fed_income_tax_box_2"),
  socialSecurityWagesBox3: text("social_security_wages_box_3"),
  socialSecurityTaxBox4: text("social_security_tax_box_4"),
  medicareWagesBox5: text("medicare_wages_box_5"),
  medicareTaxBox6: text("medicare_tax_box_6"),
  socialSecurityTipsBox7: text("social_security_tips_box_7"),
  allocatedTipsBox8: text("allocated_tips_box_8"),

  // More wage data
  dependentCareBenefitsBox10: text("dependent_care_benefits_box_10"),
  nonqualifiedPlansBox11: text("nonqualified_plans_box_11"),

  // Box 12 codes (stored as JSON string for flexibility)
  box12Codes: text("box_12_codes"),

  // Box 13 checkboxes
  statutoryEmployeeBox13: boolean("statutory_employee_box_13"),
  retirementPlanBox13: boolean("retirement_plan_box_13"),
  thirdPartySickPayBox13: boolean("third_party_sick_pay_box_13"),

  // Box 14 other
  box14Items: text("box_14_items"),

  // State and local information
  stateWagesBox16: text("state_wages_box_16"),
  stateIncomeTaxBox17: text("state_income_tax_box_17"),
  localWagesBox18: text("local_wages_box_18"),
  localIncomeTaxBox19: text("local_income_tax_box_19"),
  localityNameBox20: text("locality_name_box_20"),

  // State information (stored as JSON string)
  stateInformation: text("state_information"),

  // Summary data (helpful for tax calculations)
  grossPay: text("gross_pay"),
  cafe125Adjustments: text("cafe_125_adjustments"),
  hsaAdjustments: text("hsa_adjustments"),
  otherAdjustments: text("other_adjustments"),
  reportedW2Wages: text("reported_w2_wages"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertW2 = typeof w2Table.$inferInsert
export type SelectW2 = typeof w2Table.$inferSelect
