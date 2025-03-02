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
  LineChart,
  Calculator,
  FileSpreadsheet,
  Upload,
  MessageSquare,
  TrendingUp,
  LucideIcon,
  BarChart3
} from "lucide-react"

interface FeatureProps {
  title: string
  description: string
  icon: LucideIcon
}

const features: FeatureProps[] = [
  {
    title: "Equity Tracking",
    description:
      "Easily track all your equity grants, vesting schedules, and current value in one place.",
    icon: LineChart
  },
  {
    title: "Value Simulations",
    description:
      "Run 'what-if' scenarios to see how your equity might grow under different market conditions.",
    icon: Calculator
  },
  {
    title: "Data Import",
    description:
      "Import your equity data from CSV files or connect directly to your company's equity platform.",
    icon: Upload
  },
  {
    title: "AI Assistant",
    description:
      "Get personalized answers to your equity questions with our AI-powered chat assistant.",
    icon: MessageSquare
  },
  {
    title: "Tax Planning",
    description:
      "Understand the tax implications of your equity decisions and optimize for better outcomes.",
    icon: BarChart3
  },
  {
    title: "Detailed Reports",
    description:
      "Generate comprehensive reports on your equity holdings for financial planning.",
    icon: FileSpreadsheet
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
              Powerful Equity Management Tools
            </h2>
            <p className="text-muted-foreground text-lg">
              VestedUp provides everything you need to understand, track, and
              optimize your equity compensation.
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
                <TrendingUp className="mr-2 size-5" />
                Start Tracking Your Equity
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
