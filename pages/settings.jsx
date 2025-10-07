import ProtectedClient from "../components/ProtectedClient";
import AdminLayout from "../components/AdminLayout";

export default function SettingsPage() {
  return (
    <ProtectedClient>
      <AdminLayout>
        <h1 className="mb-4 text-2xl font-semibold">Settings</h1>
        <p className="text-text-secondary">Account and application settings placeholder.</p>
      </AdminLayout>
    </ProtectedClient>
  );
}