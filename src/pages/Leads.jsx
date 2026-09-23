import { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Users,
  Flame,
  Clock,
  CheckCircle2,
  Trash2,
  RotateCw,
} from 'lucide-react';
import { LEAD_STAGES, MOCK_LEADS } from '../data/mockLeads';
import { leadsService } from '../services/leadsService';
import { useAuth } from '../context/useAuth';
import LeadsFilterBar from '../components/leads/LeadsFilterBar';
import LeadsTable from '../components/leads/LeadsTable';
import LeadsPagination from '../components/leads/LeadsPagination';
import LeadFormModal from '../components/leads/LeadFormModal';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import {
  LeadsLoadingSkeleton,
  LeadsErrorState,
  LeadsEmptyState,
} from '../components/leads/LeadsFeedbackStates';

export default function Leads() {
  const { isAdmin } = useAuth();
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Selected leads for bulk actions
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Modals state: Add Lead, Edit Lead, View Lead Detail
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);

  // UI state simulation ('normal', 'loading', 'error', 'empty')
  const [viewState, setViewState] = useState('normal');

  // Quick stats derived from in-memory leads
  const stats = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter((l) => l.status === 'Hot Lead').length;
    const dueToday = leads.filter((l) => l.followUpDate === '2026-09-21').length;
    const active = leads.filter((l) => l.stage !== 'Lost').length;
    return { total, hot, dueToday, active };
  }, [leads]);

  // Stage counts for status tabs
  const stageCounts = useMemo(() => {
    const counts = { all: leads.length };
    LEAD_STAGES.forEach((stage) => {
      counts[stage] = leads.filter((l) => l.stage === stage).length;
    });
    return counts;
  }, [leads]);

  // Filtered leads (handles search, stage filter, agent filter, status filter)
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search matching (name, email, phone, propertyInterest)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(query);
        const matchesEmail = lead.email.toLowerCase().includes(query);
        const matchesPhone = lead.phone.includes(query);
        const matchesProperty = lead.propertyInterest.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesProperty) {
          return false;
        }
      }

      // Stage filter
      if (stageFilter && lead.stage !== stageFilter) {
        return false;
      }

      // Agent filter
      if (agentFilter && lead.assignedTo !== agentFilter) {
        return false;
      }

      // Status filter
      if (statusFilter && lead.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [leads, searchQuery, stageFilter, agentFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Has any active filter
  const hasActiveFilters = Boolean(searchQuery || stageFilter || agentFilter || statusFilter);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStageFilter('');
    setAgentFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  useEffect(() => {
    let ignore = false;
    leadsService
      .getLeads()
      .then((data) => {
        if (!ignore && data && Array.isArray(data)) {
          setLeads(data);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  // Create lead handler
  const handleCreateLead = async (newLead) => {
    try {
      const created = await leadsService.createLead(newLead);
      setLeads((prev) => [created, ...prev]);
    } catch {
      setLeads((prev) => [newLead, ...prev]);
    }
    setCurrentPage(1);
  };

  // Edit/update lead handler
  const handleUpdateLead = async (updatedLead) => {
    try {
      const saved = await leadsService.updateLead(updatedLead.id, updatedLead);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === saved.id ? saved : lead))
      );
    } catch {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
      );
    }
    if (viewingLead && viewingLead.id === updatedLead.id) {
      setViewingLead(updatedLead);
    }
  };

  // Delete lead handler (Admin only)
  const handleDeleteLead = async (id) => {
    if (!isAdmin) return;
    try {
      await leadsService.deleteLead(id);
    } catch {
      // ignore
    }
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLeadIds((prev) => prev.filter((i) => i !== id));
    if (viewingLead && viewingLead.id === id) {
      setViewingLead(null);
    }
  };

  // Bulk delete selected (Admin only)
  const handleBulkDelete = async () => {
    if (!isAdmin) return;
    try {
      await leadsService.bulkDeleteLeads(selectedLeadIds);
    } catch {
      // ignore
    }
    setLeads((prev) => prev.filter((l) => !selectedLeadIds.includes(l.id)));
    setSelectedLeadIds([]);
  };

  // Selection toggle handlers
  const handleToggleSelectLead = (id) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const currentPageIds = paginatedLeads.map((l) => l.id);
    const allSelectedOnPage = currentPageIds.every((id) => selectedLeadIds.includes(id));

    if (allSelectedOnPage) {
      setSelectedLeadIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedLeadIds((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Leads Management
            </h1>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200/60">
              {stats.total} Total
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
            Track, qualify, and assign prospective real estate buyers and investors.
          </p>
        </div>

        {/* Action Buttons: Refresh & Create Lead */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setViewState('loading');
              setTimeout(() => setViewState('normal'), 600);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Reload leads from server"
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
            <span>+ Add Lead</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Total Leads</div>
            <div className="text-lg font-bold text-slate-900">{stats.total}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Hot Inquiries</div>
            <div className="text-lg font-bold text-rose-600">{stats.hot}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Follow-up Today</div>
            <div className="text-lg font-bold text-amber-600">{stats.dueToday}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Active Pipeline</div>
            <div className="text-lg font-bold text-emerald-600">{stats.active}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar: Search lead, filter stage, agent, status */}
      <LeadsFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        stageFilter={stageFilter}
        onStageChange={(s) => {
          setStageFilter(s);
          setCurrentPage(1);
        }}
        agentFilter={agentFilter}
        onAgentChange={(a) => {
          setAgentFilter(a);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(st) => {
          setStatusFilter(st);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        stageCounts={stageCounts}
        viewState={viewState}
        onViewStateChange={setViewState}
      />

      {/* Bulk Action Bar (when rows are selected - Admin only) */}
      {isAdmin && selectedLeadIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-purple-50/90 border border-purple-200 px-4 py-2.5 text-xs text-purple-900 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-[10px]">
              {selectedLeadIds.length}
            </span>
            <span>Selected lead{selectedLeadIds.length > 1 ? 's' : ''}</span>
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
              onClick={() => setSelectedLeadIds([])}
              className="rounded-lg px-2 py-1 font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area based on viewState */}
      {viewState === 'loading' ? (
        <LeadsLoadingSkeleton />
      ) : viewState === 'error' ? (
        <LeadsErrorState onRetry={() => setViewState('normal')} />
      ) : viewState === 'empty' || filteredLeads.length === 0 ? (
        <LeadsEmptyState
          hasFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
          onOpenAddLead={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          <LeadsTable
            leads={paginatedLeads}
            selectedLeadIds={selectedLeadIds}
            onToggleSelectLead={isAdmin ? handleToggleSelectLead : undefined}
            onToggleSelectAll={isAdmin ? handleToggleSelectAll : undefined}
            onDeleteLead={isAdmin ? handleDeleteLead : undefined}
            onViewLead={setViewingLead}
            onEditLead={(lead) => setEditingLead(lead)}
            canDelete={isAdmin}
          />

          <LeadsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLeads.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Create Lead Modal */}
      <LeadFormModal
        key={isAddModalOpen ? 'new-lead' : 'new-closed'}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateLead}
        initialData={null}
      />

      {/* Edit Lead Modal */}
      <LeadFormModal
        key={editingLead ? `edit-${editingLead.id}` : 'edit-closed'}
        isOpen={Boolean(editingLead)}
        onClose={() => setEditingLead(null)}
        onSubmit={handleUpdateLead}
        initialData={editingLead}
      />

      {/* View Lead Detail Modal */}
      <LeadDetailModal
        lead={viewingLead}
        onClose={() => setViewingLead(null)}
        onEditLead={(lead) => setEditingLead(lead)}
      />
    </div>
  );
}
