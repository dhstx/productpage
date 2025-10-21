import { DomainScanner } from "@/components/DomainScanner";
import { FAQ } from "@/components/FAQ";
import { Shield, Zap, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Shield className="h-4 w-4" />
            Email Compliance Made Simple
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Fix Your Email Deliverability
            <br />
            <span className="text-blue-600">In Minutes</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scan your domain for SPF, DKIM, DMARC compliance. Get copy-paste DNS records and
            step-by-step instructions to meet 2024-2025 inbox provider requirements.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <DomainScanner />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Instant Scan</h3>
            <p className="text-muted-foreground">
              Get your compliance status in under 10 seconds. No signup required for the free scan.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Copy-Paste Ready</h3>
            <p className="text-muted-foreground">
              Get exact DNS records and header snippets you can immediately add to your domain and ESP.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Provider-Specific</h3>
            <p className="text-muted-foreground">
              Tailored instructions for Google Workspace, M365, SendGrid, Mailgun, and more.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg">Free Domain Scan</h3>
              <p className="text-muted-foreground">
                Enter your domain and see your current SPF, DKIM, DMARC, and one-click unsubscribe status.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-lg">Get Your Compliance Kit — $29</h3>
              <p className="text-muted-foreground">
                One-time payment for a comprehensive PDF report with recommended DNS records,
                provider setup steps, and validation checklist.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-lg">Implement & Verify</h3>
              <p className="text-muted-foreground">
                Follow the step-by-step instructions to add DNS records and configure your email
                platform. Use our validation checklist to confirm everything works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <FAQ />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 InboxPass. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="/privacy" className="hover:text-foreground">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

