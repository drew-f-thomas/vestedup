/**
 * @description
 * API route for initializing storage components.
 * This can be called during application startup or deployment.
 * Currently initializes the storage bucket.
 */

import { NextResponse } from "next/server"
import { ensureStorageBucketExists } from "@/actions/storage/storage-actions"

export async function GET() {
  try {
    // Only allow this in production or with a secret key
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.INIT_SECRET !== process.env.NEXT_PUBLIC_INIT_SECRET
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Initialize storage bucket
    const result = await ensureStorageBucketExists()

    if (!result.isSuccess) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, message: "Storage initialized successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in storage init API route:", error)
    return NextResponse.json(
      { error: "Failed to initialize storage" },
      { status: 500 }
    )
  }
}
