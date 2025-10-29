import BackArrow from '../components/BackArrow';
import PageTitle from '@/components/PageTitle';
import BillingContent from '@/features/billing/BillingContent';

export default function Billing() {
  return (
    <div className="min-h-screen dashboard-surface">
      <BackArrow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <PageTitle className="mb-2 uppercase tracking-tight">BILLING</PageTitle>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Manage your subscription, Points usage, and payment methods
          </p>
        </div>
        <BillingContent />
      </div>
    </div>
  );
}

