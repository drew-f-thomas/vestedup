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
  title: "Pricing | VestedUp",
  description: "Choose the right plan for your equity management needs."
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
          <span className="text-muted-foreground">/month</span>
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
      title: "Free",
      price: "Free",
      description: "Perfect for getting started with equity tracking",
      features: [
        "Track up to 2 equity grants",
        "Basic vesting schedule visualization",
        "Manual data entry",
        "Limited 'what-if' simulations",
        "Email support"
      ],
      buttonText: "Get Started",
      buttonLink: "/signup"
    },
    {
      title: "Pro",
      price: "$19",
      description: "Everything you need for comprehensive equity management",
      features: [
        "Unlimited equity grants",
        "Advanced vesting schedule visualization",
        "CSV import and platform integrations",
        "Unlimited 'what-if' simulations",
        "Tax optimization recommendations",
        "Detailed equity reports",
        "Priority support"
      ],
      buttonText: "Upgrade to Pro",
      buttonLink: "/signup?plan=pro",
      highlighted: true
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground mb-12 text-xl">
          Choose the plan that's right for you and start maximizing your equity
          today.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {pricingTiers.map((tier, index) => (
          <PricingTier key={index} {...tier} />
        ))}
      </div>

      <div className="bg-card mx-auto mt-16 max-w-3xl rounded-xl border p-8">
        <h2 className="mb-4 text-2xl font-bold">Enterprise Solutions</h2>
        <p className="text-muted-foreground mb-6">
          Need a custom solution for your company? We offer enterprise plans
          with additional features like company-wide analytics, bulk employee
          onboarding, and dedicated account management.
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
            <h3 className="text-xl font-medium">Can I switch plans later?</h3>
            <p className="text-muted-foreground mt-2">
              Yes, you can upgrade or downgrade your plan at any time. If you
              upgrade, you'll be charged the prorated amount for the remainder
              of your billing cycle.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">
              Is there a free trial for the Pro plan?
            </h3>
            <p className="text-muted-foreground mt-2">
              Yes, we offer a 14-day free trial of the Pro plan. No credit card
              required.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">
              What payment methods do you accept?
            </h3>
            <p className="text-muted-foreground mt-2">
              We accept all major credit cards and PayPal. For enterprise plans,
              we also accept bank transfers.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">Is my data secure?</h3>
            <p className="text-muted-foreground mt-2">
              Yes, we take security seriously. All data is encrypted in transit
              and at rest, and we never share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
