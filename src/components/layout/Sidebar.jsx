import { Building2, X, ChevronRight, Sparkles, LogOut, Lock } from 'lucide-react';
import { NAV_ITEMS } from '../../data/navigation';
import Badge from '../common/Badge';
import { useAuth } from '../../context/useAuth';

export default function Sidebar({ activeTab, onSelectTab, isMobileOpen, onCloseMobile }) {
  const { user, role, isAdmin, logout } = useAuth();

  // Admin-only tabs
  const adminOnlyTabs = ['sales-team', 'reports', 'settings'];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xs transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo & Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-200">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold tracking-tight text-slate-900">EstateFlow</span>
                <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">CRM</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Realty Admin Suite</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Main Menu
            </span>
            <Badge variant={isAdmin ? 'purple' : 'emerald'} className="text-[10px] py-0 px-1.5">
              {role || 'User'}
            </Badge>
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isAdminOnly = adminOnlyTabs.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4.5 w-4.5 transition-colors ${
                        isActive
                          ? 'text-purple-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isAdminOnly && !isAdmin && (
                      <span className="flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                        <Lock className="h-2.5 w-2.5" />
                        Admin
                      </span>
                    )}
                    {item.badge && (
                      <Badge variant={item.badgeVariant === 'indigo' ? 'purple' : (item.badgeVariant || 'neutral')}>
                        {item.badge}
                      </Badge>
                    )}
                    {isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-purple-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Agency / User Profile Footer */}
        <div className="border-t border-slate-100 p-3 space-y-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-2xs ${
                    user?.avatarBg ? user.avatarBg.replace('bg-indigo-600', 'bg-purple-600') : 'bg-purple-600'
                  }`}
                >
                  {user?.avatar || 'SJ'}
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-slate-800">{user?.name}</div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>{role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Logout button for mobile */}
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors lg:hidden cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
