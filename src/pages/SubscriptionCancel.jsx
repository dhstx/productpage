/**
 * Subscription Cancel Page
 * Shown when user cancels subscription checkout
 */

import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';

export default function SubscriptionCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Cancel Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <XCircle className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Subscription Cancelled
          </h1>
          <p className="text-xl text-gray-600">
            No worries! Your subscription was not processed.
          </p>
        </div>

        {/* Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What happened?</h2>
          <p className="text-gray-600 mb-6">
            You cancelled the checkout process, so no charges were made to your payment method.
            Your account remains on the current plan.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <HelpCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Had a problem during checkout?
                </h3>
                <p className="text-sm text-blue-800">
                  If you encountered any issues or have questions about our plans,
                  we're here to help. Contact our support team and we'll get you sorted out.
                </p>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">Common reasons for cancellation:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Not sure which plan is right for you</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Want to try the free tier first</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Need to discuss with your team</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Payment method issue</span>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/pricing"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            View Plans Again
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 bg-white text-gray-900 py-4 px-6 rounded-lg font-medium border-2 border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/contact"
            className="flex items-center justify-center gap-2 bg-white text-gray-900 py-4 px-6 rounded-lg font-medium border-2 border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>

        {/* Help */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">
            Still interested but have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            We'd love to help you find the perfect plan for your needs.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/contact"
              className="text-blue-600 hover:underline font-medium"
            >
              Talk to Sales
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/docs"
              className="text-blue-600 hover:underline font-medium"
            >
              Read Documentation
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/pricing"
              className="text-blue-600 hover:underline font-medium"
            >
              Compare Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

