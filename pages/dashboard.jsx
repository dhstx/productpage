import ProtectedClient from "../components/ProtectedClient";
import AdminLayout from "../components/AdminLayout";

export default function DashboardPage() {
  return (
    <ProtectedClient>
      <AdminLayout>
        <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
        <p className="text-text-secondary">Placeholder dashboard metrics.</p>
      </AdminLayout>
    </ProtectedClient>
  );
}
