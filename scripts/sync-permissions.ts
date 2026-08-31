import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';
import { PERMISSIONS } from '../src/infra/rbac/catalog/permissions.catalog';
import { PrismaClient } from '../src/generated/prisma';

let connectionString = process.env.DATABASE_URL || '';
// Se estiver rodando fora do container Docker e apontando para @postgres:5432
if (connectionString.includes('@postgres:5432')) {
  connectionString = connectionString.replace('@postgres:5432', '@localhost:5433');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Sincronizando permissões do catálogo com o banco de dados...');

  // 1. Garantir que a Role Admin existe
  let adminRole = await prisma.role.findFirst({ where: { name: 'Admin' } });
  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: {
        name: 'Admin',
        description: 'Administrador do Sistema com acesso total',
      },
    });
    console.log('✅ Role "Admin" criada.');
  } else {
    console.log('ℹ️  Role "Admin" encontrada:', adminRole.id);
  }

  // 2. Sincronizar permissões do catálogo
  let insertedCount = 0;
  let updatedCount = 0;

  for (const perm of PERMISSIONS) {
    const existing = await prisma.permission.findUnique({
      where: { key: perm.key },
    });

    if (!existing) {
      await prisma.permission.create({
        data: {
          key: perm.key,
          name: perm.descricao.slice(0, 50),
          description: perm.descricao,
        },
      });
      insertedCount++;
    } else if (existing.description !== perm.descricao) {
      await prisma.permission.update({
        where: { key: perm.key },
        data: {
          name: perm.descricao.slice(0, 50),
          description: perm.descricao,
        },
      });
      updatedCount++;
    }
  }

  console.log(
    `✅ Catálogo sincronizado: ${insertedCount} novas permissões criadas, ${updatedCount} atualizadas (Total no catálogo: ${PERMISSIONS.length}).`,
  );

  // 3. Vincular todas as permissões cadastradas no banco ao Role Admin
  const allPermissions = await prisma.permission.findMany();

  // Limpa permissões antigas do Admin e reatribui todas
  await prisma.rolePermission.deleteMany({
    where: { roleId: adminRole.id },
  });

  await prisma.rolePermission.createMany({
    data: allPermissions.map((p) => ({
      roleId: adminRole.id,
      permissionId: p.id,
    })),
    skipDuplicates: true,
  });

  console.log(
    `🚀 Sucesso! ${allPermissions.length} permissões vinculadas ao perfil "Admin".`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Erro ao sincronizar permissões:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
