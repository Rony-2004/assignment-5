const express = require('express');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const { ratingValidation } = require('../middleware/validation');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authMiddleware, ratingValidation, async (req, res) => {
  try {
    if (req.user.role !== 'USER') {
      return res.status(403).json({ error: 'Only normal users can submit ratings' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { storeId, value } = req.body;
    const userId = req.user.id;

    const store = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId
        }
      }
    });

    let rating;
    if (existingRating) {
      rating = await prisma.rating.update({
        where: {
          userId_storeId: {
            userId,
            storeId
          }
        },
        data: { value },
        include: {
          store: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              name: true
            }
          }
        }
      });
    } else {
      rating = await prisma.rating.create({
        data: {
          value,
          userId,
          storeId
        },
        include: {
          store: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              name: true
            }
          }
        }
      });
    }

    res.status(existingRating ? 200 : 201).json({
      message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
      rating
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const ratings = await prisma.rating.findMany({
      where: { userId: parseInt(userId) },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ ratings });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/store/:storeId', authMiddleware, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const store = await prisma.store.findUnique({
      where: { id: parseInt(storeId) }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (req.user.role === 'OWNER' && store.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You can only view ratings for your own store.' });
    }

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { storeId: parseInt(storeId) },
        skip,
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.rating.count({ where: { storeId: parseInt(storeId) } })
    ]);

    const averageRating = ratings.length > 0 
      ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2)
      : 0;

    res.json({
      ratings,
      averageRating: parseFloat(averageRating),
      totalRatings: total,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const rating = await prisma.rating.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        store: true
      }
    });

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    if (req.user.role !== 'ADMIN' && req.user.id !== rating.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.rating.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
