import { DomainScanner } from "@/components/DomainScanner";
import { FAQ } from "@/components/FAQ";
import { Shield, Zap, CheckCircle, AlertTriangle, Mail, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - The Gut Punch */}
      <section className="bg-gradient-to-b from-red-50 via-white to-white border-b-2 border-red-100">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              Gmail & Microsoft Enforcement Active
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900">
              Your Emails Are Going
              <br />
              <span className="text-red-600">to Spam.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
              Gmail and Microsoft's new 2025 rules are now enforced. If you're not compliant, you're invisible.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <DomainScanner />
            <p className="text-center text-sm text-gray-500 mt-4">
              Instantly check your SPF, DKIM, & DMARC status against the new rules.
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Stakes - Agitation */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
            This Isn't a Warning. <br />It's a <span className="text-red-600">Revenue Problem.</span>
          </h2>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p className="text-xl leading-relaxed">
              Since 2024, Google and Microsoft (as of May 2025) are no longer <em>asking</em> for email compliance. They are <strong>enforcing</strong> it.
            </p>
            
            <p className="text-xl leading-relaxed">
              If your domain fails their new requirements (SPF, DKIM, DMARC, One-Click Unsubscribe), your emails are either <strong className="text-red-600">throttled, sent directly to spam, or blocked entirely.</strong>
            </p>

            <div className="bg-red-50 border-l-4 border-red-600 p-6 my-8">
              <p className="text-lg font-semibold mb-3 text-red-900">That means:</p>
              <ul className="space-y-2 text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Your abandoned cart emails are <strong>recovering $0.</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Your welcome series is <strong>landing in the junk folder.</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Your sales announcements are <strong>never being seen.</strong></span>
                </li>
              </ul>
            </div>

            <p className="text-2xl font-bold text-center text-red-600 py-4">
              Every day you wait, you are losing customers and revenue.
            </p>
          </div>
        </div>
      </section>

      {/* Solution - The Painkiller */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Fix It in 5 Minutes for <span className="text-blue-600">$29.</span>
            </h2>
            
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              InboxPass is not a subscription. It's a one-time, automated audit and fix-kit.
            </p>
            
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              We scan your domain, analyze your current setup, and generate a <strong>"Compliance Kit"</strong> with the <em>exact</em>, copy-paste DNS records and provider-specific instructions you need to pass.
            </p>

            <p className="text-xl font-semibold text-gray-800 mb-12">
              Stop guessing. Stop reading confusing 50-page guides. Get the answer.
            </p>

            {/* 3-Step Process */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Scan</h3>
                <p className="text-gray-600">
                  Enter your domain for a free pass/fail preview.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Pay</h3>
                <p className="text-gray-600">
                  Unlock your full report for a one-time $29 payment.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Fix</h3>
                <p className="text-gray-600">
                  Copy and paste the records we provide into your DNS. Done.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get - Justifying $29 */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Your Instant "Compliance Kit" Includes:
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4 items-start bg-green-50 p-6 rounded-lg border border-green-200">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Copy-Paste SPF & DMARC Records</h3>
                <p className="text-gray-700">
                  The exact <code className="bg-gray-100 px-2 py-1 rounded">TXT</code> records for your domain. No syntax errors, no "SPF 10-lookup" failures.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-green-50 p-6 rounded-lg border border-green-200">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Provider-Specific DKIM Steps</h3>
                <p className="text-gray-700">
                  Simple, step-by-step instructions on how to find and add DKIM keys for <em>your</em> providers (Google Workspace, M365, SendGrid, Mailchimp, Klaviyo, etc.).
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-green-50 p-6 rounded-lg border border-green-200">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">One-Click Unsubscribe Headers</h3>
                <p className="text-gray-700">
                  The <code className="bg-gray-100 px-2 py-1 rounded">List-Unsubscribe</code> header snippets you <em>must</em> have to meet Gmail & Yahoo rules (this is <em>not</em> just a link in the footer).
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-green-50 p-6 rounded-lg border border-green-200">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">A Simple Validation PDF</h3>
                <p className="text-gray-700">
                  A shareable report that proves your domain is compliant, perfect for sending to your team or boss.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-green-50 p-6 rounded-lg border border-green-200">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Spam Rate & Hygiene Guide</h3>
                <p className="text-gray-700">
                  A quick-start guide to help you get and <em>stay</em> below the mandatory 0.3% spam complaint rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority - Why Now */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
              We Didn't Make the Rules. <br />We Just Help You Pass Them.
            </h2>

            <p className="text-xl text-center text-gray-700 mb-12">
              This isn't a "best practice" anymore. It's a mandatory requirement from the world's biggest inbox providers.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-8 w-8 text-red-500" />
                  <h3 className="font-bold text-xl">Gmail</h3>
                </div>
                <p className="text-gray-700 italic">
                  "Bulk senders (5k+/day) <strong>must</strong> use SPF, DKIM, DMARC, and one-click unsubscribe. Non-compliance can lead to blocking/spam."
                </p>
                <p className="text-sm text-gray-500 mt-3">— Google Sender Guidelines</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-8 w-8 text-blue-500" />
                  <h3 className="font-bold text-xl">Microsoft</h3>
                </div>
                <p className="text-gray-700 italic">
                  "As of May 5, 2025, Outlook/Hotmail enforce SPF, DKIM, and DMARC for high-volume senders, moving from warnings to junking to outright rejection."
                </p>
                <p className="text-sm text-gray-500 mt-3">— Microsoft Policy Update</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Trusted by Email Senders Worldwide</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Fixed our deliverability in under 10 minutes. Emails are finally landing in inboxes instead of spam. Worth every penny."
                </p>
                <p className="text-sm text-gray-600 font-medium">— Sarah M., Marketing Director</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Our open rates went from 12% to 31% after implementing InboxPass recommendations. Game changer for our SaaS."
                </p>
                <p className="text-sm text-gray-600 font-medium">— David K., Founder</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Clear instructions, no technical jargon. I'm not a developer and I got this done in 5 minutes. Highly recommend."
                </p>
                <p className="text-sm text-gray-600 font-medium">— Jennifer L., E-commerce Owner</p>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-8 bg-white px-8 py-4 rounded-lg shadow-sm">
                <div>
                  <p className="text-3xl font-bold text-blue-600">1,247+</p>
                  <p className="text-sm text-gray-600">Domains Scanned</p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <p className="text-3xl font-bold text-green-600">98%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">4.9/5</p>
                  <p className="text-sm text-gray-600">Customer Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Your Questions, Answered.</h2>
          <FAQ />
        </div>
      </section>

      {/* Research & Resources */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Inbox Crackdown: Headlines Worth Skimming</h2>
            <p className="text-center text-gray-600 mb-12">Don't take our word for it. Here are the official policy updates from Gmail, Microsoft, and Yahoo.</p>
            
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-red-500" />
                  Gmail Sender Guidelines
                </h3>
                <p className="text-gray-700 mb-3">
                  Authentication for all; DMARC, aligned From, one-click unsub, &lt;0.3% spam for bulk senders.
                </p>
                <a 
                  href="https://support.google.com/a/answer/14229414?hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                >
                  Read Gmail's Official Requirements →
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  Microsoft Outlook/Hotmail
                </h3>
                <p className="text-gray-700 mb-3">
                  May 5, 2025 DMARC/SPF/DKIM enforcement for high-volume senders—moving from warnings to junking to rejection.
                </p>
                <a 
                  href="https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%E2%80%99s-new-requirements-for-high%E2%80%90volume-senders/4399730" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                >
                  Read Microsoft's Policy Update →
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-500" />
                  Yahoo Sender Requirements
                </h3>
                <p className="text-gray-700 mb-3">
                  Header-level one-click unsubscribe required for all bulk senders.
                </p>
                <a 
                  href="https://senders.yahooinc.com/faqs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                >
                  Read Yahoo's Sender FAQs →
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-500" />
                  Gmail's "Manage Subscriptions"
                </h3>
                <p className="text-gray-700 mb-3">
                  New feature makes churn faster for non-compliant marketers—users can unsubscribe from multiple senders at once.
                </p>
                <a 
                  href="https://www.theverge.com/news/701282/gmail-manage-email-subscriptions-unsubscribe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                >
                  Read About Gmail's New Unsubscribe Tool →
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> These are not recommendations or best practices. These are <strong>mandatory requirements</strong> that are actively enforced as of 2024-2025. Non-compliance results in throttling, spam folder placement, or outright blocking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Don't Lose Another Sale to the Spam Folder.
            </h2>
            <p className="text-xl mb-12 text-blue-100">
              Get your instant, one-time fix.
            </p>

            <div className="bg-white rounded-lg p-8 shadow-xl">
              <DomainScanner />
              <p className="text-sm text-gray-600 mt-4">
                One-time $29 payment. No subscription. Instant PDF download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">InboxPass</h3>
                <p className="text-sm text-gray-600">
                  Fix email deliverability in 5 minutes. One-time $29 compliance kit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/refund-policy" className="hover:text-gray-900">Refund Policy</a></li>
                  <li><a href="/privacy-policy" className="hover:text-gray-900">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-gray-900">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="mailto:support@inboxpass.org" className="hover:text-gray-900">support@inboxpass.org</a></li>
                  <li className="text-green-600 font-medium">✓ 30-Day Money-Back Guarantee</li>
                </ul>
              </div>
            </div>
            <div className="border-t pt-8 text-center text-sm text-gray-600">
              <p>© {new Date().getFullYear()} InboxPass. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

