-- 1. Criar a Role "Admin" (Administrador do Sistema), caso não exista
INSERT INTO "roles" ("id", "name", "description")
SELECT gen_random_uuid(), 'Admin', 'Administrador do Sistema'
WHERE NOT EXISTS (
    SELECT 1 FROM "roles" WHERE "name" = 'Admin'
);

-- 2. Inserir as Permissões (usando UPSERT para evitar duplicidades pela chave)
INSERT INTO "permissions" ("id", "key", "name", "description")
VALUES 
    (gen_random_uuid(), 'core.user.create', 'Criar usuário', 'Criar usuário'),
    (gen_random_uuid(), 'core.user.view', 'Visualizar usuários', 'Visualizar usuários'),
    (gen_random_uuid(), 'core.user.update', 'Atualizar usuário', 'Atualizar usuário'),
    (gen_random_uuid(), 'core.user.delete', 'Deletar usuário', 'Deletar usuário'),
    (gen_random_uuid(), 'tenant.stores.view', 'Visualizar lojas do tenant', 'Visualizar lojas do tenant'),
    (gen_random_uuid(), 'tenant.products.view', 'Visualizar produtos do tenant', 'Visualizar produtos do tenant'),
    (gen_random_uuid(), 'tenant.products.create', 'Criar produtos do tenant', 'Criar produtos do tenant'),
    (gen_random_uuid(), 'tenant.products.update', 'Atualizar produtos do tenant', 'Atualizar produtos do tenant'),
    (gen_random_uuid(), 'tenant.products.delete', 'Deletar produtos do tenant', 'Deletar produtos do tenant'),
    (gen_random_uuid(), 'tenant.payment-methods.view', 'Visualizar meios de pagamento do tenant', 'Visualizar meios de pagamento do tenant'),
    (gen_random_uuid(), 'tenant.payment-methods.create', 'Criar meios de pagamento do tenant', 'Criar meios de pagamento do tenant'),
    (gen_random_uuid(), 'tenant.payment-methods.update', 'Atualizar meios de pagamento do tenant', 'Atualizar meios de pagamento do tenant'),
    (gen_random_uuid(), 'tenant.payment-methods.delete', 'Deletar meios de pagamento do tenant', 'Deletar meios de pagamento do tenant'),
    (gen_random_uuid(), 'tenant.orders.view', 'Visualizar pedidos do tenant', 'Visualizar pedidos do tenant'),
    (gen_random_uuid(), 'tenant.orders.create', 'Criar pedidos do tenant', 'Criar pedidos do tenant'),
    (gen_random_uuid(), 'tenant.orders.update', 'Atualizar pedidos do tenant', 'Atualizar pedidos do tenant'),
    (gen_random_uuid(), 'tenant.orders.delete', 'Deletar pedidos do tenant', 'Deletar pedidos do tenant'),
    (gen_random_uuid(), 'tenant.brands.view', 'Visualizar marcas do tenant', 'Visualizar marcas do tenant'),
    (gen_random_uuid(), 'tenant.brands.create', 'Criar marcas do tenant', 'Criar marcas do tenant'),
    (gen_random_uuid(), 'tenant.brands.update', 'Atualizar marcas do tenant', 'Atualizar marcas do tenant'),
    (gen_random_uuid(), 'tenant.brands.delete', 'Deletar marcas do tenant', 'Deletar marcas do tenant'),
    (gen_random_uuid(), 'tenant.groups.view', 'Visualizar grupos do tenant', 'Visualizar grupos do tenant'),
    (gen_random_uuid(), 'tenant.groups.create', 'Criar grupos do tenant', 'Criar grupos do tenant'),
    (gen_random_uuid(), 'tenant.groups.update', 'Atualizar grupos do tenant', 'Atualizar grupos do tenant'),
    (gen_random_uuid(), 'tenant.groups.delete', 'Deletar grupos do tenant', 'Deletar grupos do tenant'),
    (gen_random_uuid(), 'tenant.clients.create', 'Criar clientes do tenant', 'Criar clientes do tenant'),
    (gen_random_uuid(), 'tenant.clients.update', 'Atualizar clientes do tenant', 'Atualizar clientes do tenant'),
    (gen_random_uuid(), 'tenant.clients.delete', 'Deletar clientes do tenant', 'Deletar clientes do tenant'),
    (gen_random_uuid(), 'tenant.clients.view', 'Visualizar clientes do tenant', 'Visualizar clientes do tenant')
ON CONFLICT ("key") DO UPDATE 
SET "name" = EXCLUDED."name", 
    "description" = EXCLUDED."description";

-- 3. Associar todas as permissões listadas à Role "Admin"
INSERT INTO "role_permissions" ("roleId", "permissionId")
SELECT r."id", p."id"
FROM "roles" r
JOIN "permissions" p ON p."key" IN (
    'core.user.create',
    'core.user.view',
    'core.user.update',
    'core.user.delete',
    'tenant.stores.view',
    'tenant.products.view',
    'tenant.products.create',
    'tenant.products.update',
    'tenant.products.delete',
    'tenant.payment-methods.view',
    'tenant.payment-methods.create',
    'tenant.payment-methods.update',
    'tenant.payment-methods.delete',
    'tenant.orders.view',
    'tenant.orders.create',
    'tenant.orders.update',
    'tenant.orders.delete',
    'tenant.brands.view',
    'tenant.brands.create',
    'tenant.brands.update',
    'tenant.brands.delete',
    'tenant.groups.view',
    'tenant.groups.create',
    'tenant.groups.update',
    'tenant.groups.delete',
    'tenant.clients.view',
    'tenant.clients.create',
    'tenant.clients.update',
    'tenant.clients.delete'
)
WHERE r."name" = 'Admin'
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
