/**
 * @description
 * API route for setting a user as admin.
 * This is protected by an ADMIN_SECRET_KEY environment variable.
 * It should only be used during initial setup or by authorized personnel.
 */

import { NextRequest, NextResponse } from "next/server"
import { setUserAsAdminAction } from "@/actions/db/profiles-actions"

export async function POST(req: NextRequest) {
  try {
    // Check for admin secret key
    const authHeader = req.headers.get("authorization")
    const adminSecret = process.env.ADMIN_SECRET_KEY

    if (!adminSecret) {
      console.error("ADMIN_SECRET_KEY not configured in environment variables")
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      )
    }

    if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await req.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required field: userId" },
        { status: 400 }
      )
    }

    // Set user as admin
    const result = await setUserAsAdminAction(userId)

    if (!result.isSuccess) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "User set as admin successfully",
        user: result.data
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in set-admin API route:", error)
    return NextResponse.json(
      { error: "Failed to set user as admin" },
      { status: 500 }
    )
  }
}
