/*
<ai_context>
This client component provides the features section for the landing page.
</ai_context>
*/

"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  FileText,
  Calculator,
  Upload,
  MessageSquare,
  Shield,
  LucideIcon,
  Clock,
  CheckCircle2
} from "lucide-react"

interface FeatureProps {
  title: string
  description: string
  icon: LucideIcon
}

const features: FeatureProps[] = [
  {
    title: "Smart Document Upload",
    description:
      "Easily upload and analyze your W-2s, 1099s, and other tax documents with our AI-powered system.",
    icon: Upload
  },
  {
    title: "Interactive Tax Chat",
    description:
      "Get personalized guidance through your tax filing with our AI assistant that understands your documents.",
    icon: MessageSquare
  },
  {
    title: "Accurate Calculations",
    description:
      "Our system automatically extracts and calculates your tax information to ensure accuracy and maximize your refund.",
    icon: Calculator
  },
  {
    title: "Real-Time Support",
    description:
      "Get instant answers to your tax questions and step-by-step guidance throughout the filing process.",
    icon: Clock
  },
  {
    title: "Data Security",
    description:
      "Your sensitive tax information is protected with bank-level encryption and security measures.",
    icon: Shield
  },
  {
    title: "Error Prevention",
    description:
      "Our AI system checks for common mistakes and ensures your tax return is complete and accurate.",
    icon: CheckCircle2
  }
]

const FeatureCard = ({ title, description, icon: Icon }: FeatureProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="transform-gpu"
  >
    <Card className="group h-full transition-shadow duration-200 hover:shadow-lg">
      <CardHeader>
        <Icon className="mb-2 size-12 text-emerald-600" />
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
    </Card>
  </motion.div>
)

export const FeaturesSection = () => {
  return (
    <section className="mt-20 bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-4xl font-bold">
              Simplify Your Tax Filing Journey
            </h2>
            <p className="text-muted-foreground text-lg">
              Navo provides everything you need to file your taxes with
              confidence through AI-powered assistance.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <a
                href="/signup"
                className="inline-flex items-center rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
              >
                <FileText className="mr-2 size-5" />
                Start Filing Your Taxes
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
