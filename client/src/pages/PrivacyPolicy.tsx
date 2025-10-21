export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              When you use InboxPass, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Domain names</strong> you scan for compliance checking</li>
              <li><strong>DNS records</strong> (SPF, DKIM, DMARC, BIMI) from public DNS servers</li>
              <li><strong>Payment information</strong> processed securely through Stripe (we never see your card details)</li>
              <li><strong>Email address</strong> for order confirmation and report delivery</li>
              <li><strong>Usage analytics</strong> (page views, scan counts) to improve our service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Generate your compliance report and DNS recommendations</li>
              <li>Process payments and send receipts</li>
              <li>Provide customer support</li>
              <li>Improve InboxPass features and accuracy</li>
              <li>Send important updates about email compliance requirements (you can unsubscribe anytime)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-700">
              We use industry-standard encryption (SSL/TLS) to protect data in transit. Payment processing 
              is handled by Stripe, a PCI-compliant payment processor. We never store credit card information 
              on our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, rent, or share your personal information with third parties except:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Stripe</strong> for payment processing</li>
              <li><strong>Email service providers</strong> to deliver your compliance report</li>
              <li><strong>Analytics providers</strong> (anonymized data only)</li>
              <li><strong>Legal requirements</strong> if required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access your data</li>
              <li>Request data deletion</li>
              <li>Opt out of marketing emails</li>
              <li>Request a copy of your compliance report</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, email{" "}
              <a href="mailto:privacy@inboxpass.org" className="text-blue-600 hover:underline">
                privacy@inboxpass.org
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-gray-700">
              We use essential cookies for authentication and analytics cookies to understand how visitors 
              use InboxPass. You can disable cookies in your browser settings, but some features may not work properly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this privacy policy from time to time. We'll notify you of significant changes 
              via email or a notice on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700">
              Questions about privacy? Email{" "}
              <a href="mailto:privacy@inboxpass.org" className="text-blue-600 hover:underline">
                privacy@inboxpass.org
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

