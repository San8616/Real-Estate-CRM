import { AlertTriangle, CalendarDays, RotateCcw, Plus, RefreshCw } from 'lucide-react';

export function BookingsLoadingSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div className="animate-pulse space-y-4">
        {/* Table header skeleton */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-4 w-20 rounded bg-slate-200" />
        </div>

        {/* Rows skeleton */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex items-center justify-between py-3.5 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-44 rounded bg-slate-200" />
                <div className="h-2.5 w-24 rounded bg-slate-100" />
              </div>
            </div>
            <div className="space-y-1.5 hidden sm:block">
              <div className="h-3.5 w-36 rounded bg-slate-200" />
              <div className="h-2.5 w-20 rounded bg-slate-100" />
            </div>
            <div className="h-6 w-24 rounded-full bg-slate-200" />
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-6 w-16 rounded-full bg-slate-200" />
            <div className="h-6 w-12 rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
        <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-600" />
        <span>Loading scheduled appointments & reservations...</span>
      </div>
    </div>
  );
}

export function BookingsErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-12 text-center shadow-xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-xs">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900">Failed to Load Bookings</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs sm:text-sm text-slate-500">
        An error occurred while fetching reservations and appointments. Please verify your connection or try again.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}

export function BookingsEmptyState({ hasFilters, onResetFilters, onOpenAddBooking }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 p-12 text-center shadow-xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-xs">
        <CalendarDays className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900">No Bookings Found</h3>
      <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-slate-500">
        {hasFilters
          ? 'No scheduled appointments or unit reservations match your current filters. Try adjusting your search query or filters.'
          : 'There are currently no bookings recorded. Schedule a site visit or reserve a property unit to get started.'}
      </p>
      <div className="mt-5 flex items-center gap-3">
        {hasFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
        {onOpenAddBooking && (
          <button
            type="button"
            onClick={onOpenAddBooking}
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-purple-200 hover:bg-purple-700 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Schedule Booking</span>
          </button>
        )}
      </div>
    </div>
  );
}
