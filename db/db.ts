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
import { type DrizzleConfig } from "drizzle-orm"
import postgres from "postgres"

import {
  profilesTable,
  equityDataTable,
  conversationsTable,
  messagesTable,
  documentsTable,
  conversationFeedbackTable,
  promptsTable,
  taxBaseTable,
  w2Table,
  form1099MiscTable
} from "@/db/schema"

// Load environment variables
console.log("db.ts: Loading environment variables")
config({ path: ".env.local" })

// Consolidate all database tables into a single schema object
const schema = {
  profiles: profilesTable,
  equityData: equityDataTable,
  conversations: conversationsTable,
  messages: messagesTable,
  documents: documentsTable,
  conversationFeedback: conversationFeedbackTable,
  prompts: promptsTable,
  taxBase: taxBaseTable,
  w2Data: w2Table,
  form1099MiscData: form1099MiscTable
}

// Define database types
export type Schema = typeof schema
export type DB = ReturnType<typeof drizzle<Schema>>

// Validate database URL
console.log("db.ts: Validating DATABASE_URL")
if (!process.env.DATABASE_URL) {
  console.error("db.ts: DATABASE_URL is not defined in environment variables")
  throw new Error("Database connection string is missing")
}

// Mask the connection string for logging (hide password)
const maskConnectionString = (url: string) => {
  try {
    return url.replace(/:[^:@]*@/, ":********@")
  } catch (e) {
    return "Error masking connection string"
  }
}

console.log(
  `db.ts: Using connection string: ${maskConnectionString(process.env.DATABASE_URL)}`
)

let client
let db: DB

try {
  console.log("db.ts: Initializing postgres client")
  // Postgres client initialization from environment
  client = postgres(process.env.DATABASE_URL, {
    max: 10, // Maximum number of connections
    idle_timeout: 20, // Idle connection timeout in seconds
    connect_timeout: 10, // Connection timeout in seconds
    prepare: false, // Disable prepared statements for better compatibility
    onnotice: notice => {
      console.log("db.ts: Postgres notice:", notice)
    },
    debug: (connection, query, params, types) => {
      console.log(
        `db.ts: Debug - Query: ${query.substring(0, 100)}${query.length > 100 ? "..." : ""}`
      )
    }
  })

  console.log("db.ts: Postgres client initialized, creating Drizzle instance")

  // Create our Drizzle instance using the combined schema
  db = drizzle(client, { schema }) as DB

  console.log("db.ts: Database connection initialized successfully")
} catch (error) {
  console.error("db.ts: Failed to initialize database connection:", error)
  if (error instanceof Error) {
    console.error(`db.ts: Error type: ${error.name}`)
    console.error(`db.ts: Error message: ${error.message}`)
    console.error(`db.ts: Error stack: ${error.stack}`)
  }
  throw new Error(
    "Database connection failed. Please check your credentials and connection string."
  )
}

// Export the database instance
export { db }
