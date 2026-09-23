import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Helper to transform normalized unit to frontend property format
function formatUnitAsProperty(unit) {
  return {
    id: unit.unitCode, // Preserves 'PR-201' format for frontend table
    dbId: unit.id,
    unitCode: unit.unitCode,
    name: unit.name,
    type: unit.unitType,
    location: unit.location,
    price: `$${unit.price.toLocaleString()}`,
    priceRaw: unit.price,
    status: unit.status,
    assignedAgent: unit.assignedAgent ? unit.assignedAgent.name : 'Sarah Jenkins',
    assignedAgentId: unit.assignedAgentId,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    areaSqFt: unit.areaSqFt,
    listedDate: unit.listedDate,
    description: unit.description || '',
    projectName: unit.project ? unit.project.name : null,
    buildingName: unit.building ? unit.building.name : null,
  };
}

// GET /api/v1/properties
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, type, status, agent } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { location: { contains: String(search) } },
        { unitCode: { contains: String(search) } },
        { unitType: { contains: String(search) } },
      ];
    }

    if (type) {
      where.unitType = String(type);
    }

    if (status) {
      where.status = String(status);
    }

    if (agent) {
      where.assignedAgent = { name: String(agent) };
    }

    const units = await prisma.unit.findMany({
      where,
      include: {
        assignedAgent: true,
        project: true,
        building: true,
      },
      orderBy: { unitCode: 'asc' },
    });

    const properties = units.map(formatUnitAsProperty);

    return res.json({
      success: true,
      data: properties,
      total: properties.length,
    });
  } catch (err) {
    console.error('Fetch properties error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch properties.' });
  }
});

// GET /api/v1/properties/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const idParam = req.params.id;
    const unit = await prisma.unit.findFirst({
      where: {
        OR: [{ id: idParam }, { unitCode: idParam }],
      },
      include: {
        assignedAgent: true,
        project: true,
        building: true,
      },
    });

    if (!unit) {
      return res.status(404).json({ success: false, error: 'Property not found.' });
    }

    return res.json({ success: true, data: formatUnitAsProperty(unit) });
  } catch (err) {
    console.error('Fetch property detail error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch property.' });
  }
});

// POST /api/v1/properties
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      price,
      status,
      assignedAgent,
      bedrooms,
      bathrooms,
      areaSqFt,
      listedDate,
      description,
    } = req.body;

    if (!name || !location || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Property name, location, and price are required.',
      });
    }

    // Lookup agent by name if supplied
    let agentId = null;
    if (assignedAgent) {
      const foundAgent = await prisma.user.findFirst({
        where: { name: assignedAgent },
      });
      if (foundAgent) agentId = foundAgent.id;
    }

    const rawPrice = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
    const unitCode = `PR-${Math.floor(200 + Math.random() * 800)}`;

    const created = await prisma.unit.create({
      data: {
        unitCode,
        name,
        unitType: type || 'Apartment',
        location,
        price: rawPrice,
        status: status || 'Active',
        assignedAgentId: agentId,
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : 0,
        bathrooms: bathrooms ? parseInt(bathrooms, 10) : 0,
        areaSqFt: areaSqFt ? parseInt(areaSqFt, 10) : 0,
        listedDate: listedDate || new Date().toISOString().split('T')[0],
        description: description || '',
      },
      include: {
        assignedAgent: true,
        project: true,
        building: true,
      },
    });

    return res.status(201).json({ success: true, data: formatUnitAsProperty(created) });
  } catch (err) {
    console.error('Create property error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create property listing.' });
  }
});

// PUT /api/v1/properties/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const idParam = req.params.id;
    const existing = await prisma.unit.findFirst({
      where: {
        OR: [{ id: idParam }, { unitCode: idParam }],
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Property not found.' });
    }

    const {
      name,
      type,
      location,
      price,
      status,
      assignedAgent,
      bedrooms,
      bathrooms,
      areaSqFt,
      listedDate,
      description,
    } = req.body;

    let agentId = existing.assignedAgentId;
    if (assignedAgent) {
      const foundAgent = await prisma.user.findFirst({
        where: { name: assignedAgent },
      });
      if (foundAgent) agentId = foundAgent.id;
    }

    const rawPrice = price !== undefined
      ? (typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0)
      : undefined;

    const updated = await prisma.unit.update({
      where: { id: existing.id },
      data: {
        ...(name && { name }),
        ...(type && { unitType: type }),
        ...(location && { location }),
        ...(rawPrice !== undefined && { price: rawPrice }),
        ...(status && { status }),
        ...(agentId !== undefined && { assignedAgentId: agentId }),
        ...(bedrooms !== undefined && { bedrooms: parseInt(bedrooms, 10) }),
        ...(bathrooms !== undefined && { bathrooms: parseInt(bathrooms, 10) }),
        ...(areaSqFt !== undefined && { areaSqFt: parseInt(areaSqFt, 10) }),
        ...(listedDate && { listedDate }),
        ...(description !== undefined && { description }),
      },
      include: {
        assignedAgent: true,
        project: true,
        building: true,
      },
    });

    return res.json({ success: true, data: formatUnitAsProperty(updated) });
  } catch (err) {
    console.error('Update property error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update property.' });
  }
});

// DELETE /api/v1/properties/:id (Admin only)
router.delete('/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
  try {
    const idParam = req.params.id;
    const existing = await prisma.unit.findFirst({
      where: {
        OR: [{ id: idParam }, { unitCode: idParam }],
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Property not found.' });
    }

    await prisma.unit.delete({
      where: { id: existing.id },
    });

    return res.json({ success: true, message: 'Property successfully deleted.' });
  } catch (err) {
    console.error('Delete property error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete property.' });
  }
});

// POST /api/v1/properties/bulk-delete (Admin only)
router.post('/bulk-delete', authenticateToken, requireRole('Admin'), async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Array of property IDs is required.' });
    }

    await prisma.unit.deleteMany({
      where: {
        OR: [{ id: { in: ids } }, { unitCode: { in: ids } }],
      },
    });

    return res.json({ success: true, message: `${ids.length} properties successfully deleted.` });
  } catch (err) {
    console.error('Bulk delete properties error:', err);
    return res.status(500).json({ success: false, error: 'Failed to bulk delete properties.' });
  }
});

export default router;
