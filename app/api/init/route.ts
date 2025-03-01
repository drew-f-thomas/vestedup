/**
 * @description
 * API route for initializing system components.
 * This can be called during application startup or deployment.
 * Currently initializes the default system prompt.
 */

import { NextResponse } from "next/server"
import { initializeSystemPrompt } from "@/lib/init/system-prompt"

export async function GET() {
  try {
    // Only allow this in production or with a secret key
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.INIT_SECRET !== process.env.NEXT_PUBLIC_INIT_SECRET
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Initialize system prompt
    await initializeSystemPrompt()

    return NextResponse.json(
      { success: true, message: "System initialized successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in init API route:", error)
    return NextResponse.json(
      { error: "Failed to initialize system" },
      { status: 500 }
    )
  }
}
