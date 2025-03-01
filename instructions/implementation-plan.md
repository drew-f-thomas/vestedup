# Implementation Plan

## Core Setup
- [x] **Step 1: Configure Environment & Variables**
  - **Task**: Ensure all required environment variables for EquiChat (DATABASE_URL, Clerk, Stripe, PostHog, etc.) exist and are documented in `.env.example`. Validate usage in `next.config.mjs`, `middleware.ts`, etc.
  - **Files**:
    - `/.env.example`: Add placeholders for CARTA_SCRAPING_CREDENTIALS or relevant environment variables for scraping, `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY`, etc.
    - `next.config.mjs`: Check if we need to reference new environment variables for scraping or PDF uploads.
    - `middleware.ts`: Just confirm it references Clerk as needed.
  - **Step Dependencies**: None
  - **User Instructions**: 
    1. Copy `.env.example` to `.env.local`.
    2. Fill in actual credentials for database, Clerk, Stripe, PostHog, etc.
    3. (Optional) Provide environment variables for scraping if needed.

## Database & Schemas
- [x] **Step 2: Create Equity Data Schema**
  - **Task**: Create a new table `equity_data` in Drizzle for storing user’s equity records (manual, CSV, or scraped). For now, store basic data: grant_type, vesting schedule, strike_price, etc.
  - **Files**:
    - `db/schema/equity-schema.ts`: New schema file for `equity_data` table, plus an enum for `data_source`.
    - `db/schema/index.ts`: Export from there.
    - `db/db.ts`: Add `equityDataTable` to the schema object if needed.
  - **Step Dependencies**: Step 1 (we must have DB environment ready)
  - **User Instructions**: 
    1. Run `npm run db:generate` and `npm run db:migrate` after adding new schema.

- [x] **Step 3: Create Conversations & Documents Schema**
  - **Task**: For chat messages referencing user data, create new tables `conversations` and `messages` if not already present. Also define a `documents` table for PDF/image info. We have partial definitions in the spec, so we’ll finalize them.
  - **Files**:
    - `db/schema/conversations-schema.ts`: Contains `conversationsTable` & `messagesTable`.
    - `db/schema/documents-schema.ts`: For storing uploaded doc metadata.
    - `db/schema/index.ts`: Export from there.
    - `db/db.ts`: Add them to `schema`.
  - **Step Dependencies**: Step 1, Step 2
  - **User Instructions**:
    1. Run `npm run db:generate` and `npm run db:migrate` again to finalize.

## Server Actions
- [ ] **Step 4: Equity Data Actions**
  - **Task**: Implement CRUD server actions for `equity_data` table, similar to `todos-actions.ts`. We’ll have `createEquityDataAction`, `getEquityDataByUserAction`, etc.
  - **Files**:
    - `actions/db/equity-data-actions.ts`: Add new CRUD actions.
    - `types/index.ts`: Possibly export new ActionState if needed, or reuse existing.
  - **Step Dependencies**: Steps 2–3
  - **User Instructions**: None

- [ ] **Step 5: Conversation & Document Actions**
  - **Task**: Implement server actions for `conversations`, `messages`, and `documents` (upload, list, delete).
  - **Files**:
    - `actions/db/conversations-actions.ts`: Create or update a conversation, add messages, etc.
    - `actions/db/documents-actions.ts`: Insert doc reference, retrieve user docs, etc.
  - **Step Dependencies**: Steps 2–3
  - **User Instructions**: None

## Data Import & Scraping
- [ ] **Step 6: Add Data Import Route & Manual Input**
  - **Task**: Create a new route in `app/(protected)/data-import/` with a page that allows manual equity input. Also list the user’s existing equity data with read, update, and delete actions.
  - **Files**:
    - `app/(auth)/layout.tsx`: Possibly reference new route in some nav if needed.
    - `app/(protected)/data-import/page.tsx`: The server page that fetches user’s equity data and displays a client subcomponent for input.
    - `app/(protected)/data-import/_components/manual-entry-form.tsx`: A new client component to handle manual input using `createEquityDataAction`.
  - **Step Dependencies**: Steps 1–5
  - **User Instructions**: None

- [ ] **Step 7: CSV Upload & Parsing**
  - **Task**: Implement CSV import. Provide a simple file input, parse on server side, store in DB. 
  - **Files**:
    - `app/(protected)/data-import/_components/csv-uploader.tsx`: Client side file input. Calls a server action to parse CSV (or we do it in a route action).
    - `actions/db/equity-data-actions.ts`: Possibly add a `parseCsvAction`.
  - **Step Dependencies**: Step 6
  - **User Instructions**: None

- [ ] **Step 8: Carta Scraping Stub**
  - **Task**: Implement a stub for Selenium-based scraping from Carta. We’ll store user credentials securely, then let a server action handle the scraping. For now, just a placeholder returning mock data.
  - **Files**:
    - `actions/scraping-actions.ts`: `scrapeCartaData(userId, credentials)`
    - `app/(protected)/data-import/_components/credential-input.tsx`: A form for user to input Carta credentials, calls the scraping action.
  - **Step Dependencies**: Steps 1–7
  - **User Instructions**: If real scraping is needed, user must set up Selenium environment on the server.

