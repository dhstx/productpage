import ProtectedClient from "../components/ProtectedClient";
import AdminLayout from "../components/AdminLayout";

export default function PlatformsPage() {
  return (
    <ProtectedClient>
      <AdminLayout>
        <h1 className="mb-4 text-2xl font-semibold">Platforms</h1>
        <p className="text-text-secondary">List and manage platforms/resources here.</p>
      </AdminLayout>
    </ProtectedClient>
  );
}
