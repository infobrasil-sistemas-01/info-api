const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔐 Seeding announcement permissions (JS version)...');

  const permissions = [
    { key: 'core.announcement.view', name: 'Visualizar Avisos', description: 'Permite ver a lista de avisos no admin' },
    { key: 'core.announcement.create', name: 'Criar Avisos', description: 'Permite criar novos avisos para os clientes' },
    { key: 'core.announcement.update', name: 'Editar Avisos', description: 'Permite editar avisos existentes' },
    { key: 'core.announcement.delete', name: 'Excluir Avisos', description: 'Permite remover avisos do sistema' },
  ];

  // 1. Upsert permissions
  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: { name: p.name, description: p.description },
      create: p,
    });
  }

  // 2. Assign to Admin role
  const adminRole = await prisma.role.findFirst({
    where: { name: 'Admin' },
  });

  if (adminRole) {
    console.log('👥 Assigning permissions to Admin role...');
    const allAnnPermissions = await prisma.permission.findMany({
      where: { key: { startsWith: 'core.announcement.' } },
    });

    for (const p of allAnnPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: p.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: p.id,
        },
      });
    }
    console.log('✅ Permissions assigned to Admin!');
  } else {
    console.warn('⚠️ Admin role not found. Skipping assignment.');
  }

  console.log('✨ Announcement seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
