export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">30-Day Money-Back Guarantee</h2>
            <p className="text-gray-700 mb-4">
              We stand behind InboxPass 100%. If you're not satisfied with your compliance kit for any reason, 
              we'll refund your $29 payment in full—no questions asked.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to Request a Refund</h2>
            <p className="text-gray-700 mb-4">
              To request a refund, simply email us at <a href="mailto:support@inboxpass.org" className="text-blue-600 hover:underline">support@inboxpass.org</a> with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Your domain name</li>
              <li>Order confirmation email or payment receipt</li>
              <li>Brief reason for refund (optional, helps us improve)</li>
            </ul>
            <p className="text-gray-700">
              We'll process your refund within 2-3 business days. The refund will appear in your account 
              within 5-10 business days depending on your bank.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What's Covered</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Full refund if DNS records don't work as described</li>
              <li>Full refund if setup instructions are unclear or incomplete</li>
              <li>Full refund if you're not satisfied for any reason within 30 days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">After Refund</h2>
            <p className="text-gray-700">
              After a refund is issued, you'll retain access to your compliance report for reference, 
              but we ask that you do not share or redistribute the materials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700">
              Questions about our refund policy? Email us at{" "}
              <a href="mailto:support@inboxpass.org" className="text-blue-600 hover:underline">
                support@inboxpass.org
              </a>
              {" "}and we'll respond within 24 hours.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-center text-gray-700">
            <strong>Bottom line:</strong> If InboxPass doesn't solve your email deliverability problem, 
            you don't pay. It's that simple.
          </p>
        </div>
      </div>
    </div>
  );
}

