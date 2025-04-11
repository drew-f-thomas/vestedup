import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core"
import { documentsTable } from "./documents-schema"
import { profilesTable } from "./profiles-schema"

export const taxDocTypeEnum = pgEnum("tax_doc_type", [
  "W2",
  "1099_MISC",
  "1099_K",
  "1098_T"
])

// Base table for all tax documents
export const taxBaseTable = pgTable("tax_base", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profilesTable.userId, { onDelete: "cascade" }),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documentsTable.id, { onDelete: "cascade" }),
  docType: taxDocTypeEnum("doc_type").notNull(),

  // Filing year as a separate field for efficient filtering and queries
  filingYear: text("filing_year").notNull(),

  // Tax period - could be useful for quarterly filers
  taxPeriod: text("tax_period"),

  // Flags for status tracking
  isVerified: boolean("is_verified").default(false),
  isAmended: boolean("is_amended").default(false),

  // Full parsed content for reference and future extraction needs
  rawParsedContent: text("raw_parsed_content"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertTaxBase = typeof taxBaseTable.$inferInsert
export type SelectTaxBase = typeof taxBaseTable.$inferSelect
