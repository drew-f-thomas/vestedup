/*
<ai_context>
This server page returns a simple "Contact Page" component as a (marketing) route.
</ai_context>
*/

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | VestedUp",
  description:
    "Get in touch with the VestedUp team for questions, support, or partnership inquiries."
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">Contact Us</h1>

        <div className="mb-12 grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Mail className="mr-2 size-5 text-emerald-600" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                <a
                  href="mailto:support@vestedup.com"
                  className="hover:underline"
                >
                  support@vestedup.com
                </a>
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Phone className="mr-2 size-5 text-emerald-600" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                <a href="tel:+18005551234" className="hover:underline">
                  (800) 555-1234
                </a>
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <MapPin className="mr-2 size-5 text-emerald-600" />
                Office
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                123 Financial District
                <br />
                San Francisco, CA 94111
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as
              possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please provide as much detail as possible..."
                  rows={5}
                />
              </div>

              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="rounded-lg border p-8">
          <h2 className="mb-4 text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium">
                How quickly will I receive a response?
              </h3>
              <p className="text-muted-foreground mt-2">
                We aim to respond to all inquiries within 24 hours during
                business days.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium">
                Do you offer technical support?
              </h3>
              <p className="text-muted-foreground mt-2">
                Yes, our support team is available to help with any technical
                issues you may encounter. Pro plan users receive priority
                support.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium">Can I schedule a demo?</h3>
              <p className="text-muted-foreground mt-2">
                Absolutely! You can request a demo by filling out the contact
                form above or by emailing us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
