import { CreditCard, Download, FileText } from 'lucide-react';
import { getMockInvoices, PRODUCTS } from '../lib/stripe';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Billing() {
  const invoices = getMockInvoices();
  const currentPlan = PRODUCTS[1]; // Professional plan
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);

  const handleChangePlan = () => {
    navigate('/product');
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription?\n\nYour access will continue until the end of the current billing period (November 1, 2024).')) {
      alert('Subscription cancellation scheduled.\n\nYou will receive a confirmation email shortly.');
    }
  };

  const handleUpdatePayment = () => {
    setShowPaymentModal(true);
  };

  const handleUpdateBilling = () => {
    setShowBillingModal(true);
  };

  // TODO: Implement invoice download functionality
  // const handleDownloadInvoice = (invoice) => {
  //   alert(`Downloading invoice ${invoice.id}...\n\nThis would download a PDF of your invoice.`);
  // };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          BILLING & SUBSCRIPTION
        </h1>
        <p className="text-[#B3B3B3]">
          Manage your subscription, payment methods, and billing history.
        </p>
      </div>

      {/* Current Plan */}
      <section>
        <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
          CURRENT PLAN
        </h2>
        <div className="panel-system p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[#F2F2F2] font-bold text-xl uppercase tracking-tight mb-2">
                {currentPlan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-[#F2F2F2]">{currentPlan.priceLabel}</span>
                <span className="text-[#B3B3B3]">{currentPlan.interval}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[#B3B3B3] text-sm">Active subscription</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#B3B3B3] text-sm mb-1">Next billing date</p>
              <p className="text-[#F2F2F2] font-bold">November 1, 2024</p>
            </div>
          </div>

          <div className="border-t border-[#202020] pt-4 mb-4">
            <h4 className="text-[#F2F2F2] font-bold mb-3 uppercase tracking-tight text-sm">
              Plan Features
            </h4>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, idx) => (
                <li key={idx} className="text-[#B3B3B3] text-sm flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#FFC96C]"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={handleChangePlan} className="btn-system">
              Change Plan
            </button>
            <button onClick={handleCancelSubscription} className="btn-system">
              Cancel Subscription
            </button>
          </div>
        </div>
      </section>

      {/* Payment Method */}
      <section>
        <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
          PAYMENT METHOD
        </h2>
        <div className="panel-system p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[4px] bg-[#202020] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#FFC96C]" />
              </div>
              <div>
                <p className="text-[#F2F2F2] font-bold">•••• •••• •••• 4242</p>
                <p className="text-[#B3B3B3] text-sm">Expires 12/2025</p>
              </div>
            </div>
            <button onClick={handleUpdatePayment} className="btn-system">
              Update Payment Method
            </button>
          </div>
        </div>
      </section>

      {/* Billing History */}
      <section>
        <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
          BILLING HISTORY
        </h2>
        <div className="panel-system overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#202020]">
                  <th className="text-left px-6 py-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">
                    Invoice
                  </th>
                  <th className="text-left px-6 py-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-[#202020] last:border-b-0 hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-6 py-4 text-[#F2F2F2] mono">{invoice.id}</td>
                    <td className="px-6 py-4 text-[#B3B3B3]">{invoice.date}</td>
                    <td className="px-6 py-4 text-[#F2F2F2] font-bold">
                      ${(invoice.amount / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-green-500 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#FFC96C] hover:underline text-sm flex items-center gap-1 ml-auto">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Billing Info */}
      <section>
        <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
          BILLING INFORMATION
        </h2>
        <div className="panel-system p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-[#B3B3B3] text-sm mb-1 uppercase tracking-tight">Company Name</p>
              <p className="text-[#F2F2F2]">Your Organization</p>
            </div>
            <div>
              <p className="text-[#B3B3B3] text-sm mb-1 uppercase tracking-tight">Email</p>
              <p className="text-[#F2F2F2]">billing@yourorganization.com</p>
            </div>
            <div>
              <p className="text-[#B3B3B3] text-sm mb-1 uppercase tracking-tight">Address</p>
              <p className="text-[#F2F2F2]">123 Board Street, Suite 100</p>
            </div>
            <div>
              <p className="text-[#B3B3B3] text-sm mb-1 uppercase tracking-tight">Tax ID</p>
              <p className="text-[#F2F2F2]">XX-XXXXXXX</p>
            </div>
          </div>
          <div className="mt-6">
            <button onClick={handleUpdateBilling} className="btn-system">
              Update Billing Information
            </button>
          </div>
        </div>
      </section>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="panel-system p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              UPDATE PAYMENT METHOD
            </h3>
            <p className="text-[#B3B3B3] mb-6">
              This would open Stripe's secure payment form to update your card details.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  alert('Redirecting to Stripe...');
                  setShowPaymentModal(false);
                }}
                className="btn-system flex-1"
              >
                Continue to Stripe
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-[4px] bg-[#202020] text-[#F2F2F2] hover:bg-[#1A1A1A] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing Info Modal */}
      {showBillingModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="panel-system p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              UPDATE BILLING INFORMATION
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Billing information updated!'); setShowBillingModal(false); }} className="space-y-4">
              <div>
                <label className="block text-[#B3B3B3] text-sm mb-2 uppercase tracking-tight">
                  Company Name
                </label>
                <input
                  type="text"
                  defaultValue="Your Organization"
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                />
              </div>
              <div>
                <label className="block text-[#B3B3B3] text-sm mb-2 uppercase tracking-tight">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="billing@yourorganization.com"
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                />
              </div>
              <div>
                <label className="block text-[#B3B3B3] text-sm mb-2 uppercase tracking-tight">
                  Address
                </label>
                <input
                  type="text"
                  defaultValue="123 Board Street, Suite 100"
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                />
              </div>
              <div>
                <label className="block text-[#B3B3B3] text-sm mb-2 uppercase tracking-tight">
                  Tax ID
                </label>
                <input
                  type="text"
                  defaultValue="XX-XXXXXXX"
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-system flex-1">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowBillingModal(false)}
                  className="px-4 py-2 rounded-[4px] bg-[#202020] text-[#F2F2F2] hover:bg-[#1A1A1A] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
