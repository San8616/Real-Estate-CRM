import { useState, useMemo } from 'react';
import {
  UserCheck,
  Building2,
  CalendarDays,
  Users2,
  BarChart3,
  Settings,
  Plus,
  ArrowLeft,
  ShieldAlert,
  Search,
  X,
  ChevronDown,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import Badge from '../components/common/Badge';

const MOCK_TEAM_MEMBERS = [
  {
    id: 'AGT-001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@estatecrm.com',
    phone: '+1 (555) 234-8901',
    role: 'Managing Broker',
    department: 'Luxury Estates',
    office: 'Beverly Hills HQ',
    dealsClosed: 24,
    salesVolume: '$32.4M',
    activeListings: 6,
    status: 'Active',
    avatarColor: 'bg-purple-600',
  },
  {
    id: 'AGT-002',
    name: 'Michael Chang',
    email: 'm.chang@estatecrm.com',
    phone: '+1 (555) 345-6712',
    role: 'Senior Realtor',
    department: 'Residential Sales',
    office: 'Downtown Branch',
    dealsClosed: 19,
    salesVolume: '$24.1M',
    activeListings: 4,
    status: 'Active',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'AGT-003',
    name: 'Elena Rostova',
    email: 'elena.r@estatecrm.com',
    phone: '+1 (555) 456-7823',
    role: 'Commercial Specialist',
    department: 'Commercial Division',
    office: 'Century City',
    dealsClosed: 15,
    salesVolume: '$41.8M',
    activeListings: 3,
    status: 'Active',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'AGT-004',
    name: 'David Vance',
    email: 'd.vance@estatecrm.com',
    phone: '+1 (555) 567-8934',
    role: 'Senior Realtor',
    department: 'Residential Sales',
    office: 'Westside Office',
    dealsClosed: 12,
    salesVolume: '$16.2M',
    activeListings: 5,
    status: 'Active',
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'AGT-005',
    name: 'Amanda Hayes',
    email: 'amanda.h@estatecrm.com',
    phone: '+1 (555) 678-9045',
    role: 'Escrow Specialist',
    department: 'Client Relations',
    office: 'Beverly Hills HQ',
    dealsClosed: 28,
    salesVolume: '$29.0M',
    activeListings: 2,
    status: 'On Leave',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'AGT-006',
    name: 'Marcus Brody',
    email: 'm.brody@estatecrm.com',
    phone: '+1 (555) 789-0156',
    role: 'Associate Realtor',
    department: 'Residential Sales',
    office: 'Downtown Branch',
    dealsClosed: 8,
    salesVolume: '$9.4M',
    activeListings: 3,
    status: 'Active',
    avatarColor: 'bg-purple-600',
  },
  {
    id: 'AGT-007',
    name: 'Chloe Bennett',
    email: 'c.bennett@estatecrm.com',
    phone: '+1 (555) 890-1267',
    role: 'Junior Associate',
    department: 'Residential Sales',
    office: 'Westside Office',
    dealsClosed: 4,
    salesVolume: '$4.2M',
    activeListings: 2,
    status: 'Probation',
    avatarColor: 'bg-rose-600',
  },
  {
    id: 'AGT-008',
    name: 'James Wilson',
    email: 'j.wilson@estatecrm.com',
    phone: '+1 (555) 901-2378',
    role: 'Managing Broker',
    department: 'Luxury Estates',
    office: 'Century City',
    dealsClosed: 21,
    salesVolume: '$27.5M',
    activeListings: 5,
    status: 'Active',
    avatarColor: 'bg-purple-700',
  },
];

const PAGE_META = {
  leads: {
    title: 'Leads & Inquiries',
    subtitle: 'Manage prospective home buyers, sellers, and investor contacts.',
    icon: UserCheck,
    actionLabel: 'Add New Lead',
  },
  properties: {
    title: 'Property Inventory',
    subtitle: 'Listings, developments, architectural units, and property statuses.',
    icon: Building2,
    actionLabel: 'Add Property',
  },
  bookings: {
    title: 'Tour Bookings & Schedule',
    subtitle: 'Property walkthroughs, client inspections, and open house appointments.',
    icon: CalendarDays,
    actionLabel: 'New Showing',
  },
  'sales-team': {
    title: 'Sales Team & Brokers',
    subtitle: 'Manage real estate agents, commission tiers, branch assignments, and deal quotas.',
    icon: Users2,
    actionLabel: '+ Add Team Member',
  },
  reports: {
    title: 'Analytics & Financial Reports',
    subtitle: 'Sales performance, commission breakdowns, inventory velocity, and market trends.',
    icon: BarChart3,
    actionLabel: 'Export Report',
  },
  settings: {
    title: 'CRM Settings & Integrations',
    subtitle: 'Configure MLS syndication, notification preferences, user roles, and agency branding.',
    icon: Settings,
    actionLabel: 'Save Changes',
  },
};

export default function PlaceholderPage({ pageId, onBackToDashboard }) {
  const { isAdmin } = useAuth();
  const isAdminRestricted = !isAdmin && (pageId === 'settings' || pageId === 'reports' || pageId === 'sales-team');

  // Sales team state
  const [teamMembers, setTeamMembers] = useState(MOCK_TEAM_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleTab, setRoleTab] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewingMember, setViewingMember] = useState(null);

  const meta = PAGE_META[pageId] || {
    title: 'Section',
    subtitle: 'This module is ready for your specific business requirements.',
    icon: Building2,
    actionLabel: 'Action',
  };

  const Icon = meta.icon;

  // Filtered members for sales-team
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesEmail = m.email.toLowerCase().includes(q);
        const matchesRole = m.role.toLowerCase().includes(q);
        const matchesOffice = m.office.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesRole && !matchesOffice) return false;
      }
      if (roleTab !== 'All') {
        if (roleTab === 'Brokers' && !m.role.includes('Broker')) return false;
        if (roleTab === 'Senior Realtors' && m.role !== 'Senior Realtor') return false;
        if (roleTab === 'Specialists' && !m.role.includes('Specialist') && !m.role.includes('Associate')) return false;
      }
      if (departmentFilter && m.department !== departmentFilter) return false;
      if (officeFilter && m.office !== officeFilter) return false;
      if (statusFilter && m.status !== statusFilter) return false;
      return true;
    });
  }, [teamMembers, searchQuery, roleTab, departmentFilter, officeFilter, statusFilter]);

  const roleCounts = useMemo(() => {
    return {
      All: teamMembers.length,
      Brokers: teamMembers.filter((m) => m.role.includes('Broker')).length,
      'Senior Realtors': teamMembers.filter((m) => m.role === 'Senior Realtor').length,
      Specialists: teamMembers.filter((m) => m.role.includes('Specialist') || m.role.includes('Associate')).length,
    };
  }, [teamMembers]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredMembers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMembers.map((m) => m.id));
    }
  };

  const handleDeleteMember = (id) => {
    if (!isAdmin) return;
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  // Specific view for Sales Team
  if (pageId === 'sales-team') {
    return (
      <div className="space-y-5">
        {/* Role Restriction Banner if applicable */}
        {isAdminRestricted && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-900">Sales Employee View (Restricted Access)</div>
              <p className="mt-0.5 text-amber-800">
                You are viewing the team roster in Sales Employee mode. Team invitation, role modification, and agent deletion require Administrator privileges.
              </p>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Sales Team & Brokers
              </h1>
              <span className="rounded-full bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                {teamMembers.length} Active Staff
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Manage licensed agents, commission splits, branch offices, and closed deal performance.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </button>
            )}
            {!isAdminRestricted && (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-purple-700 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add Team Member</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Users2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Total Agents</div>
              <div className="text-lg font-bold text-slate-900">{teamMembers.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Total Volume</div>
              <div className="text-lg font-bold text-emerald-600">$158.9M</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Deals Closed</div>
              <div className="text-lg font-bold text-amber-600">131</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Offices</div>
              <div className="text-lg font-bold text-blue-600">3 Branches</div>
            </div>
          </div>
        </div>

        {/* Filter Bar with Status Tabs & Dropdowns */}
        <div className="space-y-3">
          {/* Top Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'Brokers', 'Senior Realtors', 'Specialists'].map((tab) => {
              const isActive = roleTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRoleTab(tab)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{tab === 'All' ? 'All Staff' : tab}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? 'bg-purple-700/60 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {roleCounts[tab]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search and Dropdowns Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff member, role, branch..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[145px]">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-3 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
                >
                  <option value="">Department: All</option>
                  <option value="Luxury Estates">Luxury Estates</option>
                  <option value="Residential Sales">Residential Sales</option>
                  <option value="Commercial Division">Commercial Division</option>
                  <option value="Client Relations">Client Relations</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              </div>

              <div className="relative min-w-[145px]">
                <select
                  value={officeFilter}
                  onChange={(e) => setOfficeFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-3 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
                >
                  <option value="">Office: All</option>
                  <option value="Beverly Hills HQ">Beverly Hills HQ</option>
                  <option value="Downtown Branch">Downtown Branch</option>
                  <option value="Westside Office">Westside Office</option>
                  <option value="Century City">Century City</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              </div>

              <div className="relative min-w-[130px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-3 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
                >
                  <option value="">Status: All</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Team Data Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {isAdmin && (
                    <th className="py-3 pl-4 pr-2 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredMembers.length && filteredMembers.length > 0}
                        onChange={handleToggleSelectAll}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="px-3.5 py-3">Staff Member</th>
                  <th className="px-3.5 py-3">Role & Division</th>
                  <th className="px-3.5 py-3">Branch Office</th>
                  <th className="px-3.5 py-3">Closed Deals</th>
                  <th className="px-3.5 py-3">Sales Volume</th>
                  <th className="px-3.5 py-3">Listings</th>
                  <th className="px-3.5 py-3">Status</th>
                  <th className="px-3.5 py-3 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMembers.map((member) => {
                  const isSelected = selectedIds.includes(member.id);
                  return (
                    <tr
                      key={member.id}
                      className={`group transition-colors duration-150 hover:bg-purple-50/20 ${
                        isSelected ? 'bg-purple-50/30' : ''
                      }`}
                    >
                      {isAdmin && (
                        <td className="py-2.5 pl-4 pr-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(member.id)}
                            className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="px-3.5 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${member.avatarColor} text-white text-[11px] font-bold`}>
                            {member.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate">{member.name}</div>
                            <div className="text-[11px] text-slate-400 truncate">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <div className="font-semibold text-slate-900">{member.role}</div>
                        <div className="text-[11px] text-slate-400">{member.department}</div>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                          <span>{member.office}</span>
                        </div>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <div className="text-xs font-bold text-slate-900">{member.dealsClosed} deals</div>
                        <div className="text-[10px] text-slate-400 font-medium">Lifetime closed</div>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <div className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                          <DollarSign className="h-3 w-3" />
                          <span>{member.salesVolume}</span>
                        </div>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <Badge variant="purple">{member.activeListings} Active</Badge>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <Badge
                          variant={
                            member.status === 'Active'
                              ? 'emerald'
                              : member.status === 'On Leave'
                              ? 'amber'
                              : 'rose'
                          }
                        >
                          {member.status}
                        </Badge>
                      </td>
                      <td className="px-3.5 py-2.5 text-right pr-6 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingMember(member)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                            title="View member profile"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          {!isAdminRestricted && (
                            <button
                              type="button"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                              title="Edit member"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(member.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remove member"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Member Detail Modal */}
        {viewingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setViewingMember(null)} />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${viewingMember.avatarColor} text-white font-bold`}>
                    {viewingMember.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{viewingMember.name}</h2>
                    <p className="text-xs text-slate-500 font-medium">{viewingMember.role} • {viewingMember.department}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setViewingMember(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="purple">{viewingMember.id}</Badge>
                  <Badge variant={viewingMember.status === 'Active' ? 'emerald' : 'amber'}>{viewingMember.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Sales Volume</div>
                    <div className="text-sm font-bold text-emerald-600">{viewingMember.salesVolume}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Deals Closed</div>
                    <div className="text-sm font-bold text-slate-900">{viewingMember.dealsClosed} Properties</div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-purple-600" />
                    <span>{viewingMember.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-purple-600" />
                    <span>{viewingMember.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-purple-600" />
                    <span>{viewingMember.office}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewingMember(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Generic view for other pages (Reports, Settings, etc.)
  return (
    <div className="space-y-5">
      {/* Role Restriction Banner if applicable */}
      {isAdminRestricted && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-900">Sales Employee View (Restricted Access)</div>
            <p className="mt-0.5 text-amber-800">
              You are viewing this section in Sales Employee mode. Modifying administrative settings, team assignments, and financial exports requires Administrator privileges.
            </p>
          </div>
        </div>
      )}

      {/* Header card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {meta.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              {meta.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </button>
          )}

          {!isAdminRestricted && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-purple-700 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{meta.actionLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Placeholder content state */}
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          {meta.title} Module
        </h3>
        <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-slate-500">
          This section is active with clean purple UI tokens, matching the CRM design system.
        </p>
      </div>
    </div>
  );
}
