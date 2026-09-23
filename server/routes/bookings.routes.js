import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Helper to format booking for frontend
function formatBooking(booking) {
  return {
    id: booking.bookingCode,
    dbId: booking.id,
    bookingCode: booking.bookingCode,
    leadId: booking.lead ? booking.lead.leadCode : booking.leadId,
    leadDbId: booking.leadId,
    leadName: booking.lead ? booking.lead.name : 'Unknown Lead',
    leadEmail: booking.lead ? booking.lead.email : '',
    leadPhone: booking.lead ? booking.lead.phone : '',
    propertyId: booking.unit ? booking.unit.unitCode : booking.unitId,
    unitDbId: booking.unitId,
    propertyName: booking.unit ? booking.unit.name : 'Unknown Property',
    propertyType: booking.unit ? booking.unit.unitType : '',
    propertyLocation: booking.unit ? booking.unit.location : '',
    propertyPrice: booking.unit ? `$${booking.unit.price.toLocaleString()}` : '',
    unitCode: booking.unit ? booking.unit.unitCode : '',
    bookingType: booking.bookingType,
    bookingDate: booking.bookingDate,
    bookingTime: booking.bookingTime,
    status: booking.status,
    assignedAgent: booking.assignedAgent ? booking.assignedAgent.name : 'Sarah Jenkins',
    assignedAgentId: booking.assignedAgentId,
    tokenAmount: booking.tokenAmount || '—',
    notes: booking.notes || '',
    createdDate: booking.createdAt.toISOString().split('T')[0],
  };
}

// GET /api/v1/bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, status, bookingType, agent } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { bookingCode: { contains: String(search) } },
        { lead: { name: { contains: String(search) } } },
        { unit: { name: { contains: String(search) } } },
        { unit: { unitCode: { contains: String(search) } } },
        { assignedAgent: { name: { contains: String(search) } } },
      ];
    }

    if (status) where.status = String(status);
    if (bookingType) where.bookingType = String(bookingType);
    if (agent) where.assignedAgent = { name: String(agent) };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        lead: true,
        unit: true,
        assignedAgent: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = bookings.map(formatBooking);

    return res.json({
      success: true,
      data: formatted,
      total: formatted.length,
    });
  } catch (err) {
    console.error('Fetch bookings error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch bookings.' });
  }
});

// GET /api/v1/bookings/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const idParam = req.params.id;
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id: idParam }, { bookingCode: idParam }],
      },
      include: {
        lead: true,
        unit: true,
        assignedAgent: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    return res.json({ success: true, data: formatBooking(booking) });
  } catch (err) {
    console.error('Fetch booking detail error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch booking.' });
  }
});

// POST /api/v1/bookings
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      leadId,
      propertyId,
      unitId,
      bookingType,
      bookingDate,
      bookingTime,
      status = 'Confirmed',
      assignedAgent,
      tokenAmount,
      notes,
    } = req.body;

    const targetUnitIdentifier = unitId || propertyId;
    if (!leadId || !targetUnitIdentifier) {
      return res.status(400).json({
        success: false,
        error: 'Lead and Unit/Property selections are required.',
      });
    }

    // Resolve unit
    const unit = await prisma.unit.findFirst({
      where: {
        OR: [{ id: targetUnitIdentifier }, { unitCode: targetUnitIdentifier }],
      },
    });

    if (!unit) {
      return res.status(404).json({ success: false, error: 'Selected unit not found.' });
    }

    // Resolve lead
    const lead = await prisma.lead.findFirst({
      where: {
        OR: [{ id: leadId }, { leadCode: leadId }],
      },
    });

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Selected lead not found.' });
    }

    // 🔒 DOUBLE-BOOKING PREVENTION GUARD
    // If the new booking is active (Confirmed or Pending), check for conflicting active reservations
    const isActiveBooking = status === 'Confirmed' || status === 'Pending';
    if (isActiveBooking) {
      const existingConflict = await prisma.booking.findFirst({
        where: {
          unitId: unit.id,
          status: { in: ['Confirmed', 'Pending'] },
        },
        include: { lead: true },
      });

      if (existingConflict) {
        return res.status(409).json({
          success: false,
          error: `Double-booking prevention: Unit "${unit.name}" is already reserved under active booking #${existingConflict.bookingCode} by ${existingConflict.lead.name} (${existingConflict.status}). Please select an available unit or cancel the prior booking.`,
          conflictBookingCode: existingConflict.bookingCode,
          conflictLeadName: existingConflict.lead.name,
        });
      }
    }

    // Resolve agent
    let agentId = req.user.id;
    if (assignedAgent) {
      const foundAgent = await prisma.user.findFirst({
        where: { name: assignedAgent },
      });
      if (foundAgent) agentId = foundAgent.id;
    }

    const bookingCode = `BK-${Math.floor(510 + Math.random() * 480)}`;

    // Transactionally create booking and update unit status
    const createdBooking = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          bookingCode,
          leadId: lead.id,
          unitId: unit.id,
          bookingType: bookingType || 'Site Visit',
          bookingDate: bookingDate || new Date().toISOString().split('T')[0],
          bookingTime: bookingTime || '10:30 AM',
          status: status || 'Confirmed',
          tokenAmount: tokenAmount || '—',
          assignedAgentId: agentId,
          notes: notes || '',
        },
        include: {
          lead: true,
          unit: true,
          assignedAgent: true,
        },
      });

      if (isActiveBooking && bookingType === 'Unit Reservation') {
        await tx.unit.update({
          where: { id: unit.id },
          data: { status: 'Pending' },
        });
      }

      return booking;
    });

    return res.status(201).json({ success: true, data: formatBooking(createdBooking) });
  } catch (err) {
    console.error('Create booking error:', err);
    return res.status(500).json({ success: false, error: 'Failed to schedule booking.' });
  }
});

