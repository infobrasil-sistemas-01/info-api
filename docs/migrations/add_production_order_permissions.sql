-- ==============================================================================
-- Script de Migração / Sincronização de Permissões: Ordens de Produção
-- Permissões: tenant.production-orders.view, create, update, delete
-- ==============================================================================

-- 1. Inserir permissões no catálogo de permissions (PostgreSQL)
INSERT INTO permissions (id, key, name, description, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(),
    'tenant.production-orders.view',
    'Visualizar ordens de produção do tenant',
    'Visualizar ordens de produção do tenant',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'tenant.production-orders.create',
    'Criar ordens de produção do tenant',
    'Criar ordens de produção do tenant',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'tenant.production-orders.update',
    'Atualizar ordens de produção do tenant',
    'Atualizar ordens de produção do tenant',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'tenant.production-orders.delete',
    'Deletar ordens de produção do tenant',
    'Deletar ordens de produção do tenant',
    NOW(),
    NOW()
  )
ON CONFLICT (key) DO UPDATE 
SET 
  description = EXCLUDED.description,
  updated_at = NOW();

-- 2. Associar automaticamente todas as permissões de ordens de produção ao perfil 'Admin'
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Admin' 
  AND p.key LIKE 'tenant.production-orders.%'
ON CONFLICT DO NOTHING;

