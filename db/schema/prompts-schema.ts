/**
 * @description
 * Defines the database schema for storing system prompts or prompt revisions.
 * For example, the GPT system prompt that admins can iterate on. We store:
 * - name: A descriptive name (e.g., "system-prompt" or "assistant-prompt")
 * - content: The full text of the prompt
 * - isActive: A boolean to indicate which prompt is currently live
 * - createdAt, updatedAt
 *
 * @notes
 * - You can expand with versioning or additional fields as needed.
 */

import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core"

export const promptTypeEnum = pgEnum("prompt_type", [
  "system",
  "user",
  "assistant"
])

export const promptsTable = pgTable("prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  description: text("description"),
  type: promptTypeEnum("type").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertPrompt = typeof promptsTable.$inferInsert
export type SelectPrompt = typeof promptsTable.$inferSelect