// PUT /api/v1/bookings/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const idParam = req.params.id;
    const existing = await prisma.booking.findFirst({
      where: {
        OR: [{ id: idParam }, { bookingCode: idParam }],
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    const {
      leadId,
      propertyId,
      unitId,
      bookingType,
      bookingDate,
      bookingTime,
      status,
      assignedAgent,
      tokenAmount,
      notes,
    } = req.body;

    let targetUnitId = existing.unitId;
    if (unitId || propertyId) {
      const targetUnitIdentifier = unitId || propertyId;
      const unit = await prisma.unit.findFirst({
        where: {
          OR: [{ id: targetUnitIdentifier }, { unitCode: targetUnitIdentifier }],
        },
      });
      if (unit) targetUnitId = unit.id;
    }

    // 🔒 DOUBLE-BOOKING CHECK on update
    const targetStatus = status || existing.status;
    const isTargetActive = targetStatus === 'Confirmed' || targetStatus === 'Pending';
    if (isTargetActive) {
      const conflict = await prisma.booking.findFirst({
        where: {
          unitId: targetUnitId,
          status: { in: ['Confirmed', 'Pending'] },
          id: { not: existing.id },
        },
        include: { lead: true, unit: true },
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          error: `Double-booking prevention: Unit "${conflict.unit.name}" is already booked under active booking #${conflict.bookingCode} by ${conflict.lead.name}.`,
        });
      }
    }

    let agentId = existing.assignedAgentId;
    if (assignedAgent) {
      const foundAgent = await prisma.user.findFirst({
        where: { name: assignedAgent },
      });
      if (foundAgent) agentId = foundAgent.id;
    }

    let resolvedLeadId = existing.leadId;
    if (leadId) {
      const lead = await prisma.lead.findFirst({
        where: {
          OR: [{ id: leadId }, { leadCode: leadId }],
        },
      });
      if (lead) resolvedLeadId = lead.id;
    }

    const updated = await prisma.booking.update({
      where: { id: existing.id },
      data: {
        leadId: resolvedLeadId,
        unitId: targetUnitId,
        ...(bookingType && { bookingType }),
        ...(bookingDate && { bookingDate }),
        ...(bookingTime && { bookingTime }),
        ...(status && { status }),
        ...(tokenAmount !== undefined && { tokenAmount }),
        assignedAgentId: agentId,
        ...(notes !== undefined && { notes }),
      },
      include: {
        lead: true,
        unit: true,
        assignedAgent: true,
      },
    });

    return res.json({ success: true, data: formatBooking(updated) });
  } catch (err) {
    console.error('Update booking error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update booking.' });
  }
});

// DELETE /api/v1/bookings/:id (Admin only)
router.delete('/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
  try {
    const idParam = req.params.id;
    const existing = await prisma.booking.findFirst({
      where: {
        OR: [{ id: idParam }, { bookingCode: idParam }],
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    await prisma.booking.delete({
      where: { id: existing.id },
    });

    return res.json({ success: true, message: 'Booking successfully deleted.' });
  } catch (err) {
    console.error('Delete booking error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete booking.' });
  }
});

// POST /api/v1/bookings/bulk-delete (Admin only)
router.post('/bulk-delete', authenticateToken, requireRole('Admin'), async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Array of booking IDs is required.' });
    }

    await prisma.booking.deleteMany({
      where: {
        OR: [{ id: { in: ids } }, { bookingCode: { in: ids } }],
      },
    });

    return res.json({ success: true, message: `${ids.length} bookings successfully deleted.` });
  } catch (err) {
    console.error('Bulk delete bookings error:', err);
    return res.status(500).json({ success: false, error: 'Failed to bulk delete bookings.' });
  }
});

export default router;
