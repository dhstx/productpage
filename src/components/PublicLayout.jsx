import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden bg-[#0C0C0C]">
      <main>
        {/* Render nested route content */}
        <Outlet />
      </main>
    </div>
  );
}
