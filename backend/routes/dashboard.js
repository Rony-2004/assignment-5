const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminOnly, ownerOnly, adminOrOwner } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/admin', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [userCount, storeCount, ratingCount] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count()
    ]);

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const recentStores = await prisma.store.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            name: true
          }
        },
        ratings: {
          select: {
            value: true
          }
        }
      }
    });

    const storesWithRatings = recentStores.map(store => {
      const averageRating = store.ratings.length > 0 
        ? (store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length).toFixed(2)
        : 0;
      
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        owner: store.owner.name,
        averageRating: parseFloat(averageRating),
        totalRatings: store.ratings.length,
        createdAt: store.createdAt
      };
    });

    const recentRatings = await prisma.rating.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        store: {
          select: {
            name: true
          }
        }
      }
    });

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    });

    const topRatedStores = await prisma.store.findMany({
      include: {
        ratings: {
          select: {
            value: true
          }
        },
        owner: {
          select: {
            name: true
          }
        }
      }
    });

    const topStores = topRatedStores
      .map(store => {
        const averageRating = store.ratings.length > 0 
          ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
          : 0;
        
        return {
          id: store.id,
          name: store.name,
          owner: store.owner.name,
          averageRating: parseFloat(averageRating.toFixed(2)),
          totalRatings: store.ratings.length
        };
      })
      .filter(store => store.totalRatings > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    res.json({
      stats: {
        totalUsers: userCount,
        totalStores: storeCount,
        totalRatings: ratingCount
      },
      recentUsers,
      recentStores: storesWithRatings,
      recentRatings,
      usersByRole,
      topRatedStores: topStores
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/owner', authMiddleware, ownerOnly, async (req, res) => {
  try {
    const ownerId = req.user.id;

    const stores = await prisma.store.findMany({
      where: { ownerId },
      include: {
        ratings: {
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
        }
      }
    });

    const dashboardData = stores.map(store => {
      const averageRating = store.ratings.length > 0 
        ? (store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length).toFixed(2)
        : 0;

      const ratingDistribution = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      };

      store.ratings.forEach(rating => {
        ratingDistribution[rating.value]++;
      });

      const recentRatings = store.ratings.slice(0, 10);

      return {
        store: {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address
        },
        averageRating: parseFloat(averageRating),
        totalRatings: store.ratings.length,
        ratingDistribution,
        recentRatings: recentRatings.map(rating => ({
          id: rating.id,
          value: rating.value,
          user: rating.user,
          createdAt: rating.createdAt
        }))
      };
    });

    const totalRatings = dashboardData.reduce((sum, data) => sum + data.totalRatings, 0);
    const overallAverage = dashboardData.length > 0 
      ? (dashboardData.reduce((sum, data) => sum + (data.averageRating * data.totalRatings), 0) / totalRatings).toFixed(2)
      : 0;

    res.json({
      stores: dashboardData,
      summary: {
        totalStores: stores.length,
        totalRatings,
        overallAverageRating: parseFloat(overallAverage)
      }
    });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
