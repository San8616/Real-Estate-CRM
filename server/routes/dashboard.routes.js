import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/dashboard/stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [leadsCount, activeUnitsCount, bookingsCount, totalUnitsPrice] = await Promise.all([
      prisma.lead.count(),
      prisma.unit.count({ where: { status: 'Active' } }),
      prisma.booking.count(),
      prisma.unit.aggregate({
        _sum: { price: true },
      }),
    ]);

    const volumeRaw = totalUnitsPrice._sum.price || 0;
    const formattedVolume = volumeRaw > 1000000
      ? `$${(volumeRaw / 1000000).toFixed(1)}M`
      : `$${volumeRaw.toLocaleString()}`;

    const stats = [
      {
        title: 'Active Leads',
        value: String(leadsCount),
        change: '+18 this week',
        trend: 'up',
        color: 'indigo',
      },
      {
        title: 'Listed Properties',
        value: String(activeUnitsCount),
        change: 'Active in inventory',
        trend: 'up',
        color: 'emerald',
      },
      {
        title: 'Site Visit Bookings',
        value: String(bookingsCount),
        change: 'Confirmed & scheduled',
        trend: 'up',
        color: 'amber',
      },
      {
        title: 'Pipeline Volume',
        value: formattedVolume,
        change: '+14.2% vs last month',
        trend: 'up',
        color: 'blue',
      },
    ];

    return res.json({ success: true, data: stats });
  } catch (err) {
    console.error('Fetch dashboard stats error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch dashboard stats.' });
  }
});

// GET /api/v1/dashboard/recent-activity
router.get('/recent-activity', authenticateToken, async (req, res) => {
  try {
    const [recentLeads, upcomingBookings] = await Promise.all([
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.findMany({
        where: {
          status: { in: ['Confirmed', 'Pending'] },
        },
        take: 4,
        include: {
          lead: true,
          unit: true,
          assignedAgent: true,
        },
        orderBy: { bookingDate: 'asc' },
      }),
    ]);

    const formattedLeads = recentLeads.map((l) => ({
      id: l.leadCode,
      name: l.name,
      email: l.email,
      phone: l.phone,
      interest: l.propertyInterest || 'Luxury Residential',
      budget: l.budget || '$1,500,000',
      status: l.status,
      statusVariant: l.status === 'Hot Lead' ? 'rose' : 'indigo',
      time: 'Recent',
    }));

    const formattedVisits = upcomingBookings.map((b) => ({
      id: b.bookingCode,
      client: b.lead ? b.lead.name : 'Client',
      property: b.unit ? b.unit.name : 'Property',
      location: b.unit ? b.unit.location : '',
      time: `${b.bookingTime} (${b.bookingDate})`,
      agent: b.assignedAgent ? b.assignedAgent.name : 'Agent',
      phone: b.lead ? b.lead.phone : '',
      email: b.lead ? b.lead.email : '',
    }));

    return res.json({
      success: true,
      data: {
        recentLeads: formattedLeads,
        upcomingVisits: formattedVisits,
      },
    });
  } catch (err) {
    console.error('Fetch dashboard activity error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch recent activity.' });
  }
});

export default router;
