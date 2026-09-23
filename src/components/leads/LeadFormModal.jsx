import { useState } from 'react';
import { X, UserPlus, Edit3, Building, Mail, Phone, DollarSign, Calendar } from 'lucide-react';
import { LEAD_STAGES, SALES_AGENTS, LEAD_STATUSES } from '../../data/mockLeads';

// Static default outside component — no dependency concerns
const DEFAULT_LEAD_FORM = {
  name: '',
  phone: '',
  email: '',
  propertyInterest: '',
  budget: '',
  stage: 'New',
  assignedTo: SALES_AGENTS[0].name,
  status: 'Active',
  followUpDate: '2026-09-22',
  notes: '',
};

function buildFormFromData(data) {
  if (!data) return DEFAULT_LEAD_FORM;
  return {
    name: data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    propertyInterest: data.propertyInterest || '',
    budget: data.budget || '',
    stage: data.stage || 'New',
    assignedTo: data.assignedTo || SALES_AGENTS[0].name,
    status: data.status || 'Active',
    followUpDate: data.followUpDate || '2026-09-22',
    notes: data.notes || '',
  };
}

/**
 * LeadFormModal — Add or Edit a real estate lead.
 *
 * Uses a state initializer function instead of useEffect to avoid
 * the react/set-state-in-effect lint warning. The parent passes a
 * unique `key` prop (e.g. lead.id or "new") so React remounts the
 * component cleanly each time the modal switches targets.
 */
export default function LeadFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const isEdit = Boolean(initialData);

  // Initialized once per mount — parent controls remount via `key`
  const [formData, setFormData] = useState(() => buildFormFromData(initialData));
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim() && !formData.email.trim()) {
      newErrors.contact = 'Provide at least a phone number or email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEdit) {
      onSubmit({ ...initialData, ...formData });
    } else {
      onSubmit({
        id: `LD-${Math.floor(100 + Math.random() * 900)}`,
        ...formData,
        createdDate: '2026-09-21',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              {isEdit ? <Edit3 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEdit ? `Edit Lead (${initialData.id})` : 'Add New Real Estate Lead'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEdit
                  ? 'Update prospective client details, stage, and assigned agent'
                  : 'Record a new prospective buyer, seller, or investor inquiry'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Eleanor Vance"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          {/* Contact Details (2 Cols) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Phone Number</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>
          </div>
          {errors.contact && <p className="text-xs text-rose-500">{errors.contact}</p>}

          {/* Property Interest & Budget (2 cols) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Property / Unit Interest</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Building className="h-3.5 w-3.5" />
                </div>
                <input
                  type="text"
                  name="propertyInterest"
                  value={formData.propertyInterest}
                  onChange={handleChange}
                  placeholder="e.g. Sovereign Heights 4B"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Budget Range</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <DollarSign className="h-3.5 w-3.5" />
                </div>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. $1,250,000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>
          </div>

          {/* Stage, Assigned Agent, Status (3 cols) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Lead Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
              >
                {LEAD_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Assigned Sales Employee</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
              >
                {SALES_AGENTS.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
              >
                {LEAD_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">Follow-up Date</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">Client Preferences / Notes</label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Key buyer requirements, financing status, timeline..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs shadow-purple-200 hover:bg-purple-700 transition-colors cursor-pointer"
            >
              {isEdit ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
