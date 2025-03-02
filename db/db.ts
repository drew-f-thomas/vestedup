/**
 * @description
 * Initializes the database connection and Drizzle schema references for the entire application.
 *
 * We import each table from the schema index and compile them into a `schema` object,
 * which Drizzle uses to provide type-safe queries. This includes all new tables for Step 14.
 *
 * Key features:
 * - Uses `postgres` as a minimal Postgres client with the connection string from `.env.local`.
 * - Drizzle orchestrates migrations and queries, referencing the combined `schema` object.
 *
 * @notes
 * - We add conversationFeedbackTable and promptsTable to the schema for Step 14.
 */

import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import {
  profilesTable,
  equityDataTable,
  conversationsTable,
  messagesTable,
  documentsTable,
  conversationFeedbackTable,
  promptsTable
} from "@/db/schema"

config({ path: ".env.local" })

// Consolidate all database tables into a single schema object
const schema = {
  profiles: profilesTable,
  equityData: equityDataTable,
  conversations: conversationsTable,
  messages: messagesTable,
  documents: documentsTable,
  conversationFeedback: conversationFeedbackTable,
  prompts: promptsTable
}

// Postgres client initialization from environment
const client = postgres(process.env.DATABASE_URL!)

// Create our Drizzle instance using the combined schema
export const db = drizzle(client, { schema })
