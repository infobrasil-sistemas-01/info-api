import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as argon2 from 'argon2';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Restoring development seed data...');

  // 1. Ensure Plans
  const plans = [
    { name: 'Free', reqMin: 30, reqMonth: 10000, maxPageSize: 100, maxDateRangeDays: 7 },
    { name: 'Profissional', reqMin: 120, reqMonth: 300000, maxPageSize: 500, maxDateRangeDays: 31 },
    { name: 'Enterprise', reqMin: 300, reqMonth: 1500000, maxPageSize: 1000, maxDateRangeDays: 92 },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }
  console.log('✅ Seeding Plans completed.');

  // 2. Ensure Admin Role
  let adminRole = await prisma.role.findFirst({ where: { name: 'Admin' } });
  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: {
        name: 'Admin',
        description: 'Administrador do Sistema com acesso total',
      },
    });
  }
  console.log('✅ Role Admin: ' + adminRole.id);

  // 3. Ensure Default DbCredentials
  let defaultDb = await prisma.dbCredentials.findFirst();
  if (!defaultDb) {
    defaultDb = await prisma.dbCredentials.create({
      data: {
        host: 'dbmobile.iprojectti.com.br',
        port: 3052,
        database: 'mobile',
        user: 'SYSDBA',
        dbId: 131,
      },
    });
  }
  console.log('✅ Default DbCredentials: ' + defaultDb.id);

  // 4. Hash passwords and create default admin users
  const passwordHash = await argon2.hash('admin');

  const usersToCreate = [
    {
      user: 'admin',
      email: 'admin@infobrasilsistemas.com.br',
      passwordHash,
      status: true,
      storeId: 104,
      roleId: adminRole.id,
      planId: (await prisma.plan.findUnique({ where: { name: 'Enterprise' } }))?.id,
      dbCredentialsId: defaultDb.id,
    },
    {
      user: 'gabriel',
      email: 'gabriel.bezerra@infobrasilsistemas.com.br',
      passwordHash,
      status: true,
      storeId: 104,
      roleId: adminRole.id,
      planId: (await prisma.plan.findUnique({ where: { name: 'Enterprise' } }))?.id,
      dbCredentialsId: defaultDb.id,
    }
  ];

  for (const u of usersToCreate) {
    await prisma.user.upsert({
      where: { user: u.user },
      update: {
        email: u.email,
        passwordHash: u.passwordHash,
        status: u.status,
        storeId: u.storeId,
        roleId: u.roleId,
        planId: u.planId,
        dbCredentialsId: u.dbCredentialsId,
      },
      create: u,
    });
    console.log(`✅ Default User "${u.user}" upserted successfully (Password is "admin").`);
  }

  console.log('✨ All development data restored perfectly!');
}

main()
  .catch((e) => {
    console.error('❌ Error restoring database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
