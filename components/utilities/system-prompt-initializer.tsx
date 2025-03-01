"use client"

/**
 * @description
 * A client component that initializes the system prompt when the application starts.
 * It calls the /api/init API route to ensure a default system prompt exists.
 *
 * @dependencies
 * - React useEffect
 */

import { useEffect } from "react"

export function SystemPromptInitializer() {
  useEffect(() => {
    // Only run in production to avoid unnecessary calls during development
    if (process.env.NODE_ENV === "production") {
      // Call the API route to initialize the system prompt
      fetch("/api/init")
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log("System prompt initialized:", data.message)
          } else {
            console.error("Failed to initialize system prompt:", data.message)
          }
        })
        .catch(error => {
          console.error("Error initializing system prompt:", error)
        })
    }
  }, []) // Empty dependency array ensures this only runs once

  // This component doesn't render anything
  return null
}
