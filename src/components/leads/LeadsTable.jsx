import {
  Phone,
  Mail,
  Calendar,
  Trash2,
  Edit2,
  Eye,
  Building,
} from 'lucide-react';
import Badge from '../common/Badge';
import { SALES_AGENTS } from '../../data/mockLeads';

export default function LeadsTable({
  leads,
  selectedLeadIds = [],
  onToggleSelectLead,
  onToggleSelectAll,
  onDeleteLead,
  onViewLead,
  onEditLead,
  canDelete = Boolean(onDeleteLead),
}) {
  const canSelect = Boolean(onToggleSelectLead && onToggleSelectAll);
  const isAllSelected =
    canSelect &&
    leads.length > 0 &&
    leads.every((lead) => selectedLeadIds.includes(lead.id));

  // Helper for stage badge styling (matching exact assignment stages)
  const getStageBadgeVariant = (stage) => {
    switch (stage) {
      case 'New':
        return 'amber';
      case 'Contacted':
        return 'blue';
      case 'Site Visit':
        return 'indigo';
      case 'Interested':
        return 'purple';
      case 'Negotiation':
        return 'amber';
      case 'Booked':
        return 'emerald';
      case 'Lost':
      default:
        return 'neutral';
    }
  };

  // Helper for status badge styling
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Hot Lead':
        return 'rose';
      case 'Active':
        return 'emerald';
      case 'Follow-up Needed':
        return 'amber';
      case 'Cold':
      default:
        return 'neutral';
    }
  };

  // Helper to format follow-up date and flag overdue/today
  const formatFollowUp = (dateStr) => {
    const todayStr = '2026-09-21';
    const isToday = dateStr === todayStr;
    const isPast = dateStr < todayStr;

    return {
      text: dateStr,
      isToday,
      isPast,
    };
  };

  // Helper to find agent metadata
  const getAgentInfo = (agentName) => {
    return (
      SALES_AGENTS.find((a) => a.name === agentName) || {
        name: agentName,
        role: 'Realtor',
        avatar: agentName.slice(0, 2).toUpperCase(),
        color: 'bg-slate-600',
      }
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {canSelect && (
                <th className="py-3 pl-4 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    aria-label="Select all leads"
                  />
                </th>
              )}
              <th className="px-4 py-3">Lead Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Assigned To</th>
              <th className="px-4 py-3">Follow-up Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right pr-6">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {leads.map((lead) => {
              const isSelected = selectedLeadIds.includes(lead.id);
              const agent = getAgentInfo(lead.assignedTo);
              const followUp = formatFollowUp(lead.followUpDate);

              return (
                <tr
                  key={lead.id}
                  className={`group transition-colors duration-150 hover:bg-purple-50/20 ${
                    isSelected ? 'bg-purple-50/40' : ''
                  }`}
                >
                  {/* Row Checkbox */}
                  {canSelect && (
                    <td className="py-2.5 pl-4 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectLead(lead.id)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        aria-label={`Select ${lead.name}`}
                      />
                    </td>
                  )}

                  {/* Lead Name & Property Interest */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 ring-2 ring-white">
                        {lead.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onViewLead && onViewLead(lead)}
                            className="font-semibold text-slate-900 hover:text-purple-600 transition-colors truncate text-left cursor-pointer text-xs sm:text-sm"
                          >
                            {lead.name}
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                          <Building className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="truncate max-w-[200px]" title={lead.propertyInterest}>
                            {lead.propertyInterest}
                          </span>
                          {lead.budget && (
                            <span className="font-semibold text-slate-700 ml-1">({lead.budget})</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <a
                      href={`tel:${lead.phone}`}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-purple-600 transition-colors font-medium"
                    >
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{lead.phone}</span>
                    </a>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-purple-600 transition-colors font-medium"
                    >
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span className="max-w-[170px] truncate" title={lead.email}>
                        {lead.email}
                      </span>
                    </a>
                  </td>

                  {/* Stage */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <Badge variant={getStageBadgeVariant(lead.stage)}>
                      {lead.stage}
                    </Badge>
                  </td>

                  {/* Assigned To */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-2xs ${
                          agent.color ? agent.color.replace('bg-indigo-600', 'bg-purple-600') : 'bg-purple-600'
                        }`}
                      >
                        {agent.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{agent.name}</div>
                        <div className="text-[10px] text-slate-400">{agent.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Follow-up Date */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs font-medium text-slate-700">{lead.followUpDate}</span>
                      {followUp.isToday && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          Due Today
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(lead.status)}>
                      {lead.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2.5 text-right pr-6 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      {/* View Action */}
                      <button
                        type="button"
                        onClick={() => onViewLead && onViewLead(lead)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                        title="View Lead Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Edit Action */}
                      <button
                        type="button"
                        onClick={() => onEditLead && onEditLead(lead)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                        title="Edit Lead"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      {/* Delete Action (Admin only) */}
                      {Boolean(canDelete && onDeleteLead) && (
                        <button
                          type="button"
                          onClick={() => onDeleteLead && onDeleteLead(lead.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
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
  );
}
