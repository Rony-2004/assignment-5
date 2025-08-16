const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { userValidation } = require('../middleware/validation');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', name, email, address, role } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orderBy = { [sortBy]: sortOrder };
    
    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          role: true,
          createdAt: true,
          stores: {
            select: {
              id: true,
              name: true,
              ratings: {
                select: {
                  value: true
                }
              }
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    const usersWithRatings = users.map(user => {
      const userObj = { ...user };
      if (user.role === 'OWNER' && user.stores.length > 0) {
        const allRatings = user.stores.flatMap(store => store.ratings);
        const averageRating = allRatings.length > 0 
          ? (allRatings.reduce((sum, r) => sum + r.value, 0) / allRatings.length).toFixed(2)
          : null;
        userObj.averageRating = averageRating;
      }
      delete userObj.stores;
      return userObj;
    });

    res.json({
      users: usersWithRatings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        stores: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: {
                value: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userResponse = { ...user };
    if (user.role === 'OWNER' && user.stores.length > 0) {
      const allRatings = user.stores.flatMap(store => store.ratings);
      const averageRating = allRatings.length > 0 
        ? (allRatings.reduce((sum, r) => sum + r.value, 0) / allRatings.length).toFixed(2)
        : null;
      userResponse.averageRating = averageRating;
    }
    delete userResponse.stores;

    res.json(userResponse);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, adminOnly, userValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, adminOnly, userValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const emailExists = await prisma.user.findFirst({
      where: {
        email,
        id: { not: parseInt(id) }
      }
    });

    if (emailExists) {
      return res.status(400).json({ error: 'Email is already taken by another user' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, address, role },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
