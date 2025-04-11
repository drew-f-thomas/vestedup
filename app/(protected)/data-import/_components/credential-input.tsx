/**
 * @description
 * This client component allows a user to input their Carta credentials, which
 * are then sent to a server action that calls the Carta scraper API endpoint
 * to retrieve equity data.
 *
 * Key Features:
 * - A form with fields for email, password, and optional 2FA code
 * - Submits data to the server action which calls the Carta scraper API
 * - Displays the received JSON data or an error message
 *
 * @dependencies
 * - scrapeCartaDataAction from "@/actions/scraping-actions"
 * - The `userId` passed in from a parent server component or page
 * - Next.js "use client" for client-side functionality
 * - Basic Tailwind styling
 *
 * @notes
 * - Credentials are only used for the API call and are not stored
 * - The server action handles the communication with the API endpoint
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { scrapeCartaDataAction } from "@/actions/scraping-actions"

interface CredentialInputProps {
  userId: string
}

export default function CredentialInput({ userId }: CredentialInputProps) {
  // Local state for storing email/password
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [scrapedData, setScrapedData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * @function handleSubmit
   * Submits the credentials to the server action which calls the Carta scraper API.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("CredentialInput: Form submission started")

    if (!email || !password) {
      console.log("CredentialInput: Missing required fields")
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setScrapedData(null)
    setError(null)

    try {
      console.log(
        `CredentialInput: Calling scrapeCartaDataAction for user ${userId.substring(0, 5)}...`
      )
      console.log(
        `CredentialInput: Email: ${email}, 2FA provided: ${twoFactorCode ? "Yes" : "No"}`
      )

      // Call the server action with the user credentials
      const result = await scrapeCartaDataAction(userId, {
        email,
        password,
        twoFactorCode: twoFactorCode || undefined
      })
      console.log(`^^^ CredentialInput: response: ${JSON.stringify(result)}`)
      console.log(
        `CredentialInput: Server action returned, success: ${result.isSuccess}`
      )

      if (!result.isSuccess) {
        console.error(
          `CredentialInput: Error from server action: ${result.message}`
        )
        setError(result.message)
        toast({
          title: "Import Failed",
          description: result.message,
          variant: "destructive"
        })
        return
      }

      console.log("CredentialInput: Data import successful")
      toast({
        title: "Data Import Successful",
        description: "Successfully retrieved your Carta data"
      })

      // Display the full JSON response
      const dataString = JSON.stringify(result.data, null, 2)
      console.log(
        `CredentialInput: Setting data (${dataString.length} characters)`
      )
      setScrapedData(dataString)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred"
      console.error("CredentialInput: Unhandled error:", err)
      setError(errorMessage)
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      console.log("CredentialInput: Form submission completed")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-muted mt-6 rounded p-4 shadow">
      <h3 className="mb-2 text-lg font-semibold">Import Data from Carta</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Enter your Carta credentials to automatically import your equity data.
        Your credentials are only used for this import and are not stored.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="carta-email"
          >
            Carta Email
          </label>
          <Input
            id="carta-email"
            type="email"
            placeholder="your-email@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="carta-password"
          >
            Password
          </label>
          <Input
            id="carta-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="carta-2fa">
            Two-Factor Code{" "}
            <span className="text-muted-foreground">(Optional)</span>
          </label>
          <Input
            id="carta-2fa"
            type="text"
            placeholder="123456"
            value={twoFactorCode}
            onChange={e => setTwoFactorCode(e.target.value)}
            disabled={isLoading}
            maxLength={6}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Enter your 2FA code if your Carta account has two-factor
            authentication enabled
          </p>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Importing Data...
            </>
          ) : (
            "Import My Carta Data"
          )}
        </Button>
      </form>

      {error && (
        <div className="bg-destructive/10 text-destructive mt-4 rounded p-3">
          <p className="mb-1 font-semibold">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {scrapedData && (
        <div className="bg-card mt-4 rounded p-3">
          <p className="mb-1 font-semibold">Imported Data:</p>
          <pre className="bg-muted max-h-60 overflow-auto rounded p-2 text-xs">
            {scrapedData}
          </pre>
        </div>
      )}
    </div>
  )
}
