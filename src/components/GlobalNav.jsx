import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';

export default function GlobalNav() {
  const [open, setOpen] = useState(false);

  const NavLinks = ({ onClick }) => (
    <nav className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <Link onClick={onClick} to="/" className="text-[#e0e0e0] hover:text-[#FFC96C] text-sm md:text-[15px] uppercase tracking-tight">Home</Link>
      <Link onClick={onClick} to="/agents" className="text-[#e0e0e0] hover:text-[#FFC96C] text-sm md:text-[15px] uppercase tracking-tight">Agents</Link>
      <Link onClick={onClick} to="/integrations" className="text-[#e0e0e0] hover:text-[#FFC96C] text-sm md:text-[15px] uppercase tracking-tight">Integrations</Link>
      <Link onClick={onClick} to="/platforms" className="text-[#e0e0e0] hover:text-[#FFC96C] text-sm md:text-[15px] uppercase tracking-tight">Platforms</Link>
      <Link onClick={onClick} to="/team" className="text-[#e0e0e0] hover:text-[#FFC96C] text-sm md:text-[15px] uppercase tracking-tight">Team</Link>
      <Link onClick={onClick} to="/pricing" className="text-[#e0e0e0] hover:text-[#FFC96C] text-sm md:text-[15px] uppercase tracking-tight">Pricing</Link>
      <Link onClick={onClick} to="/contact" className="text-[#e0e0e0] hover:text-[#FFC96C] text-sm md:text-[15px] uppercase tracking-tight">Contact</Link>
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#202020] bg-[#0C0C0C]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0C0C0C]/75">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded md:hidden text-[#B3B3B3] hover:text-[#FFC96C]"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="text-[15px] font-bold tracking-tight text-[#e0e0e0]">DHStx</Link>
        </div>

        <div className="hidden md:block">
          <NavLinks />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          <ThemeToggle inline />
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-[#202020] md:hidden">
          <div className="px-4 py-3">
            <SearchBar className="w-full" />
          </div>
          <div className="px-4 py-2 pb-4">
            <NavLinks onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
