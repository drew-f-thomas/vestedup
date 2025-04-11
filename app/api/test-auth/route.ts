/**
 * @description
 * A test endpoint to verify JWT token authentication.
 * This helps debug JWT token issues by returning token details.
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET(req: NextRequest) {
  try {
    // Get the Clerk session and token
    const { userId, getToken, sessionId } = await auth()
    const token = await getToken()

    // Parse token if available
    let tokenInfo = null
    if (token) {
      const parts = token.split(".")
      const tokenHeader = parts.length > 0 ? safeParseBase64(parts[0]) : null
      const tokenPayload = parts.length > 1 ? safeParseBase64(parts[1]) : null

      tokenInfo = {
        length: token.length,
        parts: parts.length,
        firstChars: token.substring(0, 15) + "...",
        lastChars: "..." + token.substring(token.length - 5),
        header: tokenHeader,
        payload: tokenPayload
          ? {
              ...tokenPayload,
              // Mask any sensitive data
              sub: tokenPayload.sub
                ? tokenPayload.sub.substring(0, 5) + "..."
                : null
            }
          : null
      }
    }

    // Create a response with authentication details
    return NextResponse.json({
      status: "success",
      authenticated: !!userId,
      userId: userId ? userId.substring(0, 5) + "..." : null,
      sessionId: sessionId ? sessionId.substring(0, 5) + "..." : null,
      hasToken: !!token,
      tokenInfo,
      headers: {
        received: Object.fromEntries(req.headers)
      }
    })
  } catch (error) {
    // Log the error details
    console.error("Error in test-auth endpoint:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        errorType: error instanceof Error ? error.name : "Unknown"
      },
      { status: 500 }
    )
  }
}

// Safely parse base64 encoded JWT parts
function safeParseBase64(base64String: string): any {
  try {
    // Make the base64 URL safe by replacing characters
    const safeBase64 = base64String.replace(/-/g, "+").replace(/_/g, "/")

    // Pad the string if needed
    const padded = safeBase64.padEnd(
      safeBase64.length + ((4 - (safeBase64.length % 4)) % 4),
      "="
    )

    // Decode and parse
    const jsonString = Buffer.from(padded, "base64").toString("utf8")
    return JSON.parse(jsonString)
  } catch (e) {
    return { error: "Could not parse token part" }
  }
}
