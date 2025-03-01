# EquiChat Technical Specification

## 1. System Overview

EquiChat is an AI-powered chatbot designed to help startup employees understand and manage their equity compensation. The system integrates:
- **Core Purpose**: Provide equity guidance (e.g., vesting, taxes, exercise strategies) through a conversational interface.
- **Key Workflows**:
  1. **User Authentication & Onboarding**: Login and signup using Clerk.  
  2. **Data Import**: Manually enter equity data, upload CSV, or automate retrieval (Carta scraping).  
  3. **Document Uploads**: Upload PDFs or images for GPT-4o multi-modal context.  
  4. **Chat**: Conversational Q&A referencing user data and documents.  
  5. **Insights/Recommendations**: Provide actionable scenarios (tax considerations, vesting reminders).  
  6. **Simulations**: Model changes in valuations or liquidity events.  
  7. **Admin Review**: Admins can review user conversations, gather feedback, and refine prompts.

### System Architecture
- **Frontend**: Next.js (App Router) + Tailwind + Shadcn + Framer Motion.
- **Backend**: Supabase (PostgreSQL) + Drizzle ORM + server actions.
- **Auth**: Clerk (Google login + email/password).
- **Payments**: Stripe (upgrade to premium plan for advanced features).
- **Analytics**: PostHog (user behavior tracking).
- **Deployment**: Vercel (with `.env.local` for secrets and environment variables).

## 2. Project Structure

The project follows a standardized Next.js + Supabase + Clerk template:
- **`actions/db/`**: Database-related server actions (e.g., `equity-data-actions.ts`, `conversations-actions.ts`).
- **`actions/storage/`**: File upload actions to Supabase storage (for PDFs, images).
- **`actions/stripe-actions.ts`**: Subscription and billing logic.
- **`app/`**: Next.js routes. Key routes:
  - `(auth)/login`, `(auth)/signup`: Clerk auth pages.
  - `(marketing)/`: Public marketing site, with pages for `/pricing`, `/about`, etc.
  - `(chat)/`: Chatbot route (`page.tsx`, `_components` for chat UI).
  - `(data-import)/`: Data import route for manual input, CSV upload, or scraping.
  - `(admin)/`: Admin route for conversation and prompt management.
- **`components/`**: Shared UI components (Shadcn) plus specialized modules (e.g., chat bubbles).
- **`db/`**: Drizzle schema definitions, migrations, main DB connection.
- **`lib/`**: Utilities (hooks, `stripe.ts`, `utils.ts`, etc.).
- **`types/`**: Type definitions (`equity-types.ts`, etc.).
- **`prompts/`**: AI prompt templates.

## 3. Feature Specification

### 3.1 AI-Powered Chatbot
- **User Story**: As a user, I can open a chat interface, ask equity-related questions, and get personalized responses that reference my data and uploaded documents.
- **Implementation**:
  1. **Chat UI**: A real-time chat interface with message streaming.  
  2. **Conversations DB**: Each conversation linked to the user. Store the conversation’s messages (role: “user” or “assistant”).  
  3. **PDF/Image Context**: For MVP, use GPT-4o’s built-in PDF context. Future improvement: parse PDFs into embeddings.  
  4. **Edge Cases**: Large file sizes, incomplete data, ambiguous queries.

### 3.2 Equity Data Import & Retrieval
- **User Story**: Users can input equity data manually, upload CSV, or let the system scrape from Carta (Selenium).
- **Implementation**:
  1. **Manual Entry**: Basic forms validating user input (option grants, vesting schedules, strike prices).  
  2. **CSV Upload**: Parse CSV, handle validation, store in `equity_data` table.  
  3. **Carta Scraping**: Securely handle credentials. A server action triggers Selenium or similar.  
  4. **Edge Cases**: Invalid/malformed CSV, partial data from Carta.

