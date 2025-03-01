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
    <div className="bg-muted max-w-md rounded p-4 shadow">
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
