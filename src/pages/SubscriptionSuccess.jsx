/**
 * Subscription Success Page
 * Shown after successful subscription purchase
 */

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);

  const sessionId = searchParams.get('session_id');
  const tier = searchParams.get('tier') || 'Pro';

  useEffect(() => {
    // Fetch subscription details from Stripe session
    if (sessionId) {
      fetchSubscriptionDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  async function fetchSubscriptionDetails() {
    try {
      const response = await fetch(`/api/stripe/session?session_id=${sessionId}`);
      const data = await response.json();
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to {tier}! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Your subscription is now active
          </p>
        </div>

        {/* Subscription Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's next?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-semibold">
                  1
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Check your email
                </h3>
                <p className="text-gray-600">
                  We've sent you a confirmation email with your invoice and subscription details.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-semibold">
                  2
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Explore your dashboard
                </h3>
                <p className="text-gray-600">
                  Your Points allocation is ready. Start building with our AI agents right away.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-semibold">
                  3
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Join our community
                </h3>
                <p className="text-gray-600">
                  Connect with other users, get tips, and stay updated on new features.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Sparkles className="h-5 w-5" />
            Go to Dashboard
          </Link>
          <Link
            to="/billing"
            className="flex items-center justify-center gap-2 bg-white text-gray-900 py-4 px-6 rounded-lg font-medium border-2 border-gray-200 hover:bg-gray-50 transition-colors"
          >
            View Billing
          </Link>
        </div>

        {/* Help */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Need help getting started?{' '}
            <Link to="/docs" className="text-blue-600 hover:underline">
              Check our docs
            </Link>
            {' '}or{' '}
            <Link to="/contact" className="text-blue-600 hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

