import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { taxBaseTable } from "./tax-base-schema"

// 1099-MISC specific data table
export const form1099MiscTable = pgTable("form_1099_misc_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  taxBaseId: uuid("tax_base_id")
    .notNull()
    .references(() => taxBaseTable.id, { onDelete: "cascade" }),

  // Payer information
  payerName: text("payer_name"),
  payerAddress: text("payer_address"),
  payerTin: text("payer_tin"),

  // Recipient information
  recipientName: text("recipient_name"),
  recipientAddress: text("recipient_address"),
  recipientTin: text("recipient_tin"),
  recipientAccountNumber: text("recipient_account_number"),

  // Income fields
  rents: text("rents"),
  royalties: text("royalties"),
  otherIncome: text("other_income"),
  federalIncomeTaxWithheld: text("federal_income_tax_withheld"),
  fishingBoatProceeds: text("fishing_boat_proceeds"),
  medicalPayments: text("medical_payments"),
  nonemployeeCompensation: text("nonemployee_compensation"),
  substitutePmts: text("substitute_payments"),
  cropInsuranceProceeds: text("crop_insurance_proceeds"),
  grossProceedsToAttorney: text("gross_proceeds_to_attorney"),

  // State information (as JSON string)
  stateInformation: text("state_information"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertForm1099Misc = typeof form1099MiscTable.$inferInsert
export type SelectForm1099Misc = typeof form1099MiscTable.$inferSelect