### 3.3 Actionable Insights & Recommendations
- **User Story**: System provides suggestions on option exercise, tax implications, deadlines, etc.
- **Implementation**:
  1. **Data Analysis**: Summaries of vesting, upcoming expirations, potential AMT triggers.  
  2. **UI**: Possibly a “My Equity” dashboard with key metrics.  
  3. **Edge Cases**: Missing or incomplete data yields disclaimers.

### 3.4 Personalized Simulations
- **User Story**: Model “what if” scenarios for valuations, exit events, advanced tax strategies.
- **Implementation**:
  1. **Simulation Engine**: Calculations factoring in new valuations, time-based vesting progression.  
  2. **UI**: Sliders or input fields that recalculate.  
  3. **Edge Cases**: Extremely high valuations, negative or invalid inputs.

### 3.5 Admin Tooling
- **User Story**: Admin can review conversations, see user feedback, fine-tune prompts.
- **Implementation**:
  1. **Admin Dashboard**: List of conversations with user data, feedback metrics.  
  2. **Flag Responses**: Mark inaccurate or insufficient responses.  
  3. **Prompt Iteration**: Adjust system prompts or conversation style.  
  4. **Edge Cases**: Large volumes of conversation logs.

## 4. Database Schema

### 4.1 Tables

#### `profiles` (already present)
- `user_id (PK, text)`: Clerk user reference
- `membership (membershipEnum)`: “free” or “pro”
- `stripe_customer_id, stripe_subscription_id`: optional
- `created_at, updated_at`

#### `equity_data`
- **Fields**:
  - `id (uuid)`: PK
  - `user_id (text)`: references `profiles(user_id)`
  - `data_source (text)`: e.g. “manual”, “csv”, “scraped”
  - `equity_details (jsonb)`: structured data about grants
  - `created_at, updated_at`
- **Relationships**:
  - Many-to-one with `profiles`.

#### `conversations`
- **Fields**:
  - `id (uuid)`: PK
  - `user_id (text)`: references `profiles(user_id)`
  - `started_at, ended_at (timestamp)`
- **Relationships**:
  - One-to-many with `messages`.

#### `messages`
- **Fields**:
  - `id (uuid)`: PK
  - `conversation_id (uuid)`: references `conversations(id)`, cascade delete
  - `role (enum)`: “user” or “assistant”
  - `content (text)`
  - `created_at, updated_at`
- **Relationships**:
  - Many-to-one with `conversations`.

#### `documents`
- **Fields**:
  - `id (uuid)`: PK
  - `user_id (text)`: references `profiles(user_id)`
  - `file_type (enum)`: e.g. “pdf”, “image”
  - `file_path (text)`: path in Supabase Storage
  - `uploaded_at (timestamp)`
- **Relationships**:
  - Many-to-one with `profiles`.

## 5. Server Actions

### 5.1 Database Actions

**Equity Data Actions** (`equity-data-actions.ts`):
- `createEquityDataAction(equityRecord)`: Insert new equity data row.
- `getEquityDataByUserAction(userId)`: Fetch all equity entries for the user.
- `updateEquityDataAction(id, partialEquity)`: Modify existing equity data row.
- `deleteEquityDataAction(id)`: Delete an equity data row.

**Conversation/Message Actions** (`conversations-actions.ts`):
- `createConversationAction(userId)`: Insert new conversation record.
- `createMessageAction(conversationId, role, content)`: Insert new message.
- `getConversationByIdAction(conversationId)`: Retrieve conversation and messages.

**Document Actions** (`documents-actions.ts`):
- `createDocumentAction(userId, fileType, filePath)`: Insert record in `documents`.
- `getDocumentsForUserAction(userId)`: Query all documents for the user.

### 5.2 Other Actions

**CSV Import**:
- `parseCsvStorage(file: File)`: Validate CSV file, store data in `equity_data`.

**Selenium Scraping**:
- `scrapeCartaData(credentials)`: Orchestrates Selenium. Properly store user credentials.

**GPT Chat**:
- Possibly an internal action hooking into GPT-4o or an API route that handles streaming chat responses.

