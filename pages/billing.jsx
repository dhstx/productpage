import ProtectedClient from "../components/ProtectedClient";
import AdminLayout from "../components/AdminLayout";

export default function BillingPage() {
  return (
    <ProtectedClient>
      <AdminLayout>
        <h1 className="mb-4 text-2xl font-semibold">Billing</h1>
        <p className="text-text-secondary">Billing and subscription settings placeholder.</p>
      </AdminLayout>
    </ProtectedClient>
  );
}
