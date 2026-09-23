import { X, Phone, Mail, Building, Calendar, DollarSign, UserCheck, Tag, FileText } from 'lucide-react';
import Badge from '../common/Badge';

export default function LeadDetailModal({ lead, onClose, onEditLead }) {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 font-bold text-base border border-purple-100">
              {lead.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{lead.name}</h2>
                <Badge variant="purple">{lead.id}</Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Assigned Sales Employee: <span className="font-semibold text-slate-700">{lead.assignedTo}</span>
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
          {/* Quick contact buttons */}
          <div className="flex gap-2.5">
            <a
              href={`tel:${lead.phone}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-50 px-3 py-2.5 font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>Call ({lead.phone})</span>
            </a>
            <a
              href={`mailto:${lead.email}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>Send Email</span>
            </a>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3.5 rounded-xl bg-slate-50/70 p-4 border border-slate-100">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="h-3 w-3" /> Lead Stage
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-900">{lead.stage}</div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="h-3 w-3" /> Status
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-900">{lead.status}</div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Budget
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-900">{lead.budget || 'Undisclosed'}</div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Next Follow-up
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-900">{lead.followUpDate}</div>
            </div>
          </div>

          {/* Property of interest */}
          <div className="rounded-xl border border-slate-200/80 p-3.5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building className="h-3.5 w-3.5 text-purple-600" /> Property / Unit Interest
            </div>
            <div className="mt-1 font-semibold text-slate-900">{lead.propertyInterest}</div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="rounded-xl border border-slate-200/80 p-3.5">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-slate-400" /> Activity Notes
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{lead.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close Details
          </button>
          {onEditLead && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditLead(lead);
              }}
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs shadow-purple-200 hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Edit Lead
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