## Chatbot Core
- [ ] **Step 9: Basic Chat Interface & Conversation Flow**
  - **Task**: Add a new route `app/(protected)/chat/` for the chatbot interface. Let user see prior messages, post new ones, store them in DB. We can mock GPT-4o or use an external LLM. 
  - **Files**:
    - `app/(protected)/chat/page.tsx`: Server page for chat. Possibly displays `<ChatInterface />` client component.
    - `app/(protected)/chat/_components/chat-interface.tsx`: Basic input, streaming messages from a server action that calls an LLM.
    - `actions/chat-actions.ts`: `sendMessageAction` to store user message, call GPT, store response.
  - **Step Dependencies**: Steps 1–5
  - **User Instructions**: Must add real LLM API if needed. Provide environment variable for GPT-4o or custom model.

- [ ] **Step 10: PDF & Image Upload Integration**
  - **Task**: Let user upload documents (pdf or screenshots) to reference in chat context. Save in `documents` table, store file in Supabase Storage, reference them in the chat. 
  - **Files**:
    - `actions/storage/storage-actions.ts`: For uploading to Supabase Storage.
    - `app/(protected)/chat/_components/document-uploader.tsx`: UI for doc upload. 
    - Possibly update `chat-interface.tsx` to pass doc references to LLM.
  - **Step Dependencies**: Steps 1–9
  - **User Instructions**: If private storage, user must set RLS policies in Supabase. Provide the script or instructions for setting that.

## Insights & Simulations
- [ ] **Step 11: Actionable Insights & Recommendations**
  - **Task**: Using user’s equity_data, provide guidance on vesting schedule, tax considerations, etc. Basic placeholders for MVP (like “You have 3 months to exercise,” etc.). 
  - **Files**:
    - `actions/insights-actions.ts`: Possibly an action to compute recommendations from user’s data.
    - `app/(protected)/chat/_components/chat-interface.tsx`: Modify to incorporate these insights in the LLM prompt or direct UI.
  - **Step Dependencies**: Steps 1–10
  - **User Instructions**: These calculations are simplistic for MVP. Future expansions can handle complex logic.

- [ ] **Step 12: Personalized “What-If” Simulations**
  - **Task**: Provide a small UI so user can input a hypothetical new valuation, or changes in vesting. Display results in real-time. 
  - **Files**:
    - `app/(protected)/simulations/page.tsx`: Server page with a `<SimulationsPanel />` client component for interactive scenario modeling.
    - `actions/simulations-actions.ts`: Possibly an action that calculates updated outcomes.
  - **Step Dependencies**: Steps 1–11
  - **User Instructions**: None

## Admin Tooling
- [ ] **Step 13: Admin Dashboard**
  - **Task**: Add an `(admin)/` route that shows conversation logs, allows rating or providing feedback to LLM. 
  - **Files**:
    - `app/(admin)/layout.tsx`: Possibly a separate layout if needed.
    - `app/(admin)/page.tsx`: Overviews convos, uses `getAllConversationsAction`.
    - `admin/_components/conversation-list.tsx`: For listing convos. 
  - **Step Dependencies**: Steps 9–10
  - **User Instructions**: Only allow certain Clerk user IDs or membership to see this. Possibly we handle a role check.

## Stripe & Payments
- [ ] **Step 14: Stripe Integration for Premium**
  - **Task**: Gate certain advanced features (ex: advanced chatbot, doc uploads, or simulation) behind membership=“pro”. We have partial code, so we confirm it works, including webhooks. 
  - **Files**:
    - `actions/stripe-actions.ts`: Confirm or add logic for gating. 
    - `middleware.ts`: Possibly check membership for certain routes. 
    - `app/(marketing)/pricing/page.tsx`: Ensure user can upgrade, set membership=“pro”.
  - **Step Dependencies**: Steps 1–13
  - **User Instructions**: Must set Stripe env variables, then run a test checkout to confirm.

## Testing & Misc
- [ ] **Step 15: Testing & QA**
  - **Task**: Add unit tests for server actions (Jest) and integration/E2E tests for critical flows (Playwright or Cypress). 
  - **Files**:
    - `__tests__` folder: e.g. `actions/db/equity-data-actions.test.ts`.
    - Possibly additional config in `package.json`.
  - **Step Dependencies**: Steps 1–14
  - **User Instructions**: Run `npm test` or configured test commands. Provide instructions if we do E2E or require Docker for ephemeral DB.

- [ ] **Step 16: Final Cleanup & Documentation**
  - **Task**: Polish the code, update readme, handle leftover edges. Double-check error states, flows for incomplete data, disclaimers for legal/tax disclaimers, etc.
  - **Files**:
    - `README.md`: Update usage instructions with final details.
    - Possibly small tweaks across the codebase for finishing touches.
  - **Step Dependencies**: All above
  - **User Instructions**: Deploy to Vercel, set environment variables, done.


## Summary
This plan outlines the full implementation process for EquiChat, starting from environment config and database schemas, building server actions, creating data import pages, hooking up the chatbot with multi-modal doc context, adding insights and simulations, building admin tooling, implementing Stripe payments for premium features, and concluding with thorough testing and documentation. Each step is atomic and includes references to the files to modify, so an iterative code generation system can implement them in order without conflicts, ensuring a structured approach to building EquiChat from MVP to advanced features.
