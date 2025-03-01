You are an AI code generator responsible for implementing a web application based on a provided technical specification and implementation plan.

Your task is to systematically implement each step of the plan, one at a time.

First, carefully review the following inputs:

<project_request>
# Project Name
EquiChat: AI-Powered Equity Guidance Chatbot

## Project Description
EquiChat is an AI-driven chatbot designed for startup employees to navigate their equity compensation. Users can manually import their equity data via CSV or provide credentials for automated data retrieval via web scraping (e.g., Selenium). The chatbot leverages a multi-modal AI model to process text, PDFs, and images, allowing users to upload contracts and Carta screenshots for analysis. User authentication is required to store conversation history and manage data securely.

Initially, PDF uploads will serve as conversation context using GPT-4o’s built-in capabilities, with full document parsing and advanced insights planned for future iterations. 

## Target Audience
- Startup employees with stock options or RSUs
- Early-stage founders looking to understand equity structures
- Employees transitioning jobs who need to decide on exercising options
- Financial advisors working with startup clients

## Desired Features

### Core Chatbot Functionality
- [ ] AI-powered chat experience for answering equity-related questions
    - [ ] Conversational guidance tailored to user-provided data
    - [ ] Scenario-based insights (e.g., "What happens if I leave before my options vest?")
- [ ] Equity Data Import & Retrieval
    - [ ] Manual data input for non-Carta users
    - [ ] CSV upload for structured equity data
    - [ ] User credential submission & automated Selenium-based web scraping from Carta
    - [ ] Ability to upload PDFs (contracts, Carta screenshots) for added conversation context 
- [ ] Actionable Insights & Recommendations
    - [ ] Guidance on exercising options based on user's vesting schedule
    - [ ] Tax considerations (AMT, capital gains, etc.)
    - [ ] Expiration reminders and planning
- [ ] Personalized Simulations
    - [ ] "What if" scenarios based on company valuation changes
    - [ ] Modeling future liquidity events

### AI & Model Strategy
- [ ] Start with a standard model like GPT-4o-mini, optimized via prompt engineering
- [ ] Multi-modal LLM to process and extract insights from PDFs & images (limited to out-of-the-box context usage for MVP)
- [ ] Future roadmap includes fine-tuning for specialized equity guidance
- [ ] Admin tooling for:
    - [ ] Prompt iteration and improvement
    - [ ] Conversation reviews with thumbs up/down ratings
    - [ ] Free-text critique submission for feedback
    - [ ] Storage and analysis of user-uploaded PDFs/images for quality review

### User Experience & Interface
- [ ] **Authentication using Clerk** (Google login & email/password support)
- [ ] **Hosting on Vercel with Supabase as the database**
- [ ] **User authentication required for saved conversations**
- [ ] Clean, intuitive chatbot interface (web and mobile-friendly)
- [ ] Message history and session management
- [ ] Dynamic UI elements for data visualization (e.g., charts for tax impact)
- [ ] Interactive inputs (e.g., sliders for stock price estimations)

### Security & Compliance
- [ ] Secure handling of sensitive financial data
- [ ] Data encryption at rest and in transit
- [ ] User credential handling for Carta scraping in a secure environment
- [ ] Compliance with future financial data protection regulations (e.g., SOC-2 readiness plan)

### Admin Tooling
- [ ] **All admins can review conversations, provide feedback, and iterate on prompts**
- [ ] Admin dashboard to monitor chatbot performance
- [ ] Analytics on user queries and feedback
- [ ] Ability to flag inaccurate or unclear responses for improvement

### Additional Features (Future Considerations)
- [ ] Full document parsing for deeper contract insights beyond chat context
- [ ] Integration with financial advisors for human review
- [ ] Community Q&A section for users to discuss equity topics
- [ ] Premium tier where real human lawyers review uploaded contracts

## Design Requests
- [ ] Modern and minimal UI with financial app aesthetics
- [ ] Responsive web design for mobile accessibility
- [ ] Option to toggle between light and dark mode

## Other Notes
- [ ] Legal disclaimers to be added in later stages; initial focus is exploratory
- [ ] Equity-focused for now, with potential for broader financial guidance in the future
</project_request>

<project_rules>
# Project Instructions

Use specification and guidelines as you build the app.

Write the complete code for every step. Do not get lazy.

Your goal is to completely finish whatever I ask for.

You will see <ai_context> tags in the code. These are context tags that you should use to help you understand the codebase.

## Overview

This is a web app template.

## Tech Stack

- Frontend: Next.js, Tailwind, Shadcn, Framer Motion
- Backend: Postgres, Supabase, Drizzle ORM, Server Actions
- Auth: Clerk
- Payments: Stripe
- Analytics: PostHog
- Deployment: Vercel

## Project Structure

- `actions` - Server actions
  - `db` - Database related actions
  - Other actions
- `app` - Next.js app router
  - `api` - API routes
  - `route` - An example route
    - `_components` - One-off components for the route
    - `layout.tsx` - Layout for the route
    - `page.tsx` - Page for the route
- `components` - Shared components
  - `ui` - UI components
  - `utilities` - Utility components
- `db` - Database
  - `schema` - Database schemas
- `lib` - Library code
  - `hooks` - Custom hooks
- `prompts` - Prompt files
- `public` - Static assets
- `types` - Type definitions

## Rules

Follow these rules when building the app.

### General Rules

- Use `@` to import anything from the app unless otherwise specified
- Use kebab case for all files and folders unless otherwise specified
- Don't update shadcn components unless otherwise specified

#### Env Rules

- If you update environment variables, update the `.env.example` file
- All environment variables should go in `.env.local`
- Do not expose environment variables to the frontend
- Use `NEXT_PUBLIC_` prefix for environment variables that need to be accessed from the frontend
- You may import environment variables in server actions and components by using `process.env.VARIABLE_NAME`

#### Type Rules

Follow these rules when working with types.

- When importing types, use `@/types`
- Name files like `example-types.ts`
- All types should go in `types`
- Make sure to export the types in `types/index.ts`
- Prefer interfaces over type aliases
- If referring to db types, use `@/db/schema` such as `SelectTodo` from `todos-schema.ts`

An example of a type:

`types/actions-types.ts`

```ts
export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never }
```

And exporting it:

`types/index.ts`

```ts
export * from "./actions-types"
```

### Frontend Rules

Follow these rules when working on the frontend.

It uses Next.js, Tailwind, Shadcn, and Framer Motion.

#### General Rules

- Use `lucide-react` for icons
- useSidebar must be used within a SidebarProvider

#### Components

- Use divs instead of other html tags unless otherwise specified
- Separate the main parts of a component's html with an extra blank line for visual spacing
- Always tag a component with either `use server` or `use client` at the top, including layouts and pages

##### Organization

- All components be named using kebab case like `example-component.tsx` unless otherwise specified
- Put components in `/_components` in the route if one-off components
- Put components in `/components` from the root if shared components

##### Data Fetching

- Fetch data in server components and pass the data down as props to client components.
- Use server actions from `/actions` to mutate data.

##### Server Components

- Use `"use server"` at the top of the file.
- Implement Suspense for asynchronous data fetching to show loading states while data is being fetched.
- If no asynchronous logic is required for a given server component, you do not need to wrap the component in `<Suspense>`. You can simply return the final UI directly since there is no async boundary needed.
- If asynchronous fetching is required, you can use a `<Suspense>` boundary and a fallback to indicate a loading state while data is loading.
- Server components cannot be imported into client components. If you want to use a server component in a client component, you must pass the as props using the "children" prop
- params in server pages should be awaited such as `const { courseId } = await params` where the type is `params: Promise<{ courseId: string }>`

Example of a server layout:

```tsx
"use server"

export default async function ExampleServerLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
```

Example of a server page (with async logic):

```tsx
"use server"

import { Suspense } from "react"
import { SomeAction } from "@/actions/some-actions"
import SomeComponent from "./_components/some-component"
import SomeSkeleton from "./_components/some-skeleton"

export default async function ExampleServerPage() {
  return (
    <Suspense fallback={<SomeSkeleton className="some-class" />}>
      <SomeComponentFetcher />
    </Suspense>
  )
}

async function SomeComponentFetcher() {
  const { data } = await SomeAction()
  return <SomeComponent className="some-class" initialData={data || []} />
}
```

Example of a server page (no async logic required):

```tsx
"use server"

import SomeClientComponent from "./_components/some-client-component"

// In this case, no asynchronous work is being done, so no Suspense or fallback is required.
export default async function ExampleServerPage() {
  return <SomeClientComponent initialData={[]} />
}
```

Example of a server component:

```tsx
"use server"

interface ExampleServerComponentProps {
  // Your props here
}

export async function ExampleServerComponent({
  props
}: ExampleServerComponentProps) {
  // Your code here
}
```

##### Client Components

- Use `"use client"` at the top of the file
- Client components can safely rely on props passed down from server components, or handle UI interactions without needing <Suspense> if there’s no async logic.
- Never use server actions in client components. If you need to create a new server action, create it in `/actions`

Example of a client page:

```tsx
"use client"

export default function ExampleClientPage() {
  // Your code here
}
```

Example of a client component:

```tsx
"use client"

interface ExampleClientComponentProps {
  initialData: any[]
}

export default function ExampleClientComponent({
  initialData
}: ExampleClientComponentProps) {
  // Client-side logic here
  return <div>{initialData.length} items</div>
}
```

### Backend Rules

Follow these rules when working on the backend.

It uses Postgres, Supabase, Drizzle ORM, and Server Actions.

#### General Rules

- Never generate migrations. You do not have to do anything in the `db/migrations` folder inluding migrations and metadata. Ignore it.

#### Organization

#### Schemas

- When importing schemas, use `@/db/schema`
- Name files like `example-schema.ts`
- All schemas should go in `db/schema`
- Make sure to export the schema in `db/schema/index.ts`
- Make sure to add the schema to the `schema` object in `db/db.ts`
- If using a userId, always use `userId: text("user_id").notNull()`
- Always include createdAt and updatedAt columns in all tables
- Make sure to cascade delete when necessary
- Use enums for columns that have a limited set of possible values such as:

```ts
import { pgEnum } from "drizzle-orm/pg-core"

export const membershipEnum = pgEnum("membership", ["free", "pro"])

membership: membershipEnum("membership").notNull().default("free")
```

Example of a schema:

`db/schema/todos-schema.ts`

```ts
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const todosTable = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertTodo = typeof todosTable.$inferInsert
export type SelectTodo = typeof todosTable.$inferSelect
```

And exporting it:

`db/schema/index.ts`

```ts
export * from "./todos-schema"
```

And adding it to the schema in `db/db.ts`:

`db/db.ts`

```ts
import { todosTable } from "@/db/schema"

const schema = {
  todos: todosTable
}
```

And a more complex schema:

```ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const chatsTable = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertChat = typeof chatsTable.$inferInsert
export type SelectChat = typeof chatsTable.$inferSelect
```

```ts
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { chatsTable } from "./chats-schema"

export const roleEnum = pgEnum("role", ["assistant", "user"])

export const messagesTable = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: uuid("chat_id")
    .references(() => chatsTable.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertMessage = typeof messagesTable.$inferInsert
export type SelectMessage = typeof messagesTable.$inferSelect
```

And exporting it:

`db/schema/index.ts`

```ts
export * from "./chats-schema"
export * from "./messages-schema"
```

And adding it to the schema in `db/db.ts`:

`db/db.ts`

```ts
import { chatsTable, messagesTable } from "@/db/schema"

const schema = {
  chats: chatsTable,
  messages: messagesTable
}
```

#### Server Actions

- When importing actions, use `@/actions` or `@/actions/db` if db related
- DB related actions should go in the `actions/db` folder
- Other actions should go in the `actions` folder
- Name files like `example-actions.ts`
- All actions should go in the `actions` folder
- Only write the needed actions
- Return an ActionState with the needed data type from actions
- Include Action at the end of function names `Ex: exampleFunction -> exampleFunctionAction`
- Actions should return a Promise<ActionState<T>>
- Sort in CRUD order: Create, Read, Update, Delete
- Make sure to return undefined as the data type if the action is not supposed to return any data
- **Date Handling:** For columns defined as `PgDateString` (or any date string type), always convert JavaScript `Date` objects to ISO strings using `.toISOString()` before performing operations (e.g., comparisons or insertions). This ensures value type consistency and prevents type errors.

```ts
export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never }
```

Example of an action:

`actions/db/todos-actions.ts`

```ts
"use server"

import { db } from "@/db/db"
import { InsertTodo, SelectTodo, todosTable } from "@/db/schema/todos-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createTodoAction(
  todo: InsertTodo
): Promise<ActionState<SelectTodo>> {
  try {
    const [newTodo] = await db.insert(todosTable).values(todo).returning()
    return {
      isSuccess: true,
      message: "Todo created successfully",
      data: newTodo
    }
  } catch (error) {
    console.error("Error creating todo:", error)
    return { isSuccess: false, message: "Failed to create todo" }
  }
}

export async function getTodosAction(
  userId: string
): Promise<ActionState<SelectTodo[]>> {
  try {
    const todos = await db.query.todos.findMany({
      where: eq(todosTable.userId, userId)
    })
    return {
      isSuccess: true,
      message: "Todos retrieved successfully",
      data: todos
    }
  } catch (error) {
    console.error("Error getting todos:", error)
    return { isSuccess: false, message: "Failed to get todos" }
  }
}

export async function updateTodoAction(
  id: string,
  data: Partial<InsertTodo>
): Promise<ActionState<SelectTodo>> {
  try {
    const [updatedTodo] = await db
      .update(todosTable)
      .set(data)
      .where(eq(todosTable.id, id))
      .returning()

    return {
      isSuccess: true,
      message: "Todo updated successfully",
      data: updatedTodo
    }
  } catch (error) {
    console.error("Error updating todo:", error)
    return { isSuccess: false, message: "Failed to update todo" }
  }
}

export async function deleteTodoAction(id: string): Promise<ActionState<void>> {
  try {
    await db.delete(todosTable).where(eq(todosTable.id, id))
    return {
      isSuccess: true,
      message: "Todo deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting todo:", error)
    return { isSuccess: false, message: "Failed to delete todo" }
  }
}
```

### Auth Rules

Follow these rules when working on auth.

It uses Clerk for authentication.

#### General Rules

- Import the auth helper with `import { auth } from "@clerk/nextjs/server"` in server components
- await the auth helper in server actions

### Payments Rules

Follow these rules when working on payments.

It uses Stripe for payments.

### Analytics Rules

Follow these rules when working on analytics.

It uses PostHog for analytics.

# Storage Rules

Follow these rules when working with Supabase Storage.

It uses Supabase Storage for file uploads, downloads, and management.

## General Rules

- Always use environment variables for bucket names to maintain consistency across environments
- Never hardcode bucket names in the application code
- Always handle file size limits and allowed file types at the application level
- Use the `upsert` method instead of `upload` when you want to replace existing files
- Always implement proper error handling for storage operations
- Use content-type headers when uploading files to ensure proper file handling

## Organization

### Buckets

- Name buckets in kebab-case: `user-uploads`, `profile-images`
- Create separate buckets for different types of files (e.g., `profile-images`, `documents`, `attachments`)
- Document bucket purposes in a central location
- Set appropriate bucket policies (public/private) based on access requirements
- Implement RLS (Row Level Security) policies for buckets that need user-specific access
- Make sure to let me know instructions for setting up RLS policies on Supabase since you can't do this yourself, including the SQL scripts I need to run in the editor

### File Structure

- Organize files in folders based on their purpose and ownership
- Use predictable, collision-resistant naming patterns
- Structure: `{bucket}/{userId}/{purpose}/{filename}`
- Example: `profile-images/123e4567-e89b/avatar/profile.jpg`
- Include timestamps in filenames when version history is important
- Example: `documents/123e4567-e89b/contracts/2024-02-13-contract.pdf`

## Actions

- When importing storage actions, use `@/actions/storage`
- Name files like `example-storage-actions.ts`
- Include Storage at the end of function names `Ex: uploadFile -> uploadFileStorage`
- Follow the same ActionState pattern as DB actions

Example of a storage action:

```ts
"use server"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ActionState } from "@/types"

export async function uploadFileStorage(
  bucket: string,
  path: string,
  file: File
): Promise<ActionState<{ path: string }>> {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: false,
        contentType: file.type
      })

    if (error) throw error

    return {
      isSuccess: true,
      message: "File uploaded successfully",
      data: { path: data.path }
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { isSuccess: false, message: "Failed to upload file" }
  }
}
```

## File Handling

### Upload Rules

- Always validate file size before upload
- Implement file type validation using both extension and MIME type
- Generate unique filenames to prevent collisions
- Set appropriate content-type headers
- Handle existing files appropriately (error or upsert)

Example validation:

```ts
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

function validateFile(file: File): boolean {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds limit")
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("File type not allowed")
  }

  return true
}
```

### Download Rules

- Always handle missing files gracefully
- Implement proper error handling for failed downloads
- Use signed URLs for private files

### Delete Rules

- Implement soft deletes when appropriate
- Clean up related database records when deleting files
- Handle bulk deletions carefully
- Verify ownership before deletion
- Always delete all versions/transforms of a file

## Security

### Bucket Policies

- Make buckets private by default
- Only make buckets public when absolutely necessary
- Use RLS policies to restrict access to authorized users
- Example RLS policy:

