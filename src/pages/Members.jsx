import { useEffect, useMemo, useState } from 'react';
import {
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Upload,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';

const MOCK_MEMBERS = [
  { id: '1', name: 'Amina Walker', email: 'amina@example.com', role: 'Admin', status: 'active', joinedAt: '2024-08-01' },
  { id: '2', name: 'Diego Ramos', email: 'diego@example.com', role: 'Member', status: 'active', joinedAt: '2024-10-15' },
  { id: '3', name: 'Sofia Chen', email: 'sofia@example.com', role: 'Manager', status: 'invited', joinedAt: '2025-01-10' },
  { id: '4', name: 'Liam Patel', email: 'liam@example.com', role: 'Viewer', status: 'suspended', joinedAt: '2023-12-02' },
  { id: '5', name: 'Noah Ibrahim', email: 'noah@example.com', role: 'Member', status: 'active', joinedAt: '2025-06-09' },
];

const roleFilters = ['all', 'Owner', 'Admin', 'Manager', 'Member', 'Viewer'];
const statusFilters = ['all', 'active', 'invited', 'suspended'];
const pageSize = 10;

async function fetchMembers() {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_MEMBERS), 200));
}

function toCSV(rows) {
  const header = ['Name', 'Email', 'Role', 'Status', 'Joined'];
  const body = rows.map((row) => [row.name, row.email, row.role, row.status, row.joinedAt]);
  return [header, ...body].map((line) => line.join(',')).join('\n');
}

