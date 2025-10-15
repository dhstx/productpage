import GlobalNav from './GlobalNav';
import { Outlet } from 'react-router-dom';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden bg-[#0C0C0C]">
      <GlobalNav />
      <main>
        {/* Render nested route content */}
        <Outlet />
      </main>
    </div>
  );
}