```sql
CREATE POLICY "Users can only access their own files"
ON storage.objects
FOR ALL
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### Access Control

- Generate short-lived signed URLs for private files
- Implement proper CORS policies
- Use separate buckets for public and private files
- Never expose internal file paths
- Validate user permissions before any operation

## Error Handling

- Implement specific error types for common storage issues
- Always provide meaningful error messages
- Implement retry logic for transient failures
- Log storage errors separately for monitoring

## Optimization

- Implement progressive upload for large files
- Clean up temporary files and failed uploads
- Use batch operations when handling multiple files
</project_rules>

<technical_specification>
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
</technical_specification>

<implementation_plan>
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
- [x] **Step 4: Equity Data Actions**
  - **Task**: Implement CRUD server actions for `equity_data` table, similar to `todos-actions.ts`. We’ll have `createEquityDataAction`, `getEquityDataByUserAction`, etc.
  - **Files**:
    - `actions/db/equity-data-actions.ts`: Add new CRUD actions.
    - `types/index.ts`: Possibly export new ActionState if needed, or reuse existing.
  - **Step Dependencies**: Steps 2–3
  - **User Instructions**: None

- [x] **Step 5: Conversation & Document Actions**
  - **Task**: Implement server actions for `conversations`, `messages`, and `documents` (upload, list, delete).
  - **Files**:
    - `actions/db/conversations-actions.ts`: Create or update a conversation, add messages, etc.
    - `actions/db/documents-actions.ts`: Insert doc reference, retrieve user docs, etc.
  - **Step Dependencies**: Steps 2–3
  - **User Instructions**: None

## Data Import & Scraping
- [x] **Step 6: Add Data Import Route & Manual Input**
  - **Task**: Create a new route in `app/(protected)/data-import/` with a page that allows manual equity input. Also list the user’s existing equity data with read, update, and delete actions.
  - **Files**:
    - `app/(auth)/layout.tsx`: Possibly reference new route in some nav if needed.
    - `app/(protected)/data-import/page.tsx`: The server page that fetches user’s equity data and displays a client subcomponent for input.
    - `app/(protected)/data-import/_components/manual-entry-form.tsx`: A new client component to handle manual input using `createEquityDataAction`.
  - **Step Dependencies**: Steps 1–5
  - **User Instructions**: None

- [x] **Step 7: CSV Upload & Parsing**
  - **Task**: Implement CSV import. Provide a simple file input, parse on server side, store in DB. 
  - **Files**:
    - `app/(protected)/data-import/_components/csv-uploader.tsx`: Client side file input. Calls a server action to parse CSV (or we do it in a route action).
    - `actions/db/equity-data-actions.ts`: Possibly add a `parseCsvAction`.
  - **Step Dependencies**: Step 6
  - **User Instructions**: None

- [x] **Step 8: Carta Scraping Stub**
  - **Task**: Implement a stub for Selenium-based scraping from Carta. We’ll store user credentials securely, then let a server action handle the scraping. For now, just a placeholder returning mock data.
  - **Files**:
    - `actions/scraping-actions.ts`: `scrapeCartaData(userId, credentials)`
    - `app/(protected)/data-import/_components/credential-input.tsx`: A form for user to input Carta credentials, calls the scraping action.
  - **Step Dependencies**: Steps 1–7
  - **User Instructions**: If real scraping is needed, user must set up Selenium environment on the server.

## Chatbot Core
- [x] **Step 9: Basic Chat Interface & Conversation Flow**
  - **Task**: Add a new route `app/(protected)/chat/` for the chatbot interface. Let user see prior messages, post new ones, store them in DB. We can mock GPT-4o or use an external LLM. 
  - **Files**:
    - `app/(protected)/chat/page.tsx`: Server page for chat. Possibly displays `<ChatInterface />` client component.
    - `app/(protected)/chat/_components/chat-interface.tsx`: Basic input, streaming messages from a server action that calls an LLM.
    - `actions/chat-actions.ts`: `sendMessageAction` to store user message, call GPT, store response.
  - **Step Dependencies**: Steps 1–5
  - **User Instructions**: Must add real LLM API if needed. Provide environment variable for GPT-4o or custom model.

- [x] **Step 10: PDF & Image Upload Integration**
  - **Task**: Let user upload documents (pdf or screenshots) to reference in chat context. Save in `documents` table, store file in Supabase Storage, reference them in the chat. 
  - **Files**:
    - `actions/storage/storage-actions.ts`: For uploading to Supabase Storage.
    - `app/(protected)/chat/_components/document-uploader.tsx`: UI for doc upload. 
    - Possibly update `chat-interface.tsx` to pass doc references to LLM.
  - **Step Dependencies**: Steps 1–9
  - **User Instructions**: If private storage, user must set RLS policies in Supabase. Provide the script or instructions for setting that.

## Insights & Simulations
- [x] **Step 11: Actionable Insights & Recommendations**
  - **Task**: Using user’s equity_data, provide guidance on vesting schedule, tax considerations, etc. Basic placeholders for MVP (like “You have 3 months to exercise,” etc.). 
  - **Files**:
    - `actions/insights-actions.ts`: Possibly an action to compute recommendations from user’s data.
    - `app/(protected)/chat/_components/chat-interface.tsx`: Modify to incorporate these insights in the LLM prompt or direct UI.
  - **Step Dependencies**: Steps 1–10
  - **User Instructions**: These calculations are simplistic for MVP. Future expansions can handle complex logic.

- [x] **Step 12: Personalized “What-If” Simulations**
  - **Task**: Provide a small UI so user can input a hypothetical new valuation, or changes in vesting. Display results in real-time. 
  - **Files**:
    - `app/(protected)/simulations/page.tsx`: Server page with a `<SimulationsPanel />` client component for interactive scenario modeling.
    - `actions/simulations-actions.ts`: Possibly an action that calculates updated outcomes.
  - **Step Dependencies**: Steps 1–11
  - **User Instructions**: None

## Admin Tooling
- [x] **Step 13: Admin Dashboard**
  - **Task**: Add an `(admin)/` route that shows conversation logs, allows rating or providing feedback to LLM. 
  - **Files**:
    - `app/(admin)/layout.tsx`: Possibly a separate layout if needed.
    - `app/(admin)/page.tsx`: Overviews convos, uses `getAllConversationsAction`.
    - `admin/_components/conversation-list.tsx`: For listing convos. 
  - **Step Dependencies**: Steps 9–10
  - **User Instructions**: Only allow certain Clerk user IDs or membership to see this. Possibly we handle a role check.

## Advanced Admin Features
- [x] **Step 14: Admin Dashboard Pt. 2**

  **Task**: Provide deeper administrative capabilities:
  1. **Conversation Rating**  
    - Add a modal or detail view that allows admins to open a conversation and review its messages.
    - Provide a simple thumbs-up/thumbs-down rating control.
    - Include a free-text critique area for admins to leave written feedback.
  2. **Prompt Iteration**  
    - Let admins see a list of system prompts or templates used by the chatbot.
    - Store historical prompt revisions for auditing or rollback; label one revision as the current “active” prompt.
    - Allow admins to switch which revision is active at any time.
  3. **Conversation Content Drilling**  
    - Provide a search or filter mechanism for conversation text, user ID, or date range so admins can quickly locate specific content.

  ---

  **Files** (subject to change based on your existing structure):
  - `app/(admin)/conversations/[conversationId]/page.tsx`  
    - Displays a single conversation’s messages.
    - Offers a rating control and critique text input, or a button that opens a rating modal.
  - `app/(admin)/_components/conversation-feedback-modal.tsx`  
    - A new client component to gather thumbs up/down and critique text from the admin.
  - `app/(admin)/prompts/page.tsx`  
    - Lists all prompt revisions, allows editing an existing revision or creating a new one, and toggling which is active.
  - `actions/db/admin-actions.ts` or `actions/db/feedback-actions.ts`  
    - For saving ratings/critiques to the database (if you prefer a new `conversation_feedback` table).
  - `actions/db/prompts-actions.ts`  
    - For storing prompt revisions, retrieving them, marking one as active, etc.
  - `db/schema/feedback-schema.ts` (optional)  
    - If you store conversation feedback in a separate table (see the example in the expanded admin instructions).
  - `db/schema/prompts-schema.ts` (optional)  
    - If you store prompt revisions in the database.

  ---

  **Step Dependencies**:  
  - Step 9 and Step 10 (for the basic Chat UI, so that admin can see conversation content).  
  - Step 13 (for the initial Admin Dashboard layout).

  ---

  **User Instructions**:
  1. **Database Setup**:
    - If using separate tables, add a `conversation_feedback` table to store rating/critique.  
    - Optionally create a `prompts` table to store prompt revisions.  
    - Update and run your migrations.

  2. **Server Actions**:
    - Create new actions (`actions/db/feedback-actions.ts`) for creating/updating conversation feedback.  
    - Create new actions (`actions/db/prompts-actions.ts`) for listing, creating, updating, and activating prompt revisions.

  3. **Admin Routes & UI**:
    - In `(admin)/conversations/[conversationId]/page.tsx`, display conversation content and add a rating/feedback form or button to open a modal.  
    - Create `(admin)/_components/conversation-feedback-modal.tsx` for collecting thumbs up/down and text feedback.  
    - In `(admin)/prompts/page.tsx`, build a list of stored prompt revisions, plus a form to edit or create a new revision. Provide a toggle/checkbox or similar control to designate a prompt as the active one.

  4. **Testing**:
    - Log in as an admin, navigate to an existing conversation, add a rating and critique.  
    - Verify data is stored correctly in the database or state.  
    - Update a system prompt or set a new prompt as active, then confirm in logs or direct usage that the chatbot uses that updated prompt.

  5. **Security**:
    - Ensure only authorized admins can access `(admin)/` routes.  
    - Possibly store an `isAdmin` boolean in `profiles` or only allow certain user IDs.  
    - Validate all user input for rating or prompt changes server-side.

  6. **Deployment**:
    - Redeploy after adding new DB schema and verifying local tests or staging environment. 


- **Implementation Details**:
  1. **Database Enhancements**  
     - **Option A**: Create a new table `conversation_feedback` with columns:
       - `id (uuid, PK)`
       - `conversation_id (uuid)` referencing `conversations(id)` with `onDelete: "cascade"`
       - `rating (int or enum)` – e.g., 1–5 stars or thumbs up/down
       - `notes (text)` for additional comments
       - `created_at, updated_at`
     - **Option B**: Add a `rating` column to `conversations` or `messages` directly.  
     - **Prompt Storage**:  
       - If you want admin-edited system prompts stored in DB rather than in files, create a `prompts` table:
         - `id (uuid, PK)`
         - `name (text)` – e.g. "system-prompt"
         - `content (text)` – the actual prompt text
         - `created_at, updated_at`
       - Or keep prompts in code/files and have the admin update a config file (less recommended for real-time changes).
  2. **Server Actions**  
     - **`createOrUpdateConversationFeedbackAction(conversationId, rating, notes?)`**: Insert or update a feedback entry.  
     - **`getConversationFeedbackAction(conversationId)`**: Retrieve feedback for a specific conversation.  
     - **`createOrUpdatePromptAction(promptName, content)`**: If storing prompts in DB, let admins edit them.  
     - **`getAllPromptsAction()`** or **`getPromptByNameAction(name)`**: Retrieve current system prompts for display.  
  3. **Admin UI**  
     - **Conversation List** (already done in Step 13) can include a “Rate” or “Feedback” button that opens:
       - A feedback modal or page to submit rating/notes.
       - A summary of existing feedback for that conversation.  
     - **Conversation Drilling**:  
       - A new route e.g. `app/(admin)/conversations/[conversationId]/page.tsx` that shows all messages.  
       - Provide a search box or filter by user ID, date, or keyword.  
     - **Prompt Iteration**:  
       - A new route `app/(admin)/prompts/page.tsx` listing all system prompts from DB (or a note if using files).
       - Let admins edit the prompt text in a text area, then call `updatePromptAction`.
       - Possibly show revision history or an “active” flag.  

  - **Step Dependencies**: Step 13 (basic Admin Dashboard)  
  - **User Instructions**:
    1. **Add** the DB changes (new `conversation_feedback` table or columns, plus optional `prompts` table).
    2. **Create** the new server actions for conversation feedback and prompt storage if you choose the DB approach.
    3. **Enhance** the `(admin)/page.tsx` or create new sub-routes for a detail view. E.g.:
      - `(admin)/conversations/[conversationId]/page.tsx` for drilling into messages.
      - `(admin)/prompts/page.tsx` for editing system prompts.
    4. **Update** the UI to show “rating” or “feedback” buttons, and a dedicated “prompts” admin page if needed.
    5. **Test** end-to-end by logging in as a “pro” user, going to `/admin`, rating a conversation, and verifying data changes in the DB (or in your file-based prompt config, if relevant).
    6. **Secure** these admin routes further if you want only certain user IDs (besides membership=“pro”) to see them. Possibly store an isAdmin boolean in the `profiles` table.

- [ ] **Step 15: Enhanced Chat Experience**

  **Task**: Expand the chat UI with a sidebar of recent conversations, a “New Chat” button, file upload button in the chat input, and a server action that integrates with OpenAI’s GPT-4o model.

  1. **Sidebar Conversation History**
     - Displays a list of the user’s recent conversations (title can be “Conversation 1,” etc. or show partial content).
     - Allows the user to switch between conversations by clicking on one.

  2. **New Chat Button**
     - A button at the top of the sidebar that triggers creation of a new conversation (via `createConversationAction`) and then navigates to that conversation.

  3. **File Upload in Chat Input**
     - Next to the message input box, add an icon button for uploading PDF/image files.
     - On upload, we call the same `uploadDocumentStorage` we’ve used in the code base, then attach the newly created doc to the conversation context (the simplest approach is to store the doc ID in the conversation or mention it in the messages).

  4. **Integration with OpenAI GPT-4o**  
     - Create a new server action (`sendOpenAIMessageAction`) that calls the OpenAI API using the user’s prompt, plus any uploaded doc references.
     - The “multi-modal” aspect is conceptual for now. We’ll pass doc references or partial text to the model in a system prompt, or you could store them in the conversation.  
     - Return the AI’s response, store it in the `messages` table as role=“assistant.”

  5. **Routing**  
     - Possibly update `(protected)/chat/[conversationId]/page.tsx` so that each conversation is its own route, or keep it single-page with local state.  
     - For the sidebar approach, we might place the `<Sidebar>` in the `layout.tsx` for `(protected)/chat/`, and pass down conversation ID through search params or dynamic route.
  
  **Step Dependencies**: Steps 1–14 (particularly Step 9 for basic chat).  

  **User Instructions**:  
   1. Provide your OpenAI API key in `.env.local` as `OPENAI_API_KEY`.  
   2. Confirm the user interface updates appear in the chat route with the conversation list on the left and chat on the right.  
   3. Test uploading PDFs or images from the chat input, confirm they appear as relevant context in messages.  
   4. Validate that new chat creation works, and old conversations can be re-accessed from the sidebar.  
   5. Confirm that AI responses come from GPT-4o per your configuration.  


## Stripe & Payments
- [ ] **Step 16: Stripe Integration for Premium**
  - **Task**: Gate certain advanced features (ex: advanced chatbot, doc uploads, or simulation) behind membership=“pro”. We have partial code, so we confirm it works, including webhooks. 
  - **Files**:
    - `actions/stripe-actions.ts`: Confirm or add logic for gating. 
    - `middleware.ts`: Possibly check membership for certain routes. 
    - `app/(marketing)/pricing/page.tsx`: Ensure user can upgrade, set membership=“pro”.
  - **Step Dependencies**: Steps 1–13
  - **User Instructions**: Must set Stripe env variables, then run a test checkout to confirm.

## Testing & Misc
- [ ] **Step 17: Testing & QA**
  - **Task**: Add unit tests for server actions (Jest) and integration/E2E tests for critical flows (Playwright or Cypress). 
  - **Files**:
    - `__tests__` folder: e.g. `actions/db/equity-data-actions.test.ts`.
    - Possibly additional config in `package.json`.
  - **Step Dependencies**: Steps 1–14
  - **User Instructions**: Run `npm test` or configured test commands. Provide instructions if we do E2E or require Docker for ephemeral DB.

- [ ] **Step 18: Final Cleanup & Documentation**
  - **Task**: Polish the code, update readme, handle leftover edges. Double-check error states, flows for incomplete data, disclaimers for legal/tax disclaimers, etc.
  - **Files**:
    - `README.md`: Update usage instructions with final details.
    - Possibly small tweaks across the codebase for finishing touches.
  - **Step Dependencies**: All above
  - **User Instructions**: Deploy to Vercel, set environment variables, done.


## Summary
This plan outlines the full implementation process for EquiChat, starting from environment config and database schemas, building server actions, creating data import pages, hooking up the chatbot with multi-modal doc context, adding insights and simulations, building admin tooling, implementing Stripe payments for premium features, and concluding with thorough testing and documentation. Each step is atomic and includes references to the files to modify, so an iterative code generation system can implement them in order without conflicts, ensuring a structured approach to building EquiChat from MVP to advanced features.
</implementation_plan>

<existing_code>
<file_map>
/Users/drew/dev/app-template
├── actions
│   ├── db
│   │   ├── conversation-actions.ts
│   │   ├── documents-actions.ts
│   │   ├── equity-data-actions.ts
│   │   ├── feedback-actions.ts
│   │   ├── profiles-actions.ts
│   │   ├── prompts-actions.ts
│   │   └── todos-actions.ts
│   ├── storage
│   │   └── storage-actions.ts
│   ├── chat-actions.ts
│   ├── insights-actions.ts
│   ├── scraping-actions.ts
│   ├── simulation-actions.ts
│   └── stripe-actions.ts
├── app
│   ├── (admin)
│   │   ├── _components
│   │   │   └── conversation-list.tsx
│   │   ├── conversations
│   │   │   └── [conversationId]
│   │   │       ├── _compontents
│   │   │       │   └── conversation-feedback-modal.tsx
│   │   │       └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (auth)
│   │   ├── login
│   │   │   └── [[...login]]
│   │   │       └── page.tsx
│   │   ├── signup
│   │   │   └── [[...signup]]
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── (marketing)
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── pricing
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (protected)
│   │   ├── chat
│   │   │   ├── _components
│   │   │   │   ├── chat-interface.tsx
│   │   │   │   └── document-uploader.tsx
│   │   │   └── page.tsx
│   │   ├── data-import
│   │   │   ├── _components
│   │   │   │   ├── credential-input.tsx
│   │   │   │   ├── csv-uploader.tsx
│   │   │   │   ├── equity-data-table.tsx
│   │   │   │   └── manual-entry-form.tsx
│   │   │   └── page.tsx
│   │   └── simulations
│   │       ├── _components
│   │       │   └── simulations-panel.tsx
│   │       └── page.tsx
│   ├── api
│   │   └── stripe
│   │       └── webhooks
│   │           └── route.ts
│   ├── todo
│   │   ├── _components
│   │   │   └── todo-list.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components
│   ├── landing
│   │   ├── features.tsx
│   │   └── hero.tsx
│   ├── magicui
│   │   ├── animated-gradient-text.tsx
│   │   └── hero-video-dialog.tsx
│   ├── sidebar
│   │   ├── app-sidebar.tsx
│   │   ├── nav-main.tsx
│   │   ├── nav-projects.tsx
│   │   ├── nav-user.tsx
│   │   └── team-switcher.tsx
│   ├── utilities
│   │   ├── posthog
│   │   │   ├── posthog-pageview.tsx
│   │   │   ├── posthog-provider.tsx
│   │   │   └── posthog-user-identity.tsx
│   │   ├── providers.tsx
│   │   ├── tailwind-indicator.tsx
│   │   └── theme-switcher.tsx
│   └── header.tsx
├── db
│   ├── schema
│   │   ├── conversations-schema.ts
│   │   ├── documents-schema.ts
│   │   ├── equity-schema.ts
│   │   ├── feedback-schema.ts
│   │   ├── index.ts
│   │   ├── profiles-schema.ts
│   │   ├── prompts-schema.ts
│   │   └── todos-schema.ts
│   └── db.ts
├── hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib
│   ├── hooks
│   │   ├── use-copy-to-clipboard.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── stripe.ts
│   └── utils.ts
├── types
│   ├── index.ts
│   └── server-action-types.ts
├── .eslintrc.json
├── components.json
├── drizzle.config.ts
├── license
├── middleware.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── prettier.config.cjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

</file_map>

<file_contents>
File: actions/stripe-actions.ts
```ts
/*
<ai_context>
Contains server actions related to Stripe.
</ai_context>
*/

import {
  updateProfileAction,
  updateProfileByStripeCustomerIdAction
} from "@/actions/db/profiles-actions"
import { SelectProfile } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

type MembershipStatus = SelectProfile["membership"]

const getMembershipStatus = (
  status: Stripe.Subscription.Status,
  membership: MembershipStatus
): MembershipStatus => {
  switch (status) {
    case "active":
    case "trialing":
      return membership
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
    case "past_due":
    case "paused":
    case "unpaid":
      return "free"
    default:
      return "free"
  }
}

const getSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"]
  })
}

export const updateStripeCustomer = async (
  userId: string,
  subscriptionId: string,
  customerId: string
) => {
  try {
    if (!userId || !subscriptionId || !customerId) {
      throw new Error("Missing required parameters for updateStripeCustomer")
    }

    const subscription = await getSubscription(subscriptionId)

    const result = await updateProfileAction(userId, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id
    })

    if (!result.isSuccess) {
      throw new Error("Failed to update customer profile")
    }

    return result.data
  } catch (error) {
    console.error("Error in updateStripeCustomer:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update Stripe customer")
  }
}

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  productId: string
): Promise<MembershipStatus> => {
  try {
    if (!subscriptionId || !customerId || !productId) {
      throw new Error(
        "Missing required parameters for manageSubscriptionStatusChange"
      )
    }

    const subscription = await getSubscription(subscriptionId)
    const product = await stripe.products.retrieve(productId)
    const membership = product.metadata.membership as MembershipStatus

    if (!["free", "pro"].includes(membership)) {
      throw new Error(
        `Invalid membership type in product metadata: ${membership}`
      )
    }

    const membershipStatus = getMembershipStatus(
      subscription.status,
      membership
    )

    const updateResult = await updateProfileByStripeCustomerIdAction(
      customerId,
      {
        stripeSubscriptionId: subscription.id,
        membership: membershipStatus
      }
    )

    if (!updateResult.isSuccess) {
      throw new Error("Failed to update subscription status")
    }

    return membershipStatus
  } catch (error) {
    console.error("Error in manageSubscriptionStatusChange:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update subscription status")
  }
}

