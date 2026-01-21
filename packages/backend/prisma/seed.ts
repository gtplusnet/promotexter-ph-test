import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const users = [
    {
      fullName: 'Juan Dela Cruz',
      email: 'juan.delacruz@email.com',
      contactNumber: '+63 917 123 4567',
      gender: 'male',
    },
    {
      fullName: 'Maria Santos',
      email: 'maria.santos@email.com',
      contactNumber: '+63 918 234 5678',
      gender: 'female',
    },
    {
      fullName: 'Carlos Reyes',
      email: 'carlos.reyes@email.com',
      contactNumber: '+63 919 345 6789',
      gender: 'male',
    },
    {
      fullName: 'Ana Garcia',
      email: 'ana.garcia@email.com',
      contactNumber: '+63 920 456 7890',
      gender: 'female',
    },
    {
      fullName: 'Miguel Torres',
      email: 'miguel.torres@email.com',
      contactNumber: '+63 921 567 8901',
      gender: 'male',
    },
  ];

  console.log('Seeding database...');

  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(`Created user: ${createdUser.fullName} (${createdUser.email})`);
  }

  console.log('Seeded 5 users successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
