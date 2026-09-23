import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Building2,
  CalendarCheck,
  ArrowUpRight,
  Clock,
  PhoneCall,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/useAuth';
import { dashboardService } from '../services/dashboardService';

const KPI_NAVIGATION = {
  'Active Leads': 'leads',
  'Listed Properties': 'properties',
  'Site Visit Bookings': 'bookings',
};

export default function Dashboard({ onNavigate }) {
  const { user, role } = useAuth();
  const [stats, setStats] = useState([
    {
      title: 'Active Leads',
      value: '8',
      change: '+18 this week',
      trend: 'up',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Listed Properties',
      value: '14',
      change: 'Active in inventory',
      trend: 'up',
      icon: Building2,
      color: 'emerald',
    },
    {
      title: 'Site Visit Bookings',
      value: '7',
      change: 'Confirmed & scheduled',
      trend: 'up',
      icon: CalendarCheck,
      color: 'amber',
    },
    {
      title: 'Pipeline Volume',
      value: '$37.2M',
      change: '+14.2% vs last month',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue',
    },
  ]);

  const [recentLeads, setRecentLeads] = useState([
    {
      id: 1,
      name: 'Alexander Wright',
      email: 'alex.wright@example.com',
      phone: '+1 (555) 234-8901',
      interest: 'Penthouse at Sovereign Heights',
      budget: '$1,850,000',
      status: 'Hot Lead',
      statusVariant: 'rose',
      time: '12m ago',
    },
    {
      id: 2,
      name: 'Evelyn Carter',
      email: 'evelyn.c@example.com',
      phone: '+1 (555) 345-6712',
      interest: 'Modern Villa - Azure Bay',
      budget: '$2,400,000',
      status: 'Site Visit',
      statusVariant: 'purple',
      time: '45m ago',
    },
    {
      id: 3,
      name: 'Marcus Chen',
      email: 'marcus.chen@example.com',
      phone: '+1 (555) 456-7823',
      interest: 'Downtown Commercial Loft',
      budget: '$950,000',
      status: 'Contacted',
      statusVariant: 'amber',
      time: '2h ago',
    },
    {
      id: 4,
      name: 'Sophia Martinez',
      email: 'sophia.m@example.com',
      phone: '+1 (555) 567-8934',
      interest: 'Oakridge Family Residence',
      budget: '$1,200,000',
      status: 'New',
      statusVariant: 'emerald',
      time: '3h ago',
    },
  ]);

  const [upcomingVisits, setUpcomingVisits] = useState([
    {
      id: 1,
      client: 'Alexander Wright',
      property: 'Penthouse at Sovereign Heights',
      location: 'Downtown Core, Manhattan, NY',
      time: '10:30 AM (2026-09-23)',
      agent: 'Sarah Jenkins',
    },
    {
      id: 2,
      client: 'Evelyn Carter',
      property: 'Modern Villa – Azure Bay',
      location: 'Azure Bay Drive, Miami, FL',
      time: '02:00 PM (2026-09-22)',
      agent: 'Elena Rostova',
    },
  ]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const statsData = await dashboardService.getStats();
        if (statsData && Array.isArray(statsData)) {
          const iconMap = {
            'Active Leads': Users,
            'Listed Properties': Building2,
            'Site Visit Bookings': CalendarCheck,
            'Pipeline Volume': TrendingUp,
          };
          setStats(
            statsData.map((s) => ({
              ...s,
              icon: iconMap[s.title] || Building2,
            }))
          );
        }
      } catch {
        // keep initial fallback
      }

      try {
        const activityData = await dashboardService.getRecentActivity();
        if (activityData?.recentLeads) {
          setRecentLeads(activityData.recentLeads);
        }
        if (activityData?.upcomingVisits) {
          setUpcomingVisits(activityData.upcomingVisits);
        }
      } catch {
        // keep initial fallback
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Real Estate Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Welcome back, <span className="font-semibold text-slate-700">{user?.name || 'Agent'}</span>{' '}
            <span className="rounded bg-purple-50 px-1.5 py-0.2 text-[11px] font-bold text-purple-700 ml-1">
              {role || 'Admin'}
            </span>
            . Here is your agency pipeline summary for today.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live Market Feed
          </div>
          <span className="text-xs text-slate-400 font-medium">Updated 5 min ago</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const targetPage = KPI_NAVIGATION[stat.title];
          const isClickable = Boolean(onNavigate && targetPage);

          return (
            <div
              key={idx}
              onClick={isClickable ? () => onNavigate(targetPage) : undefined}
              onKeyDown={
                isClickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onNavigate(targetPage);
                      }
                    }
                  : undefined
              }
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-label={isClickable ? `View ${stat.title}` : undefined}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 ${
                isClickable
                  ? 'cursor-pointer hover:shadow-md hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20'
                  : 'cursor-default'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-purple-600 transition-colors group-hover:bg-purple-50">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-2xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </div>
                <div className="inline-flex items-center text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Leads & Upcoming Site Visits */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Inquiries & Leads (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Lead Inquiries</h2>
              <p className="text-xs text-slate-500 mt-0.5">Prospective buyers and investors registered today</p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('leads')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                <span>View All Leads</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="mt-4 divide-y divide-slate-100 overflow-x-auto">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 hover:bg-purple-50/20 rounded-xl px-2.5 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xs font-bold text-purple-700">
                    {lead.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{lead.name}</span>
                      <Badge variant={lead.statusVariant}>{lead.status}</Badge>
                    </div>
                    <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      Interested in <span className="text-slate-700 font-semibold">{lead.interest}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                  <span className="text-xs font-bold text-slate-900">{lead.budget}</span>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {lead.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Property Visits (1 col) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Visits</h2>
              <p className="text-xs text-slate-500 mt-0.5">Confirmed buyer showings</p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('bookings')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                Schedule
              </button>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {upcomingVisits.map((visit) => (
              <div
                key={visit.id}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {visit.time}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Agent: {visit.agent}</span>
                </div>

                <h3 className="mt-2 text-sm font-semibold text-slate-900">{visit.property}</h3>

                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{visit.location}</span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Client: <strong className="text-slate-800">{visit.client}</strong></span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-purple-600 rounded-md hover:bg-white transition-colors"
                      title="Call Client"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-purple-600 rounded-md hover:bg-white transition-colors"
                      title="Email Client"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