**Storage** (`storage-actions.ts`):
- `uploadFileStorage(bucket, path, file)`: Manage uploads to Supabase storage (PDFs/images).
- `generateSignedUrlStorage(bucket, path)`: Generate short-lived URLs for private objects.

## 6. Design System

### 6.1 Visual Style
- **Color Palette**:
  - **Primary**: `#1E3A8A` (Navy Blue)
  - **Secondary**: `#10B981` (Emerald Green)
  - **Accent**: `#9C40FF` or `#ffaa40` (from gradient examples)
  - **Background**: `#F9FAFB` (Light Gray)
  - **Text**: `#1F2937` (Dark Gray)
- **Typography**:
  - Font: **Inter**. Headings scale from 24px up to 48px. Body text ~16px or 14px.
- **Component Styling**:
  - Shadcn UI. Buttons, Cards, Inputs standardized. 
- **Spacing & Layout**:
  - Use Tailwind spacing tokens (2, 4, 6, 8, etc.).

### 6.2 Core Components
- **Layout**: 
  - `(auth)/layout.tsx`, `(marketing)/layout.tsx`, root `layout.tsx` in `app/`.
- **Navigation**: 
  - Header & optional sidebar for chat or admin. 
- **Chat**: 
  - `ChatBubble` for user and AI messages.
- **Data Import**:
  - CSV upload, progress bar, etc.
- **Interactive States**:
  - Hover, active, focus ring states; transitions with Tailwind classes.

## 7. Component Architecture

### 7.1 Server Components
- **Data Fetching**: Use server actions or calls to DB. Return minimal necessary data to client components.
- **Suspense**: Wrap pages that load large data sets or calls to LLM. 
- **Error Handling**: Basic try/catch in server actions.

### 7.2 Client Components
- **State Management**: Local state via `useState`, `useReducer`, or context. 
- **Event Handlers**: For CSV uploads, chat input, etc. 
- **UI**: Use Framer Motion for animations as needed.

## 8. Authentication & Authorization

- **Clerk**: 
  1. Imported in `layout.tsx`.  
  2. Middleware (`middleware.ts`) ensures protected routes (like `/chat`) redirect if not authenticated.  
  3. `auth()` from `@clerk/nextjs/server` in server components.

- **Protected Routes**: 
  - `(chat)`, `(data-import)`, `(admin)` behind Clerk sign-in. 
  - Potential membership gating for advanced features.

## 9. Data Flow

- **Server/Client**: 
  - Use server components to read DB, pass data to client for display. 
  - For updates, client calls server actions, which mutate the DB.

## 10. Stripe Integration

- **Payment Flow**:
  1. User chooses plan on `/pricing`.
  2. Goes to Stripe Checkout with `client_reference_id` = user’s ID.
  3. On success, Stripe calls webhook → we handle subscription status in `manageSubscriptionStatusChange`.
  4. Mark user as “pro” if subscription is active.
- **Webhook Handling**:
  - `POST /api/stripe/webhooks` processes `checkout.session.completed`, `customer.subscription.updated|deleted`.
- **Product Config**:
  - Set “membership=free|pro” in `metadata.membership`.

## 11. PostHog Analytics

- **Analytics Strategy**: 
  - Track events: “uploaded CSV”, “opened chat”, “sent message”. 
  - Identify user by Clerk ID.
- **Event Tracking**:
  - Use the existing `posthog.capture(‘event_name’)` in client components.

## 12. Testing

- **Unit Tests**:
  - Use Jest + `@testing-library/react`. 
  - Test server actions (DB queries, data transformations).
- **E2E Tests**:
  - Use Playwright for flows: sign in, import data, start chat, read insights.
- **Example Cases**:
  1. “User logs in, uploads CSV, sees correct data in DB.”
  2. “User sends chat message with equity question, gets AI response referencing vesting schedule.”
  3. “Admin logs in, reviews conversation logs.”


