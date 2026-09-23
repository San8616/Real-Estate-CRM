import { useState } from 'react';
import {
  X,
  CalendarDays,
  Edit3,
  UserCheck,
  Building2,
  Clock,
  DollarSign,
  AlertCircle,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { MOCK_LEADS } from '../../data/mockLeads';
import { MOCK_PROPERTIES } from '../../data/mockProperties';
import {
  BOOKING_STATUSES,
  BOOKING_TYPES,
  TIME_SLOTS,
  SALES_AGENTS,
  getActiveBookingForUnit,
  getBookedPropertyIds,
} from '../../data/mockBookings';

const DEFAULT_BOOKING_FORM = {
  leadId: '',
  leadName: '',
  leadEmail: '',
  leadPhone: '',
  propertyId: '',
  propertyName: '',
  propertyType: '',
  propertyLocation: '',
  propertyPrice: '',
  unitCode: '',
  bookingType: 'Site Visit',
  bookingDate: '2026-09-23',
  bookingTime: '10:30 AM',
  status: 'Confirmed',
  assignedAgent: SALES_AGENTS[0].name,
  tokenAmount: '',
  notes: '',
};

function buildFormFromBooking(data) {
  if (!data) return DEFAULT_BOOKING_FORM;
  return {
    leadId: data.leadId || '',
    leadName: data.leadName || '',
    leadEmail: data.leadEmail || '',
    leadPhone: data.leadPhone || '',
    propertyId: data.propertyId || '',
    propertyName: data.propertyName || '',
    propertyType: data.propertyType || '',
    propertyLocation: data.propertyLocation || '',
    propertyPrice: data.propertyPrice || '',
    unitCode: data.unitCode || '',
    bookingType: data.bookingType || 'Site Visit',
    bookingDate: data.bookingDate || '2026-09-23',
    bookingTime: data.bookingTime || '10:30 AM',
    status: data.status || 'Confirmed',
    assignedAgent: data.assignedAgent || SALES_AGENTS[0].name,
    tokenAmount: data.tokenAmount || '',
    notes: data.notes || '',
  };
}

export default function BookingFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  allBookings = [],
}) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState(() => buildFormFromBooking(initialData));
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  // Set of booked properties (excluding the current booking being edited)
  const bookedPropertyIds = getBookedPropertyIds(
    allBookings,
    isEdit ? initialData.id : null
  );

  // Check if current selected property has an active collision
  const conflictingBooking = getActiveBookingForUnit(
    formData.propertyId,
    allBookings,
    isEdit ? initialData.id : null
  );

  const isUnitUnavailable = Boolean(conflictingBooking);

  // Handle lead selection change
  const handleLeadSelect = (e) => {
    const leadId = e.target.value;
    const selectedLead = MOCK_LEADS.find((l) => l.id === leadId);

    if (selectedLead) {
      setFormData((prev) => ({
        ...prev,
        leadId: selectedLead.id,
        leadName: selectedLead.name,
        leadEmail: selectedLead.email,
        leadPhone: selectedLead.phone,
        assignedAgent: selectedLead.assignedTo || prev.assignedAgent,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        leadId: '',
        leadName: '',
        leadEmail: '',
        leadPhone: '',
      }));
    }

    if (errors.lead) {
      setErrors((prev) => ({ ...prev, lead: null }));
    }
  };

  // Handle unit selection change
  const handleUnitSelect = (e) => {
    const propertyId = e.target.value;
    const selectedProperty = MOCK_PROPERTIES.find((p) => p.id === propertyId);

    if (selectedProperty) {
      setFormData((prev) => ({
        ...prev,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        propertyType: selectedProperty.type,
        propertyLocation: selectedProperty.location,
        propertyPrice: selectedProperty.price,
        unitCode: selectedProperty.id.replace('PR-', 'Unit-'),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        propertyId: '',
        propertyName: '',
        propertyType: '',
        propertyLocation: '',
        propertyPrice: '',
        unitCode: '',
      }));
    }

    if (errors.unit) {
      setErrors((prev) => ({ ...prev, unit: null }));
    }
  };

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
    if (!formData.leadId && !formData.leadName.trim()) {
      newErrors.lead = 'Please select or enter a lead';
    }
    if (!formData.propertyId) {
      newErrors.unit = 'Please select a unit/property';
    }
    if (!formData.bookingDate) {
      newErrors.bookingDate = 'Booking date is required';
    }
    if (!formData.bookingTime) {
      newErrors.bookingTime = 'Time slot is required';
    }

    // Double-booking check: cannot book the same unit twice if status is active
    if (isUnitUnavailable && (formData.status === 'Confirmed' || formData.status === 'Pending')) {
      newErrors.unit = `Double-booking prevention: This unit is already booked under active reservation ${conflictingBooking.id} by ${conflictingBooking.leadName}.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...formData,
      tokenAmount: formData.tokenAmount.trim() ? formData.tokenAmount : '—',
    };

    if (isEdit) {
      onSubmit({ ...initialData, ...payload });
    } else {
      onSubmit({
        id: `BK-${Math.floor(510 + Math.random() * 400)}`,
        ...payload,
        createdDate: '2026-09-22',
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
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              {isEdit ? <Edit3 className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEdit ? 'Edit Booking Appointment' : 'Schedule New Booking'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEdit
                  ? `Update reservation details for #${initialData?.id}`
                  : 'Book a site visit, walkthrough, or unit reservation'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Double-Booking Warning Banner */}
        {isUnitUnavailable && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-900">Unit Double-Booking Alert</div>
              <div className="mt-0.5 text-amber-800">
                <strong>{formData.propertyName}</strong> is currently reserved under active booking{' '}
                <span className="font-semibold text-amber-950 underline decoration-amber-400">
                  {conflictingBooking.id}
                </span>{' '}
                by <strong>{conflictingBooking.leadName}</strong> ({conflictingBooking.status}).
                Please choose another available unit or change this booking status to Cancelled/Completed.
              </div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Row 1: Select Lead */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-purple-600" />
                Select Lead / Client *
              </span>
              {formData.leadEmail && (
                <span className="text-[11px] font-normal text-slate-400 lowercase">
                  {formData.leadEmail}
                </span>
              )}
            </label>
            <select
              value={formData.leadId}
              onChange={handleLeadSelect}
              className={`w-full rounded-xl border bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                errors.lead
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-purple-500 focus:ring-purple-100'
              } cursor-pointer`}
            >
              <option value="">-- Choose a registered lead --</option>
              {MOCK_LEADS.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} ({lead.id}) — {lead.phone} | Interest: {lead.propertyInterest}
                </option>
              ))}
            </select>
            {errors.lead && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="h-3 w-3" />
                {errors.lead}
              </p>
            )}
          </div>

          {/* Row 2: Select Unit / Property */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-purple-600" />
                Select Unit / Property Listing *
              </span>
              {formData.propertyPrice && (
                <span className="text-[11px] font-bold text-purple-700">
                  {formData.propertyPrice} ({formData.propertyType})
                </span>
              )}
            </label>
            <select
              value={formData.propertyId}
              onChange={handleUnitSelect}
              className={`w-full rounded-xl border bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                errors.unit || isUnitUnavailable
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-purple-500 focus:ring-purple-100'
              } cursor-pointer`}
            >
              <option value="">-- Choose an inventory unit --</option>
              {MOCK_PROPERTIES.map((property) => {
                const isBooked = bookedPropertyIds.has(property.id);
                return (
                  <option key={property.id} value={property.id}>
                    {isBooked ? '⛔ [ALREADY BOOKED] ' : '✓ [Available] '}
                    {property.name} ({property.type}) — {property.price} | {property.location}
                  </option>
                );
              })}
            </select>
            {errors.unit && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="h-3 w-3" />
                {errors.unit}
              </p>
            )}
          </div>

          {/* Row 3: Booking Type & Assigned Agent */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Booking Type
              </label>
              <select
                name="bookingType"
                value={formData.bookingType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
              >
                {BOOKING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Assigned Broker / Agent
              </label>
              <select
                name="assignedAgent"
                value={formData.assignedAgent}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
              >
                {SALES_AGENTS.map((agent) => (
                  <option key={agent.name} value={agent.name}>
                    {agent.name} ({agent.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Date & Time Slot */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <CalendarDays className="h-3 w-3 text-slate-400" />
                Booking Date *
              </label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
              {errors.bookingDate && (
                <p className="mt-1 text-xs text-rose-500">{errors.bookingDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                Time Slot *
              </label>
              <select
                name="bookingTime"
                value={formData.bookingTime}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.bookingTime && (
                <p className="mt-1 text-xs text-rose-500">{errors.bookingTime}</p>
              )}
            </div>
          </div>

          {/* Row 5: Booking Status & Token / Deposit Amount */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Booking Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
              >
                {BOOKING_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-slate-400" />
                Token / Deposit Amount
              </label>
              <input
                type="text"
                name="tokenAmount"
                value={formData.tokenAmount}
                onChange={handleChange}
                placeholder="e.g. $25,000 or leave blank"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* Row 6: Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <FileText className="h-3 w-3 text-slate-400" />
              Special Notes / Requests
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add inspection notes, gate codes, or escrow details..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs sm:text-sm text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUnitUnavailable && (formData.status === 'Confirmed' || formData.status === 'Pending')}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isEdit ? 'Save Changes' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
