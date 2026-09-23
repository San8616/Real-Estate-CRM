import { BedDouble, Bath, SquareStack, MapPin, Eye, Edit2, Trash2, Calendar } from 'lucide-react';
import Badge from '../common/Badge';
import { SALES_AGENTS } from '../../data/mockProperties';

// Badge variants for property type
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

// Badge variants for listing status
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'Active':     return 'emerald';
    case 'Pending':    return 'amber';
    case 'Sold':       return 'indigo';
    case 'Off Market': return 'neutral';
    default:           return 'neutral';
  }
};

// Lookup agent metadata
const getAgentInfo = (agentName) =>
  SALES_AGENTS.find((a) => a.name === agentName) || {
    name: agentName,
    role: 'Agent',
    avatar: agentName.slice(0, 2).toUpperCase(),
    color: 'bg-slate-600',
  };

export default function PropertiesTable({
  properties,
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
    properties.length > 0 &&
    properties.every((p) => selectedIds.includes(p.id));

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          {/* Header */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {canSelect && (
                <th className="py-3 pl-4 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    aria-label="Select all properties"
                  />
                </th>
              )}
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Assigned Agent</th>
              <th className="px-4 py-3">Listed Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right pr-6">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {properties.map((property) => {
              const isSelected = selectedIds.includes(property.id);
              const agent = getAgentInfo(property.assignedAgent);

              return (
                <tr
                  key={property.id}
                  className={`group transition-colors duration-150 hover:bg-purple-50/20 ${
                    isSelected ? 'bg-purple-50/40' : ''
                  }`}
                >
                  {/* Checkbox */}
                  {canSelect && (
                    <td className="py-2.5 pl-4 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(property.id)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        aria-label={`Select ${property.name}`}
                      />
                    </td>
                  )}

                  {/* Property Name & ID */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      {/* Icon tile */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                        <SquareStack className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onView && onView(property)}
                          className="font-semibold text-slate-900 hover:text-purple-600 transition-colors truncate max-w-[180px] text-left block cursor-pointer text-xs sm:text-sm"
                          title={property.name}
                        >
                          {property.name}
                        </button>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">{property.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <Badge variant={getTypeBadgeVariant(property.type)}>{property.type}</Badge>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 max-w-[180px]">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate" title={property.location}>{property.location}</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{property.price}</span>
                  </td>

                  {/* Details: bed / bath / sqft */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5 text-xs text-slate-500">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3.5 w-3.5 text-slate-400" />
                          {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5 text-slate-400" />
                          {property.bathrooms}
                        </span>
                      )}
                      <span className="text-slate-400 font-medium">
                        {property.areaSqFt.toLocaleString()} sqft
                      </span>
                    </div>
                  </td>

                  {/* Assigned Agent */}
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

                  {/* Listed Date */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{property.listedDate}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(property.status)}>{property.status}</Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2.5 text-right pr-6 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onView && onView(property)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                        title="View Property Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(property)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                        title="Edit Property"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {Boolean(canDelete && onDelete) && (
                        <button
                          type="button"
                          onClick={() => onDelete(property.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Property"
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
