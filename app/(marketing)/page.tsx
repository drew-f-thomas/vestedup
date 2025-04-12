"use server"

/*
<ai_context>
This server page is the marketing homepage.
</ai_context>
*/

import { FeaturesSection } from "@/components/landing/features"
import { HeroSection } from "@/components/landing/hero"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Navo | Interactive Tax Filing Made Simple",
  description:
    "Navo helps you file your taxes with confidence through AI-powered document analysis and interactive chat guidance. Upload your tax documents and get personalized assistance every step of the way."
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
