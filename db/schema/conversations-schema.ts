/**
 * @description
 * Defines the database schema for conversations and messages, which track user chat history.
 *
 * The `conversationsTable` records a single conversation belonging to a user,
 * and the `messagesTable` links to a conversation via `conversationId`.
 *
 * Key features:
 * - Each conversation belongs to a user (linked via `userId` referencing `profilesTable.userId`).
 * - Each message references a conversation (cascade delete to remove messages if the conversation is deleted).
 * - The `role` enum indicates if the message was from the user or the AI assistant.
 * - We include timestamps to track conversation start/end, as well as message creation/updates.
 *
 * @dependencies
 * - profilesTable from `profiles-schema.ts`: We reference user IDs from that table.
 * - `drizzle-orm/pg-core` for table, column, and enum definitions.
 * - Basic knowledge from the EquiChat specification specifying role-based messages and ownership by a user.
 *
 * @notes
 * - We assume that if a user is deleted from `profiles`, their conversations will also be removed (cascade).
 * - Timestamps track creation and last update for queries or audit logs.
 */

import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { profilesTable } from "@/db/schema/profiles-schema"

/**
 * roleEnum:
 * Defines the possible roles for a chat message.
 * 'user' => the user is speaking
 * 'assistant' => the AI assistant's response
 */
export const roleEnum = pgEnum("role", ["user", "assistant"])

/**
 * conversationsTable:
 * Stores the top-level record for each chat session a user has.
 */
export const conversationsTable = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profilesTable.userId, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * messagesTable:
 * Stores all messages associated with a conversation.
 */
export const messagesTable = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversationsTable.id, { onDelete: "cascade" }),
  role: roleEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * InsertConversation:
 * Type used to insert a new conversation row into `conversationsTable`.
 */
export type InsertConversation = typeof conversationsTable.$inferInsert

/**
 * SelectConversation:
 * Type representing a row retrieved from `conversationsTable`.
 */
export type SelectConversation = typeof conversationsTable.$inferSelect

/**
 * InsertMessage:
 * Type used to insert a new message row into `messagesTable`.
 */
export type InsertMessage = typeof messagesTable.$inferInsert

/**
 * SelectMessage:
 * Type representing a row retrieved from `messagesTable`.
 */
export type SelectMessage = typeof messagesTable.$inferSelect