```

File: actions/db/profiles-actions.ts
```ts
/*
<ai_context>
Contains server actions related to profiles in the DB.
</ai_context>
*/

"use server"

import { db } from "@/db/db"
import {
  InsertProfile,
  profilesTable,
  SelectProfile
} from "@/db/schema/profiles-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createProfileAction(
  data: InsertProfile
): Promise<ActionState<SelectProfile>> {
  try {
    const [newProfile] = await db.insert(profilesTable).values(data).returning()
    return {
      isSuccess: true,
      message: "Profile created successfully",
      data: newProfile
    }
  } catch (error) {
    console.error("Error creating profile:", error)
    return { isSuccess: false, message: "Failed to create profile" }
  }
}

export async function getProfileByUserIdAction(
  userId: string
): Promise<ActionState<SelectProfile>> {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId)
    })
    if (!profile) {
      return { isSuccess: false, message: "Profile not found" }
    }

    return {
      isSuccess: true,
      message: "Profile retrieved successfully",
      data: profile
    }
  } catch (error) {
    console.error("Error getting profile by user id", error)
    return { isSuccess: false, message: "Failed to get profile" }
  }
}

export async function updateProfileAction(
  userId: string,
  data: Partial<InsertProfile>
): Promise<ActionState<SelectProfile>> {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.userId, userId))
      .returning()

    if (!updatedProfile) {
      return { isSuccess: false, message: "Profile not found to update" }
    }

    return {
      isSuccess: true,
      message: "Profile updated successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { isSuccess: false, message: "Failed to update profile" }
  }
}

export async function updateProfileByStripeCustomerIdAction(
  stripeCustomerId: string,
  data: Partial<InsertProfile>
): Promise<ActionState<SelectProfile>> {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.stripeCustomerId, stripeCustomerId))
      .returning()

    if (!updatedProfile) {
      return {
        isSuccess: false,
        message: "Profile not found by Stripe customer ID"
      }
    }

    return {
      isSuccess: true,
      message: "Profile updated by Stripe customer ID successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating profile by stripe customer ID:", error)
    return {
      isSuccess: false,
      message: "Failed to update profile by Stripe customer ID"
    }
  }
}

export async function deleteProfileAction(
  userId: string
): Promise<ActionState<void>> {
  try {
    await db.delete(profilesTable).where(eq(profilesTable.userId, userId))
    return {
      isSuccess: true,
      message: "Profile deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting profile:", error)
    return { isSuccess: false, message: "Failed to delete profile" }
  }
}

```

File: actions/db/todos-actions.ts
```ts
/*
<ai_context>
Contains server actions related to todos in the DB.
</ai_context>
*/

"use server"

import { db } from "@/db/db"
import { InsertTodo, SelectTodo, todosTable } from "@/db/schema/todos-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createTodoAction(
  todo: InsertTodo
): Promise<ActionState<SelectTodo>> {
  try {
    const [newTodo] = await db.insert(todosTable).values(todo).returning()
    return {
      isSuccess: true,
      message: "Todo created successfully",
      data: newTodo
    }
  } catch (error) {
    console.error("Error creating todo:", error)
    return { isSuccess: false, message: "Failed to create todo" }
  }
}

export async function getTodosAction(
  userId: string
): Promise<ActionState<SelectTodo[]>> {
  try {
    const todos = await db.query.todos.findMany({
      where: eq(todosTable.userId, userId)
    })
    return {
      isSuccess: true,
      message: "Todos retrieved successfully",
      data: todos
    }
  } catch (error) {
    console.error("Error getting todos:", error)
    return { isSuccess: false, message: "Failed to get todos" }
  }
}

export async function updateTodoAction(
  id: string,
  data: Partial<InsertTodo>
): Promise<ActionState<SelectTodo>> {
  try {
    const [updatedTodo] = await db
      .update(todosTable)
      .set(data)
      .where(eq(todosTable.id, id))
      .returning()

    return {
      isSuccess: true,
      message: "Todo updated successfully",
      data: updatedTodo
    }
  } catch (error) {
    console.error("Error updating todo:", error)
    return { isSuccess: false, message: "Failed to update todo" }
  }
}

export async function deleteTodoAction(id: string): Promise<ActionState<void>> {
  try {
    await db.delete(todosTable).where(eq(todosTable.id, id))
    return {
      isSuccess: true,
      message: "Todo deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting todo:", error)
    return { isSuccess: false, message: "Failed to delete todo" }
  }
}

```

File: app/(auth)/signup/[[...signup]]/page.tsx
```tsx
/*
<ai_context>
This client page provides the signup form from Clerk.
</ai_context>
*/

"use client"

import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export default function SignUpPage() {
  const { theme } = useTheme()

  return (
    <SignUp
      forceRedirectUrl="/todo"
      appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
    />
  )
}

```

File: app/(marketing)/contact/page.tsx
```tsx
/*
<ai_context>
This server page returns a simple "Contact Page" component as a (marketing) route.
</ai_context>
*/

"use server"

export default async function ContactPage() {
  return <div>Contact Page</div>
}

```

File: app/(marketing)/about/page.tsx
```tsx
/*
<ai_context>
This server page returns a simple "About Page" component as a (marketing) route.
</ai_context>
*/

"use server"

export default async function AboutPage() {
  return <div>About Page</div>
}

```

File: app/(marketing)/layout.tsx
```tsx
/*
<ai_context>
This server layout provides a shared header and basic structure for (marketing) routes.
</ai_context>
*/

"use server"

import Header from "@/components/header"

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1">{children}</div>
    </div>
  )
}

```

File: app/(marketing)/page.tsx
```tsx
/*
<ai_context>
This server page is the marketing homepage.
</ai_context>
*/

"use server"

import { FeaturesSection } from "@/components/landing/features"
import { HeroSection } from "@/components/landing/hero"

export default async function HomePage() {
  return (
    <div className="pb-20">
      <HeroSection />
      {/* social proof */}
      <FeaturesSection />
      {/* pricing */}
      {/* faq */}
      {/* blog */}
      {/* footer */}
    </div>
  )
}

```

File: app/(marketing)/pricing/page.tsx
```tsx
/*
<ai_context>
This server page displays pricing options for the product, integrating Stripe payment links.
</ai_context>
*/

"use server"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"

export default async function PricingPage() {
  const { userId } = await auth()

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Choose Your Plan</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <PricingCard
          title="Monthly Plan"
          price="$10"
          description="Billed monthly"
          buttonText="Subscribe Monthly"
          buttonLink={
            process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY || "#"
          }
          userId={userId}
        />
        <PricingCard
          title="Yearly Plan"
          price="$100"
          description="Billed annually"
          buttonText="Subscribe Yearly"
          buttonLink={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY || "#"}
          userId={userId}
        />
      </div>
    </div>
  )
}

interface PricingCardProps {
  title: string
  price: string
  description: string
  buttonText: string
  buttonLink: string
  userId: string | null
}

function PricingCard({
  title,
  price,
  description,
  buttonText,
  buttonLink,
  userId
}: PricingCardProps) {
  const finalButtonLink = userId
    ? `${buttonLink}?client_reference_id=${userId}`
    : buttonLink

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex grow items-center justify-center">
        <p className="text-4xl font-bold">{price}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <a
            href={finalButtonLink}
            className={cn(
              "inline-flex items-center justify-center",
              finalButtonLink === "#" && "pointer-events-none opacity-50"
            )}
          >
            {buttonText}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

```

File: app/(auth)/login/[[...login]]/page.tsx
```tsx
/*
<ai_context>
This client page provides the login form from Clerk.
</ai_context>
*/

"use client"

import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export default function LoginPage() {
  const { theme } = useTheme()

  return (
    <SignIn
      forceRedirectUrl="/todo"
      appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
    />
  )
}

```

File: app/api/stripe/webhooks/route.ts
```ts
/*
<ai_context>
This API route handles Stripe webhook events to manage subscription status changes and updates user profiles accordingly.
</ai_context>
*/

import {
  manageSubscriptionStatusChange,
  updateStripeCustomer
} from "@/actions/stripe-actions"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted"
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get("Stripe-Signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret) {
      throw new Error("Webhook secret or signature missing")
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await handleSubscriptionChange(event)
          break

        case "checkout.session.completed":
          await handleCheckoutSession(event)
          break

        default:
          throw new Error("Unhandled relevant event!")
      }
    } catch (error) {
      console.error("Webhook handler failed:", error)
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400
        }
      )
    }
  }

  return new Response(JSON.stringify({ received: true }))
}

async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const productId = subscription.items.data[0].price.product as string
  await manageSubscriptionStatusChange(
    subscription.id,
    subscription.customer as string,
    productId
  )
}

async function handleCheckoutSession(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session
  if (checkoutSession.mode === "subscription") {
    const subscriptionId = checkoutSession.subscription as string
    await updateStripeCustomer(
      checkoutSession.client_reference_id as string,
      subscriptionId,
      checkoutSession.customer as string
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"]
    })

    const productId = subscription.items.data[0].price.product as string
    await manageSubscriptionStatusChange(
      subscription.id,
      subscription.customer as string,
      productId
    )
  }
}

```

File: app/todo/_components/todo-list.tsx
```tsx
/*
<ai_context>
This client component renders a Todo list with add, toggle, and delete functionality.
</ai_context>
*/

"use client"

import {
  createTodoAction,
  deleteTodoAction,
  updateTodoAction
} from "@/actions/db/todos-actions"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { SelectTodo } from "@/db/schema"
import { Trash2 } from "lucide-react"
import { useState } from "react"

interface TodoListProps {
  userId: string
  initialTodos: SelectTodo[]
}

export function TodoList({ userId, initialTodos }: TodoListProps) {
  const [newTodo, setNewTodo] = useState("")
  const [todos, setTodos] = useState(initialTodos)

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      const newTodoData = {
        id: Date.now().toString(),
        userId,
        content: newTodo,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setTodos(prevTodos => [...prevTodos, newTodoData])
      setNewTodo("")

      const result = await createTodoAction({
        userId: userId,
        content: newTodo,
        completed: false
      })
      if (result.isSuccess) {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === newTodoData.id ? result.data : todo
          )
        )
      } else {
        console.error("Error creating todo:", result.message)
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== newTodoData.id)
        )
      }
    }
  }

  const handleToggleTodo = async (id: string, completed: boolean) => {
    console.log("handleToggleTodo", id, completed)
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    )

    await updateTodoAction(id, { completed: !completed })
  }

  const handleRemoveTodo = async (id: string) => {
    console.log("handleRemoveTodo", id)
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))

    await deleteTodoAction(id)
  }

  return (
    <div className="bg-card mx-auto mt-8 max-w-md rounded-lg p-6 shadow">
      <h1 className="mb-4 text-center text-2xl font-bold">Todo App</h1>

      <div className="mb-4 flex">
        <Input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="mr-2"
          onKeyPress={e => e.key === "Enter" && handleAddTodo()}
        />
        <Button onClick={handleAddTodo}>Add</Button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="bg-muted flex items-center justify-between rounded p-2"
          >
            <div className="flex items-center">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() =>
                  handleToggleTodo(todo.id, todo.completed)
                }
                className="mr-2"
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`${todo.completed ? "text-muted-foreground line-through" : ""}`}
              >
                {todo.content}
              </label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveTodo(todo.id)}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete todo</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

```

File: app/todo/layout.tsx
```tsx
/*
<ai_context>
This server layout provides a sidebar and breadcrumb navigation for the todo route. It wraps the todo page and its children.
</ai_context>
*/

"use server"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"

export default async function TodoLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Todos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

```

File: app/layout.tsx
```tsx
/*
<ai_context>
The root server layout for the app.
</ai_context>
*/

import {
  createProfileAction,
  getProfileByUserIdAction
} from "@/actions/db/profiles-actions"
import { Toaster } from "@/components/ui/toaster"
import { PostHogPageview } from "@/components/utilities/posthog/posthog-pageview"
import { PostHogUserIdentify } from "@/components/utilities/posthog/posthog-user-identity"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mckay's App Template",
  description: "A full-stack web app template."
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (userId) {
    const profileRes = await getProfileByUserIdAction(userId)
    if (!profileRes.isSuccess) {
      await createProfileAction({ userId })
    }
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "bg-background mx-auto min-h-screen w-full scroll-smooth antialiased",
            inter.className
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <PostHogUserIdentify />
            <PostHogPageview />

            {children}

            <TailwindIndicator />

            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}

```

File: app/globals.css
```css
/*
<ai_context>
Global styles for the app.
</ai_context>
*/

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

```

File: app/todo/page.tsx
```tsx
/*
<ai_context>
This server page retrieves user todos from the database and renders them in a list.
</ai_context>
*/

"use server"

import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { getTodosAction } from "@/actions/db/todos-actions"
import { TodoList } from "@/app/todo/_components/todo-list"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function TodoPage() {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/login")
  }

  const { data: profile } = await getProfileByUserIdAction(userId)

  if (!profile) {
    return redirect("/signup")
  }

  if (profile.membership === "free") {
    return redirect("/pricing")
  }

  const todos = await getTodosAction(userId)

  return (
    <div className="flex-1 p-4 pt-0">
      <TodoList userId={userId} initialTodos={todos.data ?? []} />
    </div>
  )
}

```

File: components/landing/features.tsx
```tsx
/*
<ai_context>
This client component provides the features section for the landing page.
</ai_context>
*/

"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  AppWindow,
  Database,
  DollarSign,
  LucideIcon,
  Shield
} from "lucide-react"

interface FeatureProps {
  title: string
  description: string
  icon: LucideIcon
}

const features: FeatureProps[] = [
  {
    title: "Frontend",
    description: "Next.js, Tailwind, Shadcn, Framer Motion",
    icon: AppWindow
  },
  {
    title: "Backend",
    description: "Postgres, Supabase, Drizzle ORM, Server Actions",
    icon: Database
  },
  {
    title: "Auth",
    description: "Clerk",
    icon: Shield
  },
  {
    title: "Payments",
    description: "Stripe",
    icon: DollarSign
  }
]

const FeatureCard = ({ title, description, icon: Icon }: FeatureProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="transform-gpu"
  >
    <Card className="group transition-shadow duration-200 hover:shadow-lg">
      <CardHeader>
        <Icon className="text-primary mb-2 size-12" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </motion.div>
)

export const FeaturesSection = () => {
  return (
    <section className="mt-20 bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="mb-12 text-center text-4xl font-bold">Tech Stack</h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

```

File: components/landing/hero.tsx
```tsx
/*
<ai_context>
This client component provides the hero section for the landing page.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ChevronRight, Rocket } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"
import AnimatedGradientText from "../magicui/animated-gradient-text"
import HeroVideoDialog from "../magicui/hero-video-dialog"

export const HeroSection = () => {
  const handleGetStartedClick = () => {
    posthog.capture("clicked_get_started")
  }

  return (
    <div className="flex flex-col items-center justify-center px-8 pt-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <Link href="https://github.com/mckaywrigley/mckays-app-template">
          <AnimatedGradientText>
            🚀 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />
            <span
              className={cn(
                `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
              )}
            >
              View the code on GitHub
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="mt-8 flex max-w-2xl flex-col items-center justify-center gap-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-balance text-6xl font-bold"
        >
          Save time and start building.
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="max-w-xl text-balance text-xl"
        >
          Use Mckay's app template to save time and get started with your next
          project.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <Link
            href="https://github.com/mckaywrigley/mckays-app-template"
            onClick={handleGetStartedClick}
          >
            <Button className="bg-blue-500 text-lg hover:bg-blue-600">
              <Rocket className="mr-2 size-5" />
              Get Started &rarr;
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        className="mx-auto mt-20 flex w-full max-w-screen-lg items-center justify-center rounded-lg border shadow-lg"
      >
        <HeroVideoDialog
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/9yS0dR0kP-s"
          thumbnailSrc="hero.png"
          thumbnailAlt="Hero Video"
        />
      </motion.div>
    </div>
  )
}

```

File: components/magicui/animated-gradient-text.tsx
```tsx
/*
<ai_context>
This client component provides an animated gradient text.
</ai_context>
*/

import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export default function AnimatedGradientText({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/40 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-black/40",
        className
      )}
    >
      <div
        className={`animate-gradient absolute inset-0 block size-full bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] p-[1px] [border-radius:inherit] ![mask-composite:subtract] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]`}
      />

      {children}
    </div>
  )
}

```

File: components/sidebar/nav-main.tsx
```tsx
/*
<ai_context>
This client component provides a main navigation for the sidebar.
</ai_context>
*/

"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"
import { ChevronRight, type LucideIcon } from "lucide-react"

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: { title: string; url: string }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map(subItem => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

```

File: components/magicui/hero-video-dialog.tsx
```tsx
/*
<ai_context>
This client component provides a video dialog for the hero section.
</ai_context>
*/

"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Play, XIcon } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out"

interface HeroVideoProps {
  animationStyle?: AnimationStyle
  videoSrc: string
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 }
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 }
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 }
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 }
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 }
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  }
}