function download(filename, content, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Members() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMembers().then(setMembers);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, role, status]);

  const filtered = useMemo(() => {
    const queryLower = query.trim().toLowerCase();
    const rows = members
      .filter((member) => {
        if (!queryLower) return true;
        return (
          member.name.toLowerCase().includes(queryLower) ||
          member.email.toLowerCase().includes(queryLower)
        );
      })
      .filter((member) => (role === 'all' ? true : member.role === role))
      .filter((member) => (status === 'all' ? true : member.status === status));

    const sortAccessor = (member) => {
      if (sortBy === 'joinedAt') {
        return new Date(member.joinedAt).getTime();
      }
      return String(member[sortBy] ?? '').toLowerCase();
    };

    return [...rows].sort((a, b) => {
      const valueA = sortAccessor(a);
      const valueB = sortAccessor(b);

      if (valueA < valueB) return sortDir === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [members, query, role, status, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setQuery('');
    setRole('all');
    setStatus('all');
    setSortBy('name');
    setSortDir('asc');
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Members Directory</h1>
          <p className="text-muted-foreground">
            Invite, manage roles, and keep your team organized.
          </p>
        </div>
        <Badge variant="outline" className="uppercase tracking-tight">
          <Users className="h-3.5 w-3.5" />
          {filtered.length} members
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-card/80 border-[#202020]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base uppercase tracking-tight text-[#F2F2F2]">
              Directory Controls
            </CardTitle>
            <CardDescription>Search, filter, and sort your members list.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search name or email"
                  className="pl-9 bg-[#0C0C0C]/60 border-[#202020]"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Role</DropdownMenuLabel>
                  {roleFilters.map((roleOption) => (
                    <DropdownMenuItem key={roleOption} onClick={() => setRole(roleOption)}>
                      {role === roleOption ? '✓ ' : ''}
                      {roleOption}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  {statusFilters.map((statusOption) => (
                    <DropdownMenuItem key={statusOption} onClick={() => setStatus(statusOption)}>
                      {status === statusOption ? '✓ ' : ''}
                      {statusOption}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="gap-2" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-[#202020]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base uppercase tracking-tight text-[#F2F2F2]">
              Quick Actions
            </CardTitle>
            <CardDescription>Invite new members and manage data.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <InviteDialog onInvite={(member) => setMembers((previous) => [member, ...previous])} />
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => download('members.csv', toCSV(filtered))}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" className="gap-2" disabled>
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#202020]">
        <CardHeader className="flex flex-col gap-1 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base uppercase tracking-tight text-[#F2F2F2]">
              Members
            </CardTitle>
            <CardDescription>{filtered.length} total members</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader
                  onClick={() => toggleSort('name')}
                  active={sortBy === 'name'}
                  direction={sortDir}
                >
                  Name
                </SortableHeader>
                <SortableHeader
                  onClick={() => toggleSort('email')}
                  active={sortBy === 'email'}
                  direction={sortDir}
                >
                  Email
                </SortableHeader>
                <SortableHeader
                  onClick={() => toggleSort('role')}
                  active={sortBy === 'role'}
                  direction={sortDir}
                >
                  Role
                </SortableHeader>
                <SortableHeader
                  onClick={() => toggleSort('status')}
                  active={sortBy === 'status'}
                  direction={sortDir}
                >
                  Status
                </SortableHeader>
                <SortableHeader
                  onClick={() => toggleSort('joinedAt')}
                  active={sortBy === 'joinedAt'}
                  direction={sortDir}
                >
                  Joined
                </SortableHeader>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={member.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={member.status} />
                  </TableCell>
                  <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <RowActions
                      member={member}
                      onSuspend={(id) =>
                        setMembers((previous) =>
                          previous.map((item) =>
                            item.id === id ? { ...item, status: 'suspended' } : item,
                          ),
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No members match your filters yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SortableHeader({ children, onClick, active, direction }) {
  return (
    <TableHead>
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 text-left font-medium uppercase tracking-tight ${
          active ? 'text-[#FFC96C]' : ''
        }`}
      >
        {children}
        {active && <span className="text-xs text-muted-foreground">{direction === 'asc' ? '▲' : '▼'}</span>}
      </button>
    </TableHead>
  );
}

const roleTone = {
  Owner: 'border-[#FFC96C]/30 bg-[#FFC96C]/20 text-[#FFC96C] uppercase tracking-tight',
  Admin: 'border-[#6366F1]/30 bg-[#6366F1]/20 text-[#C7D2FE] uppercase tracking-tight',
  Manager: 'border-[#38BDF8]/30 bg-[#38BDF8]/20 text-[#BAE6FD] uppercase tracking-tight',
  Member: 'border-[#22C55E]/30 bg-[#22C55E]/20 text-[#BBF7D0] uppercase tracking-tight',
  Viewer: 'border-[#94A3B8]/30 bg-[#94A3B8]/20 text-[#CBD5F5] uppercase tracking-tight',
};

function RoleBadge({ role }) {
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${roleTone[role]}`}>{role}</span>;
}

const statusTone = {
  active: {
    badge: 'border-[#22C55E]/30 bg-[#22C55E]/20 text-[#BBF7D0]',
    dot: 'bg-[#22C55E]',
  },
  invited: {
    badge: 'border-[#38BDF8]/30 bg-[#38BDF8]/20 text-[#BAE6FD]',
    dot: 'bg-[#38BDF8]',
  },
  suspended: {
    badge: 'border-[#F87171]/30 bg-[#F87171]/20 text-[#FECACA]',
    dot: 'bg-[#F87171]',
  },
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-tight ${
        statusTone[status].badge
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${statusTone[status].dot}`} />
      {status}
    </span>
  );
}

function RowActions({ member, onSuspend }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(member.email)}>
          Copy email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.alert('Edit member coming soon')}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-400 focus:text-red-400" onClick={() => onSuspend(member.id)}>
          Suspend
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function InviteDialog({ onInvite }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');

  const disableSubmit = !name.trim() || !email.trim();

  const handleSubmit = () => {
    if (disableSubmit) return;

    const newMember = {
      id: Math.random().toString(36).slice(2),
      name: name.trim(),
      email: email.trim(),
      role,
      status: 'invited',
      joinedAt: new Date().toISOString().slice(0, 10),
    };

    onInvite(newMember);
    setOpen(false);
    setName('');
    setEmail('');
    setRole('Member');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Invite member
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0C0C0C] border-[#202020]">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-tight">Invite a new member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-name">Name</Label>
            <Input
              id="invite-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ada Lovelace"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ada@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <select
              id="invite-role"
              className="h-10 w-full rounded-md border border-[#202020] bg-[#0C0C0C] px-3 text-sm focus:border-[#FFC96C] focus:outline-none"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {roleFilters.filter((option) => option !== 'all').map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={disableSubmit}>
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
