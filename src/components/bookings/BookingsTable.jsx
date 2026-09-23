import {
  Calendar,
  Clock,
  Building2,
  DollarSign,
  Eye,
  Edit2,
  Trash2,
  MapPin,
} from 'lucide-react';
import Badge from '../common/Badge';
import { SALES_AGENTS } from '../../data/mockBookings';

// Status badge variants
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'Confirmed': return 'emerald';
    case 'Pending':   return 'amber';
    case 'Completed': return 'blue';
    case 'Cancelled': return 'rose';
    default:          return 'neutral';
  }
};

// Type badge variants
const getTypeBadgeVariant = (type) => {
  switch (type) {
    case 'Unit Reservation':   return 'purple';
    case 'Site Visit':          return 'violet';
    case 'Contract Signing':    return 'emerald';
    case 'Virtual Walkthrough': return 'blue';
    default:                    return 'neutral';
  }
};

// Lookup agent metadata
const getAgentInfo = (agentName) =>
  SALES_AGENTS.find((a) => a.name === agentName) || {
    name: agentName,
    role: 'Agent',
    avatar: agentName.slice(0, 2).toUpperCase(),
    color: 'bg-purple-600',
  };

export default function BookingsTable({
  bookings,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onEdit,
  onDelete,
  canDelete = Boolean(onDelete),
}) {
  const canSelect = Boolean(onToggleSelect && onToggleSelectAll);
  const isAllSelected =
    canSelect &&
    bookings.length > 0 &&
    bookings.every((b) => selectedIds.includes(b.id));

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1020px] border-collapse text-left text-xs sm:text-sm">
          {/* Header */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {canSelect && (
                <th className="py-3 pl-4 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    aria-label="Select all bookings"
                  />
                </th>
              )}
              <th className="px-3.5 py-3">Booking ID & Type</th>
              <th className="px-3.5 py-3">Client / Lead</th>
              <th className="px-3.5 py-3">Unit / Property</th>
              <th className="px-3.5 py-3">Schedule</th>
              <th className="px-3.5 py-3">Token / Deposit</th>
              <th className="px-3.5 py-3">Assigned Broker</th>
              <th className="px-3.5 py-3">Status</th>
              <th className="px-3.5 py-3 text-right pr-6">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {bookings.map((booking) => {
              const isSelected = selectedIds.includes(booking.id);
              const agent = getAgentInfo(booking.assignedAgent);

              return (
                <tr
                  key={booking.id}
                  className={`group transition-colors duration-150 hover:bg-purple-50/20 ${
                    isSelected ? 'bg-purple-50/30' : ''
                  }`}
                >
                  {/* Checkbox */}
                  {canSelect && (
                    <td className="py-2.5 pl-4 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(booking.id)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        aria-label={`Select booking ${booking.id}`}
                      />
                    </td>
                  )}

                  {/* Booking ID & Type */}
                  <td className="px-3.5 py-2.5">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-semibold text-slate-900">{booking.id}</span>
                      <Badge variant={getTypeBadgeVariant(booking.bookingType)}>
                        {booking.bookingType}
                      </Badge>
                    </div>
                  </td>

                  {/* Client / Lead */}
                  <td className="px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-700 text-[11px] font-bold">
                        {booking.leadName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {booking.leadName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {booking.leadPhone || booking.leadEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Unit / Property */}
                  <td className="px-3.5 py-2.5">
                    <div className="min-w-0 max-w-[220px]">
                      <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{booking.propertyName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{booking.propertyLocation}</span>
                      </div>
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                      <Calendar className="h-3.5 w-3.5 text-purple-600" />
                      <span>{booking.bookingDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 font-medium">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{booking.bookingTime}</span>
                    </div>
                  </td>

                  {/* Token / Deposit */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-0.5">
                      {booking.tokenAmount !== '—' && (
                        <DollarSign className="h-3 w-3 text-emerald-600" />
                      )}
                      <span>{booking.tokenAmount}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {booking.tokenAmount !== '—' ? 'Escrow Token' : 'No Deposit'}
                    </div>
                  </td>

                  {/* Assigned Broker */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-white text-[10px] font-bold ${agent.color}`}
                      >
                        {agent.avatar}
                      </div>
                      <span className="text-xs font-medium text-slate-800">
                        {booking.assignedAgent}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-3.5 py-2.5 text-right pr-6 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(booking)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(booking)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                        title="Edit booking"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {Boolean(canDelete && onDelete) && (
                        <button
                          type="button"
                          onClick={() => onDelete(booking.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Cancel or remove booking"
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
  );
}
