/*
<ai_context>
This client component provides the hero section for the landing page.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  ChevronRight,
  LineChart,
  TrendingUp,
  DollarSign,
  Calculator
} from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"
import AnimatedGradientText from "../magicui/animated-gradient-text"
import HeroVideoDialog from "../magicui/hero-video-dialog"

export const HeroSection = () => {
  const handleGetStartedClick = () => {
    posthog.capture("clicked_get_started")
  }

  return (
    <div className="flex flex-col items-center justify-center px-8 pt-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <Link href="/pricing">
          <AnimatedGradientText>
            <TrendingUp className="mr-1 size-4" />{" "}
            <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />
            <span
              className={cn(
                `animate-gradient inline bg-gradient-to-r from-[#40c9ff] via-[#40ff8d] to-[#40c9ff] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
              )}
            >
              Unlock your equity's true potential
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="mt-8 flex max-w-2xl flex-col items-center justify-center gap-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-balance text-6xl font-bold"
        >
          Understand, Track, and Maximize Your Equity
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="max-w-xl text-balance text-xl"
        >
          VestedUp helps you make sense of your equity compensation with
          powerful tools for tracking, simulating, and optimizing your financial
          future.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="flex gap-4"
        >
          <Link href="/signup" onClick={handleGetStartedClick}>
            <Button className="bg-emerald-600 text-lg hover:bg-emerald-700">
              <Calculator className="mr-2 size-5" />
              Start Tracking Free
            </Button>
          </Link>

          <Link href="/about">
            <Button variant="outline" className="text-lg">
              Learn More
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        className="mx-auto mt-20 flex w-full max-w-screen-lg items-center justify-center rounded-lg border shadow-lg"
      >
        <HeroVideoDialog
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/9yS0dR0kP-s"
          thumbnailSrc="hero2.png"
          thumbnailAlt="VestedUp Dashboard Preview"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
        className="mt-12 flex flex-wrap justify-center gap-8"
      >
        <div className="flex items-center gap-2">
          <LineChart className="size-6 text-emerald-600" />
          <span className="text-lg font-medium">Equity Tracking</span>
        </div>
        <div className="flex items-center gap-2">
          <Calculator className="size-6 text-emerald-600" />
          <span className="text-lg font-medium">Value Simulations</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="size-6 text-emerald-600" />
          <span className="text-lg font-medium">Tax Optimization</span>
        </div>
      </motion.div>
    </div>
  )
}
