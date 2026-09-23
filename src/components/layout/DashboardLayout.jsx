import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { NAV_ITEMS } from '../../data/navigation';

export default function DashboardLayout({ activeTab, onSelectTab, onNewLeadClick, children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Find active navigation item label for the top navbar
  const currentNav = NAV_ITEMS.find((item) => item.id === activeTab);
  const activePageTitle = currentNav ? currentNav.label : 'Dashboard';

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Sidebar (Responsive desktop + mobile drawer) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <TopNavbar
          activePageTitle={activePageTitle}
          onOpenMobile={() => setIsMobileOpen(true)}
          onNewLeadClick={onNewLeadClick}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
