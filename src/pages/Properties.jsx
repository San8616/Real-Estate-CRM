import { useState, useMemo, useEffect } from 'react';
import { Plus, Building2, TrendingUp, Clock, CheckCircle2, Trash2, RotateCw } from 'lucide-react';
import { PROPERTY_STATUSES, MOCK_PROPERTIES } from '../data/mockProperties';
import { propertiesService } from '../services/propertiesService';
import { useAuth } from '../context/useAuth';
import PropertiesFilterBar from '../components/properties/PropertiesFilterBar';
import PropertiesTable from '../components/properties/PropertiesTable';
import PropertiesPagination from '../components/properties/PropertiesPagination';
import PropertyFormModal from '../components/properties/PropertyFormModal';
import PropertyDetailModal from '../components/properties/PropertyDetailModal';
import {
  PropertiesLoadingSkeleton,
  PropertiesErrorState,
  PropertiesEmptyState,
} from '../components/properties/PropertiesFeedbackStates';

export default function Properties() {
  const { isAdmin } = useAuth();
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);

  // UI state simulation
  const [viewState, setViewState] = useState('normal');

  // Quick stats derived from in-memory data
  const stats = useMemo(() => {
    const total = properties.length;
    const active = properties.filter((p) => p.status === 'Active').length;
    const pending = properties.filter((p) => p.status === 'Pending').length;
    const sold = properties.filter((p) => p.status === 'Sold').length;
    return { total, active, pending, sold };
  }, [properties]);

  // Status counts for status tabs
  const statusCounts = useMemo(() => {
    const counts = { all: properties.length };
    PROPERTY_STATUSES.forEach((st) => {
      counts[st] = properties.filter((p) => p.status === st).length;
    });
    return counts;
  }, [properties]);

  // Filtered results
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = property.name.toLowerCase().includes(query);
        const matchesLocation = property.location.toLowerCase().includes(query);
        const matchesAgent = property.assignedAgent.toLowerCase().includes(query);
        const matchesType = property.type.toLowerCase().includes(query);
        if (!matchesName && !matchesLocation && !matchesAgent && !matchesType) {
          return false;
        }
      }
      if (typeFilter && property.type !== typeFilter) return false;
      if (agentFilter && property.assignedAgent !== agentFilter) return false;
      if (statusFilter && property.status !== statusFilter) return false;
      return true;
    });
  }, [properties, searchQuery, typeFilter, agentFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / pageSize) || 1;
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProperties.slice(start, start + pageSize);
  }, [filteredProperties, currentPage, pageSize]);

  const hasActiveFilters = Boolean(searchQuery || typeFilter || agentFilter || statusFilter);

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('');
    setAgentFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  useEffect(() => {
    let ignore = false;
    propertiesService
      .getProperties()
      .then((data) => {
        if (!ignore && data && Array.isArray(data)) {
          setProperties(data);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  // CRUD handlers
  const handleCreate = async (newProperty) => {
    try {
      const created = await propertiesService.createProperty(newProperty);
      setProperties((prev) => [created, ...prev]);
    } catch {
      setProperties((prev) => [newProperty, ...prev]);
    }
    setCurrentPage(1);
  };

  const handleUpdate = async (updated) => {
    try {
      const saved = await propertiesService.updateProperty(updated.id, updated);
      setProperties((prev) =>
        prev.map((p) => (p.id === saved.id ? saved : p))
      );
    } catch {
      setProperties((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    }
    if (viewingProperty && viewingProperty.id === updated.id) {
      setViewingProperty(updated);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    try {
      await propertiesService.deleteProperty(id);
    } catch {
      // ignore
    }
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    if (viewingProperty && viewingProperty.id === id) {
      setViewingProperty(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!isAdmin) return;
    try {
      await propertiesService.bulkDeleteProperties(selectedIds);
    } catch {
      // ignore
    }
    setProperties((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  // Selection handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const currentPageIds = paginatedProperties.map((p) => p.id);
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Property Inventory
            </h1>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200/60">
              {stats.total} Listings
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
            Manage residential, commercial, and luxury real estate listings.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setViewState('loading');
              setTimeout(() => setViewState('normal'), 600);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Reload listings"
          >
            <RotateCw className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Property</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Total Listings</div>
            <div className="text-lg font-bold text-slate-900">{stats.total}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Active</div>
            <div className="text-lg font-bold text-emerald-600">{stats.active}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Pending</div>
            <div className="text-lg font-bold text-amber-600">{stats.pending}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Sold</div>
            <div className="text-lg font-bold text-blue-600">{stats.sold}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <PropertiesFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        typeFilter={typeFilter}
        onTypeChange={(t) => { setTypeFilter(t); setCurrentPage(1); }}
        agentFilter={agentFilter}
        onAgentChange={(a) => { setAgentFilter(a); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(s) => { setStatusFilter(s); setCurrentPage(1); }}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        statusCounts={statusCounts}
        viewState={viewState}
        onViewStateChange={setViewState}
      />

      {/* Bulk Action Bar (Admin only) */}
      {isAdmin && selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-purple-50/90 border border-purple-200 px-4 py-2.5 text-xs text-purple-900 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-[10px]">
              {selectedIds.length}
            </span>
            <span>Selected listing{selectedIds.length > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="rounded-lg px-2 py-1 font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {viewState === 'loading' ? (
        <PropertiesLoadingSkeleton />
      ) : viewState === 'error' ? (
        <PropertiesErrorState onRetry={() => setViewState('normal')} />
      ) : viewState === 'empty' || filteredProperties.length === 0 ? (
        <PropertiesEmptyState
          hasFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
          onOpenAddProperty={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          <PropertiesTable
            properties={paginatedProperties}
            selectedIds={selectedIds}
            onToggleSelect={isAdmin ? handleToggleSelect : undefined}
            onToggleSelectAll={isAdmin ? handleToggleSelectAll : undefined}
            onView={setViewingProperty}
            onEdit={(p) => setEditingProperty(p)}
            onDelete={isAdmin ? handleDelete : undefined}
            canDelete={isAdmin}
          />
          <PropertiesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProperties.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Add Property Modal */}
      <PropertyFormModal
        key={isAddModalOpen ? 'new-property' : 'new-property-closed'}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreate}
        initialData={null}
      />

      {/* Edit Property Modal */}
      <PropertyFormModal
        key={editingProperty ? `edit-${editingProperty.id}` : 'edit-property-closed'}
        isOpen={Boolean(editingProperty)}
        onClose={() => setEditingProperty(null)}
        onSubmit={handleUpdate}
        initialData={editingProperty}
      />

      {/* View Property Detail Modal */}
      <PropertyDetailModal
        property={viewingProperty}
        onClose={() => setViewingProperty(null)}
        onEditProperty={(p) => setEditingProperty(p)}
      />
    </div>
  );
}
