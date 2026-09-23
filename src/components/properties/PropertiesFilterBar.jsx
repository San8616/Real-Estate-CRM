import { Search, X, RotateCcw, ChevronDown, Sparkles } from 'lucide-react';
import { PROPERTY_TYPES, PROPERTY_STATUSES, SALES_AGENTS } from '../../data/mockProperties';

export default function PropertiesFilterBar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  agentFilter,
  onAgentChange,
  statusFilter,
  onStatusChange,
  onResetFilters,
  hasActiveFilters,
  statusCounts = {},
  viewState,
  onViewStateChange,
}) {
  const tabs = [
    { id: 'all', label: 'All Listings', count: statusCounts.all },
    ...PROPERTY_STATUSES.map((status) => ({
      id: status,
      label: status,
      count: statusCounts[status],
    })),
  ];

  return (
    <div className="space-y-3">
      {/* Horizontal Status Tabs / Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = (statusFilter === '' && tab.id === 'all') || statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusChange(tab.id === 'all' ? '' : tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-purple-800/80 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Filter Control Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, location, agent, type..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Right: Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Property Type Dropdown */}
          <div className="relative min-w-[140px] flex-1 sm:flex-none">
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value)}
              aria-label="Filter by Property Type"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-3 pr-8 text-xs sm:text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
            >
              <option value="">Type: All Types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* 2. Assigned Agent Dropdown */}
          <div className="relative min-w-[160px] flex-1 sm:flex-none">
            <select
              value={agentFilter}
              onChange={(e) => onAgentChange(e.target.value)}
              aria-label="Filter by Assigned Agent"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-3 pr-8 text-xs sm:text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
            >
              <option value="">Agent: All Agents</option>
              {SALES_AGENTS.map((agent) => (
                <option key={agent.name} value={agent.name}>
                  {agent.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* 3. Status Dropdown */}
          <div className="relative min-w-[140px] flex-1 sm:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by Listing Status"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-3 pr-8 text-xs sm:text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer"
            >
              <option value="">Status: All</option>
              {PROPERTY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
              title="Reset all active filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* State Preview Switches */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span className="font-semibold text-[11px] text-slate-600">Preview UI State:</span>
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          {[
            { id: 'normal', label: 'Normal Data' },
            { id: 'loading', label: 'Loading State' },
            { id: 'error', label: 'Error State' },
            { id: 'empty', label: 'Empty State' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewStateChange(item.id)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                viewState === item.id
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
