import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/password';

const prisma = new PrismaClient();

export async function main() {
  const adminEmail = 'admin@saferoad.local';
  
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log(`[Seed] User with email '${adminEmail}' already exists (Role: ${existingUser.role}). Skipping creation.`);
    return;
  }

  const hashedPassword = await hashPassword('Admin@12345');
  const admin = await prisma.user.create({
    data: {
      fullName: 'SafeRoad Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`[Seed] Created development Admin account: ${admin.email} (Role: ${admin.role})`);
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error('[Seed] Error running seed script:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
