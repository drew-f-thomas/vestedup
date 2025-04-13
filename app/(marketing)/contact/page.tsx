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
  title: "Contact Us | Navo",
  description:
    "Get in touch with the Navo team for questions about tax filing, support, or business solutions."
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
                <a href="mailto:support@navo.tax" className="hover:underline">
                  support@navo.tax
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
                456 Tech Center
                <br />
                Austin, TX 78701
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Have questions about tax filing? Fill out the form below and we'll
              get back to you quickly.
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
                <Input
                  id="subject"
                  placeholder="Question about tax filing..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your tax situation or any questions you have..."
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
                How does your AI tax assistant work?
              </h3>
              <p className="text-muted-foreground mt-2">
                Our AI assistant analyzes your tax documents, extracts relevant
                information, and guides you through the filing process with
                simple questions and explanations. It's available 24/7 to help
                with your tax questions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium">
                Is my tax information secure?
              </h3>
              <p className="text-muted-foreground mt-2">
                Yes, we use bank-level encryption and are fully IRS-compliant.
                Your sensitive tax information is protected with the highest
                security standards, and we never share your data with third
                parties.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium">
                What if I need help during tax filing?
              </h3>
              <p className="text-muted-foreground mt-2">
                Our AI assistant is always available to help, and Premium users
                get priority support with faster response times. You can also
                reach our support team via email or phone during business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
