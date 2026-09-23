import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/units/available (Quick lookup for booking dropdown)
router.get('/available', authenticateToken, async (req, res) => {
  try {
    // Find units that do not have any active Confirmed or Pending booking
    const activeBookings = await prisma.booking.findMany({
      where: {
        status: { in: ['Confirmed', 'Pending'] },
      },
      select: { unitId: true, bookingCode: true, lead: { select: { name: true } } },
    });

    const bookedUnitMap = new Map();
    activeBookings.forEach((b) => {
      bookedUnitMap.set(b.unitId, b);
    });

    const units = await prisma.unit.findMany({
      include: {
        project: { select: { name: true } },
        building: { select: { name: true } },
      },
      orderBy: { unitCode: 'asc' },
    });

    const formatted = units.map((u) => {
      const activeBooking = bookedUnitMap.get(u.id);
      return {
        id: u.id,
        unitCode: u.unitCode,
        name: u.name,
        unitType: u.unitType,
        location: u.location,
        price: u.price,
        formattedPrice: `$${u.price.toLocaleString()}`,
        status: u.status,
        isBooked: Boolean(activeBooking),
        activeBookingCode: activeBooking ? activeBooking.bookingCode : null,
        activeBookingLeadName: activeBooking ? activeBooking.lead.name : null,
      };
    });

    return res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('Fetch available units error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch available units.' });
  }
});

// GET /api/v1/units
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      search,
      unitType,
      status,
      projectId,
      buildingId,
      assignedAgentId,
      page = 1,
      pageSize = 50,
    } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { unitCode: { contains: String(search) } },
        { location: { contains: String(search) } },
      ];
    }

    if (unitType) where.unitType = String(unitType);
    if (status) where.status = String(status);
    if (projectId) where.projectId = String(projectId);
    if (buildingId) where.buildingId = String(buildingId);
    if (assignedAgentId) where.assignedAgentId = String(assignedAgentId);

    const skip = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
    const take = parseInt(pageSize, 10);

    const [units, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        include: {
          project: { select: { id: true, name: true, code: true } },
          building: { select: { id: true, name: true } },
          assignedAgent: { select: { id: true, name: true, role: true, avatar: true } },
        },
        skip,
        take,
        orderBy: { unitCode: 'asc' },
      }),
      prisma.unit.count({ where }),
    ]);

    return res.json({
      success: true,
      data: units,
      meta: {
        total,
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
        totalPages: Math.ceil(total / take) || 1,
      },
    });
  } catch (err) {
    console.error('Fetch units error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch units.' });
  }
});

// GET /api/v1/units/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const unit = await prisma.unit.findUnique({
      where: { id: req.params.id },
      include: {
        project: true,
        building: true,
        assignedAgent: true,
        bookings: {
          include: { lead: true },
          orderBy: { bookingDate: 'desc' },
        },
      },
    });

    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found.' });
    }

    return res.json({ success: true, data: unit });
  } catch (err) {
    console.error('Fetch unit detail error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch unit.' });
  }
});

// POST /api/v1/units
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      unitCode,
      name,
      unitType,
      location,
      price,
      bedrooms,
      bathrooms,
      areaSqFt,
      status,
      assignedAgentId,
      projectId,
      buildingId,
      listedDate,
      description,
    } = req.body;

    if (!name || !unitType || !location || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Unit name, type, location, and price are required.',
      });
    }

    const code = unitCode || `PR-${Math.floor(200 + Math.random() * 800)}`;

    const newUnit = await prisma.unit.create({
      data: {
        unitCode: code,
        name,
        unitType,
        location,
        price: parseFloat(price) || 0,
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : 0,
        bathrooms: bathrooms ? parseInt(bathrooms, 10) : 0,
        areaSqFt: areaSqFt ? parseInt(areaSqFt, 10) : 0,
        status: status || 'Active',
        assignedAgentId: assignedAgentId || null,
        projectId: projectId || null,
        buildingId: buildingId || null,
        listedDate: listedDate || new Date().toISOString().split('T')[0],
        description: description || '',
      },
      include: {
        project: true,
        building: true,
        assignedAgent: true,
      },
    });

    return res.status(201).json({ success: true, data: newUnit });
  } catch (err) {
    console.error('Create unit error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create unit.' });
  }
});

// PUT /api/v1/units/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      unitCode,
      name,
      unitType,
      location,
      price,
      bedrooms,
      bathrooms,
      areaSqFt,
      status,
      assignedAgentId,
      projectId,
      buildingId,
      listedDate,
      description,
    } = req.body;

    const updated = await prisma.unit.update({
      where: { id: req.params.id },
      data: {
        ...(unitCode && { unitCode }),
        ...(name && { name }),
        ...(unitType && { unitType }),
        ...(location && { location }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(bedrooms !== undefined && { bedrooms: parseInt(bedrooms, 10) }),
        ...(bathrooms !== undefined && { bathrooms: parseInt(bathrooms, 10) }),
        ...(areaSqFt !== undefined && { areaSqFt: parseInt(areaSqFt, 10) }),
        ...(status && { status }),
        ...(assignedAgentId !== undefined && { assignedAgentId }),
        ...(projectId !== undefined && { projectId }),
        ...(buildingId !== undefined && { buildingId }),
        ...(listedDate && { listedDate }),
        ...(description !== undefined && { description }),
      },
      include: {
        project: true,
        building: true,
        assignedAgent: true,
      },
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update unit error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update unit.' });
  }
});

// DELETE /api/v1/units/:id (Admin only)
router.delete('/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
  try {
    await prisma.unit.delete({
      where: { id: req.params.id },
    });

    return res.json({ success: true, message: 'Unit successfully deleted.' });
  } catch (err) {
    console.error('Delete unit error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete unit.' });
  }
});

export default router;
