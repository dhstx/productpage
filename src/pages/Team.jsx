import { useState } from 'react';
import BackArrow from '../components/BackArrow';
import { Users, Mail, Shield, Trash2, UserPlus } from 'lucide-react';

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

  return (
    <div className="space-y-8">
      <BackArrow />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
            TEAM MANAGEMENT
          </h1>
          <p className="text-[#B3B3B3]">
            Manage team members and their access to your platforms.
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="btn-system flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="panel-system p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-[#FFC96C]" />
            <span className="text-[#B3B3B3] text-sm uppercase tracking-tight">Total Members</span>
          </div>
          <div className="text-2xl font-bold text-[#F2F2F2]">4</div>
        </div>
        <div className="panel-system p-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-[#FFC96C]" />
            <span className="text-[#B3B3B3] text-sm uppercase tracking-tight">Admins</span>
          </div>
          <div className="text-2xl font-bold text-[#F2F2F2]">2</div>
        </div>
        <div className="panel-system p-4">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-[#FFC96C]" />
            <span className="text-[#B3B3B3] text-sm uppercase tracking-tight">Pending Invites</span>
          </div>
          <div className="text-2xl font-bold text-[#F2F2F2]">1</div>
        </div>
        <div className="panel-system p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-[#FFC96C]" />
            <span className="text-[#B3B3B3] text-sm uppercase tracking-tight">Available Seats</span>
          </div>
          <div className="text-2xl font-bold text-[#F2F2F2]">46</div>
        </div>
      </div>

      {/* Team Members List */}
      <section>
        <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
          TEAM MEMBERS
        </h2>
        <div className="panel-system overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0C0C0C]">
              <tr className="border-b border-[#202020]">
                <th className="text-left p-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">Member</th>
                <th className="text-left p-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">Role</th>
                <th className="text-left p-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">Status</th>
                <th className="text-left p-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">Joined</th>
                <th className="text-right p-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b border-[#202020] hover:bg-[#1A1A1A]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[4px] bg-[#202020] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#FFC96C] font-bold">{member.name[0]}</span>
                      </div>
                      <div>
                        <div className="text-[#F2F2F2] font-medium">{member.name}</div>
                        <div className="text-[#B3B3B3] text-sm">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-[4px] bg-[#202020] text-[#FFC96C] text-sm font-medium">
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-[#B3B3B3] text-sm">{member.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#B3B3B3] text-sm">{member.joinedDate}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {member.role !== 'Owner' && (
                        <>
                          <button
                            onClick={() => handleChangeRole(member)}
                            className="px-3 py-1 rounded-[4px] bg-[#202020] text-[#F2F2F2] text-sm hover:bg-[#FFC96C] hover:text-[#0C0C0C] transition-colors"
                          >
                            Change Role
                          </button>
                          <button
                            onClick={() => handleRemove(member)}
                            className="p-2 rounded-[4px] bg-[#202020] text-red-500 hover:bg-red-500 hover:text-white transition-colors"
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
      </section>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="panel-system p-6 max-w-md w-full">
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
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                />
              </div>
              <div>
                <label className="block text-[#B3B3B3] text-sm mb-2 uppercase tracking-tight">
                  Role
                </label>
                <select className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]">
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
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] resize-none"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-system flex-1">
                  Send Invitation
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-[4px] bg-[#202020] text-[#F2F2F2] hover:bg-[#1A1A1A] transition-colors"
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
