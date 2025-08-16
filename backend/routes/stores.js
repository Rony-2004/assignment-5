const express = require('express');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { storeValidation } = require('../middleware/validation');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', name, address } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orderBy = { [sortBy]: sortOrder };
    
    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          owner: {
            select: {
              name: true,
              email: true
            }
          },
          ratings: {
            select: {
              value: true,
              userId: true,
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }),
      prisma.store.count({ where })
    ]);

    const storesWithRatings = stores.map(store => {
      const averageRating = store.ratings.length > 0 
        ? (store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length).toFixed(2)
        : 0;
      
      const userRating = req.user.role === 'USER' 
        ? store.ratings.find(r => r.userId === req.user.id)?.value || null
        : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        averageRating: parseFloat(averageRating),
        totalRatings: store.ratings.length,
        userRating,
        createdAt: store.createdAt
      };
    });

    res.json({
      stores: storesWithRatings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const store = await prisma.store.findUnique({
      where: { id: parseInt(id) },
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        },
        ratings: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const averageRating = store.ratings.length > 0 
      ? (store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length).toFixed(2)
      : 0;

    const userRating = req.user.role === 'USER' 
      ? store.ratings.find(r => r.userId === req.user.id)?.value || null
      : null;

    const storeResponse = {
      ...store,
      averageRating: parseFloat(averageRating),
      totalRatings: store.ratings.length,
      userRating
    };

    res.json(storeResponse);
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, adminOnly, storeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, ownerId } = req.body;

    const existingStore = await prisma.store.findUnique({
      where: { email }
    });

    if (existingStore) {
      return res.status(400).json({ error: 'Store with this email already exists' });
    }

    const owner = await prisma.user.findUnique({
      where: { id: ownerId }
    });

    if (!owner || owner.role !== 'OWNER') {
      return res.status(400).json({ error: 'Invalid owner ID or user is not a store owner' });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, adminOnly, storeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, address, ownerId } = req.body;

    const existingStore = await prisma.store.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingStore) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const emailExists = await prisma.store.findFirst({
      where: {
        email,
        id: { not: parseInt(id) }
      }
    });

    if (emailExists) {
      return res.status(400).json({ error: 'Email is already taken by another store' });
    }

    if (ownerId) {
      const owner = await prisma.user.findUnique({
        where: { id: ownerId }
      });

      if (!owner || owner.role !== 'OWNER') {
        return res.status(400).json({ error: 'Invalid owner ID or user is not a store owner' });
      }
    }

    const updatedStore = await prisma.store.update({
      where: { id: parseInt(id) },
      data: { name, email, address, ...(ownerId && { ownerId }) },
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Store updated successfully',
      store: updatedStore
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id: parseInt(id) }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    await prisma.store.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
