/*
<ai_context>
This server page displays pricing options for the product, integrating Stripe payment links.
</ai_context>
*/

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Pricing | Navo",
  description: "Choose the right plan for your tax filing needs."
}

interface PricingTierProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
  highlighted?: boolean
}

const PricingTier = ({
  title,
  price,
  description,
  features,
  buttonText,
  buttonLink,
  highlighted = false
}: PricingTierProps) => (
  <div
    className={`flex flex-col rounded-xl border p-8 shadow-sm ${
      highlighted
        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
        : "bg-card"
    }`}
  >
    <div className="mb-6">
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="mt-4">
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Free" && (
          <span className="text-muted-foreground">/tax return</span>
        )}
      </div>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>

    <div className="mb-6 grow">
      <p className="mb-4 font-medium">Features include:</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check
              className={`mr-2 mt-1 size-5 ${highlighted ? "text-emerald-600" : "text-primary"}`}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>

    <Link href={buttonLink}>
      <Button
        className={`w-full ${
          highlighted
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-primary hover:bg-primary/90"
        }`}
      >
        {buttonText}
      </Button>
    </Link>
  </div>
)

export default async function PricingPage() {
  const pricingTiers = [
    {
      title: "Basic",
      price: "Free",
      description: "Perfect for simple tax returns",
      features: [
        "Upload and analyze W-2 forms",
        "Basic tax calculations",
        "AI-powered chat assistance",
        "Standard e-filing",
        "Email support"
      ],
      buttonText: "File for Free",
      buttonLink: "/signup"
    },
    {
      title: "Premium",
      price: "$49",
      description: "For more complex tax situations",
      features: [
        "All Basic features",
        "Multiple W-2s and 1099s",
        "Advanced tax calculations",
        "Priority chat support",
        "Tax optimization suggestions",
        "Audit risk assessment",
        "Year-round tax planning"
      ],
      buttonText: "Choose Premium",
      buttonLink: "/signup?plan=premium",
      highlighted: true
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground mb-12 text-xl">
          Choose the plan that's right for you and file your taxes with
          confidence.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {pricingTiers.map((tier, index) => (
          <PricingTier key={index} {...tier} />
        ))}
      </div>

      <div className="bg-card mx-auto mt-16 max-w-3xl rounded-xl border p-8">
        <h2 className="mb-4 text-2xl font-bold">Business Tax Solutions</h2>
        <p className="text-muted-foreground mb-6">
          Need help with business taxes? We offer specialized solutions for
          small businesses, self-employed individuals, and corporations with
          features like business expense tracking, quarterly tax estimation, and
          dedicated tax advisory services.
        </p>
        <Link href="/contact">
          <Button variant="outline" className="w-full sm:w-auto">
            Contact Sales
          </Button>
        </Link>
      </div>

      <div className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-6 text-left">
          <div>
            <h3 className="text-xl font-medium">How does the pricing work?</h3>
            <p className="text-muted-foreground mt-2">
              Our pricing is per tax return. You can file multiple years if
              needed, with each year counting as a separate return. State
              returns may have additional fees depending on your location.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">
              What if I need help during tax filing?
            </h3>
            <p className="text-muted-foreground mt-2">
              Our AI assistant is available 24/7 to help with your questions.
              Premium users also get priority support and access to tax
              optimization suggestions.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">
              What payment methods do you accept?
            </h3>
            <p className="text-muted-foreground mt-2">
              We accept all major credit cards and PayPal. For business
              solutions, we also accept ACH transfers.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">Is my tax data secure?</h3>
            <p className="text-muted-foreground mt-2">
              Yes, we use bank-level encryption to protect your sensitive tax
              information. Our systems are IRS-compliant and regularly audited
              for security.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