export default function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const selectedAnimation = animationVariants[animationStyle]

  return (
    <div className={cn("relative", className)}>
      <div
        className="group relative cursor-pointer"
        onClick={() => setIsVideoOpen(true)}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="w-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
        />
        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
          <div className="bg-primary/10 flex size-28 items-center justify-center rounded-full backdrop-blur-md">
            <div
              className={`from-primary/30 to-primary relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}
            >
              <Play
                className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                style={{
                  filter:
                    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))"
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsVideoOpen(false)}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
            >
              <motion.button className="absolute -top-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black">
                <XIcon className="size-5" />
              </motion.button>
              <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">
                <iframe
                  src={videoSrc}
                  className="size-full rounded-2xl"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

```

File: components/sidebar/app-sidebar.tsx
```tsx
/*
<ai_context>
This client component provides the sidebar for the app.
</ai_context>
*/

"use client"

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal
} from "lucide-react"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"

// Sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg"
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise"
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup"
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free"
    }
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" }
      ]
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" }
      ]
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" }
      ]
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" }
      ]
    }
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

```

File: app/(auth)/layout.tsx
```tsx
/*
<ai_context>
This server layout provides a centered layout for (auth) pages.
</ai_context>
*/

"use server"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center">{children}</div>
  )
}

```

File: components/sidebar/nav-projects.tsx
```tsx
/*
<ai_context>
This client component provides a list of projects for the sidebar.
</ai_context>
*/

"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon
} from "lucide-react"

export function NavProjects({
  projects
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map(item => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

```

File: components/sidebar/nav-user.tsx
```tsx
/*
<ai_context>
This client component provides a user button for the sidebar via Clerk.
</ai_context>
*/

"use client"

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { UserButton, useUser } from "@clerk/nextjs"

export function NavUser() {
  const { user } = useUser()

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2 font-medium">
        <UserButton afterSignOutUrl="/" />
        {user?.fullName}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

```

File: components/sidebar/team-switcher.tsx
```tsx
/*
<ai_context>
This client component provides a team switcher for the sidebar.
</ai_context>
*/

"use client"

import { ChevronsUpDown, Plus } from "lucide-react"
import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

```

File: components/utilities/posthog/posthog-provider.tsx
```tsx
/*
<ai_context>
This client component provides the PostHog provider for the app.
</ai_context>
*/

"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only" // or 'always' to create profiles for anonymous users as well
  })
}
export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

```

File: components/utilities/tailwind-indicator.tsx
```tsx
/*
<ai_context>
This server component provides a tailwind indicator for the app in dev mode.
</ai_context>
*/

"use server"

export async function TailwindIndicator() {
  // Don't show in production
  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-12 left-3 z-50 flex size-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}

```

File: components/utilities/posthog/posthog-user-identity.tsx
```tsx
/*
<ai_context>
This client component identifies the user in PostHog.
</ai_context>
*/

"use client"

import { useUser } from "@clerk/nextjs"
import posthog from "posthog-js"
import { useEffect } from "react"

export function PostHogUserIdentify() {
  const { user } = useUser()

  useEffect(() => {
    if (user?.id) {
      // Identify the user in PostHog
      posthog.identify(user.id)
    } else {
      // If no user is signed in, reset any previously identified user
      posthog.reset()
    }
  }, [user?.id])

  return null
}

```

File: components/utilities/posthog/posthog-pageview.tsx
```tsx
/*
<ai_context>
This client component tracks pageviews in PostHog.
</ai_context>
*/

"use client"

import { usePathname } from "next/navigation"
import posthog from "posthog-js"
import { useEffect } from "react"

export function PostHogPageview() {
  const pathname = usePathname()

  useEffect(() => {
    // Track a pageview whenever the pathname changes
    if (pathname) {
      posthog.capture("$pageview", { path: pathname })
    }
  }, [pathname])

  return null
}

```

File: components/utilities/providers.tsx
```tsx
/*
<ai_context>
This client component provides the providers for the app.
</ai_context>
*/

"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"
import { CSPostHogProvider } from "./posthog/posthog-provider"

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <CSPostHogProvider>{children}</CSPostHogProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}

```

File: components/utilities/theme-switcher.tsx
```tsx
/*
<ai_context>
This client component provides a theme switcher for the app.
</ai_context>
*/

"use client"

import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { HTMLAttributes, ReactNode } from "react"

interface ThemeSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const ThemeSwitcher = ({ children, ...props }: ThemeSwitcherProps) => {
  const { setTheme, theme } = useTheme()

  const handleChange = (theme: "dark" | "light") => {
    localStorage.setItem("theme", theme)
    setTheme(theme)
  }

  return (
    <div
      className={cn(
        "p-1 hover:cursor-pointer hover:opacity-50",
        props.className
      )}
      onClick={() => handleChange(theme === "light" ? "dark" : "light")}
    >
      {theme === "dark" ? (
        <Moon className="size-6" />
      ) : (
        <Sun className="size-6" />
      )}
    </div>
  )
}

```

File: components/header.tsx
```tsx
/*
<ai_context>
This client component provides the header for the app.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/nextjs"
import { Menu, Rocket, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ThemeSwitcher } from "./utilities/theme-switcher"

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" }
]

const signedInLinks = [{ href: "/todo", label: "Todo" }]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        isScrolled
          ? "bg-background/80 shadow-sm backdrop-blur-sm"
          : "bg-background"
      }`}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-4">
        <div className="flex items-center space-x-2 hover:cursor-pointer hover:opacity-80">
          <Rocket className="size-6" />
          <Link href="/" className="text-xl font-bold">
            Mckay's App Template
          </Link>
        </div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 space-x-2 font-semibold md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 hover:opacity-80"
            >
              {link.label}
            </Link>
          ))}

          <SignedIn>
            {signedInLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1 hover:opacity-80"
              >
                {link.label}
              </Link>
            ))}
          </SignedIn>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeSwitcher />

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Login</Button>
            </SignInButton>

            <SignUpButton>
              <Button className="bg-blue-500 hover:bg-blue-600">Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="bg-primary-foreground text-primary p-4 md:hidden">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="block hover:underline"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block hover:underline"
                  onClick={toggleMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <SignedIn>
              {signedInLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block hover:underline"
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </SignedIn>
          </ul>
        </nav>
      )}
    </header>
  )
}

```

File: db/schema/todos-schema.ts
```ts
/*
<ai_context>
Defines the database schema for todos.
</ai_context>
*/

import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const todosTable = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertTodo = typeof todosTable.$inferInsert
export type SelectTodo = typeof todosTable.$inferSelect

```

File: db/schema/profiles-schema.ts
```ts
/*
<ai_context>
Defines the database schema for profiles.
</ai_context>
*/

import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const membershipEnum = pgEnum("membership", ["free", "pro"])

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  membership: membershipEnum("membership").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertProfile = typeof profilesTable.$inferInsert
export type SelectProfile = typeof profilesTable.$inferSelect

```

File: hooks/use-toast.ts
```ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

```

File: hooks/use-mobile.tsx
```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

```

File: lib/hooks/use-copy-to-clipboard.tsx
```tsx
/*
<ai_context>
Hook for copying text to the clipboard.
</ai_context>
*/

"use client"

import { useState } from "react"

export interface useCopyToClipboardProps {
  timeout?: number
}

export function useCopyToClipboard({
  timeout = 2000
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState<Boolean>(false)

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return
    }

    if (!value) {
      return
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    })
  }

  return { isCopied, copyToClipboard }
}

```

File: lib/hooks/use-mobile.tsx
```tsx
/*
<ai_context>
Hook to check if the user is on a mobile device.
</ai_context>
*/

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

```

File: lib/hooks/use-toast.ts
```ts
/*
<ai_context>
Hook to display toast notifications.
</ai_context>
*/

"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST"
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach(toast => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false
              }
            : t
        )
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: []
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId)
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id }
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: open => {
        if (!open) dismiss()
      }
    }
  })

  return {
    id: id,
    dismiss,
    update
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId })
  }
}

export { toast, useToast }

```

File: lib/utils.ts
```ts
/*
<ai_context>
Contains the utility functions for the app.
</ai_context>
*/

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

File: types/index.ts
```ts
/*
<ai_context>
Exports the types for the app.
</ai_context>
*/

export * from "./server-action-types"

```

File: lib/stripe.ts
```ts
/*
<ai_context>
Contains the Stripe configuration for the app.
</ai_context>
*/

import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  appInfo: {
    name: "Mckay's App Template",
    version: "0.1.0"
  }
})

```

File: components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

File: types/server-action-types.ts
```ts
/*
<ai_context>
Contains the general server action types.
</ai_context>
*/

export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never }

```

File: .eslintrc.json
```json
/*
<ai_context>
Contains the ESLint configuration for the app.
</ai_context>
*/

{
  "$schema": "https://json.schemastore.org/eslintrc",
  "root": true,
  "extends": [
    "next/core-web-vitals",
    "prettier",
    "plugin:tailwindcss/recommended"
  ],
  "plugins": ["tailwindcss"],
  "rules": {
    "@next/next/no-img-element": "off",
    "jsx-a11y/alt-text": "off",
    "react-hooks/exhaustive-deps": "off",
    "tailwindcss/enforces-negative-arbitrary-values": "off",
    "tailwindcss/no-contradicting-classname": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/no-unnecessary-arbitrary-value": "off",
    "react/no-unescaped-entities": "off"
  },
  "settings": {
    "tailwindcss": {
      "callees": ["cn", "cva"],
      "config": "tailwind.config.js"
    }
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "parser": "@typescript-eslint/parser"
    }
  ]
}

```

File: license
```license
MIT License

Copyright (c) 2024 Mckay Wrigley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

File: middleware.ts
```ts
/*
<ai_context>
Contains middleware for protecting routes, checking user authentication, and redirecting as needed.
</ai_context>
*/

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/todo(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: "/login" })
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && isProtectedRoute(req)) {
    return NextResponse.next()
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}

```

File: package.json
```json
{
  "name": "mckays-app-template",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "npm run lint:fix && npm run format:write",
    "type-check": "tsc --noEmit",
    "lint:fix": "next lint --fix",
    "format:write": "prettier --write \"{app,lib,db,components,context,types}/**/*.{ts,tsx}\" --cache",
    "format:check": "prettier --check \"{app,lib,db,components,context,types}**/*.{ts,tsx}\" --cache",
    "analyze": "ANALYZE=true npm run build",
    "db:generate": "npx drizzle-kit generate",
    "db:migrate": "npx drizzle-kit migrate",
    "prepare": "husky install"
  },
  "dependencies": {
    "@clerk/backend": "^1.20.1",
    "@clerk/nextjs": "^6.8.1",
    "@clerk/themes": "^2.1.53",
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-aspect-ratio": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.2",
    "@radix-ui/react-context-menu": "^2.2.4",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-hover-card": "^1.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-menubar": "^1.1.4",
    "@radix-ui/react-navigation-menu": "^1.2.3",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "@radix-ui/react-toggle": "^1.1.1",
    "@radix-ui/react-toggle-group": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "drizzle-orm": "^0.33.0",
    "embla-carousel-react": "^8.5.1",
    "framer-motion": "^11.11.8",
    "input-otp": "^1.4.1",
    "lucide-react": "^0.436.0",
    "next": "^15.0.3",
    "next-themes": "^0.3.0",
    "postgres": "^3.4.4",
    "posthog-js": "^1.201.0",
    "react": "^16.8 || ^17.0 || ^18.0 || ^19.0",
    "react-day-picker": "^8.10.1",
    "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0",
    "react-hook-form": "^7.54.1",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.0",
    "sonner": "^1.7.1",
    "stripe": "^16.9.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "@types/node": "^20",
    "@types/react": "^16.8 || ^17.0 || ^18.0 || ^19.0",
    "@types/react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0",
    "dotenv": "^16.4.5",
    "drizzle-kit": "^0.24.2",
    "eslint": "^8",
    "eslint-config-next": "14.2.7",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-tailwindcss": "^3.17.5",
    "husky": "^9.1.6",
    "postcss": "^8",
    "prettier": "^3.3.3",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  },
  "packageManager": "yarn@1.22.22+sha512.a6b2f7906b721bba3d67d4aff083df04dad64c399707841b7acf00f6b133b7ac24255f2652fa22ae3534329dc6180534e98d17432037ff6fd140556e2bb3137e"
}

```

File: next.config.mjs
```mjs
/*
<ai_context>
Configures Next.js for the app.
</ai_context>
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "localhost" }]
  }
}

export default nextConfig

```

File: prettier.config.cjs
```cjs
/*
<ai_context>
Configures Prettier for the app.
</ai_context>
*/

/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: "lf",
  semi: false,
  useTabs: false,
  singleQuote: false,
  arrowParens: "avoid",
  tabWidth: 2,
  trailingComma: "none",
  importOrder: [
    "^.+\\.scss$",
    "^.+\\.css$",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/types/(.*)$",
    "^@/config/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/registry/(.*)$",
    "^@/styles/(.*)$",
    "^@/app/(.*)$",
    "",
    "^[./]"
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true
}

```

File: README.md
```md
# Mckay's App Template

