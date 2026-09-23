import { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
  LogOut,
  Shield,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { ROLES } from '../../data/mockAuth';
import Badge from '../common/Badge';

export default function TopNavbar({ onOpenMobile, activePageTitle = 'Dashboard', onNewLeadClick }) {
  const { user, role, isAdmin, logout, switchRole } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleRole = () => {
    const nextRole = isAdmin ? ROLES.SALES_EMPLOYEE : ROLES.ADMIN;
    switchRole(nextRole);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left side: Mobile menu toggle & Current section title / Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobile}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <div className="text-sm font-bold text-slate-900 tracking-tight">{activePageTitle}</div>
          <div className="text-[11px] text-slate-400">Overview & Management</div>
        </div>

        {/* Global Search Input */}
        <div className="relative flex-1 max-w-xs md:max-w-md ml-0 sm:ml-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search leads, properties, bookings..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-12 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden sm:flex items-center pr-3">
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side: Quick Action + Notifications + User Avatar */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Add Button */}
        <button
          type="button"
          onClick={onNewLeadClick}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs shadow-purple-200 transition-all hover:bg-purple-700 active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Lead</span>
        </button>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            type="button"
            className="relative rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600" />
            </span>
          </button>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 text-left transition-colors hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${
                user?.avatarBg ? user.avatarBg.replace('bg-indigo-600', 'bg-purple-600') : 'bg-purple-600'
              }`}
            >
              {user?.avatar || 'SJ'}
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                  {user?.name || 'Sarah Jenkins'}
                </span>
                <Badge variant={isAdmin ? 'purple' : 'emerald'} className="text-[10px] py-0 px-1.5">
                  {role || 'Admin'}
                </Badge>
              </div>
              <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                {user?.title || 'Principal Broker'}
              </div>
            </div>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-fadeIn">
              {/* Profile Card */}
              <div className="p-3 border-b border-slate-100">
                <div className="font-bold text-xs text-slate-900">{user?.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">Current Role:</span>
                  <Badge variant={isAdmin ? 'purple' : 'emerald'} className="text-[10px]">
                    {role}
                  </Badge>
                </div>
              </div>

              {/* Role Switcher Demo Control */}
              <div className="p-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={handleToggleRole}
                  className="w-full flex items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 p-2 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-3.5 w-3.5 text-purple-600" />
                    <span>Switch Role (Demo)</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700">
                    {isAdmin ? '→ Sales' : '→ Admin'}
                  </span>
                </button>
              </div>

              {/* Role Capabilities Hint */}
              <div className="px-3 py-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                {isAdmin ? (
                  <>
                    <Shield className="h-3 w-3 text-purple-500" />
                    <span>Full Admin Permissions</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3 w-3 text-emerald-500" />
                    <span>Sales Employee Mode</span>
                  </>
                )}
              </div>

              {/* Logout Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
