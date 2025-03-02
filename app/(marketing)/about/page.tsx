/*
<ai_context>
This server page returns a simple "About Page" component as a (marketing) route.
</ai_context>
*/

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About VestedUp | Your Equity Management Partner",
  description:
    "Learn about VestedUp's mission to help employees understand and maximize the value of their equity compensation."
}

export default async function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">About VestedUp</h1>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground text-lg">
              At VestedUp, we believe that equity compensation should be
              transparent and accessible to everyone. Our mission is to empower
              employees with the tools and knowledge they need to understand,
              track, and maximize the value of their equity compensation.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Our Story</h2>
            <p className="text-muted-foreground mb-4 text-lg">
              VestedUp was founded in 2023 by a team of finance professionals
              and software engineers who experienced firsthand the challenges of
              understanding equity compensation. After receiving stock options
              and RSUs from their employers, they struggled to find tools that
              could help them track their vesting schedules, understand tax
              implications, and make informed decisions about their equity.
            </p>
            <p className="text-muted-foreground text-lg">
              Frustrated by the lack of accessible resources, they decided to
              build the solution themselves. VestedUp was born with a simple
              goal: to make equity compensation understandable and manageable
              for everyone, regardless of their financial background.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Our Values</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-medium">Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in complete transparency in everything we do, from
                  our pricing to how we handle your data.
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-medium">Accessibility</h3>
                <p className="text-muted-foreground">
                  We're committed to making complex financial concepts
                  accessible to everyone, regardless of their background.
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-medium">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously innovate to provide the best tools and
                  resources for understanding equity compensation.
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-medium">Security</h3>
                <p className="text-muted-foreground">
                  We prioritize the security and privacy of your financial data
                  above all else.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Our Team</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              VestedUp is built by a diverse team of finance professionals,
              software engineers, and designers who are passionate about making
              equity compensation accessible to everyone.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
