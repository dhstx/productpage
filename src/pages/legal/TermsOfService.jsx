import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: December 2024</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using DHStx.co ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, do not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                DHStx provides an AI-powered automation platform with multiple specialized agents for business tasks. 
                The Service operates on a Platform Token (PT) based pricing model with tiered subscription plans.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
              <p className="text-gray-700 mb-4">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Platform Tokens (PT) and Billing</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 PT System</h3>
              <p className="text-gray-700 mb-4">
                Platform Tokens (PT) are the unit of measurement for Service usage. PT consumption varies based on:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>AI model used (Core vs Advanced)</li>
                <li>Message length and complexity</li>
                <li>Agent type selected</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Subscription Plans</h3>
              <p className="text-gray-700 mb-4">
                We offer multiple subscription tiers with monthly PT allocations. Unused PT expires at the end of each billing cycle.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Billing</h3>
              <p className="text-gray-700 mb-4">
                Subscriptions are billed in advance on a monthly or annual basis. You authorize us to charge your payment method for all fees.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.4 Advanced PT Metering</h3>
              <p className="text-gray-700 mb-4">
                Advanced model usage may incur additional charges beyond your base subscription. You will be notified before exceeding your Advanced PT allocation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use Policy</h2>
              <p className="text-gray-700 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful code or malware</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use the Service to harass, abuse, or harm others</li>
                <li>Scrape or extract data without permission</li>
                <li>Resell or redistribute the Service</li>
                <li>Use the Service to generate spam or unsolicited content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Content and Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.1 Your Content</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of content you submit to the Service. By submitting content, you grant us a license to use, 
                store, and process it to provide the Service.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.2 AI-Generated Content</h3>
              <p className="text-gray-700 mb-4">
                Content generated by our AI agents is provided to you for your use. You are responsible for reviewing and 
                verifying all AI-generated content before use.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.3 Our Intellectual Property</h3>
              <p className="text-gray-700 mb-4">
                The Service, including all software, algorithms, and content, is owned by DHStx and protected by intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Refund Policy</h2>
              <p className="text-gray-700 mb-4">
                Refunds are handled on a case-by-case basis. To request a refund, contact support@dhstx.co within 7 days of purchase. 
                Refunds are not available for PT that has been consumed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Modifications and Termination</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify or discontinue the Service at any time. We may terminate or suspend your account 
                for violations of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers and Limitations of Liability</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.1 Service "As Is"</h3>
              <p className="text-gray-700 mb-4">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.2 AI Limitations</h3>
              <p className="text-gray-700 mb-4">
                AI-generated content may contain errors, inaccuracies, or inappropriate content. You are responsible for 
                reviewing and verifying all output.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.3 Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, DHSTX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold harmless DHStx from any claims arising from your use of the Service or 
                violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                Any disputes shall be resolved through binding arbitration in accordance with the rules of the American 
                Arbitration Association.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by the laws of the State of Delaware, without regard to conflict of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance 
                of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms, contact us at:
              </p>
              <p className="text-gray-700">
                Email: legal@dhstx.co<br />
                Address: [Your Business Address]
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              By using DHStx.co, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

