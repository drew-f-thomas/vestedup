"use server"
/**
 * @description
 * Server page for the "Personalized What-If Simulations" route (Step 12).
 * Ensures the user is authenticated, then displays a minimal simulation UI.
 *
 * Key Features:
 * - Auth check using Clerk's `auth()`
 * - Renders a SimulationsPanel client component for user interactions
 *
 * @dependencies
 * - auth from "@clerk/nextjs/server"
 * - redirect from "next/navigation"
 * - SimulationsPanel from "./_components/simulations-panel"
 *
 * @notes
 * - In real usage, you might fetch user data or membership level here before rendering.
 * - For now, we simply pass userId down to SimulationsPanel for the server action calls.
 */

import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import SimulationsPanel from "./_components/simulations-panel"

export default async function SimulationsPage() {
  const { userId } = await auth()

  if (!userId) {
    // If not logged in, redirect to login
    return redirect("/login")
  }

  // If you want to gate certain membership levels, you could check profile here
  // For example, if the user has "free" membership, you might redirect them to /pricing

  // Render the new SimulationsPanel to let user run "what if" scenarios
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">What-If Simulations</h1>
      <p className="mb-4">
        Explore hypothetical scenarios by adjusting your company's valuation or
        share price to see a naive estimate of your equity's potential value.
      </p>

      <SimulationsPanel userId={userId} />
    </div>
  )
}
