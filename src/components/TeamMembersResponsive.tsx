import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Trash2 } from "lucide-react";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | string;
  status: "Active" | "Pending" | "Suspended" | string;
  joined: string; // ISO or yyyy-mm-dd
};

export function TeamMembersResponsive({
  members,
  onChangeRole,
  onRemove,
}: {
  members: Member[];
  onChangeRole: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (isMobile) {
    return (
      <div className="tm-cards">
        {members.map((m) => (
          <article key={m.id} className="tm-card" aria-label={`${m.name} record`}>
            <header className="tm-card__head">
              <div className="tm-avatar" aria-hidden>
                {m.name?.[0] ?? "?"}
              </div>
              <div className="tm-ident min-w-0">
                <div className="tm-name">{m.name}</div>
                <div className="tm-email overflow-wrap-anywhere">{m.email}</div>
              </div>
              <div className="tm-actions">
                {m.role !== "Owner" && (
                  <>
                    <button className="btn btn-ghost" onClick={() => onChangeRole(m.id)}>Change Role</button>
                    <button className="btn btn-danger" onClick={() => onRemove(m.id)} aria-label={`Remove ${m.name}`}>
                      🗑
                    </button>
                  </>
                )}
              </div>
            </header>

            <dl className="tm-meta">
              <div className="tm-meta__item">
                <dt>Role</dt><dd>{m.role}</dd>
              </div>
              <div className="tm-meta__item">
                <dt>Status</dt>
                <dd className={`dot ${String(m.status || "").toLowerCase()}`}>{m.status}</dd>
              </div>
              <div className="tm-meta__item">
                <dt>Joined</dt><dd>{new Date(m.joined).toLocaleDateString()}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    );
  }

  // Desktop: keep existing table (wrapped for horizontal scroll + sticky first column)
  return (
    <div className="panel-system tm-table-wrap">
      <table className="w-full tm-table">
        <thead className="bg-white dark:bg-[#0C0C0C]">
          <tr className="border-b border-zinc-200 dark:border-[#202020]">
            <th className="text-left p-3 md:p-4 text-zinc-600 dark:text-[#B3B3B3] text-xs md:text-sm uppercase tracking-tight font-bold">Member</th>
            <th className="text-left p-3 md:p-4 text-zinc-600 dark:text-[#B3B3B3] text-xs md:text-sm uppercase tracking-tight font-bold w-[88px] md:w-auto">Role</th>
            <th className="text-left p-3 md:p-4 text-zinc-600 dark:text-[#B3B3B3] text-xs md:text-sm uppercase tracking-tight font-bold">Status</th>
            <th className="text-left p-3 md:p-4 text-zinc-600 dark:text-[#B3B3B3] text-xs md:text-sm uppercase tracking-tight font-bold hidden sm:table-cell">Joined</th>
            <th className="text-right p-3 md:p-4 text-zinc-600 dark:text-[#B3B3B3] text-xs md:text-sm uppercase tracking-tight font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-b border-zinc-200 dark:border-[#202020] hover:bg-zinc-50 dark:hover:bg-[#1A1A1A]">
              <td className="p-3 md:p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[4px] bg-zinc-100 dark:bg-[#202020] flex items-center justify-center flex-shrink-0">
                    <span className="text-zinc-700 dark:text-white/90 font-bold">{m.name?.[0] ?? "?"}</span>
                  </div>
                  <div>
                    <div className="text-zinc-900 dark:text-zinc-100 font-medium text-sm md:text-base">{m.name}</div>
                    <div className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm">{m.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-3 md:p-4">
                <span className="px-2 py-0.5 rounded-[4px] border border-zinc-200 bg-white text-zinc-800 dark:border-white/10 dark:bg-neutral-800 dark:text-zinc-200 text-xs md:text-sm font-medium whitespace-nowrap">
                  {m.role}
                </span>
              </td>
              <td className="p-3 md:p-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${m.status === 'Active' ? 'bg-green-600 dark:bg-green-500' : m.status === 'Suspended' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm">{m.status}</span>
                </div>
              </td>
              <td className="p-3 md:p-4 text-zinc-600 dark:text-zinc-400 text-xs md:text-sm hidden sm:table-cell">{m.joined}</td>
              <td className="p-3 md:p-4">
                <div className="flex items-center justify-end gap-2">
                  {m.role !== 'Owner' && (
                    <>
                      <button
                        onClick={() => onChangeRole(m.id)}
                        className="px-2 py-1 rounded-[4px] border border-zinc-200 bg-white text-zinc-800 text-xs md:text-sm hover:bg-zinc-50 dark:border-white/10 dark:bg-neutral-800 dark:text-zinc-100 dark:hover:bg-neutral-700 transition-colors"
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() => onRemove(m.id)}
                        className="p-2 rounded-[4px] border border-zinc-200 bg-white text-zinc-700 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:bg-neutral-800 dark:text-zinc-200 dark:hover:bg-red-900/20 transition-colors"
                        aria-label={`Remove ${m.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
