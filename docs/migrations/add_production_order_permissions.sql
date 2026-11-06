-- ==============================================================================
-- Script de Migração / Sincronização de Permissões: Ordens de Produção
-- Permissões: tenant.production-orders.view, create, update, delete
-- ==============================================================================

-- 1. Inserir ou atualizar as Permissões no catálogo ("permissions")
INSERT INTO "permissions" ("id", "key", "name", "description")
VALUES 
    (gen_random_uuid(), 'tenant.production-orders.view', 'Visualizar ordens de produção do tenant', 'Visualizar ordens de produção do tenant'),
    (gen_random_uuid(), 'tenant.production-orders.create', 'Criar ordens de produção do tenant', 'Criar ordens de produção do tenant'),
    (gen_random_uuid(), 'tenant.production-orders.update', 'Atualizar ordens de produção do tenant', 'Atualizar ordens de produção do tenant'),
    (gen_random_uuid(), 'tenant.production-orders.delete', 'Deletar ordens de produção do tenant', 'Deletar ordens de produção do tenant')
ON CONFLICT ("key") DO UPDATE 
SET "name" = EXCLUDED."name", 
    "description" = EXCLUDED."description";

-- 2. Associar as novas permissões à Role "Admin" (Administrador do Sistema)
INSERT INTO "role_permissions" ("roleId", "permissionId")
SELECT r."id", p."id"
FROM "roles" r
JOIN "permissions" p ON p."key" IN (
    'tenant.production-orders.view',
    'tenant.production-orders.create',
    'tenant.production-orders.update',
    'tenant.production-orders.delete'
)
WHERE r."name" = 'Admin'
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
