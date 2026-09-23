import { X, MapPin, BedDouble, Bath, SquareStack, Calendar, DollarSign, UserCheck, FileText, Tag } from 'lucide-react';
import Badge from '../common/Badge';

// Badge variants (same helpers as PropertiesTable)
const getTypeBadgeVariant = (type) => {
  switch (type) {
    case 'Penthouse':   return 'purple';
    case 'Villa':       return 'emerald';
    case 'Apartment':   return 'blue';
    case 'Townhouse':   return 'indigo';
    case 'Commercial':  return 'amber';
    case 'Plot / Land': return 'neutral';
    default:            return 'neutral';
  }
};

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'Active':     return 'emerald';
    case 'Pending':    return 'amber';
    case 'Sold':       return 'indigo';
    case 'Off Market': return 'neutral';
    default:           return 'neutral';
  }
};

export default function PropertyDetailModal({ property, onClose, onEditProperty }) {
  if (!property) return null;

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
              <SquareStack className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900 leading-tight">{property.name}</h2>
                <Badge variant="purple">{property.id}</Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Assigned to: <span className="font-semibold text-slate-700">{property.assignedAgent}</span>
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

        <div className="mt-5 space-y-4 text-xs sm:text-sm">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={getTypeBadgeVariant(property.type)}>{property.type}</Badge>
            <Badge variant={getStatusBadgeVariant(property.status)}>{property.status}</Badge>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3.5 rounded-xl bg-slate-50/70 p-4 border border-slate-100">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Price
              </span>
              <div className="mt-1 text-sm font-bold text-slate-900">{property.price}</div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Listed Date
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-900">{property.listedDate}</div>
            </div>
            {property.bedrooms > 0 && (
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <BedDouble className="h-3 w-3" /> Bedrooms
                </span>
                <div className="mt-1 text-xs font-semibold text-slate-900">{property.bedrooms}</div>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Bath className="h-3 w-3" /> Bathrooms
                </span>
                <div className="mt-1 text-xs font-semibold text-slate-900">{property.bathrooms}</div>
              </div>
            )}
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="h-3 w-3" /> Area
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-900">
                {property.areaSqFt.toLocaleString()} sq ft
              </div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="h-3 w-3" /> Agent
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-900">{property.assignedAgent}</div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-slate-200/80 p-3.5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-purple-500" /> Location
            </div>
            <div className="mt-1 font-semibold text-slate-900">{property.location}</div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="rounded-xl border border-slate-200/80 p-3.5">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-slate-400" /> Description
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{property.description}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close Details
          </button>
          {onEditProperty && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditProperty(property);
              }}
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-purple-200 hover:bg-purple-700 transition-colors"
            >
              Edit Property
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
