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
import { testAuthenticationAction } from "@/actions/scraping-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon, ShieldCheckIcon } from "@radix-ui/react-icons"
import { PulseLoader } from "react-spinners"

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
  const [authSuccess, setAuthSuccess] = useState<boolean>(false)
  const [tokenInfo, setTokenInfo] = useState<string | null>(null)
  const [isTestingAuth, setIsTestingAuth] = useState<boolean>(false)

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

  /**
   * @function testAuthentication
   * Tests the authentication by making a request to the test-auth endpoint.
   */
  async function handleTestAuth() {
    setIsTestingAuth(true)
    setError(null)
    setAuthSuccess(false)
    setTokenInfo(null)

    try {
      const result = await testAuthenticationAction()

      if (result.isSuccess) {
        setAuthSuccess(true)
        setTokenInfo(result.data.tokenInfo || null)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An unexpected error occurred while testing authentication.")
      console.error("Authentication test error:", err)
    } finally {
      setIsTestingAuth(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Import Your Equity Data</h2>
        <p className="text-muted-foreground">
          Enter your credentials to import data from your equity platform.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="size-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            <div className="space-y-4">
              <p>{error}</p>
              <div className="text-sm">
                <p className="mb-2 font-semibold">Troubleshooting steps:</p>
                <ol className="list-decimal space-y-1 pl-5">
                  <li>
                    Verify that you're authenticated by using the "Test
                    Authentication" button below
                  </li>
                  <li>
                    Try logging out and logging back in to refresh your
                    authentication
                  </li>
                  <li>Ensure you have a stable internet connection</li>
                  <li>Clear your browser cache and cookies, then try again</li>
                  <li>If problems persist, please contact support</li>
                </ol>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {authSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <ShieldCheckIcon className="size-4 text-green-600" />
          <AlertTitle className="text-green-800">
            Authentication Successful
          </AlertTitle>
          <AlertDescription>
            <p className="text-green-700">
              You are properly authenticated and can proceed with data import.
            </p>
            {tokenInfo && (
              <div className="mt-2 whitespace-pre-line rounded-md bg-green-100 p-3 font-mono text-xs text-green-800">
                {tokenInfo}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleTestAuth}
          disabled={isTestingAuth}
          className="mb-4"
        >
          {isTestingAuth ? (
            <span className="flex items-center">
              <PulseLoader color="#666" size={8} className="mr-2" /> Testing...
            </span>
          ) : (
            "Test Authentication"
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
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
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="carta-2fa"
            >
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
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <span className="flex items-center justify-center">
              <PulseLoader color="#fff" size={8} className="mr-2" />{" "}
              Processing...
            </span>
          ) : (
            "Import Data"
          )}
        </Button>
      </form>

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
