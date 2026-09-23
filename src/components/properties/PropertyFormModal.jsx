import { useState } from 'react';
import { X, Building2, Edit3, MapPin, DollarSign, Calendar, UserCheck, BedDouble, Bath, Tag } from 'lucide-react';
import { PROPERTY_TYPES, PROPERTY_STATUSES, SALES_AGENTS } from '../../data/mockProperties';

// Static defaults — outside component to avoid exhaustive-deps lint warning
const DEFAULT_PROPERTY_FORM = {
  name: '',
  type: 'Apartment',
  location: '',
  price: '',
  status: 'Active',
  assignedAgent: SALES_AGENTS[0].name,
  bedrooms: '',
  bathrooms: '',
  areaSqFt: '',
  listedDate: '2026-09-21',
  description: '',
};

function buildFormFromProperty(data) {
  if (!data) return DEFAULT_PROPERTY_FORM;
  return {
    name: data.name || '',
    type: data.type || 'Apartment',
    location: data.location || '',
    price: data.price || '',
    status: data.status || 'Active',
    assignedAgent: data.assignedAgent || SALES_AGENTS[0].name,
    bedrooms: data.bedrooms !== undefined ? String(data.bedrooms) : '',
    bathrooms: data.bathrooms !== undefined ? String(data.bathrooms) : '',
    areaSqFt: data.areaSqFt !== undefined ? String(data.areaSqFt) : '',
    listedDate: data.listedDate || '2026-09-21',
    description: data.description || '',
  };
}

/**
 * PropertyFormModal — Add or Edit a property listing.
 * Uses state initializer (no useEffect) + key prop at call-site for clean remounting.
 */
export default function PropertyFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState(() => buildFormFromProperty(initialData));
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
    if (!formData.name.trim()) newErrors.name = 'Property name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...formData,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : 0,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : 0,
      areaSqFt: formData.areaSqFt ? parseInt(formData.areaSqFt, 10) : 0,
      priceRaw: parseFloat(formData.price.replace(/[^0-9.]/g, '')) || 0,
    };

    if (isEdit) {
      onSubmit({ ...initialData, ...payload });
    } else {
      onSubmit({
        id: `PR-${Math.floor(300 + Math.random() * 600)}`,
        ...payload,
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

      {/* Modal */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              {isEdit ? <Edit3 className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEdit ? `Edit Property (${initialData.id})` : 'Add New Property Listing'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEdit
                  ? 'Update listing details, price, status, and assigned agent'
                  : 'Add a new residential or commercial property to the inventory'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Property Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Property Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Skyline Terrace Condo 14A"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Location / Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Midtown East, New York, NY"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
            {errors.location && <p className="mt-1 text-xs text-rose-500">{errors.location}</p>}
          </div>

          {/* Type, Status, Assigned Agent (3 cols) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Property Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
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
                {PROPERTY_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Assigned Agent</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <UserCheck className="h-3.5 w-3.5" />
                </div>
                <select
                  name="assignedAgent"
                  value={formData.assignedAgent}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
                >
                  {SALES_AGENTS.map((a) => (
                    <option key={a.name} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Price & Listed Date (2 cols) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Listing Price <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <DollarSign className="h-3.5 w-3.5" />
                </div>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. $1,850,000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
              {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Listed Date</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <input
                  type="date"
                  name="listedDate"
                  value={formData.listedDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms, Bathrooms, Area (3 cols) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Bedrooms</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <BedDouble className="h-3.5 w-3.5" />
                </div>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 3"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Bathrooms</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Bath className="h-3.5 w-3.5" />
                </div>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 2"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Area (sq ft)</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Tag className="h-3.5 w-3.5" />
                </div>
                <input
                  type="number"
                  name="areaSqFt"
                  value={formData.areaSqFt}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 2400"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Key features, highlights, selling points..."
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
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-purple-200 hover:bg-purple-700 transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
