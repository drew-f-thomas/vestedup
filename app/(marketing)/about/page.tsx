/*
<ai_context>
This server page returns a simple "About Page" component as a (marketing) route.
</ai_context>
*/

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Navo | Your AI Tax Filing Partner",
  description:
    "Learn about Navo's mission to revolutionize tax filing through AI-powered document analysis and interactive guidance."
}

export default async function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">About Navo</h1>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground text-lg">
              At Navo, we believe that filing taxes should be simple, accurate,
              and stress-free for everyone. Our mission is to revolutionize tax
              filing by combining AI-powered document analysis with interactive
              guidance, making it easy for anyone to file their taxes with
              confidence.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Our Story</h2>
            <p className="text-muted-foreground mb-4 text-lg">
              Navo was founded in 2024 by a team of tax professionals and AI
              engineers who saw an opportunity to transform the tax filing
              experience. After years of witnessing people struggle with complex
              tax forms, confusing instructions, and expensive filing services,
              they envisioned a better way: an AI-powered platform that could
              understand tax documents and guide users through the filing
              process.
            </p>
            <p className="text-muted-foreground text-lg">
              By combining advanced document analysis with conversational AI,
              they created a platform that not only simplifies tax filing but
              also helps users understand their tax situation better. Navo was
              built to make professional-grade tax filing accessible to
              everyone, without the professional-grade price tag.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Our Values</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-medium">Simplicity</h3>
                <p className="text-muted-foreground">
                  We transform complex tax procedures into simple, guided
                  conversations that anyone can understand.
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-medium">Accuracy</h3>
                <p className="text-muted-foreground">
                  Our AI-powered system ensures precise document analysis and
                  calculations, minimizing errors in your tax returns.
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-medium">Innovation</h3>
                <p className="text-muted-foreground">
                  We leverage cutting-edge AI technology to continuously improve
                  the tax filing experience.
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-medium">Security</h3>
                <p className="text-muted-foreground">
                  We protect your sensitive tax information with bank-level
                  encryption and IRS-compliant security measures.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Our Team</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Navo is built by a diverse team of tax professionals, AI
              engineers, and security experts who are passionate about making
              tax filing accessible, accurate, and stress-free for everyone.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
