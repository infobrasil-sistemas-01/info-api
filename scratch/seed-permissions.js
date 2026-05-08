const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🔐 Seeding announcement permissions...');

  const permissions = [
    { key: 'core.announcement.view', name: 'Visualizar Avisos', description: 'Permite ver a lista de avisos no admin' },
    { key: 'core.announcement.create', name: 'Criar Avisos', description: 'Permite criar novos avisos para os clientes' },
    { key: 'core.announcement.update', name: 'Editar Avisos', description: 'Permite editar avisos existentes' },
    { key: 'core.announcement.delete', name: 'Excluir Avisos', description: 'Permite remover avisos do sistema' },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: { name: p.name, description: p.description },
      create: p,
    });
  }

  console.log('✅ Permissions seeded!');
  
  await prisma.$disconnect();
  await pool.end();
}

main();
