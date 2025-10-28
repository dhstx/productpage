import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Trash2 } from "lucide-react";
import "@/styles/team-actions.css";

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
                    <button
                      className="team-action"
                      onClick={() => onChangeRole(m.id)}
                    >
                      Change Role
                    </button>
                    <button
                      className="team-action team-action--danger"
                      onClick={() => onRemove(m.id)}
                      aria-label={`Remove ${m.name}`}
                    >
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
    <div className="panel-system tm-table-wrap" style={{ background: 'var(--card-bg)', color: 'var(--text)', border: '1px solid var(--card-border)', borderRadius: 12 }}>
      <table className="w-full tm-table">
        <thead style={{ background: 'var(--card-bg)' }}>
          <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
            <th className="text-left p-3 md:p-4 text-xs md:text-sm uppercase tracking-tight font-bold" style={{ color: 'var(--muted)' }}>Member</th>
            <th className="text-left p-3 md:p-4 text-xs md:text-sm uppercase tracking-tight font-bold w-[88px] md:w-auto" style={{ color: 'var(--muted)' }}>Role</th>
            <th className="text-left p-3 md:p-4 text-xs md:text-sm uppercase tracking-tight font-bold" style={{ color: 'var(--muted)' }}>Status</th>
            <th className="text-left p-3 md:p-4 text-xs md:text-sm uppercase tracking-tight font-bold hidden sm:table-cell" style={{ color: 'var(--muted)' }}>Joined</th>
            <th className="text-right p-3 md:p-4 text-xs md:text-sm uppercase tracking-tight font-bold" style={{ color: 'var(--muted)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
              <td className="p-3 md:p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[4px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-elev)' }}>
                    <span className="font-bold" style={{ color: 'var(--text)' }}>{m.name?.[0] ?? "?"}</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm md:text-base" style={{ color: 'var(--text)' }}>{m.name}</div>
                    <div className="text-xs md:text-sm" style={{ color: 'var(--muted)' }}>{m.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-3 md:p-4">
                <span className="px-2 py-0.5 rounded-[4px] text-xs md:text-sm font-medium whitespace-nowrap" style={{ border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text)' }}>
                  {m.role}
                </span>
              </td>
              <td className="p-3 md:p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.status === 'Active' ? '#16a34a' : m.status === 'Suspended' ? '#ef4444' : '#f59e0b' }}></div>
                  <span className="text-xs md:text-sm" style={{ color: 'var(--muted)' }}>{m.status}</span>
                </div>
              </td>
              <td className="p-3 md:p-4 text-xs md:text-sm hidden sm:table-cell" style={{ color: 'var(--muted)' }}>{m.joined}</td>
              <td className="p-3 md:p-4">
                <div className="flex items-center justify-end gap-2">
                  {m.role !== 'Owner' && (
                    <>
                      <button
                        onClick={() => onChangeRole(m.id)}
                        className="team-action"
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() => onRemove(m.id)}
                        className="team-action team-action--danger"
                        aria-label={`Remove ${m.name}`}
                        title={`Remove ${m.name}`}
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
