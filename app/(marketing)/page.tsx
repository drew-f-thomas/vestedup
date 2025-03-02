/*
<ai_context>
This server page is the marketing homepage.
</ai_context>
*/

import { FeaturesSection } from "@/components/landing/features"
import { HeroSection } from "@/components/landing/hero"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "VestedUp | Understand, Track, and Maximize Your Equity",
  description:
    "VestedUp helps you make sense of your equity compensation with powerful tools for tracking, simulating, and optimizing your financial future."
}

export default async function HomePage() {
  return (
    <div className="pb-20">
      <HeroSection />
      {/* social proof */}
      <FeaturesSection />
      {/* pricing */}
      {/* faq */}
      {/* blog */}
      {/* footer */}
    </div>
  )
}
