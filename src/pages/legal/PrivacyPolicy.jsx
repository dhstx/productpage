import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: December 2024</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                DHStx ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Account information (name, email, password)</li>
                <li>Profile information (company, phone number)</li>
                <li>Payment information (processed by Stripe)</li>
                <li>Messages and content you submit to AI agents</li>
                <li>Support communications</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Usage data (pages visited, features used)</li>
                <li>PT consumption and billing data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.3 AI Interaction Data</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Conversation history with AI agents</li>
                <li>Agent selection and preferences</li>
                <li>Model usage (Core vs Advanced)</li>
                <li>PT consumption patterns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide and maintain the Service</li>
                <li>Process your transactions and manage billing</li>
                <li>Improve and personalize your experience</li>
                <li>Train and improve our AI models</li>
                <li>Send service updates and notifications</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Detect and prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
                <li>Analyze usage patterns and optimize performance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. AI Model Training</h2>
              <p className="text-gray-700 mb-4">
                We may use anonymized conversation data to improve our AI models. You can opt out of having your data used 
                for training by contacting us at privacy@dhstx.co.
              </p>
              <p className="text-gray-700 mb-4">
                We do not share your specific conversations with third-party AI providers beyond what is necessary to 
                generate responses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.1 Service Providers</h3>
              <p className="text-gray-700 mb-4">We share information with trusted service providers:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Stripe (payment processing)</li>
                <li>Supabase (database and authentication)</li>
                <li>Anthropic (AI model provider)</li>
                <li>Vercel (hosting)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.2 Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law or to protect our rights, safety, or property.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.3 Business Transfers</h3>
              <p className="text-gray-700 mb-4">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication</li>
                <li>Secure data centers with physical security</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-700 mt-4">
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your information for as long as necessary to provide the Service and comply with legal obligations:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Account data: Until account deletion + 30 days</li>
                <li>Conversation history: 90 days (configurable in settings)</li>
                <li>Billing records: 7 years (legal requirement)</li>
                <li>Audit logs: 90 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt out of marketing communications</li>
                <li>Opt out of AI training data use</li>
                <li>Object to processing of your data</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, contact us at privacy@dhstx.co or use the Settings page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Maintain your session</li>
                <li>Remember your preferences</li>
                <li>Analyze usage patterns</li>
                <li>Improve performance</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can control cookies through your browser settings. However, disabling cookies may limit functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
                safeguards are in place to protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our Service is not intended for children under 13. We do not knowingly collect information from children. 
                If you believe we have collected information from a child, contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of significant changes via email 
                or a notice on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                For questions about this Privacy Policy or to exercise your rights, contact us at:
              </p>
              <p className="text-gray-700">
                Email: privacy@dhstx.co<br />
                Address: [Your Business Address]<br />
                Data Protection Officer: [DPO Name/Email]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. GDPR Compliance (EU Users)</h2>
              <p className="text-gray-700 mb-4">
                If you are in the European Union, you have additional rights under GDPR:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Right to data portability</li>
                <li>Right to restrict processing</li>
                <li>Right to object to automated decision-making</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Our lawful basis for processing your data is consent and contractual necessity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. CCPA Compliance (California Users)</h2>
              <p className="text-gray-700 mb-4">
                If you are a California resident, you have additional rights under CCPA:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Right to know what personal information is collected</li>
                <li>Right to know if personal information is sold or disclosed</li>
                <li>Right to opt-out of the sale of personal information</li>
                <li>Right to non-discrimination for exercising your rights</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We do not sell your personal information.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              By using DHStx.co, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

