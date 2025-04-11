/**
 * @description
 * Defines the database schema for storing metadata about uploaded documents.
 *
 * The `documentsTable` references a user (who owns the document),
 * tracks file type (pdf/image) via an enum, and stores the path to the file in Supabase storage.
 * Documents can be tagged with specific categories to help organize equity documents.
 *
 * Key features:
 * - Each document belongs to a user in `profilesTable`.
 * - The `fileTypeEnum` enumerates the accepted file types (pdf, image).
 * - The `documentTagEnum` categorizes documents by type (e.g., stock options, RSUs).
 * - The `filePath` indicates where the file is stored in Supabase.
 * - We store `uploadedAt` for auditing/time-based queries.
 * - Documents can have a title and tag for better organization.
 * - The `isEncrypted` flag indicates if the document is encrypted with KMS.
 *
 * @dependencies
 * - profilesTable from `profiles-schema.ts`.
 * - `drizzle-orm/pg-core` for schema definitions.
 *
 * @notes
 * - We assume `user_id` references `profilesTable.userId` with a cascade if the user is removed.
 * - This table pairs with the actual file storage in Supabase, which must remain in sync.
 */

import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean
} from "drizzle-orm/pg-core"
import { profilesTable } from "@/db/schema/profiles-schema"

/**
 * fileTypeEnum:
 * Distinguishes between PDF files and images for the user's documents.
 * Additional types could be added in the future (e.g. "txt", "docx").
 */
export const fileTypeEnum = pgEnum("file_type", ["pdf", "image"])

/**
 * documentTagEnum:
 * Categorizes documents by type for equity-related documents.
 * This helps users organize and find their documents more easily.
 */
export const documentTagEnum = pgEnum("document_tag", [
  "stock_option_grant",
  "rsu_grant",
  "stock_option_agreement",
  "valuation_report",
  "83b_election",
  "vesting_schedule",
  "other"
])

/**
 * documentsTable:
 * The table storing references to user-uploaded documents for context in the chatbot.
 */
export const documentsTable = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profilesTable.userId, { onDelete: "cascade" }),
  title: text("title"),
  fileType: fileTypeEnum("file_type").notNull(),
  documentTag: documentTagEnum("document_tag").default("other"),
  filePath: text("file_path").notNull(),
  isEncrypted: boolean("is_encrypted").default(false).notNull(),
  parsedContent: text("parsed_content"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * InsertDocument:
 * Type used when inserting a new record into the `documentsTable`.
 */
export type InsertDocument = typeof documentsTable.$inferInsert

/**
 * SelectDocument:
 * Type representing a row retrieved from `documentsTable`.
 */
export type SelectDocument = typeof documentsTable.$inferSelect
