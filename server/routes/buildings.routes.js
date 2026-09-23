import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/buildings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { projectId, search } = req.query;
    const where = {};

    if (projectId) {
      where.projectId = String(projectId);
    }

    if (search) {
      where.name = { contains: String(search) };
    }

    const buildings = await prisma.building.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true, code: true },
        },
        _count: {
          select: { units: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: buildings,
      total: buildings.length,
    });
  } catch (err) {
    console.error('Fetch buildings error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch buildings.' });
  }
});

// GET /api/v1/buildings/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const building = await prisma.building.findUnique({
      where: { id: req.params.id },
      include: {
        project: true,
        units: true,
      },
    });

    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found.' });
    }

    return res.json({ success: true, data: building });
  } catch (err) {
    console.error('Fetch building detail error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch building.' });
  }
});

// POST /api/v1/buildings
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { projectId, name, totalFloors, totalUnits } = req.body;

    if (!projectId || !name) {
      return res.status(400).json({
        success: false,
        error: 'Project ID and Building name are required.',
      });
    }

    const newBuilding = await prisma.building.create({
      data: {
        projectId,
        name,
        totalFloors: totalFloors ? parseInt(totalFloors, 10) : 1,
        totalUnits: totalUnits ? parseInt(totalUnits, 10) : 0,
      },
    });

    return res.status(201).json({ success: true, data: newBuilding });
  } catch (err) {
    console.error('Create building error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create building.' });
  }
});

// PUT /api/v1/buildings/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, totalFloors, totalUnits } = req.body;

    const updated = await prisma.building.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(totalFloors !== undefined && { totalFloors: parseInt(totalFloors, 10) }),
        ...(totalUnits !== undefined && { totalUnits: parseInt(totalUnits, 10) }),
      },
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update building error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update building.' });
  }
});

// DELETE /api/v1/buildings/:id (Admin only)
router.delete('/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
  try {
    await prisma.building.delete({
      where: { id: req.params.id },
    });

    return res.json({ success: true, message: 'Building successfully deleted.' });
  } catch (err) {
    console.error('Delete building error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete building.' });
  }
});

export default router;
