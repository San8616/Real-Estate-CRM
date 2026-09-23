import {
  X,
  Calendar,
  Clock,
  Building2,
  DollarSign,
  UserCheck,
  Phone,
  Mail,
  FileText,
  MapPin,
  Edit2,
} from 'lucide-react';
import Badge from '../common/Badge';
import { SALES_AGENTS } from '../../data/mockBookings';

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'Confirmed': return 'emerald';
    case 'Pending':   return 'amber';
    case 'Completed': return 'blue';
    case 'Cancelled': return 'rose';
    default:          return 'neutral';
  }
};

const getTypeBadgeVariant = (type) => {
  switch (type) {
    case 'Unit Reservation':   return 'indigo';
    case 'Site Visit':          return 'purple';
    case 'Contract Signing':    return 'emerald';
    case 'Virtual Walkthrough': return 'blue';
    default:                    return 'neutral';
  }
};

const getAgentInfo = (agentName) =>
  SALES_AGENTS.find((a) => a.name === agentName) || {
    name: agentName,
    role: 'Agent',
    avatar: agentName.slice(0, 2).toUpperCase(),
    color: 'bg-indigo-600',
  };

export default function BookingDetailModal({ booking, onClose, onEditBooking }) {
  if (!booking) return null;

  const agent = getAgentInfo(booking.assignedAgent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  Booking #{booking.id}
                </h2>
                <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                <Badge variant={getTypeBadgeVariant(booking.bookingType)}>{booking.bookingType}</Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Created on {booking.createdDate || 'Recent'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs sm:text-sm">
          {/* Lead Information Card */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
              <UserCheck className="h-3.5 w-3.5 text-purple-600" />
              Lead / Client Details
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">{booking.leadName}</div>
                <div className="text-xs text-slate-500 mt-0.5">ID: {booking.leadId}</div>
              </div>
              <div className="flex items-center gap-2">
                {booking.leadPhone && (
                  <a
                    href={`tel:${booking.leadPhone}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                    <span>Call</span>
                  </a>
                )}
                {booking.leadEmail && (
                  <a
                    href={`mailto:${booking.leadEmail}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap gap-4 text-xs text-slate-600">
              <span>Phone: <strong>{booking.leadPhone}</strong></span>
              <span>Email: <strong>{booking.leadEmail}</strong></span>
            </div>
          </div>

          {/* Unit / Property Information Card */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
              <Building2 className="h-3.5 w-3.5 text-purple-600" />
              Reserved Unit / Property
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-sm font-bold text-slate-900">{booking.propertyName}</div>
              <div className="text-sm font-bold text-purple-700">{booking.propertyPrice}</div>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{booking.propertyLocation}</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap gap-4 text-xs text-slate-600">
              <span>Type: <strong>{booking.propertyType}</strong></span>
              <span>Property ID: <strong>{booking.propertyId}</strong></span>
              {booking.unitCode && <span>Unit Code: <strong>{booking.unitCode}</strong></span>}
            </div>
          </div>

          {/* Schedule & Financials Grid */}
          <div className="grid grid-cols-2 gap-3.5 rounded-xl bg-slate-50/70 p-4 border border-slate-100">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Booking Date
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-900">{booking.bookingDate}</div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3 w-3" /> Time Slot
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-900">{booking.bookingTime}</div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Token / Deposit
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-900">{booking.tokenAmount || '—'}</div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="h-3 w-3" /> Assigned Broker
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px] font-bold ${agent.color}`}>
                  {agent.avatar}
                </span>
                <span className="text-xs font-semibold text-slate-900">{booking.assignedAgent}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <FileText className="h-3 w-3" /> Notes & Instructions
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">{booking.notes}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditBooking(booking);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-purple-200 hover:bg-purple-700 transition-colors cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Booking</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
