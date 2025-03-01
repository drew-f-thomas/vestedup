/**
 * @description
 * Defines the schema for the `equity_data` table, which stores equity-related records for each user.
 *
 * This includes:
 * - userId: references the `profiles` table (foreign key)
 * - dataSource: an enum describing how the data was obtained (manual, csv, scraped)
 * - equityDetails: a JSONB column containing details about the equity (e.g., grant type, strike price, vesting)
 * - createdAt, updatedAt: timestamps for auditing
 *
 * @dependencies
 * - @/db/schema/profiles-schema: for referencing the userId from `profilesTable`
 * - drizzle-orm: for table & column definitions
 * - pg-core: for enumerations, text, timestamp, jsonb, etc.
 *
 * @notes
 * - The `onDelete: "cascade"` ensures that if the user is deleted from `profiles`, their `equity_data` will also be removed.
 * - We use the dataSourceEnum to strictly define possible import methods for the equity data.
 */

import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb
} from "drizzle-orm/pg-core"
import { profilesTable } from "@/db/schema/profiles-schema"

/**
 * dataSourceEnum:
 *
 * Defines the possible ways a user might have imported or created their equity data.
 * - manual: Manually entered via form
 * - csv: Imported via CSV file
 * - scraped: Retrieved through Selenium-based scraping from Carta
 */
export const dataSourceEnum = pgEnum("data_source", [
  "manual",
  "csv",
  "scraped"
])

/**
 * equityDataTable
 *
 * The main table for storing equity records linked to a user.
 * Fields:
 * - id: Primary key (UUID)
 * - userId: References userId in profilesTable
 * - dataSource: An enum representing how data was obtained
 * - equityDetails: JSONB object containing structured equity information
 * - createdAt, updatedAt: Timestamps with default values
 */
export const equityDataTable = pgTable("equity_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profilesTable.userId, { onDelete: "cascade" }),
  dataSource: dataSourceEnum("data_source").notNull().default("manual"),
  equityDetails: jsonb("equity_details").$type<Record<string, any>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * InsertEquityData
 *
 * Type that can be used when inserting into the `equity_data` table.
 */
export type InsertEquityData = typeof equityDataTable.$inferInsert

/**
 * SelectEquityData
 *
 * Type that represents a row retrieved from the `equity_data` table.
 */
export type SelectEquityData = typeof equityDataTable.$inferSelect
