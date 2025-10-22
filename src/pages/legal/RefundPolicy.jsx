import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: December 2024</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
              <p className="text-gray-700 mb-4">
                At DHStx, we strive to provide excellent service. This Refund Policy outlines the circumstances under 
                which refunds may be issued and the process for requesting them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Subscription Refunds</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.1 Monthly Subscriptions</h3>
              <p className="text-gray-700 mb-4">
                Monthly subscriptions may be eligible for a prorated refund if:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You request a refund within 7 days of your initial subscription</li>
                <li>You have used less than 20% of your allocated PT</li>
                <li>You have not previously received a refund</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Annual Subscriptions</h3>
              <p className="text-gray-700 mb-4">
                Annual subscriptions may be eligible for a prorated refund if:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You request a refund within 14 days of purchase</li>
                <li>You have used less than 10% of your total annual PT allocation</li>
                <li>The refund amount will be calculated based on unused months</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. PT Top-Up Refunds</h2>
              <p className="text-gray-700 mb-4">
                PT top-up purchases are generally non-refundable once the PT has been added to your account. 
                Exceptions may be made for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Duplicate or erroneous charges</li>
                <li>Technical errors that prevented PT delivery</li>
                <li>Unauthorized purchases (with proof)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Non-Refundable Items</h2>
              <p className="text-gray-700 mb-4">
                The following are not eligible for refunds:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>PT that has been consumed</li>
                <li>Subscriptions after the refund window has passed</li>
                <li>Partial month subscriptions</li>
                <li>Promotional or discounted subscriptions (unless required by law)</li>
                <li>Services rendered (conversations completed, agents used)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Service Issues</h2>
              <p className="text-gray-700 mb-4">
                If you experience service issues that prevent you from using the platform, you may be eligible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>PT credit for the affected period</li>
                <li>Extended subscription period</li>
                <li>Partial or full refund (at our discretion)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Service issues must be reported within 48 hours of occurrence to be eligible for compensation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. How to Request a Refund</h2>
              <p className="text-gray-700 mb-4">
                To request a refund:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Contact our support team at support@dhstx.co</li>
                <li>Include your account email and subscription/transaction ID</li>
                <li>Provide a detailed reason for the refund request</li>
                <li>Include any relevant screenshots or documentation</li>
              </ol>
              <p className="text-gray-700 mt-4">
                Refund requests are typically processed within 5-7 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Refund Process</h2>
              <p className="text-gray-700 mb-4">
                Once approved:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Refunds are issued to the original payment method</li>
                <li>Processing time: 5-10 business days</li>
                <li>You will receive an email confirmation</li>
                <li>Your account may be downgraded or suspended</li>
                <li>Unused PT will be removed from your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Chargebacks</h2>
              <p className="text-gray-700 mb-4">
                If you initiate a chargeback without first contacting us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Your account will be immediately suspended</li>
                <li>You may be charged a chargeback fee</li>
                <li>You may be banned from future use of the Service</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Please contact us first to resolve any billing disputes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cancellation vs. Refund</h2>
              <p className="text-gray-700 mb-4">
                Canceling your subscription is different from requesting a refund:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Cancellation stops future billing but does not refund current period</li>
                <li>You retain access until the end of your billing cycle</li>
                <li>Unused PT expires at the end of the billing cycle</li>
                <li>You can cancel anytime from your Settings page</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                If you have a dispute about PT charges or billing:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Submit a dispute through your Billing page</li>
                <li>Provide evidence (screenshots, conversation logs)</li>
                <li>Our team will review within 3-5 business days</li>
                <li>You will receive a decision via email</li>
                <li>Approved disputes result in PT credit or refund</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Exceptional Circumstances</h2>
              <p className="text-gray-700 mb-4">
                We may issue refunds outside of this policy for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Extended service outages (>24 hours)</li>
                <li>Data loss or corruption</li>
                <li>Billing errors on our part</li>
                <li>Legal requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately 
                upon posting. Your continued use of the Service constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For refund requests or questions about this policy:
              </p>
              <p className="text-gray-700">
                Email: support@dhstx.co<br />
                Billing Support: billing@dhstx.co<br />
                Response Time: Within 24 hours
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              This Refund Policy is part of our Terms of Service. By using DHStx.co, you agree to this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

