import { useState } from 'react';
import "../styles/dashboard-theme.css";
import "@/styles/theme-overrides.css";
import BackArrow from '../components/BackArrow';
import PageHeading from '../components/PageHeading';
import { Users, Mail, Shield, UserPlus } from 'lucide-react';
import { TeamMembersResponsive } from "@/components/TeamMembersResponsive";

export default function Team() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamMembers] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@yourorganization.com',
      role: 'Owner',
      status: 'Active',
      joinedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@yourorganization.com',
      role: 'Admin',
      status: 'Active',
      joinedDate: '2024-03-20'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@yourorganization.com',
      role: 'Member',
      status: 'Active',
      joinedDate: '2024-06-10'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily@yourorganization.com',
      role: 'Member',
      status: 'Pending',
      joinedDate: '2024-09-25'
    }
  ]);

  const handleInvite = (e) => {
    e.preventDefault();
    alert('Invitation sent! The team member will receive an email to join.');
    setShowInviteModal(false);
  };

  const handleRemove = (member) => {
    if (confirm(`Remove ${member.name} from the team?`)) {
      alert(`${member.name} has been removed from the team.`);
    }
  };

  const handleChangeRole = (member) => {
    alert(`Change role for ${member.name}\n\nAvailable roles:\n• Owner - Full access\n• Admin - Manage team and settings\n• Member - View and edit content\n• Viewer - Read-only access`);
  };

  // Adapters for the responsive component's id-based API
  const membersForComponent = teamMembers.map((m) => ({
    id: String(m.id),
    name: m.name,
    email: m.email,
    role: m.role,
    status: m.status,
    joined: m.joinedDate,
  }));

  const onChangeRoleById = (id) => {
    const m = teamMembers.find((x) => String(x.id) === String(id));
    if (m) handleChangeRole(m);
  };

  const onRemoveById = (id) => {
    const m = teamMembers.find((x) => String(x.id) === String(id));
    if (m) handleRemove(m);
  };

  return (
    <div className="space-y-8 dashboard-surface">
      <BackArrow />
      <div className="flex items-center justify-between">
        <div>
          <PageHeading className="mb-2 uppercase tracking-tight">TEAM</PageHeading>
          <p className="text-muted-fg">
            Manage team members and their access to your platforms.
          </p>
        </div>
        {/* Desktop invite button (right aligned) */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="btn-primary hidden md:flex items-center gap-2 px-4 py-2"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>
      {/* Mobile invite button (above stats, left aligned) */}
      <div className="md:hidden">
        <button
          onClick={() => setShowInviteModal(true)}
          className="btn-primary flex items-center gap-2 mt-2 px-4 py-2"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border bg-[color:var(--panel)] p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Total Members</div>
          <div className="text-base font-semibold" style={{ color: 'var(--text)' }}>4</div>
        </div>
        <div className="rounded-xl border bg-[color:var(--panel)] p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Admins</div>
          <div className="text-base font-semibold" style={{ color: 'var(--text)' }}>2</div>
        </div>
        <div className="rounded-xl border bg-[color:var(--panel)] p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Pending Invites</div>
          <div className="text-base font-semibold" style={{ color: 'var(--text)' }}>1</div>
        </div>
        <div className="rounded-xl border bg-[color:var(--panel)] p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Available Seats</div>
          <div className="text-base font-semibold" style={{ color: 'var(--text)' }}>46</div>
        </div>
      </div>

      {/* Team Members List */}
      <section>
        <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-primary">
          TEAM MEMBERS
        </h2>
        <TeamMembersResponsive
          members={membersForComponent}
          onChangeRole={onChangeRoleById}
          onRemove={onRemoveById}
        />
      </section>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="dashboard-card p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              INVITE TEAM MEMBER
            </h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-[#B3B3B3] text-sm mb-2 uppercase tracking-tight">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2 rounded-[4px] focus:outline-none"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label className="block text-[#B3B3B3] text-sm mb-2 uppercase tracking-tight">
                  Role
                </label>
                <select className="w-full px-4 py-2 rounded-[4px] focus:outline-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text)' }}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-[#B3B3B3] text-sm mb-2 uppercase tracking-tight">
                  Personal Message (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="Welcome to the team!"
                  className="w-full px-4 py-2 rounded-[4px] focus:outline-none resize-none"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text)' }}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 px-4 py-2">
                  Send Invitation
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn-outline px-4 py-2 rounded-[4px] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
