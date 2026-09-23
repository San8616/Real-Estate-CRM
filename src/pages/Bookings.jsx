import { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  CalendarDays,
  CheckCircle2,
  Clock,
  Building2,
  Trash2,
  RotateCw,
} from 'lucide-react';
import { MOCK_BOOKINGS } from '../data/mockBookings';
import { bookingsService } from '../services/bookingsService';
import { useAuth } from '../context/useAuth';
import BookingsFilterBar from '../components/bookings/BookingsFilterBar';
import BookingsTable from '../components/bookings/BookingsTable';
import BookingsPagination from '../components/bookings/BookingsPagination';
import BookingFormModal from '../components/bookings/BookingFormModal';
import BookingDetailModal from '../components/bookings/BookingDetailModal';
import {
  BookingsLoadingSkeleton,
  BookingsErrorState,
  BookingsEmptyState,
} from '../components/bookings/BookingsFeedbackStates';

export default function Bookings() {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Selected bookings for bulk actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [viewingBooking, setViewingBooking] = useState(null);

  // UI state simulation ('normal', 'loading', 'error', 'empty')
  const [viewState, setViewState] = useState('normal');

  // KPI Metrics derived from bookings
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
    const pending = bookings.filter((b) => b.status === 'Pending').length;
    const reservations = bookings.filter((b) => b.bookingType === 'Unit Reservation').length;
    return { total, confirmed, pending, reservations };
  }, [bookings]);

  // Status counts for status filter tabs
  const statusCounts = useMemo(() => {
    const counts = { all: bookings.length };
    bookings.forEach((b) => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });
    return counts;
  }, [bookings]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search matching across client, property, unit, ID, agent
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesClient = booking.leadName.toLowerCase().includes(query);
        const matchesProperty = booking.propertyName.toLowerCase().includes(query);
        const matchesId = booking.id.toLowerCase().includes(query);
        const matchesAgent = booking.assignedAgent.toLowerCase().includes(query);
        const matchesUnit = booking.unitCode ? booking.unitCode.toLowerCase().includes(query) : false;
        if (!matchesClient && !matchesProperty && !matchesId && !matchesAgent && !matchesUnit) {
          return false;
        }
      }

      // Status filter
      if (statusFilter && booking.status !== statusFilter) {
        return false;
      }

      // Booking Type filter
      if (typeFilter && booking.bookingType !== typeFilter) {
        return false;
      }

      // Agent filter
      if (agentFilter && booking.assignedAgent !== agentFilter) {
        return false;
      }

      return true;
    });
  }, [bookings, searchQuery, statusFilter, typeFilter, agentFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredBookings.length / pageSize) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, currentPage, pageSize]);

  const hasActiveFilters = Boolean(searchQuery || statusFilter || typeFilter || agentFilter);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
    setAgentFilter('');
    setCurrentPage(1);
  };

  useEffect(() => {
    let ignore = false;
    bookingsService
      .getBookings()
      .then((data) => {
        if (!ignore && data && Array.isArray(data)) {
          setBookings(data);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  // CRUD handlers
  const handleCreate = async (newBooking) => {
    try {
      const created = await bookingsService.createBooking(newBooking);
      setBookings((prev) => [created, ...prev]);
    } catch {
      setBookings((prev) => [newBooking, ...prev]);
    }
    setCurrentPage(1);
  };

  const handleUpdate = async (updated) => {
    try {
      const saved = await bookingsService.updateBooking(updated.id, updated);
      setBookings((prev) =>
        prev.map((b) => (b.id === saved.id ? saved : b))
      );
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
    }
    if (viewingBooking && viewingBooking.id === updated.id) {
      setViewingBooking(updated);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    try {
      await bookingsService.deleteBooking(id);
    } catch {
      // ignore
    }
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    if (viewingBooking && viewingBooking.id === id) {
      setViewingBooking(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!isAdmin) return;
    try {
      await bookingsService.bulkDeleteBookings(selectedIds);
    } catch {
      // ignore
    }
    setBookings((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
    setSelectedIds([]);
  };

  // Selection handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const currentPageIds = paginatedBookings.map((b) => b.id);
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header matching reference UI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Booking Management
            </h1>
            <span className="rounded-full bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 text-xs font-bold text-purple-700">
              {stats.total} Total
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Schedule walkthroughs, unit reservations, client visits, and prevent double-booking.
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
            title="Reload bookings"
          >
            <RotateCw className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-purple-700 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Schedule Booking</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Total Bookings</div>
            <div className="text-lg font-bold text-slate-900">{stats.total}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Confirmed</div>
            <div className="text-lg font-bold text-emerald-600">{stats.confirmed}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Pending Review</div>
            <div className="text-lg font-bold text-amber-600">{stats.pending}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Unit Reservations</div>
            <div className="text-lg font-bold text-violet-600">{stats.reservations}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <BookingsFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        typeFilter={typeFilter}
        onTypeChange={(t) => {
          setTypeFilter(t);
          setCurrentPage(1);
        }}
        agentFilter={agentFilter}
        onAgentChange={(a) => {
          setAgentFilter(a);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        viewState={viewState}
        onViewStateChange={setViewState}
        statusCounts={statusCounts}
      />

      {/* Bulk Action Bar (Admin only) */}
      {isAdmin && selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-purple-50/80 border border-purple-100 px-4 py-2.5 text-xs text-purple-900">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-[10px]">
              {selectedIds.length}
            </span>
            <span>Selected booking{selectedIds.length > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Cancel/Delete</span>
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
        <BookingsLoadingSkeleton />
      ) : viewState === 'error' ? (
        <BookingsErrorState onRetry={() => setViewState('normal')} />
      ) : viewState === 'empty' || filteredBookings.length === 0 ? (
        <BookingsEmptyState
          hasFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
          onOpenAddBooking={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          <BookingsTable
            bookings={paginatedBookings}
            selectedIds={selectedIds}
            onToggleSelect={isAdmin ? handleToggleSelect : undefined}
            onToggleSelectAll={isAdmin ? handleToggleSelectAll : undefined}
            onView={setViewingBooking}
            onEdit={(b) => setEditingBooking(b)}
            onDelete={isAdmin ? handleDelete : undefined}
            canDelete={isAdmin}
          />
          <BookingsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBookings.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Add Booking Modal */}
      <BookingFormModal
        key={isAddModalOpen ? 'new-booking' : 'new-booking-closed'}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreate}
        initialData={null}
        allBookings={bookings}
      />

      {/* Edit Booking Modal */}
      <BookingFormModal
        key={editingBooking ? `edit-${editingBooking.id}` : 'edit-booking-closed'}
        isOpen={Boolean(editingBooking)}
        onClose={() => setEditingBooking(null)}
        onSubmit={handleUpdate}
        initialData={editingBooking}
        allBookings={bookings}
      />

      {/* View Booking Detail Modal */}
      <BookingDetailModal
        booking={viewingBooking}
        onClose={() => setViewingBooking(null)}
        onEditBooking={(b) => setEditingBooking(b)}
      />
    </div>
  );
}
