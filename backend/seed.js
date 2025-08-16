const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('Admin@1234', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@storerating.com' },
    update: {},
    create: {
      name: 'System Administrator User',
      email: 'admin@storerating.com',
      password: hashedPassword,
      address: '123 Admin Street, Admin City, Admin State 12345',
      role: 'ADMIN'
    }
  });

  // Create store owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@storerating.com' },
    update: {},
    create: {
      name: 'Store Owner Business Manager',
      email: 'owner@storerating.com',
      password: hashedPassword,
      address: '456 Business Avenue, Business City, Business State 67890',
      role: 'OWNER'
    }
  });

  // Create normal user
  const user = await prisma.user.upsert({
    where: { email: 'user@storerating.com' },
    update: {},
    create: {
      name: 'Regular User Customer Person',
      email: 'user@storerating.com',
      password: hashedPassword,
      address: '789 Customer Lane, Customer City, Customer State 13579',
      role: 'USER'
    }
  });

  // Create sample stores
  const store1 = await prisma.store.upsert({
    where: { email: 'info@amazingstore.com' },
    update: {},
    create: {
      name: 'Amazing Electronics Store and More',
      email: 'info@amazingstore.com',
      address: '100 Electronics Boulevard, Tech City, Tech State 11111',
      ownerId: owner.id
    }
  });

  const store2 = await prisma.store.upsert({
    where: { email: 'contact@supermarket.com' },
    update: {},
    create: {
      name: 'Super Fresh Grocery Market Chain',
      email: 'contact@supermarket.com',
      address: '200 Fresh Food Street, Grocery Town, Food State 22222',
      ownerId: owner.id
    }
  });

  // Create sample ratings
  await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: user.id,
        storeId: store1.id
      }
    },
    update: {},
    create: {
      value: 5,
      userId: user.id,
      storeId: store1.id
    }
  });

  await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: user.id,
        storeId: store2.id
      }
    },
    update: {},
    create: {
      value: 4,
      userId: user.id,
      storeId: store2.id
    }
  });

  console.log('Database seeded successfully!');
  console.log('Login credentials:');
  console.log('Admin: admin@storerating.com / Admin@1234');
  console.log('Owner: owner@storerating.com / Admin@1234');
  console.log('User: user@storerating.com / Admin@1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
