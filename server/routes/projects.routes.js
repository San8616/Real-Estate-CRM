import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, type, city } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { location: { contains: String(search) } },
        { code: { contains: String(search) } },
      ];
    }

    if (type) {
      where.projectType = String(type);
    }

    if (city) {
      where.city = String(city);
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        buildings: {
          select: { id: true, name: true, totalUnits: true },
        },
        _count: {
          select: { units: true, buildings: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: projects,
      total: projects.length,
    });
  } catch (err) {
    console.error('Fetch projects error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch projects.' });
  }
});

// GET /api/v1/projects/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        buildings: true,
        units: true,
      },
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }

    return res.json({ success: true, data: project });
  } catch (err) {
    console.error('Fetch project detail error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch project.' });
  }
});

// POST /api/v1/projects
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, code, projectType, location, city, state, description } = req.body;

    if (!name || !code || !location) {
      return res.status(400).json({
        success: false,
        error: 'Name, code, and location are required.',
      });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        code,
        projectType: projectType || 'Residential',
        location,
        city: city || '',
        state: state || '',
        description: description || '',
      },
    });

    return res.status(201).json({ success: true, data: newProject });
  } catch (err) {
    console.error('Create project error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create project.' });
  }
});

// PUT /api/v1/projects/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, code, projectType, location, city, state, description } = req.body;

    const updated = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(projectType && { projectType }),
        ...(location && { location }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(description !== undefined && { description }),
      },
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update project error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update project.' });
  }
});

// DELETE /api/v1/projects/:id (Admin only)
router.delete('/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });

    return res.json({ success: true, message: 'Project successfully deleted.' });
  } catch (err) {
    console.error('Delete project error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete project.' });
  }
});

export default router;
