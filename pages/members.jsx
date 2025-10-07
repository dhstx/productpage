import ProtectedClient from "../components/ProtectedClient";
import AdminLayout from "../components/AdminLayout";

export default function MembersPage() {
  return (
    <ProtectedClient>
      <AdminLayout>
        <h1 className="mb-4 text-2xl font-semibold">Members</h1>
        <p className="text-text-secondary">User/member management placeholder.</p>
      </AdminLayout>
    </ProtectedClient>
  );
}
