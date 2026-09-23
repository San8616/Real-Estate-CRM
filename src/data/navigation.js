import {
  LayoutDashboard,
  UserCheck,
  Building2,
  CalendarDays,
  Users2,
  BarChart3,
  Settings,
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: UserCheck,
    badge: '18 New',
    badgeVariant: 'amber',
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: Building2,
    badge: '142',
    badgeVariant: 'neutral',
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: CalendarDays,
    badge: '5 Today',
    badgeVariant: 'purple',
  },
  {
    id: 'sales-team',
    label: 'Sales Team',
    icon: Users2,
    badge: null,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    badge: null,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    badge: null,
  },
];