This is a full-stack app template for courses on [Takeoff](https://JoinTakeoff.com/).

## Sponsors

If you are interested in sponsoring my repos, please contact me at [ads@takeoffai.org](mailto:ads@takeoffai.org).

Or sponsor me directly on [GitHub Sponsors](https://github.com/sponsors/mckaywrigley).

## Tech Stack

- IDE: [Cursor](https://www.cursor.com/)
- AI Tools: [V0](https://v0.dev/), [Perplexity](https://www.perplexity.com/)
- Frontend: [Next.js](https://nextjs.org/docs), [Tailwind](https://tailwindcss.com/docs/guides/nextjs), [Shadcn](https://ui.shadcn.com/docs/installation), [Framer Motion](https://www.framer.com/motion/introduction/)
- Backend: [PostgreSQL](https://www.postgresql.org/about/), [Supabase](https://supabase.com/), [Drizzle](https://orm.drizzle.team/docs/get-started-postgresql), [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- Auth: [Clerk](https://clerk.com/)
- Payments: [Stripe](https://stripe.com/)
- Analytics: [PostHog](https://posthog.com/)

## Prerequisites

You will need accounts for the following services.

They all have free plans that you can use to get started.

- Create a [Cursor](https://www.cursor.com/) account
- Create a [GitHub](https://github.com/) account
- Create a [Supabase](https://supabase.com/) account
- Create a [Clerk](https://clerk.com/) account
- Create a [Stripe](https://stripe.com/) account
- Create a [PostHog](https://posthog.com/) account
- Create a [Vercel](https://vercel.com/) account

You will likely not need paid plans unless you are building a business.

## Environment Variables

```bash
# DB (Supabase)
DATABASE_URL=

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Payments (Stripe)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PORTAL_LINK=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the environment variables from above
3. Run `npm install` to install dependencies
4. Run `npm run dev` to run the app locally

```

File: drizzle.config.ts
```ts
/*
<ai_context>
Configures Drizzle for the app.
</ai_context>
*/

import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env.local" })

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})

```

File: tailwind.config.ts
```ts
/*
<ai_context>
Configures Tailwind CSS for the app.
</ai_context>
*/

import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0"
          },
          to: {
            height: "var(--radix-accordion-content-height)"
          }
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)"
          },
          to: {
            height: "0"
          }
        },
        gradient: {
          to: {
            backgroundPosition: "var(--bg-size) 0"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        gradient: "gradient 8s linear infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
} satisfies Config

export default config

```

File: tsconfig.json
```json
/*
<ai_context>
Configures the TypeScript compiler options for the app.
</ai_context>
*/

{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    },
    "target": "ES2017"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

File: db/schema/equity-schema.ts
```ts
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

import { pgEnum, pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core"
import { profilesTable } from "@/db/schema/profiles-schema"

/**
 * dataSourceEnum:
 * 
 * Defines the possible ways a user might have imported or created their equity data.
 * - manual: Manually entered via form
 * - csv: Imported via CSV file
 * - scraped: Retrieved through Selenium-based scraping from Carta
 */
export const dataSourceEnum = pgEnum("data_source", ["manual", "csv", "scraped"])

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
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profilesTable.userId, { onDelete: "cascade" }),
  dataSource: dataSourceEnum("data_source")
    .notNull()
    .default("manual"),
  equityDetails: jsonb("equity_details")
    .$type<Record<string, any>>()
    .notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
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


```

File: db/schema/documents-schema.ts
```ts
/**
 * @description
 * Defines the database schema for storing metadata about uploaded documents.
 *
 * The `documentsTable` references a user (who owns the document),
 * tracks file type (pdf/image) via an enum, and stores the path to the file in Supabase storage.
 *
 * Key features:
 * - Each document belongs to a user in `profilesTable`.
 * - The `fileTypeEnum` enumerates the accepted file types (pdf, image).
 * - The `filePath` indicates where the file is stored in Supabase.
 * - We store `uploadedAt` for auditing/time-based queries.
 *
 * @dependencies
 * - profilesTable from `profiles-schema.ts`.
 * - `drizzle-orm/pg-core` for schema definitions.
 *
 * @notes
 * - We assume `user_id` references `profilesTable.userId` with a cascade if the user is removed.
 * - This table pairs with the actual file storage in Supabase, which must remain in sync.
 */

import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { profilesTable } from "@/db/schema/profiles-schema"

/**
 * fileTypeEnum:
 * Distinguishes between PDF files and images for the user's documents.
 * Additional types could be added in the future (e.g. "txt", "docx").
 */
export const fileTypeEnum = pgEnum("file_type", ["pdf", "image"])

/**
 * documentsTable:
 * The table storing references to user-uploaded documents for context in the chatbot.
 */
export const documentsTable = pgTable("documents", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profilesTable.userId, { onDelete: "cascade" }),
  fileType: fileTypeEnum("file_type")
    .notNull(),
  filePath: text("file_path")
    .notNull(),
  uploadedAt: timestamp("uploaded_at")
    .defaultNow()
    .notNull()
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


```

File: db/schema/conversations-schema.ts
```ts
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
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profilesTable.userId, { onDelete: "cascade" }),
  startedAt: timestamp("started_at")
    .defaultNow()
    .notNull(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
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
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversationsTable.id, { onDelete: "cascade" }),
  role: roleEnum("role")
    .notNull(),
  content: text("content")
    .notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
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


```

File: actions/db/equity-data-actions.ts
```ts
/**
 * @description
 * This server actions file provides CRUD operations for the equity_data table,
 * plus a new parseCsvAction for handling CSV file imports.
 * 
 * Key Features & Functions:
 * 1. createEquityDataAction: Inserts a new equity data record.
 * 2. getEquityDataByUserAction: Retrieves all equity data rows for a given user.
 * 3. updateEquityDataAction: Partially updates a single equity data record.
 * 4. deleteEquityDataAction: Deletes a single equity data record.
 * 5. parseCsvAction: Parses rows from an uploaded CSV and inserts them as new records with dataSource="csv".
 *
 * @dependencies
 * - db from "@/db/db"
 * - equityDataTable from "@/db/schema/equity-schema"
 * - eq from "drizzle-orm"
 * - ActionState from "@/types/server-action-types"
 * 
 * @notes
 * - parseCsvAction uses minimal CSV parsing and expects lines with columns:
 *   grantType, shares, strikePrice
 * - For more robust parsing, consider a CSV library like papaparse or 'csv-parse'.
 */

"use server"

import { db } from "@/db/db"
import { equityDataTable, InsertEquityData, SelectEquityData } from "@/db/schema/equity-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * @function createEquityDataAction
 * Inserts a new equity data record. 
 */
export async function createEquityDataAction(
  equityRecord: InsertEquityData
): Promise<ActionState<SelectEquityData>> {
  try {
    const [newRecord] = await db.insert(equityDataTable).values(equityRecord).returning()
    return {
      isSuccess: true,
      message: "Equity data created successfully",
      data: newRecord
    }
  } catch (error) {
    console.error("Error creating equity data record:", error)
    return { isSuccess: false, message: "Failed to create equity data record" }
  }
}

/**
 * @function getEquityDataByUserAction
 * Retrieves all equity data entries for a given userId.
 */
export async function getEquityDataByUserAction(
  userId: string
): Promise<ActionState<SelectEquityData[]>> {
  try {
    const records = await db.query.equityData.findMany({
      where: eq(equityDataTable.userId, userId)
    })
    return {
      isSuccess: true,
      message: "Equity data retrieved successfully",
      data: records
    }
  } catch (error) {
    console.error("Error retrieving equity data:", error)
    return { isSuccess: false, message: "Failed to retrieve equity data" }
  }
}

/**
 * @function updateEquityDataAction
 * Partially updates an existing equity data record by its ID.
 */
export async function updateEquityDataAction(
  id: string,
  data: Partial<InsertEquityData>
): Promise<ActionState<SelectEquityData>> {
  try {
    const [updatedRecord] = await db
      .update(equityDataTable)
      .set(data)
      .where(eq(equityDataTable.id, id))
      .returning()

    if (!updatedRecord) {
      return { isSuccess: false, message: "No matching record found to update" }
    }

    return {
      isSuccess: true,
      message: "Equity data updated successfully",
      data: updatedRecord
    }
  } catch (error) {
    console.error("Error updating equity data:", error)
    return { isSuccess: false, message: "Failed to update equity data" }
  }
}

/**
 * @function deleteEquityDataAction
 * Deletes a single equity data record by its ID.
 */
export async function deleteEquityDataAction(
  id: string
): Promise<ActionState<void>> {
  try {
    const deletedCount = await db
      .delete(equityDataTable)
      .where(eq(equityDataTable.id, id))
      .execute()

    if (deletedCount.length === 0) {
      return { isSuccess: false, message: "No matching record found to delete" }
    }

    return {
      isSuccess: true,
      message: "Equity data deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting equity data:", error)
    return { isSuccess: false, message: "Failed to delete equity data" }
  }
}

/**
 * @function parseCsvAction
 * @async
 * @description
 *  Parses an uploaded CSV file from formData (field name: "csvFile"), 
 *  expects a userId in formData as well, then inserts each row in `equity_data`
 *  with `dataSource="csv"`. Minimal CSV logic is used for demonstration.
 * 
 * @param {FormData} formData - The multipart form data, containing "csvFile" and "userId".
 * @returns {Promise<ActionState<void>>} - Returns success or failure message.
 * 
 * @example
 *  <form action={parseCsvAction} encType="multipart/form-data">
 *    <input type="hidden" name="userId" value="user_123" />
 *    <input type="file" name="csvFile" accept=".csv" />
 *    <button type="submit">Import</button>
 *  </form>
 */
export async function parseCsvAction(formData: FormData): Promise<ActionState<void>> {
  try {
    const file = formData.get("csvFile") as File | null
    const userId = formData.get("userId") as string

    // Basic validation
    if (!file || !userId) {
      return { isSuccess: false, message: "Missing file or userId" }
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return { isSuccess: false, message: "Uploaded file must be a .csv" }
    }

    // Convert file to text
    const csvContent = await file.text()
    const lines = csvContent.split(/\r?\n/) // naive splitting by newline

    if (lines.length < 2) {
      return { isSuccess: false, message: "CSV file is empty or invalid" }
    }

    // Optional: parse header row
    // We assume columns: grantType, shares, strikePrice
    const header = lines[0].split(",").map(col => col.trim().toLowerCase())
    // e.g. ["granttype", "shares", "strikeprice"]

    // We'll do minimal checking
    if (header.length < 3) {
      return { isSuccess: false, message: "CSV must have at least 3 columns" }
    }

    // Parse each row. Start from line index 1 (skip header).
    const rowsToInsert: InsertEquityData[] = []

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].trim()
      if (!row) continue // skip empty lines

      const cols = row.split(",")
      if (cols.length < 3) {
        // skip or handle partial row
        continue
      }

      const grantType = cols[0].trim()
      const sharesStr = cols[1].trim()
      const strikePriceStr = cols[2].trim()

      // Convert shares, strikePrice
      const shares = Number(sharesStr)
      const strikePrice = Number(strikePriceStr)

      // Minimal validation
      if (!grantType || isNaN(shares) || isNaN(strikePrice)) {
        // skip invalid row or handle error
        continue
      }

      const equityDetails = { grantType, shares, strikePrice }
      rowsToInsert.push({
        userId,
        dataSource: "csv",
        equityDetails
      })
    }

    if (rowsToInsert.length === 0) {
      return { isSuccess: false, message: "No valid rows found in CSV" }
    }

    // Insert all rows
    await db.insert(equityDataTable).values(rowsToInsert)

    return {
      isSuccess: true,
      message: `${rowsToInsert.length} rows inserted from CSV`,
      data: undefined
    }
  } catch (error) {
    console.error("Error parsing CSV:", error)
    return { isSuccess: false, message: "Failed to parse CSV" }
  }
}


```

File: actions/db/documents-actions.ts
```ts
/**
 * @description
 * Provides server actions for CRUD operations on the `documentsTable`.
 * Each record references a user (userId) and stores metadata about an uploaded file (fileType, filePath).
 * 
 * Key Features:
 * - createDocumentAction: Inserts a new document reference (PDF/image).
 * - getDocumentByIdAction: Retrieves metadata for a single document by UUID.
 * - getDocumentsForUserAction: Lists all documents for a user.
 * - updateDocumentAction: Partial update for fields like fileType, filePath, or userId.
 * - deleteDocumentAction: Removes a document record from the DB (should also remove the file from storage if needed).
 * 
 * @dependencies
 * - db from "@/db/db"
 * - documentsTable, InsertDocument, SelectDocument from "@/db/schema/documents-schema"
 * - eq from "drizzle-orm" for building WHERE clauses
 * - ActionState<T> from "@/types" for success/failure return structure
 * 
 * @notes
 * - This does not directly handle file uploads to Supabase storage. It only creates/manages the DB record.
 * - To actually store a file, see the storage actions in `actions/storage` (if implemented).
 * - The `user_id` reference is cascade-deleted if the user is removed.
 */

"use server"

import { db } from "@/db/db"
import {
  documentsTable,
  InsertDocument,
  SelectDocument
} from "@/db/schema/documents-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * @function createDocumentAction
 * @async
 * @description
 *  Inserts a new document record in the documents table.
 *  Typically called after uploading a file to storage and obtaining its file path.
 * 
 * @param {InsertDocument} documentData - The document data to insert (includes userId, fileType, filePath).
 * @returns {Promise<ActionState<SelectDocument>>}
 */
export async function createDocumentAction(
  documentData: InsertDocument
): Promise<ActionState<SelectDocument>> {
  try {
    const [newDoc] = await db
      .insert(documentsTable)
      .values(documentData)
      .returning()

    return {
      isSuccess: true,
      message: "Document created successfully",
      data: newDoc
    }
  } catch (error) {
    console.error("Error creating document:", error)
    return {
      isSuccess: false,
      message: "Failed to create document"
    }
  }
}

/**
 * @function getDocumentByIdAction
 * @async
 * @description
 *  Fetches a single document by its UUID from the documents table.
 * 
 * @param {string} documentId - The UUID of the document to retrieve.
 * @returns {Promise<ActionState<SelectDocument>>}
 */
export async function getDocumentByIdAction(
  documentId: string
): Promise<ActionState<SelectDocument>> {
  try {
    const doc = await db.query.documents.findFirst({
      where: eq(documentsTable.id, documentId)
    })

    if (!doc) {
      return {
        isSuccess: false,
        message: "Document not found"
      }
    }

    return {
      isSuccess: true,
      message: "Document retrieved successfully",
      data: doc
    }
  } catch (error) {
    console.error("Error retrieving document by ID:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve document"
    }
  }
}

/**
 * @function getDocumentsForUserAction
 * @async
 * @description
 *  Returns all documents belonging to a specific user, ordered by upload date descending.
 * 
 * @param {string} userId - The ID of the user whose documents will be fetched.
 * @returns {Promise<ActionState<SelectDocument[]>>}
 */
export async function getDocumentsForUserAction(
  userId: string
): Promise<ActionState<SelectDocument[]>> {
  try {
    const docs = await db.query.documents.findMany({
      where: eq(documentsTable.userId, userId),
      orderBy: (tbl, { desc }) => [desc(tbl.uploadedAt)]
    })

    return {
      isSuccess: true,
      message: "User documents retrieved successfully",
      data: docs
    }
  } catch (error) {
    console.error("Error retrieving documents for user:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve documents for user"
    }
  }
}

/**
 * @function updateDocumentAction
 * @async
 * @description
 *  Partially updates a document record by its UUID.
 *  The Partial<InsertDocument> allows updating fields like fileType or filePath.
 * 
 * @param {string} documentId - The UUID of the document to update.
 * @param {Partial<InsertDocument>} data - Fields to update.
 * @returns {Promise<ActionState<SelectDocument>>}
 */
export async function updateDocumentAction(
  documentId: string,
  data: Partial<InsertDocument>
): Promise<ActionState<SelectDocument>> {
  try {
    const [updated] = await db
      .update(documentsTable)
      .set(data)
      .where(eq(documentsTable.id, documentId))
      .returning()

    if (!updated) {
      return {
        isSuccess: false,
        message: "No matching document found"
      }
    }

    return {
      isSuccess: true,
      message: "Document updated successfully",
      data: updated
    }
  } catch (error) {
    console.error("Error updating document:", error)
    return {
      isSuccess: false,
      message: "Failed to update document"
    }
  }
}

/**
 * @function deleteDocumentAction
 * @async
 * @description
 *  Deletes a single document record by its UUID.
 *  The corresponding file should also be removed from Supabase storage by another action if necessary.
 * 
 * @param {string} documentId - The UUID of the document to delete.
 * @returns {Promise<ActionState<void>>}
 */
export async function deleteDocumentAction(
  documentId: string
): Promise<ActionState<void>> {
  try {
    const result = await db
      .delete(documentsTable)
      .where(eq(documentsTable.id, documentId))
      .execute()

    if (result.length === 0) {
      return {
        isSuccess: false,
        message: "No matching document found to delete"
      }
    }

    return {
      isSuccess: true,
      message: "Document deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting document:", error)
    return {
      isSuccess: false,
      message: "Failed to delete document"
    }
  }
}

```

File: postcss.config.mjs
```mjs
/*
<ai_context>
Configures PostCSS for the app.
</ai_context>
*/

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}
  }
}

export default config

```

File: app/(protected)/data-import/_components/equity-data-table.tsx
```tsx
/**
 * @description
 * A client component for displaying and managing (read, update, delete)
 * the user's existing equity data in a table format.
 * 
 * Key features:
 * - Shows each record with its grantType, shares, strikePrice (from equityDetails)
 * - Allows inline editing of each record
 * - Allows deleting a record
 * - Maintains local component state for immediate UI updates
 * 
 * @dependencies
 * - updateEquityDataAction, deleteEquityDataAction from "@/actions/db/equity-data-actions"
 * - useState from React
 * - toast from "@/lib/hooks/use-toast" for notifications
 * 
 * @notes
 * - For more advanced editing (multiple fields, validations), consider a separate form or modal.
 * - This is a minimal example to satisfy read, update, delete requirements from Step 6.
 */

"use client"

import { useState } from "react"
import { SelectEquityData, InsertEquityData } from "@/db/schema/equity-schema"
import {
  deleteEquityDataAction,
  updateEquityDataAction
} from "@/actions/db/equity-data-actions"
import { toast } from "@/lib/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EquityDataTableProps {
  userId: string
  initialData: SelectEquityData[]
}

interface EditingState {
  [id: string]: {
    grantType: string
    shares: number
    strikePrice: number
  }
}

export default function EquityDataTable({
  userId,
  initialData
}: EquityDataTableProps) {
  const [equityData, setEquityData] = useState<SelectEquityData[]>(initialData)
  const [editing, setEditing] = useState<EditingState>({})

  /**
   * @function handleDelete
   * Calls deleteEquityDataAction, and upon success,
   * removes that record from local state.
   */
  async function handleDelete(id: string) {
    const result = await deleteEquityDataAction(id)
    if (!result.isSuccess) {
      toast({
        title: "Error Deleting",
        description: result.message,
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Deleted",
      description: "Record deleted successfully."
    })

    setEquityData(prev => prev.filter(item => item.id !== id))
  }

  /**
   * @function handleEdit
   * Toggles editing mode for a row. If we're entering editing mode, populate
   * the editing state with the current record's equityDetails.
   */
  function handleEdit(record: SelectEquityData) {
    const details = record.equityDetails as Record<string, any>
    setEditing(prev => ({
      ...prev,
      [record.id]: {
        grantType: details.grantType || "",
        shares: details.shares || 0,
        strikePrice: details.strikePrice || 0
      }
    }))
  }

  /**
   * @function handleCancel
   * Cancels editing mode for a row, discarding changes from local state.
   */
  function handleCancel(id: string) {
    setEditing(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }

  /**
   * @function handleSave
   * Calls updateEquityDataAction with the updated fields. On success,
   * updates local state to reflect changes, then leaves editing mode.
   */
  async function handleSave(record: SelectEquityData) {
    const editData = editing[record.id]
    if (!editData) return

    // Build partial data for the updated equityDetails
    const updatedDetails = {
      grantType: editData.grantType,
      shares: Number(editData.shares),
      strikePrice: Number(editData.strikePrice)
    }

    // We'll do partial update of the equity data record
    const partial: Partial<InsertEquityData> = {
      equityDetails: updatedDetails
    }

    const result = await updateEquityDataAction(record.id, partial)
    if (!result.isSuccess) {
      toast({
        title: "Error Updating",
        description: result.message,
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Updated",
      description: "Record updated successfully."
    })

    // Update local state
    setEquityData(prev =>
      prev.map(item =>
        item.id === record.id
          ? { ...item, equityDetails: updatedDetails }
          : item
      )
    )

    // Exit editing mode
    handleCancel(record.id)
  }

  return (
    <div className="mt-4">
      <h2 className="mb-2 text-xl font-semibold">Your Existing Equity Data</h2>

      {equityData.length === 0 ? (
        <p className="text-sm italic">No equity records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Grant Type</th>
                <th className="text-left p-2">Shares</th>
                <th className="text-left p-2">Strike Price</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equityData.map(record => {
                const details = record.equityDetails as Record<string, any>
                const isEditing = editing[record.id] !== undefined

                return (
                  <tr key={record.id} className="border-b">
                    <td className="p-2">
                      {isEditing ? (
                        <Input
                          type="text"
                          value={editing[record.id].grantType}
                          onChange={e =>
                            setEditing(prev => ({
                              ...prev,
                              [record.id]: {
                                ...prev[record.id],
                                grantType: e.target.value
                              }
                            }))
                          }
                        />
                      ) : (
                        details.grantType || ""
                      )}
                    </td>

                    <td className="p-2">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editing[record.id].shares}
                          onChange={e =>
                            setEditing(prev => ({
                              ...prev,
                              [record.id]: {
                                ...prev[record.id],
                                shares: Number(e.target.value)
                              }
                            }))
                          }
                        />
                      ) : (
                        details.shares || 0
                      )}
                    </td>

                    <td className="p-2">
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editing[record.id].strikePrice}
                          onChange={e =>
                            setEditing(prev => ({
                              ...prev,
                              [record.id]: {
                                ...prev[record.id],
                                strikePrice: Number(e.target.value)
                              }
                            }))
                          }
                        />
                      ) : (
                        details.strikePrice || 0
                      )}
                    </td>

                    <td className="p-2 space-x-2">
                      {!isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(record)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSave(record)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(record.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

```

File: app/(protected)/data-import/_components/manual-entry-form.tsx
```tsx
/**
 * @description
 * A client component for manually adding new equity data records.
 * This form captures basic fields like grantType, shares, strikePrice,
 * then calls `createEquityDataAction` with dataSource="manual" and the user's inputs.
 * 
 * Key features:
 * - Local state to handle form inputs
 * - On submit, calls the server action, then triggers a page refresh (router.refresh()) to show the new record
 * - Basic validation for numeric fields
 * 
 * @dependencies
 * - createEquityDataAction from "@/actions/db/equity-data-actions"
 * - useRouter from "next/navigation" for refreshing the page
 * 
 * @notes
 * - For real-world usage, you might add more sophisticated validation and error handling
 * - If you want to open up advanced fields (e.g., vesting schedule, expiration date), expand the form accordingly
 */

"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createEquityDataAction } from "@/actions/db/equity-data-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/hooks/use-toast"

interface ManualEntryFormProps {
  userId: string
}

export default function ManualEntryForm({ userId }: ManualEntryFormProps) {
  // Local state for basic fields
  const [grantType, setGrantType] = useState("")
  const [shares, setShares] = useState<number | undefined>(undefined)
  const [strikePrice, setStrikePrice] = useState<number | undefined>(undefined)

  const router = useRouter()

  /**
   * @function handleSubmit
   * Handles form submission by calling createEquityDataAction with user inputs.
   * On success, resets form fields and refreshes the page to show new record.
   */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    // Convert numeric fields from string
    const sharesNum = shares ? Number(shares) : 0
    const strikeNum = strikePrice ? Number(strikePrice) : 0

    if (!grantType || sharesNum <= 0 || strikeNum < 0) {
      toast({
        title: "Invalid input",
        description: "Please enter valid equity details.",
        variant: "destructive"
      })
      return
    }

    // Build the equityDetails object
    const equityDetails = {
      grantType,
      shares: sharesNum,
      strikePrice: strikeNum
    }

    // Call server action
    const result = await createEquityDataAction({
      userId,
      dataSource: "manual",
      equityDetails
    })

    if (!result.isSuccess) {
      console.error("Failed to create equity data:", result.message)
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      })
      return
    }

    // Reset form fields
    setGrantType("")
    setShares(undefined)
    setStrikePrice(undefined)

    // Show success toast
    toast({
      title: "Success",
      description: "Equity data record created successfully."
    })

    // Refresh the page to show newly inserted record
    router.refresh()
  }

  return (
    <div className="max-w-md bg-muted p-4 rounded shadow">
      <h2 className="mb-4 text-xl font-semibold">Add a New Equity Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Grant Type</label>
          <Input
            type="text"
            placeholder="e.g. ISO, RSU"
            value={grantType}
            onChange={e => setGrantType(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Shares</label>
          <Input
            type="number"
            placeholder="e.g. 1000"
            value={shares ?? ""}
            onChange={e => setShares(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Strike Price</label>
          <Input
            type="number"
            step="0.01"
            placeholder="e.g. 0.50"
            value={strikePrice ?? ""}
            onChange={e => setStrikePrice(Number(e.target.value))}
          />
        </div>

        <Button type="submit">Add Equity Data</Button>
      </form>
    </div>
  )
}

```

File: actions/chat-actions.ts
```ts
/**
 * @description
 * Server actions for handling the chat flow. Specifically, we define a 
 * sendMessageAction that saves the user's message, simulates an AI response,
 * and returns both messages.
 * 
 * Key Features:
 * - Stores the user message in the database
 * - Mocks an AI response and stores it
 * - Returns the newly created messages
 * 
 * @dependencies
 * - createMessageAction from conversation-actions to store messages
 * - eq from drizzle-orm if we need to query or filter
 * - The Chat/LLM portion is currently mocked
 * 
 * @notes
 * - In production, you'd integrate with an LLM by calling its API,
 *   then store the returned content as the assistant’s message.
 * - Also consider token usage, streaming, etc.
 */

"use server"

import { ActionState } from "@/types"
import { createMessageAction } from "@/actions/db/conversation-actions"

/**
 * @interface SendMessageProps
 * @property {string} conversationId - The ID of the conversation
 * @property {string} userId - The ID of the user sending the message
 * @property {string} content - The text of the user’s message
 */
interface SendMessageProps {
  conversationId: string
  userId: string
  content: string
}

/**
 * @function sendMessageAction
 * @async
 * @description
 *  Saves the user's message, then mocks an AI assistant response. 
 *  Returns both newly created messages (user + assistant).
 *
 * @param {SendMessageProps} props - Contains conversationId, userId, content
 * @returns {Promise<ActionState<{ userMessageId: string; assistantMessageId: string }>>}
 *  - On success, returns the new message IDs
 */
export async function sendMessageAction(
  props: SendMessageProps
): Promise<ActionState<{ userMessageId: string; assistantMessageId: string }>> {
  try {
    const { conversationId, userId, content } = props

    // 1. Store the user’s message
    const userMsg = await createMessageAction(conversationId, "user", content)
    if (!userMsg.isSuccess) {
      return { isSuccess: false, message: userMsg.message }
    }

    // 2. Mock LLM call. Instead of an API, we do a placeholder response
    const mockAssistantResponse = `This is a stub GPT-4o reply to: "${content}"`

    // 3. Store the assistant message
    const aiMsg = await createMessageAction(
      conversationId,
      "assistant",
      mockAssistantResponse
    )
    if (!aiMsg.isSuccess) {
      return { isSuccess: false, message: aiMsg.message }
    }

    return {
      isSuccess: true,
      message: "Message sent and AI responded (mock).",
      data: {
        userMessageId: userMsg.data.id,
        assistantMessageId: aiMsg.data.id
      }
    }
  } catch (error) {
    console.error("Error in sendMessageAction:", error)
    return { isSuccess: false, message: "Failed to send message" }
  }
}

```

File: app/(protected)/data-import/page.tsx
```tsx
/**
 * @description 
 * Server page for the Data Import route. It handles:
 * - User authentication (via Clerk)
 * - Fetching existing equity data from the DB
 * - Rendering client components for adding and listing/editing that data.
 * 
 * Key features:
 * - Protects route: redirects to /login if user is not authenticated
 * - Retrieves user's equity data from `equity-data-actions.ts`
 * - Renders two client components:
 *   1) ManualEntryForm for inserting new equity records
 *   2) EquityDataTable for listing, editing, and deleting existing records
 * 
 * @dependencies
 * - auth from "@clerk/nextjs/server"
 * - redirect from "next/navigation"
 * - getEquityDataByUserAction from "@/actions/db/equity-data-actions"
 * - ManualEntryForm from "./_components/manual-entry-form"
 * - EquityDataTable from "./_components/equity-data-table"
 * 
 * @notes
 * - This page does NOT gate membership level, so free users can access data import.
 * - If you need membership gating, add it after fetching the user profile.
 */

"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getEquityDataByUserAction } from "@/actions/db/equity-data-actions"
import ManualEntryForm from "./_components/manual-entry-form"
import CsvUploader from "./_components/csv-uploader"
import EquityDataTable from "./_components/equity-data-table"
import CredentialInput from "./_components/credential-input"

export default async function DataImportPage() {
  // Check user session
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  // Fetch existing equity data for this user
  const equityDataRes = await getEquityDataByUserAction(userId)
  if (!equityDataRes.isSuccess) {
    // You could display an error message or debug info here
    // For now, let's treat it as an empty array
    console.error("Failed to retrieve equity data:", equityDataRes.message)
  }

  const userEquityData = equityDataRes.data || []

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Data Import & Manual Input</h1>

      {/** Form to add a new equity record */}
      <ManualEntryForm userId={userId} />
      <hr className="my-6" />

      <CsvUploader userId={userId} />
      <hr className="my-6" />

      <CredentialInput userId={userId} />
      <hr className="my-6" />

      {/** Table to list existing equity data (with update/delete) */}
      <EquityDataTable userId={userId} initialData={userEquityData} />
    </div>
  )
}

```

File: app/(protected)/data-import/_components/csv-uploader.tsx
```tsx
/**
 * @description
 * A client component that provides a form for CSV file upload. 
 * When the user submits the form, it calls the `parseCsvAction` server action
 * with the uploaded CSV file. 
 * 
 * Key features:
 * - Simple form with file input (type="file")
 * - Accepts .csv files
 * - Calls parseCsvAction from "equity-data-actions.ts" to parse the CSV rows
 * - Refreshes the page on completion so the newly added data is visible
 * 
 * @dependencies
 * - parseCsvAction (server action) from "@/actions/db/equity-data-actions"
 * - useRouter from "next/navigation" for refreshing the page or redirecting
 * 
 * @notes
 * - The parseCsvAction will parse each row, create new records in `equity_data`,
 *   and return a success/failure result.
 * - We rely on Next.js 13+ server actions for multipart form submission support.
 * - Additional CSV validations or advanced parsing can be added as needed.
 */

"use client"

import { useRouter } from "next/navigation"
import { parseCsvAction } from "@/actions/db/equity-data-actions"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CsvUploaderProps {
  userId: string
}

export default function CsvUploader({ userId }: CsvUploaderProps) {
  // We'll track a local message for success/error feedback if desired
  const [errorMessage, setErrorMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  /**
   * @function handleChange
   * We clear out any previous error messages when a new file is chosen.
   */
  function handleChange() {
    setErrorMessage("")
  }

  /**
   * @function handleSubmit
   * We intercept the form submission to show a loading state. 
   * The actual parsing is handled in parseCsvAction server action.
   */
  async function handleSubmit() {
    setIsUploading(true)
  }

  return (
    <div className="mt-6">
      <h3 className="mb-2 text-lg font-semibold">Upload CSV</h3>

      <form
        action={async formData => {
          // This function automatically executes parseCsvAction with the formData
          // Then we handle the returned result to show success/error
          setIsUploading(true)
          setErrorMessage("")

          const res = await parseCsvAction(formData)

          setIsUploading(false)

          if (!res.isSuccess) {
            setErrorMessage(res.message)
            return
          }

          // If success, refresh the page to see new entries
          router.refresh()
        }}
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="flex flex-col space-y-2"
      >
        <input type="hidden" name="userId" value={userId} />

        <input
          type="file"
          name="csvFile"
          accept=".csv"
          onChange={handleChange}
          className="file:mr-2 file:rounded file:border file:px-2 file:py-1"
        />

        {errorMessage && (
          <p className="text-destructive text-sm">{errorMessage}</p>
        )}

        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Import CSV"}
        </Button>
      </form>
    </div>
  )
}


```

File: actions/scraping-actions.ts
```ts
/**
 * @description
 * This file provides server actions related to Carta scraping. Currently, it
 * contains a placeholder stub that simulates Selenium-based scraping, returning
 * mock data.
 * 
 * Key Features:
 * - scrapeCartaDataAction: Accepts a userId and credentials, logs them, and returns
 *   mock data for demonstration.
 * 
 * @dependencies
 * - auth from "@clerk/nextjs/server" if we need to authenticate the request
 * - ActionState from "@/types" for standard success/failure patterns
 * 
 * @notes
 * - In a real scenario, you would implement logic here to launch a Selenium or
 *   Puppeteer browser, navigate to Carta, log in with the provided credentials,
 *   and scrape the relevant equity data. 
 * - Always handle credentials securely; do not store plain-text passwords in logs
 *   or in the database. 
 * - This is purely a stub for the MVP.
 */

"use server"

import { ActionState } from "@/types"

interface CartaCredentials {
  email: string
  password: string
}

/**
 * @function scrapeCartaDataAction
 * @async
 * @description
 *  Placeholder function that simulates Selenium-based scraping to retrieve
 *  Carta data using user credentials. For now, returns static mock data.
 * 
 * @param {string} userId - The ID of the user who is attempting to scrape Carta.
 * @param {CartaCredentials} credentials - An object containing email and password.
 * @returns {Promise<ActionState<{ mockData: string }>>}
 *  - A success or failure result, with mock data on success.
 * 
 * @example
 *  const result = await scrapeCartaDataAction("user_abc", {
 *    email: "test@example.com",
 *    password: "password123"
 *  })
 */
export async function scrapeCartaDataAction(
  userId: string,
  credentials: CartaCredentials
): Promise<ActionState<{ mockData: string }>> {
  try {
    // TODO: Replace with real Selenium or Puppeteer logic
    console.log(
      `Pretending to scrape Carta for userId: ${userId} with credentials:`,
      credentials
    )

    // Return a mock result for demonstration
    return {
      isSuccess: true,
      message: "Scraped Carta data successfully (stub).",
      data: {
        mockData:
          "This is placeholder data. In a real implementation, we'd parse Carta pages."
      }
    }
  } catch (error) {
    console.error("Error scraping Carta:", error)
    return { isSuccess: false, message: "Failed to scrape Carta" }
  }
}


```

File: actions/insights-actions.ts
```ts
/**
 * @description
 * This file provides server actions for generating actionable insights and
 * recommendations related to a user's equity data. For now, we return placeholder
 * messages to demonstrate how we might guide the user about exercising options,
 * upcoming tax considerations, or general vesting reminders.
 * 
 * Key Features:
 * - getInsightsAction: Fetches user equity data, returns basic placeholder insights.
 * 
 * @dependencies
 * - db from "@/db/db": to retrieve the user's equity data
 * - eq from "drizzle-orm": for DB filtering
 * - ActionState from "@/types": to return success/failure states
 * - InsertEquityData, SelectEquityData from "@/db/schema/equity-schema"
 * 
 * @notes
 * - This is an MVP approach. Future expansions might incorporate real tax logic, 
 *   actual vesting schedule calculations, or tie into external APIs.
 * - If the user has no equity data, we can return an empty array or basic disclaimers.
 */

"use server"

import { ActionState } from "@/types"
import { db } from "@/db/db"
import { equityDataTable, SelectEquityData } from "@/db/schema/equity-schema"
import { eq } from "drizzle-orm"

/**
 * @function getInsightsAction
 * @async
 * @description
 *  Reads the user's equity data from the DB and generates a small set of 
 *  placeholder insights or recommendations. 
 *
 * @param {string} userId - The user's ID (from Clerk).
 * @returns {Promise<ActionState<string[]>>} - An array of insight strings, or empty if none.
 */
export async function getInsightsAction(
  userId: string
): Promise<ActionState<string[]>> {
  try {
    // 1. Retrieve user equity data
    const records: SelectEquityData[] = await db.query.equityData.findMany({
      where: eq(equityDataTable.userId, userId)
    })

    if (!records || records.length === 0) {
      // If no equity data, return a friendly placeholder
      return {
        isSuccess: true,
        message: "No equity records found.",
        data: [
          "We don't see any equity data yet. Add data or upload a CSV to get insights."
        ]
      }
    }

    // 2. Build placeholder insights
    //    We do naive logic or just generic disclaimers for this MVP
    const insights: string[] = []

    // Example: For each record, mention vesting, tax, etc.
    records.forEach((record, index) => {
      const details = record.equityDetails as Record<string, any>
      const grantType = details.grantType ?? "Grant"
      const shares = details.shares ?? 0
      const strikePrice = details.strikePrice ?? 0

      insights.push(
        `Equity #${index + 1}: You have a ${grantType} grant with ${shares} shares at a strike price of $${strikePrice}.`
      )
    })

    // Add a few general placeholders
    insights.push(
      "Remember to monitor upcoming vesting events for potential tax considerations.",
      "Consider your personal liquidity needs before exercising. Consult a tax professional if unsure."
    )

    return {
      isSuccess: true,
      message: "Insights generated successfully",
      data: insights
    }
  } catch (error) {
    console.error("Error generating insights:", error)
    return {
      isSuccess: false,
      message: "Failed to generate insights"
    }
  }
}

```

File: app/(protected)/chat/_components/chat-interface.tsx
```tsx
/**
 * @description
 * The main chat interface for EquiChat's MVP. Shows a list of existing messages 
 * (both user and assistant) and an input for sending new messages. We also now
 * display user-specific equity insights (placeholders) at the top.
 * 
 * Key features:
 * - Displays conversation messages sorted by creation time
 * - Input for sending user messages
 * - Calls the sendMessageAction server action to store the user message
 *   and generate a mock AI assistant reply
 * - Shows "insights" passed in from the server
 * 
 * @dependencies
 * - sendMessageAction from "@/actions/chat-actions"
 * - React useState for local input state
 * - Next.js router for refreshing to fetch updated messages
 * - "insights": a string[] array of placeholders for the user
 * 
 * @notes
 * - Future expansions might incorporate these insights dynamically into the chat,
 *   e.g., a special "Insights" prompt appended to user queries or a clickable suggestions panel.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/hooks/use-toast"
import { sendMessageAction } from "@/actions/chat-actions"
import { SelectMessage } from "@/db/schema/conversations-schema"

interface ChatInterfaceProps {
  userId: string
  conversationId: string
  existingMessages: SelectMessage[]
  insights: string[] // Step 11: We add this new prop for displaying user equity insights
}

export default function ChatInterface({
  userId,
  conversationId,
  existingMessages,
  insights
}: ChatInterfaceProps) {
  // Local input state for new message
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()

  /**
   * @function handleSendMessage
   * Called when user presses "Send" or hits Enter in the input.
   * Calls the server action to store user message, plus a mock AI reply.
   */
  async function handleSendMessage() {
    if (!messageText.trim()) {
      return
    }

    setIsSending(true)

    const res = await sendMessageAction({
      conversationId,
      userId,
      content: messageText.trim()
    })

    setIsSending(false)
    setMessageText("")

    if (!res.isSuccess) {
      toast({
        title: "Error sending message",
        description: res.message,
        variant: "destructive"
      })
      return
    }

    // Refresh page to load new messages from the DB
    router.refresh()
  }

  return (
    <div className="border rounded p-4 max-w-2xl space-y-4">
      {/* Step 11: Display user insights if any */}
      {insights && insights.length > 0 && (
        <div className="bg-secondary/10 p-3 rounded">
          <h2 className="text-lg font-bold mb-2">Your Equity Insights:</h2>

          <ul className="list-disc list-inside text-sm space-y-1">
            {insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display the conversation messages */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {existingMessages.map(msg => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.role === "user"
                ? "bg-secondary text-secondary-foreground self-end"
                : "bg-accent text-accent-foreground self-start"
            }`}
          >
            <span className="block text-sm font-bold">
              {msg.role.toUpperCase()}
            </span>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      {/* Input for new messages */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleSendMessage()
            }
          }}
        />

        <Button onClick={handleSendMessage} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  )
}

```

File: app/(protected)/chat/_components/document-uploader.tsx
```tsx
/**
 * @description
 * A client component that provides an interface for uploading PDF or image documents
 * to Supabase storage and creating a `documents` table record. 
 * 
 * Key Features:
 * - Accepts a userId prop to tie documents to that user
 * - Renders a simple <form> that calls our uploadDocumentStorage server action
 * - On success, can refresh the page or do other logic
 * 
 * @dependencies
 * - uploadDocumentStorage from "@/actions/storage/storage-actions"
 * - Next.js "useRouter" for page refresh
 * 
 * @notes
 * - This is a minimal example. We can also show a preview, progress bar, etc.
 * - For more advanced usage, we might handle multiple files or chunk uploads for large PDFs.
 */

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { uploadDocumentStorage } from "@/actions/storage/storage-actions"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/hooks/use-toast"

interface DocumentUploaderProps {
  userId: string
}

export default function DocumentUploader({ userId }: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter()

  /**
   * @function handleSubmit
   *  Binds to a <form> action. We'll pass the FormData to our server action 
   *  "uploadDocumentStorage". On success, we refresh or handle success.
   */
  async function handleSubmit(formData: FormData) {
    setIsUploading(true)
    setErrorMessage("")

    const res = await uploadDocumentStorage(formData)
    setIsUploading(false)

    if (!res.isSuccess) {
      setErrorMessage(res.message)
      toast({
        title: "Upload Error",
        description: res.message,
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Upload Success",
      description: "Document uploaded successfully."
    })

    // Refresh the page to see newly uploaded doc, if we choose to list them
    router.refresh()
  }

  return (
    <div className="mt-6 p-4 border rounded space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold">Upload a Document</h2>

      <form
        action={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col space-y-2"
      >
        <input type="hidden" name="userId" value={userId} />

        <input
          type="file"
          name="file"
          accept=".pdf,image/*"
          // Additional validation can be done client-side
        />

        {errorMessage && (
          <div className="text-destructive text-sm">{errorMessage}</div>
        )}

        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Document"}
        </Button>
      </form>
    </div>
  )
}

```

File: app/(protected)/chat/page.tsx
```tsx
"use server"
/**
 * @description
 * Server page for the chat route. It ensures the user is authenticated,
 * retrieves or creates a conversation for them, fetches existing messages,
 * fetches user equity insights, then renders a ChatInterface client component.
 * 
 * Key Features:
 * - Auth check (Clerk) -> if no user, redirect
 * - Retrieve or create conversation 
 * - Fetch messages for the conversation
 * - Fetch user equity insights (Step 11) from getInsightsAction
 * - Render the chat interface with both messages and insights
 * 
 * @notes
 * - This example picks the FIRST conversation found or creates a new one 
 *   if none exist. 
 * - If you want more advanced conversation management, expand here.
 */

import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { 
  getConversationsByUserAction, 
  createConversationAction, 
  getMessagesByConversationAction 
} from "@/actions/db/conversation-actions"

import ChatInterface from "./_components/chat-interface"

// Step 11 import:
import { getInsightsAction } from "@/actions/insights-actions"

export default async function ChatPage() {
  // 1. Check if user is logged in
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  // 2. Retrieve or create a conversation for this user
  const userConvos = await getConversationsByUserAction(userId)
  if (!userConvos.isSuccess) {
    console.error("Could not fetch user conversations:", userConvos.message)
    return redirect("/login") // or show an error
  }

  let conversationId = ""
  if (userConvos.data.length > 0) {
    // We'll just pick the first conversation for demonstration
    conversationId = userConvos.data[0].id
  } else {
    // Create a new conversation if none exist
    const newConv = await createConversationAction(userId)
    if (!newConv.isSuccess) {
      console.error("Could not create conversation:", newConv.message)
      return redirect("/login") // or show an error
    }
    conversationId = newConv.data.id
  }

  // 3. Fetch messages for that conversation
  const messagesRes = await getMessagesByConversationAction(conversationId)
  if (!messagesRes.isSuccess) {
    console.error("Could not fetch messages:", messagesRes.message)
  }
  const existingMessages = messagesRes.data ?? []

  // Step 11: fetch the user's equity insights
  const insightsRes = await getInsightsAction(userId)
  const userInsights = insightsRes.isSuccess ? insightsRes.data : []

  // 4. Render the chat interface
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Chatbot</h1>

      <ChatInterface
        userId={userId}
        conversationId={conversationId}
        existingMessages={existingMessages}
        insights={userInsights}
      />
    </div>
  )
}

```

File: actions/storage/storage-actions.ts
```ts
/**
 * @description
 * Server actions for handling file uploads (PDFs, images) to Supabase Storage.
 * We also create a document record in the `documents` table so that 
 * the file can be referenced later by the chatbot.
 * 
 * Key Features:
 * - uploadDocumentStorage: Accepts a FormData object, extracts the file, 
 *   validates it, uploads to Supabase, and creates a DB record. 
 * 
 * @dependencies
 * - createClientComponentClient from "@supabase/auth-helpers-nextjs"
 *   for interacting with Supabase from a server action in Next.js 13+ 
 *   (although typically used in client components, it also works in server actions).
 * - createDocumentAction from "@/actions/db/documents-actions" to create the DB record.
 * - We rely on environment variables to specify the bucket name and other optional settings.
 * 
 * @notes
 * - In real usage, ensure your PDF or image max size suits your environment.
 * - We do minimal validation here. Expand as needed (MIME checks, PDF checks, etc.).
 * - The "userId" is required from the formData. We'll store files at: 
 *   "BUCKET_NAME/userId/randomFileName" 
 * - We generate a random file name to avoid collisions. 
 */

"use server"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ActionState } from "@/types"
import { randomUUID } from "crypto"
import { createDocumentAction } from "@/actions/db/documents-actions"
import { fileTypeEnum } from "@/db/schema/documents-schema"

// 10MB max for demonstration
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * @function uploadDocumentStorage
 * @async
 * @description
 *  Handles the file upload from a `<form>` submission. Expects:
 *   - "file" in FormData
 *   - "userId" in FormData
 * 
 *  Validates file type (PDF or image), file size, then uploads to Supabase. 
 *  Lastly, inserts a row into the `documents` table via createDocumentAction.
 * 
 * @param {FormData} formData - The multipart form data from a <form>.
 * @returns {Promise<ActionState<{ documentId: string }>>}
 *  - On success, returns the newly created `documentId`.
 */
export async function uploadDocumentStorage(
  formData: FormData
): Promise<ActionState<{ documentId: string }>> {
  try {
    // 1. Extract userId and file
    const userId = formData.get("userId") as string
    const file = formData.get("file") as File | null

    if (!userId) {
      return { isSuccess: false, message: "Missing userId in formData" }
    }
    if (!file) {
      return { isSuccess: false, message: "No file uploaded" }
    }

    // 2. Basic file size check
    if (file.size > MAX_FILE_SIZE) {
      return {
        isSuccess: false,
        message: `File size exceeds max limit of ${MAX_FILE_SIZE} bytes`
      }
    }

    // 3. Determine file type for our DB enum: 'pdf' or 'image'.
    //    We'll do a naive check on the MIME type and extension.
    let fileType: typeof fileTypeEnum._type // "pdf" | "image"
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      fileType = "pdf"
    } else if (
      file.type.startsWith("image/") ||
      file.name.toLowerCase().match(/\.(png|jpe?g|gif|webp)$/)
    ) {
      fileType = "image"
    } else {
      return {
        isSuccess: false,
        message: "Unsupported file type. Only PDF or images allowed."
      }
    }

    // 4. Upload to Supabase storage
    //    We'll use an env variable for the bucket name: process.env.SUPABASE_DOCS_BUCKET
    //    If not set, default to "documents".
    const bucketName = process.env.SUPABASE_DOCS_BUCKET || "documents"
    const supabase = createClientComponentClient()

    // Generate a unique path for the file. e.g. "documents/<userId>/uuid-filename.pdf"
    const fileExt = file.name.split(".").pop()
    const randomFilename = `${randomUUID()}.${fileExt}`
    const filePath = `${userId}/${randomFilename}`

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type
      })

    if (error) {
      console.error("Supabase upload error:", error)
      return { isSuccess: false, message: "Failed to upload file" }
    }

    // 5. Insert a record into `documents` table
    //    We store the path as returned by supabase, along with the userId and fileType
    const docResult = await createDocumentAction({
      userId,
      fileType,
      filePath: data.path
      // We'll rely on `insertDocumentAction` to set `uploadedAt` automatically.
    })

    if (!docResult.isSuccess) {
      // If DB insertion fails, consider cleaning up the uploaded file from storage 
      // for consistency. We'll skip that for brevity, but in production you'd do so.
      return { isSuccess: false, message: docResult.message }
    }

    // 6. Return success with newly created doc ID
    return {
      isSuccess: true,
      message: "File uploaded and document record created",
      data: { documentId: docResult.data.id }
    }
  } catch (err) {
    console.error("Error in uploadDocumentStorage action:", err)
    return { isSuccess: false, message: "An error occurred during upload" }
  }
}


```

File: app/(protected)/data-import/_components/credential-input.tsx
```tsx
/**
 * @description
 * This client component allows a user to input their Carta credentials, which
 * are then sent to a server action (`scrapeCartaDataAction`) to simulate (stub)
 * automated web scraping. For now, we simply return mock data from the server.
 * 
 * Key Features:
 * - A simple form with fields for email and password
 * - Submits data to the server action
 * - Displays either a success message containing mock data, or an error
 * 
 * @dependencies
 * - scrapeCartaDataAction from "@/actions/scraping-actions"
 * - The `userId` passed in from a parent server component or page
 * - Next.js "use router" for potential refreshing or navigation
 * - Basic Tailwind styling
 * 
 * @notes
 * - In production, ensure that credentials are handled securely and not stored in logs.
 * - If implementing real Selenium scraping, you must handle the browser steps in 
 *   `scrapeCartaDataAction`.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { scrapeCartaDataAction } from "@/actions/scraping-actions"
import { toast } from "@/lib/hooks/use-toast"

interface CredentialInputProps {
  userId: string
}

export default function CredentialInput({ userId }: CredentialInputProps) {
  // Local state for storing email/password
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mockData, setMockData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * @function handleSubmit
   * Submits the credentials to the server action. On success, displays the mock data.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setMockData(null)

    const result = await scrapeCartaDataAction(userId, { email, password })
    setIsLoading(false)

    if (!result.isSuccess) {
      toast({
        title: "Scraping Error",
        description: result.message,
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Scraping Successful",
      description: result.message
    })
    setMockData(result.data.mockData)
  }

  return (
    <div className="mt-6 bg-muted p-4 rounded shadow">
      <h3 className="mb-2 text-lg font-semibold">Automated Carta Scraping (Stub)</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="carta-email">
            Carta Email
          </label>
          <Input
            id="carta-email"
            type="email"
            placeholder="your-email@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="carta-password">
            Password
          </label>
          <Input
            id="carta-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Scraping..." : "Scrape My Carta Data"}
        </Button>
      </form>

      {mockData && (
        <div className="mt-4 rounded bg-card p-2">
          <p className="font-semibold mb-1">Scrape Results (Stub):</p>
          <p className="text-sm text-muted-foreground">{mockData}</p>
        </div>
      )}
    </div>
  )
}

```

File: db/schema/index.ts
```ts
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


```

File: db/db.ts
```ts
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
  todosTable,
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
  todos: todosTable,
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


```

File: actions/simulation-actions.ts
```ts
/**
 * @description
 * This file provides server actions for personalized "what-if" simulations.
 * For Step 12, we implement a basic scenario where a user inputs a hypothetical
 * company valuation, and we compute a naive potential equity value based on
 * the user's total shares from the database.
 *
 * Key Features:
 * - simulateValuationAction: Fetches user's total shares, multiplies by newValuation
 *   to compute a simplified "potentialValue."
 *
 * @dependencies
 * - db from "@/db/db": used to query user equity data
 * - eq from "drizzle-orm": for DB filtering
 * - equityDataTable from "@/db/schema/equity-schema": to find how many shares the user owns
 * - ActionState from "@/types": standard success/failure structure
 *
 * @notes
 * - This is a barebones example. Real calculations may consider vesting schedules,
 *   strike prices, tax treatments, or partial ownership. For now, we just sum shares
 *   and multiply by newValuation.
 * - The `newValuation` is provided in the UI as a single number. We assume it's a
 *   "per share" figure or a simplified price. We do not enforce advanced checks.
 */

"use server"

import { eq } from "drizzle-orm"
import { db } from "@/db/db"
import { equityDataTable } from "@/db/schema/equity-schema"
import { ActionState } from "@/types"

/**
 * @interface SimulateValuationProps
 * @property {string} userId - The ID of the user from Clerk.
 * @property {number} newValuation - The hypothetical price per share (or simple valuation metric).
 */
interface SimulateValuationProps {
  userId: string
  newValuation: number
}

/**
 * @function simulateValuationAction
 * @async
 * @description
 *  Fetches all equity data for the given user, sums up total shares,
 *  multiplies by the provided newValuation, and returns a naive "potentialValue."
 *
 * @param {SimulateValuationProps} props - The simulation inputs (userId, newValuation).
 * @returns {Promise<ActionState<{ potentialValue: number; totalShares: number }>>}
 *  On success, returns the computed potentialValue and the total number of shares.
 */
export async function simulateValuationAction(
  props: SimulateValuationProps
): Promise<ActionState<{ potentialValue: number; totalShares: number }>> {
  try {
    const { userId, newValuation } = props

    if (!userId || newValuation <= 0) {
      return {
        isSuccess: false,
        message: "Invalid userId or newValuation."
      }
    }

    // 1. Fetch all equity_data for the user
    const userEquity = await db.query.equityData.findMany({
      where: eq(equityDataTable.userId, userId)
    })

    // 2. Sum up the total number of shares
    let totalShares = 0
    userEquity.forEach(record => {
      const details = record.equityDetails as Record<string, any>
      const shares = details.shares ? Number(details.shares) : 0
      totalShares += shares
    })

    // 3. Potential value = totalShares * newValuation
    const potentialValue = totalShares * newValuation

    return {
      isSuccess: true,
      message: "Simulation successful",
      data: { potentialValue, totalShares }
    }
  } catch (error) {
    console.error("Error in simulateValuationAction:", error)
    return {
      isSuccess: false,
      message: "Failed to run simulation"
    }
  }
}

```

File: app/(protected)/simulations/_components/simulations-panel.tsx
```tsx
/**
 * @description
 * A client component that allows the user to input a hypothetical new valuation (e.g., per share price)
 * and see a naive "potential value" of their shares. Demonstrates interactive scenario modeling for Step 12.
 *
 * Key Features:
 * - Takes userId from props for server action calls.
 * - Uses a numeric input or slider to adjust newValuation.
 * - Calls the simulateValuationAction on changes to fetch a computed potential value.
 *
 * @dependencies
 * - simulateValuationAction from "@/actions/simulations-actions" to handle server logic
 * - React useState for local component state
 * - toast from "@/lib/hooks/use-toast" for error handling
 *
 * @notes
 * - This is a minimal example. Real scenarios might integrate advanced tax logic, vesting schedules, etc.
 * - We do not handle advanced input validation beyond checking a positive number. Expand as needed.
 */

"use client"

import { useState } from "react"
import { simulateValuationAction } from "@/actions/simulation-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/hooks/use-toast"

interface SimulationsPanelProps {
  userId: string
}

export default function SimulationsPanel({ userId }: SimulationsPanelProps) {
  // Local state for newValuation
  const [newValuation, setNewValuation] = useState<number>(10)
  // We'll store the result from the server in a small object
  const [simulationResult, setSimulationResult] = useState<{
    potentialValue: number
    totalShares: number
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  /**
   * @function handleSimulate
   * Called whenever the user wants to run the "what-if" simulation.
   * We call the server action with userId and newValuation, then store the result.
   */
  async function handleSimulate() {
    if (newValuation <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valuation greater than 0.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    const res = await simulateValuationAction({
      userId,
      newValuation
    })

    setIsLoading(false)

    if (!res.isSuccess) {
      toast({
        title: "Simulation Error",
        description: res.message,
        variant: "destructive"
      })
      return
    }

    setSimulationResult(res.data)
  }

  return (
    <div className="border p-4 rounded max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Hypothetical Valuation Simulator
      </h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="valuation-input">
          Enter a hypothetical valuation (per share):
        </label>

        <Input
          id="valuation-input"
          type="number"
          step="1"
          min="1"
          value={newValuation}
          onChange={e => setNewValuation(Number(e.target.value))}
        />
      </div>

      <Button onClick={handleSimulate} disabled={isLoading}>
        {isLoading ? "Calculating..." : "Run Simulation"}
      </Button>

      {simulationResult && (
        <div className="mt-6 bg-muted p-3 rounded">
          <p className="text-sm">
            You have a total of{" "}
            <span className="font-bold">{simulationResult.totalShares}</span>{" "}
            shares.
          </p>
          <p className="text-sm">
            At a valuation of{" "}
            <span className="font-bold">${newValuation.toFixed(2)}</span> per
            share, your potential equity value is:
          </p>
          <p className="text-lg font-semibold">
            ${simulationResult.potentialValue.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}

```

File: app/(protected)/simulations/page.tsx
```tsx
"use server"
/**
 * @description
 * Server page for the "Personalized What-If Simulations" route (Step 12).
 * Ensures the user is authenticated, then displays a minimal simulation UI.
 *
 * Key Features:
 * - Auth check using Clerk's `auth()`
 * - Renders a SimulationsPanel client component for user interactions
 *
 * @dependencies
 * - auth from "@clerk/nextjs/server"
 * - redirect from "next/navigation"
 * - SimulationsPanel from "./_components/simulations-panel"
 *
 * @notes
 * - In real usage, you might fetch user data or membership level here before rendering.
 * - For now, we simply pass userId down to SimulationsPanel for the server action calls.
 */

import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import SimulationsPanel from "./_components/simulations-panel"

export default async function SimulationsPage() {
  const { userId } = await auth()

  if (!userId) {
    // If not logged in, redirect to login
    return redirect("/login")
  }

  // If you want to gate certain membership levels, you could check profile here
  // For example, if the user has "free" membership, you might redirect them to /pricing

  // Render the new SimulationsPanel to let user run "what if" scenarios
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">What-If Simulations</h1>
      <p className="mb-4">
        Explore hypothetical scenarios by adjusting your company's valuation or
        share price to see a naive estimate of your equity's potential value.
      </p>

      <SimulationsPanel userId={userId} />
    </div>
  )
}

```

File: actions/db/conversation-actions.ts
```ts
/**
 * @description
 * Provides server actions for creating and managing Conversations and Messages.
 * 
 * The `conversationsTable` stores each conversation and references the `profilesTable`.
 * The `messagesTable` stores each chat message and references its parent conversation.
 * 
 * Key Features:
 * - Create, Read, Update, Delete (CRUD) for Conversation records
 * - Create, Read, Update, Delete (CRUD) for Message records
 * - A new getAllConversationsAction for admin to see all user conversations
 * 
 * @dependencies
 * - db from "@/db/db" for Drizzle ORM
 * - InsertConversation, SelectConversation, InsertMessage, SelectMessage from "@/db/schema/conversations-schema"
 * - eq, desc from "drizzle-orm" for building WHERE or ORDER BY clauses
 * 
 * @notes
 * - Return types follow the ActionState<T> pattern from "@/types/server-action-types"
 * - The conversation <-> messages relationship is cascaded on delete, so deleting a conversation will remove its messages.
 * - getAllConversationsAction is restricted to Admin usage in the plan, so use it carefully in the Admin route only.
 */

"use server"

import { db } from "@/db/db"
import {
  conversationsTable,
  messagesTable,
  InsertConversation,
  SelectConversation,
  InsertMessage,
  SelectMessage
} from "@/db/schema/conversations-schema"
import { ActionState } from "@/types"
import { eq, desc } from "drizzle-orm"

/**
 * @function createConversationAction
 * @async
 * @description
 *  Inserts a new record in the conversations table for a given userId.
 *  By default, startedAt is set to "now" and endedAt is null until the conversation is ended.
 * 
 * @param {string} userId - The ID of the user who owns this conversation.
 * @returns {Promise<ActionState<SelectConversation>>}
 */
export async function createConversationAction(
  userId: string
): Promise<ActionState<SelectConversation>> {
  try {
    const [conversation] = await db
      .insert(conversationsTable)
      .values({ userId })
      .returning()

    return {
      isSuccess: true,
      message: "Conversation created successfully",
      data: conversation
    }
  } catch (error) {
    console.error("Error creating conversation:", error)
    return {
      isSuccess: false,
      message: "Failed to create conversation"
    }
  }
}

/**
 * @function getConversationsByUserAction
 * @async
 * @description
 *  Fetches all conversations that belong to the specified userId.
 * 
 * @param {string} userId - The ID of the user whose conversations to retrieve.
 * @returns {Promise<ActionState<SelectConversation[]>>}
 */
export async function getConversationsByUserAction(
  userId: string
): Promise<ActionState<SelectConversation[]>> {
  try {
    const conversations = await db.query.conversations.findMany({
      where: eq(conversationsTable.userId, userId),
      orderBy: (convo, { desc }) => [desc(convo.createdAt)]
    })

    return {
      isSuccess: true,
      message: "Conversations retrieved successfully",
      data: conversations
    }
  } catch (error) {
    console.error("Error retrieving conversations by user:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve conversations"
    }
  }
}

/**
 * @function getConversationByIdAction
 * @async
 * @description
 *  Fetches a single conversation by its UUID.
 *  Does not include messages. For messages, call getMessagesByConversationAction separately.
 * 
 * @param {string} conversationId - The UUID of the conversation.
 * @returns {Promise<ActionState<SelectConversation>>}
 */
export async function getConversationByIdAction(
  conversationId: string
): Promise<ActionState<SelectConversation>> {
  try {
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversationsTable.id, conversationId)
    })

    if (!conversation) {
      return {
        isSuccess: false,
        message: "Conversation not found"
      }
    }

    return {
      isSuccess: true,
      message: "Conversation retrieved successfully",
      data: conversation
    }
  } catch (error) {
    console.error("Error retrieving conversation by ID:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve conversation"
    }
  }
}

/**
 * @function updateConversationAction
 * @async
 * @description
 *  Partially updates a conversation record by ID. 
 *  Any valid fields from InsertConversation may be passed in `data`.
 * 
 * @param {string} conversationId - The UUID of the conversation to update.
 * @param {Partial<InsertConversation>} data - Fields to update (e.g., endedAt).
 * @returns {Promise<ActionState<SelectConversation>>}
 */
export async function updateConversationAction(
  conversationId: string,
  data: Partial<InsertConversation>
): Promise<ActionState<SelectConversation>> {
  try {
    const [updated] = await db
      .update(conversationsTable)
      .set(data)
      .where(eq(conversationsTable.id, conversationId))
      .returning()

    if (!updated) {
      return {
        isSuccess: false,
        message: "No matching conversation found"
      }
    }

    return {
      isSuccess: true,
      message: "Conversation updated successfully",
      data: updated
    }
  } catch (error) {
    console.error("Error updating conversation:", error)
    return {
      isSuccess: false,
      message: "Failed to update conversation"
    }
  }
}

/**
 * @function deleteConversationAction
 * @async
 * @description
 *  Deletes a conversation by its UUID, including all messages (via cascade).
 * 
 * @param {string} conversationId - The UUID of the conversation to delete.
 * @returns {Promise<ActionState<void>>}
 */
export async function deleteConversationAction(
  conversationId: string
): Promise<ActionState<void>> {
  try {
    const result = await db
      .delete(conversationsTable)
      .where(eq(conversationsTable.id, conversationId))
      .execute()

    if (result.length === 0) {
      return {
        isSuccess: false,
        message: "No matching conversation found to delete"
      }
    }

    return {
      isSuccess: true,
      message: "Conversation deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting conversation:", error)
    return {
      isSuccess: false,
      message: "Failed to delete conversation"
    }
  }
}

/**
 * @function createMessageAction
 * @async
 * @description
 *  Creates a new message in a specific conversation. 
 *  The role is typically either "user" or "assistant".
 * 
 * @param {string} conversationId - The UUID of the conversation to which we add the message.
 * @param {"user" | "assistant"} role - The role of the message (user or assistant).
 * @param {string} content - The text content of the message.
 * @returns {Promise<ActionState<SelectMessage>>}
 */
export async function createMessageAction(
  conversationId: string,
  role: "user" | "assistant",
  content: string
): Promise<ActionState<SelectMessage>> {
  try {
    const [msg] = await db
      .insert(messagesTable)
      .values({
        conversationId,
        role,
        content
      })
      .returning()

    return {
      isSuccess: true,
      message: "Message created successfully",
      data: msg
    }
  } catch (error) {
    console.error("Error creating message:", error)
    return {
      isSuccess: false,
      message: "Failed to create message"
    }
  }
}

/**
 * @function getMessagesByConversationAction
 * @async
 * @description
 *  Retrieves all messages belonging to a specific conversation ID, typically sorted by creation time.
 * 
 * @param {string} conversationId - The UUID of the conversation whose messages are being retrieved.
 * @returns {Promise<ActionState<SelectMessage[]>>}
 */
export async function getMessagesByConversationAction(
  conversationId: string
): Promise<ActionState<SelectMessage[]>> {
  try {
    const messages = await db.query.messages.findMany({
      where: eq(messagesTable.conversationId, conversationId),
      orderBy: (msg, { asc }) => [asc(msg.createdAt)]
    })

    return {
      isSuccess: true,
      message: "Messages retrieved successfully",
      data: messages
    }
  } catch (error) {
    console.error("Error retrieving messages by conversation:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve messages"
    }
  }
}

/**
 * @function updateMessageAction
 * @async
 * @description
 *  Partially updates a message record by its UUID. 
 *  Accepts partial InsertMessage fields (role, content).
 * 
 * @param {string} messageId - The UUID of the message to update.
 * @param {Partial<InsertMessage>} data - The fields to update.
 * @returns {Promise<ActionState<SelectMessage>>}
 */
export async function updateMessageAction(
  messageId: string,
  data: Partial<InsertMessage>
): Promise<ActionState<SelectMessage>> {
  try {
    const [updated] = await db
      .update(messagesTable)
      .set(data)
      .where(eq(messagesTable.id, messageId))
      .returning()

    if (!updated) {
      return {
        isSuccess: false,
        message: "No matching message found to update"
      }
    }

    return {
      isSuccess: true,
      message: "Message updated successfully",
      data: updated
    }
  } catch (error) {
    console.error("Error updating message:", error)
    return {
      isSuccess: false,
      message: "Failed to update message"
    }
  }
}

/**
 * @function deleteMessageAction
 * @async
 * @description
 *  Deletes a single message record by UUID.
 * 
 * @param {string} messageId - The UUID of the message to delete.
 * @returns {Promise<ActionState<void>>}
 */
export async function deleteMessageAction(
  messageId: string
): Promise<ActionState<void>> {
  try {
    const result = await db
      .delete(messagesTable)
      .where(eq(messagesTable.id, messageId))
      .execute()

    if (result.length === 0) {
      return {
        isSuccess: false,
        message: "No matching message found to delete"
      }
    }

    return {
      isSuccess: true,
      message: "Message deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting message:", error)
    return {
      isSuccess: false,
      message: "Failed to delete message"
    }
  }
}

/**
 * @function getAllConversationsAction
 * @async
 * @description
 *  Retrieves all conversations in the system (for admin only). 
 *  Sorted by createdAt descending. Use with caution.
 * 
 * @returns {Promise<ActionState<SelectConversation[]>>}
 */
export async function getAllConversationsAction(): Promise<
  ActionState<SelectConversation[]>
> {
  try {
    const conversations = await db.query.conversations.findMany({
      orderBy: (tbl, { desc }) => [desc(tbl.createdAt)]
    })

    return {
      isSuccess: true,
      message: "All conversations retrieved successfully",
      data: conversations
    }
  } catch (error) {
    console.error("Error retrieving all conversations:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve all conversations"
    }
  }
}


```

File: app/(admin)/layout.tsx
```tsx
/**
 * @description
 * This server layout provides an admin-only area. We check the user's membership
 * to ensure it's "pro" before allowing access. Otherwise, we redirect them to
 * "/pricing" (or you could do a 403 page).
 *
 * Key Features:
 * - Auth check using Clerk
 * - Profile membership check using getProfileByUserIdAction
 * - Minimal admin header for a consistent look
 *
 * @dependencies
 * - auth from "@clerk/nextjs/server"
 * - getProfileByUserIdAction from "@/actions/db/profiles-actions"
 * - redirect from "next/navigation"
 *
 * @notes
 * - This approach is simplistic. Production apps might require an explicit admin role
 *   or a separate table for admin users. We use membership='pro' as a stand-in.
 */

"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // 1. Clerk auth for user ID
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  // 2. Retrieve user profile
  const profileRes = await getProfileByUserIdAction(userId)
  if (!profileRes.isSuccess || !profileRes.data) {
    return redirect("/signup")
  }

  // 3. Basic membership check => must be "pro"
  if (profileRes.data.membership !== "pro") {
    return redirect("/pricing")
  }

  // 4. Render a minimal layout
  return (
    <div className="min-h-screen p-4">
      <div className="mb-6 border-b pb-2">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all user conversations
        </p>
      </div>

      {children}
    </div>
  )
}


```

File: actions/db/feedback-actions.ts
```ts
/**
 * @description
 * Provides server actions for CRUD operations on conversation feedback.
 * The table is `conversation_feedback`. Each record references a conversation,
 * has an integer rating, and free-text notes.
 *
 * Key Features:
 * - createOrUpdateFeedbackAction: Insert or update a single feedback entry for a conversation
 * - getFeedbackByConversationAction: Retrieve the existing feedback for a conversation
 *
 * @dependencies
 * - db from "@/db/db"
 * - conversationFeedbackTable, InsertConversationFeedback, SelectConversationFeedback
 * - eq from "drizzle-orm" for WHERE clause
 * - ActionState from "@/types"
 *
 * @notes
 * - For MVP, we assume one feedback record per conversation. If a row exists, we update it.
 * - Ratings: You might do 1 for thumbs up, 0 for thumbs down, or any scale you want.
 */

"use server"

import { db } from "@/db/db"
import {
  conversationFeedbackTable,
  InsertConversationFeedback,
  SelectConversationFeedback
} from "@/db/schema/feedback-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * @function createOrUpdateFeedbackAction
 * @async
 * @description
 *  Creates a new feedback record if none exists for the conversation, or updates
 *  the existing record. For MVP we assume only one record per conversation.
 *
 * @param {string} conversationId - the conversation to which the feedback belongs
 * @param {number} rating - numeric rating (0 or 1, but you can do any scale)
 * @param {string} notes - optional free-text critique
 *
 * @returns {Promise<ActionState<SelectConversationFeedback>>}
 */
export async function createOrUpdateFeedbackAction(
  conversationId: string,
  rating: number,
  notes?: string
): Promise<ActionState<SelectConversationFeedback>> {
  try {
    // Check if there's already feedback for this conversation
    const existing = await db.query.conversationFeedbackTable.findFirst({
      where: eq(conversationFeedbackTable.conversationId, conversationId)
    })

    if (!existing) {
      // Create a new record
      const [newFeedback] = await db
        .insert(conversationFeedbackTable)
        .values({
          conversationId,
          rating,
          notes
        })
        .returning()
      return {
        isSuccess: true,
        message: "Feedback created successfully",
        data: newFeedback
      }
    } else {
      // Update the existing record
      const [updatedFeedback] = await db
        .update(conversationFeedbackTable)
        .set({ rating, notes })
        .where(eq(conversationFeedbackTable.conversationId, conversationId))
        .returning()
      return {
        isSuccess: true,
        message: "Feedback updated successfully",
        data: updatedFeedback
      }
    }
  } catch (error) {
    console.error("Error creating/updating feedback:", error)
    return { isSuccess: false, message: "Failed to save feedback" }
  }
}

/**
 * @function getFeedbackByConversationAction
 * @async
 * @description
 *  Retrieves the feedback record (if any) for a specific conversation.
 *
 * @param {string} conversationId - The conversation UUID
 * @returns {Promise<ActionState<SelectConversationFeedback>>}
 */
export async function getFeedbackByConversationAction(
  conversationId: string
): Promise<ActionState<SelectConversationFeedback>> {
  try {
    const feedback = await db.query.conversationFeedback.findFirst({
      where: eq(conversationFeedbackTable.conversationId, conversationId)
    })
    if (!feedback) {
      return { isSuccess: false, message: "No feedback for this conversation" }
    }

    return {
      isSuccess: true,
      message: "Feedback retrieved",
      data: feedback
    }
  } catch (error) {
    console.error("Error retrieving feedback:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve feedback"
    }
  }
}


```

File: app/(admin)/_components/conversation-list.tsx
```tsx
/**
 * @description
 * A client component that lists all conversations. Each row shows the conversation's
 * ID, userId, startedAt, updatedAt. Admins could expand to rate or flag the conversation.
 *
 * Key Features:
 * - Accepts an array of SelectConversation objects
 * - Renders them in a simple table
 * - Provides a placeholder for admin feedback or rating
 *
 * @dependencies
 * - React useState if needed (we do minimal usage)
 * - Possibly can import a "flagConversationAction" if we want to implement that
 *
 * @notes
 * - For large data sets, consider pagination. This is a minimal MVP.
 * - Timestamps are displayed as strings. In real usage, format them with date-fns or similar.
 */

"use client"

import { SelectConversation } from "@/db/schema/conversations-schema"
import { Button } from "@/components/ui/button"

interface AdminConversationListProps {
  conversations: SelectConversation[]
}

export default function AdminConversationList({
  conversations
}: AdminConversationListProps) {
  if (conversations.length === 0) {
    return <div>No conversations found.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="border-b bg-muted">
            <th className="text-left p-2 font-semibold">ID</th>
            <th className="text-left p-2 font-semibold">User ID</th>
            <th className="text-left p-2 font-semibold">Started At</th>
            <th className="text-left p-2 font-semibold">Updated At</th>
            <th className="p-2 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {conversations.map(convo => (
            <tr key={convo.id} className="border-b">
              <td className="p-2 text-sm">{convo.id}</td>
              <td className="p-2 text-sm">{convo.userId}</td>
              <td className="p-2 text-sm">
                {convo.startedAt?.toISOString().split("T")[0]}
              </td>
              <td className="p-2 text-sm">
                {convo.updatedAt?.toISOString().split("T")[0]}
              </td>
              <td className="p-2 space-x-2">
                {/* Placeholder for rating or other admin actions */}
                <Button variant="outline" size="sm">
                  Rate
                </Button>
                <Button variant="outline" size="sm">
                  Flag
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


```

File: app/(admin)/dashboard/page.tsx
```tsx
/**
 * @description
 * The main admin dashboard page. Displays a list of all conversations
 * (across all users). Only accessible to membership="pro" users as enforced by layout.
 *
 * Key Features:
 * - Calls getAllConversationsAction to fetch data
 * - Displays them using a client component <AdminConversationList />
 *
 * @dependencies
 * - getAllConversationsAction from "@/actions/db/conversation-actions"
 * - AdminConversationList from "./_components/conversation-list"
 *
 * @notes
 * - In production, you might add search, pagination, filtering by user, etc.
 */

"use server"

import { getAllConversationsAction } from "@/actions/db/conversation-actions"
import AdminConversationList from "../_components/conversation-list"

export default async function AdminPage() {
  const allConvos = await getAllConversationsAction()

  if (!allConvos.isSuccess) {
    return (
      <div className="text-red-500">
        Error fetching conversations: {allConvos.message}
      </div>
    )
  }

  // We have all conversations in allConvos.data
  return (
    <div>
      <AdminConversationList conversations={allConvos.data} />
    </div>
  )
}


```

File: actions/db/prompts-actions.ts
```ts
/**
 * @description
 * Provides server actions for managing system prompts in the `prompts` table.
 * We can store multiple named prompts, mark one as active, etc.
 *
 * Key Features:
 * - createPromptAction: Insert a new prompt revision
 * - updatePromptAction: Partial update (like content or isActive)
 * - getAllPromptsAction: List all prompts
 * - setActivePromptAction: Helper to mark exactly one prompt as active
 *
 * @dependencies
 * - db from "@/db/db"
 * - promptsTable from "@/db/schema/prompts-schema"
 * - eq from "drizzle-orm"
 * - ActionState from "@/types"
 */

"use server"

import { db } from "@/db/db"
import {
  promptsTable,
  InsertPrompt,
  SelectPrompt
} from "@/db/schema/prompts-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * @function createPromptAction
 * @async
 * @description
 *  Inserts a new row into promptsTable. Typically used when admins add a new revision.
 *
 * @param {InsertPrompt} promptData - The name, content, and isActive (optional)
 * @returns {Promise<ActionState<SelectPrompt>>}
 */
export async function createPromptAction(
  promptData: InsertPrompt
): Promise<ActionState<SelectPrompt>> {
  try {
    const [created] = await db.insert(promptsTable).values(promptData).returning()
    return {
      isSuccess: true,
      message: "Prompt created successfully",
      data: created
    }
  } catch (error) {
    console.error("Error creating prompt:", error)
    return { isSuccess: false, message: "Failed to create prompt" }
  }
}

/**
 * @function getAllPromptsAction
 * @async
 * @description
 *  Retrieves all prompt records, optionally sorted by createdAt desc.
 *
 * @returns {Promise<ActionState<SelectPrompt[]>>}
 */
export async function getAllPromptsAction(): Promise<
  ActionState<SelectPrompt[]>
> {
  try {
    // For simplicity, sort newest first
    const prompts = await db.query.prompts.findMany({
      orderBy: (tbl, { desc }) => [desc(tbl.createdAt)]
    })
    return {
      isSuccess: true,
      message: "Prompts retrieved successfully",
      data: prompts
    }
  } catch (error) {
    console.error("Error fetching prompts:", error)
    return { isSuccess: false, message: "Failed to fetch prompts" }
  }
}

/**
 * @function updatePromptAction
 * @async
 * @description
 *  Partially updates a prompt by ID. Allows changing content, isActive, etc.
 *
 * @param {string} promptId - the UUID of the prompt to update
 * @param {Partial<InsertPrompt>} data - new content or isActive
 * @returns {Promise<ActionState<SelectPrompt>>}
 */
export async function updatePromptAction(
  promptId: string,
  data: Partial<InsertPrompt>
): Promise<ActionState<SelectPrompt>> {
  try {
    const [updated] = await db
      .update(promptsTable)
      .set(data)
      .where(eq(promptsTable.id, promptId))
      .returning()

    if (!updated) {
      return { isSuccess: false, message: "Prompt not found" }
    }

    return {
      isSuccess: true,
      message: "Prompt updated successfully",
      data: updated
    }
  } catch (error) {
    console.error("Error updating prompt:", error)
    return { isSuccess: false, message: "Failed to update prompt" }
  }
}

/**
 * @function setActivePromptAction
 * @async
 * @description
 *  Marks the specified prompt as active, and optionally unsets all others.
 *  This ensures only one prompt is active at a time if desired.
 *
 * @param {string} promptId - the UUID of the prompt to activate
 * @returns {Promise<ActionState<void>>}
 */
export async function setActivePromptAction(
  promptId: string
): Promise<ActionState<void>> {
  try {
    // First, set all prompts to isActive = false
    await db.update(promptsTable).set({ isActive: false }).execute()

    // Then set the chosen prompt to isActive = true
    const [activated] = await db
      .update(promptsTable)
      .set({ isActive: true })
      .where(eq(promptsTable.id, promptId))
      .returning()

    if (!activated) {
      return { isSuccess: false, message: "Prompt not found to activate" }
    }

    return { isSuccess: true, message: "Prompt activated", data: undefined }
  } catch (error) {
    console.error("Error setting active prompt:", error)
    return { isSuccess: false, message: "Failed to activate prompt" }
  }
}


```

File: db/schema/prompts-schema.ts
```ts
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

import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core"

export const promptsTable = pgTable("prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertPrompt = typeof promptsTable.$inferInsert
export type SelectPrompt = typeof promptsTable.$inferSelect


```

File: app/(admin)/conversations/[conversationId]/page.tsx
```tsx
/**
 * @description
 * Server page for admin to view a single conversation in detail, including
 * the messages. Also allows rating and leaving feedback via a modal.
 *
 * Key Features:
 * - Fetches conversation data from getConversationByIdAction
 * - Fetches associated messages from getMessagesByConversationAction
 * - Fetches feedback (if any) from getFeedbackByConversationAction
 * - Renders a conversation detail and a <ConversationFeedbackModal />
 *
 * @dependencies
 * - auth from "@clerk/nextjs/server" if we want to re-check membership, though
 *   the layout might handle gating already
 * - getConversationByIdAction, getMessagesByConversationAction
 * - getFeedbackByConversationAction
 *
 * @notes
 * - This route is nested under (admin)/conversations/[conversationId], so the user
 *   should already pass the admin layout checks.
 * - We show a minimal read-only view of messages for the sake of demonstration.
 */

"use server"

import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

import {
  getConversationByIdAction,
  getMessagesByConversationAction
} from "@/actions/db/conversation-actions"
import { getFeedbackByConversationAction } from "@/actions/db/feedback-actions"

import ConversationFeedbackModal from "./_compontents/conversation-feedback-modal"

interface AdminConversationPageProps {
  params: Promise<{ conversationId: string }>
}

export default async function AdminConversationPage({
  params
}: AdminConversationPageProps) {
  // Wait for route params
  const { conversationId } = await params

  // Optionally re-check user in case layout doesn't do it
  const { userId } = await auth()
  if (!userId) {
    return notFound()
  }

  // 1. Fetch the conversation
  const convoRes = await getConversationByIdAction(conversationId)
  if (!convoRes.isSuccess || !convoRes.data) {
    return (
      <div className="text-red-500">Conversation not found or error loading.</div>
    )
  }
  const conversation = convoRes.data

  // 2. Fetch the messages for that conversation
  const msgsRes = await getMessagesByConversationAction(conversationId)
  const messages = msgsRes.isSuccess ? msgsRes.data : []

  // 3. Fetch existing feedback
  const fbRes = await getFeedbackByConversationAction(conversationId)
  const existingFeedback = fbRes.isSuccess ? fbRes.data : null

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Conversation Detail</h2>
      <div className="text-sm text-muted-foreground">
        <p>
          <strong>Conversation ID:</strong> {conversation.id}
        </p>
        <p>
          <strong>User ID:</strong> {conversation.userId}
        </p>
        <p>
          <strong>Started At:</strong> {conversation.startedAt?.toISOString()}
        </p>
        <p>
          <strong>Updated At:</strong> {conversation.updatedAt?.toISOString()}
        </p>
      </div>

      <hr />

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Messages</h3>
        {messages.length === 0 ? (
          <p className="text-sm italic">No messages found.</p>
        ) : (
          <ul className="space-y-2">
            {messages.map(msg => (
              <li key={msg.id} className="rounded bg-muted p-2">
                <span className="font-bold text-sm mr-2">{msg.role}:</span>
                <span className="text-sm">{msg.content}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr />

      {/* The feedback modal or form - pass existing feedback if any */}
      <ConversationFeedbackModal
        conversationId={conversationId}
        existingFeedback={existingFeedback}
      />
    </div>
  )
}


```

File: db/schema/feedback-schema.ts
```ts
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

export type InsertConversationFeedback = typeof conversationFeedbackTable.$inferInsert
export type SelectConversationFeedback = typeof conversationFeedbackTable.$inferSelect


```

File: app/(admin)/conversations/[conversationId]/_compontents/conversation-feedback-modal.tsx
```tsx
/**
 * @description
 * A client component that allows an admin to rate a conversation (thumbs up/down)
 * and leave a free-text critique. We fetch the existing rating if provided,
 * display it in the UI, and update it on submission.
 *
 * Key Features:
 * - Renders a simple form for rating and notes
 * - Calls createOrUpdateFeedbackAction on submit
 * - Optionally displayed as a modal or just an inline block (here, we do inline)
 *
 * @dependencies
 * - createOrUpdateFeedbackAction from "@/actions/db/feedback-actions"
 * - React useState
 * - toast for notifications
 *
 * @notes
 * - rating: we store as 0 or 1 for thumbs down or up, but you can expand as needed.
 */

"use client"

import { useState } from "react"
import { createOrUpdateFeedbackAction } from "@/actions/db/feedback-actions"
import { SelectConversationFeedback } from "@/db/schema/feedback-schema"
import { toast } from "@/lib/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ConversationFeedbackModalProps {
  conversationId: string
  existingFeedback: SelectConversationFeedback | null
}

export default function ConversationFeedbackModal({
  conversationId,
  existingFeedback
}: ConversationFeedbackModalProps) {
  // We'll keep rating as 0 or 1
  const [rating, setRating] = useState<number>(
    existingFeedback ? existingFeedback.rating : 0
  )
  const [notes, setNotes] = useState<string>(
    existingFeedback?.notes || ""
  )

  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    setIsSaving(true)

    const res = await createOrUpdateFeedbackAction(conversationId, rating, notes)
    setIsSaving(false)

    if (!res.isSuccess) {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Feedback saved",
      description: "Your rating and critique have been saved."
    })
  }

  return (
    <div className="p-2 border rounded-md space-y-4">
      <h3 className="text-lg font-semibold">Conversation Feedback</h3>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="thumbsDown"
            name="rating"
            checked={rating === 0}
            onChange={() => setRating(0)}
            className="mr-1"
          />
          <label htmlFor="thumbsDown">Thumbs Down</label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id="thumbsUp"
            name="rating"
            checked={rating === 1}
            onChange={() => setRating(1)}
            className="mr-1"
          />
          <label htmlFor="thumbsUp">Thumbs Up</label>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Critique</label>
        <Textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Leave a free-text critique here..."
        />
      </div>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Feedback"}
      </Button>
    </div>
  )
}


```
</file_contents>


</existing_code>

Your task is to:
1. Identify the next incomplete step from the implementation plan (marked with `- [ ]`)
2. Generate the necessary code for all files specified in that step
3. Return the generated code

The implementation plan is just a suggestion meant to provide a high-level overview of the objective. Use it to guide you, but you do not have to adhere to it strictly. Make sure to follow the given rules as you work along the lines of the plan.

For EVERY file you modify or create, you MUST provide the COMPLETE file contents in the format above.

Each file should be wrapped in a code block with its file path above it and a "Here's what I did and why":

Here's what I did and why: [text here...]
Filepath: src/components/Example.tsx
```
/**
 * @description 
 * This component handles [specific functionality].
 * It is responsible for [specific responsibilities].
 * 
 * Key features:
 * - Feature 1: Description
 * - Feature 2: Description
 * 
 * @dependencies
 * - DependencyA: Used for X
 * - DependencyB: Used for Y
 * 
 * @notes
 * - Important implementation detail 1
 * - Important implementation detail 2
 */

BEGIN WRITING FILE CODE
// Complete implementation with extensive inline comments & documentation...
```

Documentation requirements:
- File-level documentation explaining the purpose and scope
- Component/function-level documentation detailing inputs, outputs, and behavior
- Inline comments explaining complex logic or business rules
- Type documentation for all interfaces and types
- Notes about edge cases and error handling
- Any assumptions or limitations

Guidelines:
- Implement exactly one step at a time
- Ensure all code follows the project rules and technical specification
- Include ALL necessary imports and dependencies
- Write clean, well-documented code with appropriate error handling
- Always provide COMPLETE file contents - never use ellipsis (...) or placeholder comments
- Never skip any sections of any file - provide the entire file every time
- Handle edge cases and add input validation where appropriate
- Follow TypeScript best practices and ensure type safety
- Include necessary tests as specified in the testing strategy

Begin by identifying the next incomplete step from the plan, then generate the required code (with complete file contents and documentation).

Above each file, include a "Here's what I did and why" explanation of what you did for that file.

Then end with "STEP X COMPLETE. Here's what I did and why:" followed by an explanation of what you did and then a "USER INSTRUCTIONS: Please do the following:" followed by manual instructions for the user for things you can't do like installing libraries, updating configurations on services, etc.

You also have permission to update the implementation plan if needed. If you update the implementation plan, include each modified step in full and return them as markdown code blocks at the end of the user instructions. No need to mark the current step as complete - that is implied.