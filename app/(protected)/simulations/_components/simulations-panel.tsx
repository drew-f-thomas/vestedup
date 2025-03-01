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
    <div className="mx-auto max-w-lg rounded border p-4">
      <h2 className="mb-4 text-xl font-semibold">
        Hypothetical Valuation Simulator
      </h2>

      <div className="mb-4">
        <label className="mb-1 block font-medium" htmlFor="valuation-input">
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
        <div className="bg-muted mt-6 rounded p-3">
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
