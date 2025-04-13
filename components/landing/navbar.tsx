/*
<ai_context>
This client component provides the navbar for the marketing pages.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Calculator, LineChart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="bg-background/80 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="size-6 text-emerald-600" />
            <span>Navo</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex size-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-emerald-500 to-emerald-700 p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <TrendingUp className="size-6 text-white" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Navo
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Understand, track, and maximize your equity
                            compensation.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem
                      href="/features/tracking"
                      title="Equity Tracking"
                      icon={LineChart}
                    >
                      Track all your equity grants and vesting schedules in one
                      place.
                    </ListItem>
                    <ListItem
                      href="/features/simulations"
                      title="Value Simulations"
                      icon={Calculator}
                    >
                      Run 'what-if' scenarios to see how your equity might grow.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Sign up
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <button
            onClick={toggleMenu}
            className="flex size-10 items-center justify-center rounded-md border"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="bg-background border-b md:hidden">
          <div className="container mx-auto space-y-1 px-4 pb-4">
            <Link
              href="/"
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium",
                isActive("/")
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-primary/10"
              )}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium",
                isActive("/pricing")
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-primary/10"
              )}
              onClick={closeMenu}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium",
                isActive("/about")
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-primary/10"
              )}
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium",
                isActive("/contact")
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-primary/10"
              )}
              onClick={closeMenu}
            >
              Contact
            </Link>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="outline" className="mr-2 w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" className="mt-2 block">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    icon: React.FC<{ className?: string }>
  }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {Icon && <Icon className="size-4 text-emerald-600" />}
            <span>{title}</span>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})

ListItem.displayName = "ListItem"
