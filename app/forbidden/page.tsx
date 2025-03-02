"use server"

import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export default async function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto max-w-md text-center">
        <ShieldAlert className="text-destructive mx-auto mb-4 size-16" />
        <h1 className="mb-4 text-3xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. This area is restricted
          to administrators only.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
