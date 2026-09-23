import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Helper to format lead for frontend
function formatLead(lead) {
  return {
    id: lead.leadCode,
    dbId: lead.id,
    leadCode: lead.leadCode,
    name: lead.name,
    email: lead.email || '',
    phone: lead.phone,
    stage: lead.stage,
    status: lead.status,
    propertyInterest: lead.propertyInterest || '',
    budget: lead.budget || '',
    source: lead.source || 'Website Form',
    assignedTo: lead.assignedAgent ? lead.assignedAgent.name : 'Sarah Jenkins',
    assignedAgentId: lead.assignedAgentId,
    followUpDate: lead.followUpDate || '2026-09-22',
    notes: lead.notes || '',
    createdDate: lead.createdAt.toISOString().split('T')[0],
  };
}

// GET /api/v1/leads
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, stage, status, agent } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { email: { contains: String(search) } },
        { phone: { contains: String(search) } },
        { propertyInterest: { contains: String(search) } },
        { leadCode: { contains: String(search) } },
      ];
    }

    if (stage) where.stage = String(stage);
    if (status) where.status = String(status);
    if (agent) where.assignedAgent = { name: String(agent) };

    const leads = await prisma.lead.findMany({
      where,
      include: { assignedAgent: true },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = leads.map(formatLead);

    return res.json({
      success: true,
      data: formatted,
      total: formatted.length,
    });
  } catch (err) {
    console.error('Fetch leads error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch leads.' });
  }
});

// GET /api/v1/leads/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const idParam = req.params.id;
    const lead = await prisma.lead.findFirst({
      where: {
        OR: [{ id: idParam }, { leadCode: idParam }],
      },
      include: {
        assignedAgent: true,
        bookings: {
          include: { unit: true },
          orderBy: { bookingDate: 'desc' },
        },
      },
    });

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found.' });
    }

    return res.json({ success: true, data: formatLead(lead) });
  } catch (err) {
    console.error('Fetch lead detail error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch lead.' });
  }
});

// POST /api/v1/leads
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      propertyInterest,
      budget,
      stage,
      status,
      assignedTo,
      followUpDate,
      notes,
      source,
    } = req.body;

    if (!name || (!phone && !email)) {
      return res.status(400).json({
        success: false,
        error: 'Lead name and at least one contact method (phone or email) are required.',
      });
    }

    // Lookup agent by name if supplied
    let agentId = null;
    if (assignedTo) {
      const foundAgent = await prisma.user.findFirst({
        where: { name: assignedTo },
      });
      if (foundAgent) agentId = foundAgent.id;
    }

    const leadCode = `LD-${Math.floor(100 + Math.random() * 900)}`;

    const created = await prisma.lead.create({
      data: {
        leadCode,
        name,
        phone: phone || '',
        email: email || '',
        propertyInterest: propertyInterest || '',
        budget: budget || '',
        stage: stage || 'New',
        status: status || 'Active',
        assignedAgentId: agentId,
        followUpDate: followUpDate || new Date().toISOString().split('T')[0],
        notes: notes || '',
        source: source || 'Website Form',
      },
      include: { assignedAgent: true },
    });

    return res.status(201).json({ success: true, data: formatLead(created) });
  } catch (err) {
    console.error('Create lead error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create lead.' });
  }
});

// PUT /api/v1/leads/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const idParam = req.params.id;
    const existing = await prisma.lead.findFirst({
      where: {
        OR: [{ id: idParam }, { leadCode: idParam }],
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Lead not found.' });
    }

    const {
      name,
      phone,
      email,
      propertyInterest,
      budget,
      stage,
      status,
      assignedTo,
      followUpDate,
      notes,
      source,
    } = req.body;

    let agentId = existing.assignedAgentId;
    if (assignedTo) {
      const foundAgent = await prisma.user.findFirst({
        where: { name: assignedTo },
      });
      if (foundAgent) agentId = foundAgent.id;
    }

    const updated = await prisma.lead.update({
      where: { id: existing.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(propertyInterest !== undefined && { propertyInterest }),
        ...(budget !== undefined && { budget }),
        ...(stage && { stage }),
        ...(status && { status }),
        ...(agentId !== undefined && { assignedAgentId: agentId }),
        ...(followUpDate !== undefined && { followUpDate }),
        ...(notes !== undefined && { notes }),
        ...(source !== undefined && { source }),
      },
      include: { assignedAgent: true },
    });

    return res.json({ success: true, data: formatLead(updated) });
  } catch (err) {
    console.error('Update lead error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update lead.' });
  }
});

// DELETE /api/v1/leads/:id (Admin only)
router.delete('/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
  try {
    const idParam = req.params.id;
    const existing = await prisma.lead.findFirst({
      where: {
        OR: [{ id: idParam }, { leadCode: idParam }],
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Lead not found.' });
    }

    await prisma.lead.delete({
      where: { id: existing.id },
    });

    return res.json({ success: true, message: 'Lead successfully deleted.' });
  } catch (err) {
    console.error('Delete lead error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete lead.' });
  }
});

// POST /api/v1/leads/bulk-delete (Admin only)
router.post('/bulk-delete', authenticateToken, requireRole('Admin'), async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Array of lead IDs is required.' });
    }

    await prisma.lead.deleteMany({
      where: {
        OR: [{ id: { in: ids } }, { leadCode: { in: ids } }],
      },
    });

    return res.json({ success: true, message: `${ids.length} leads successfully deleted.` });
  } catch (err) {
    console.error('Bulk delete leads error:', err);
    return res.status(500).json({ success: false, error: 'Failed to bulk delete leads.' });
  }
});

export default router;
