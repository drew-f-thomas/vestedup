/**
 * @description
 * Defines the database schema for conversation feedback. Each conversation
 * can have 0 or 1 feedback entries submitted by an admin. This schema includes
 * a numeric `rating` (use 1 for thumbs up, 0 for thumbs down, or any scale you want)
 * and `notes` for additional critique text.
 *
 * @dependencies
 * - drizzle-orm/pg-core for column definitions
 * - conversationsTable from "@/db/schema/conversations-schema" for foreign key
 *
 * @notes
 * - The `onDelete: "cascade"` ensures that if the conversation is deleted,
 *   the feedback record is also removed automatically.
 */

import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core"
import { conversationsTable } from "@/db/schema/conversations-schema"

export const conversationFeedbackTable = pgTable("conversation_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),

  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversationsTable.id, { onDelete: "cascade" }),

  // rating can be used as thumbs up (1) / thumbs down (0), or any numeric scale you prefer
  rating: integer("rating").notNull().default(0),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertConversationFeedback =
  typeof conversationFeedbackTable.$inferInsert
export type SelectConversationFeedback =
  typeof conversationFeedbackTable.$inferSelect
