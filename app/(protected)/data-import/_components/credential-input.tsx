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
import { Loader2 } from "lucide-react"

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
   * Submits the credentials to the server action which calls the Carta scraping API.
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
    setScrapedData(null)
    setError(null)

    try {
      const result = await scrapeCartaDataAction(userId, {
        email,
        password,
        twoFactorCode: twoFactorCode || undefined
      })

      if (!result.isSuccess) {
        setError(result.message)
        toast({
          title: "Scraping Error",
          description: result.message,
          variant: "destructive"
        })
        return
      }

      toast({
        title: "Scraping Successful",
        description: "Successfully retrieved your Carta data"
      })
      setScrapedData(result.data.mockData)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      toast({
        title: "Scraping Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
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
          <pre className="bg-muted max-h-40 overflow-auto rounded p-2 text-xs">
            {scrapedData}
          </pre>
        </div>
      )}
    </div>
  )
}
