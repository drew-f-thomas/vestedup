/*
<ai_context>
Exports the database schema for the app, aggregating all tables from the `db/schema` directory.
</ai_context>
*/

/**
 * @description
 * This file collects and re-exports all schema definitions from the directory
 * so they can be easily imported throughout the codebase:
 *
 * - profilesSchema
 * - todosSchema
 * - equityDataSchema
 * - conversationsSchema, messagesSchema
 * - documentsSchema
 * - conversationFeedbackSchema
 * - promptsSchema
 *
 * @notes
 * Ensure that any new schema file is exported here for Drizzle and the rest of the app.
 */

export * from "./profiles-schema"
export * from "./todos-schema"
export * from "./equity-schema"
export * from "./conversations-schema"
export * from "./documents-schema"

// New additions for Step 14:
export * from "./feedback-schema"
export * from "./prompts-schema"
