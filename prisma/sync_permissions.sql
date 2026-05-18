-- 1. Garantir que o Role Admin existe
-- No Postgres do Prisma, as colunas podem exigir aspas se tiverem CamelCase
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Admin') THEN
        INSERT INTO roles (id, name, description) 
        VALUES (gen_random_uuid(), 'Admin', 'Administrador do Sistema com acesso total');
    END IF;
END $$;

-- 2. Inserir todas as permissões do catálogo
-- Usando ON CONFLICT (key) que é @unique no Prisma
INSERT INTO permissions (id, key, name, description) VALUES
(gen_random_uuid(), 'core.user.create', 'Criar usuário/role', 'Criar usuário/role'),
(gen_random_uuid(), 'core.user.view', 'Visualizar usuários/roles', 'Visualizar usuários/roles'),
(gen_random_uuid(), 'core.user.update', 'Atualizar usuário/role', 'Atualizar usuário/role'),
(gen_random_uuid(), 'core.user.delete', 'Deletar usuário/role', 'Deletar usuário/role'),
(gen_random_uuid(), 'tenant.products.view', 'Visualizar produtos', 'Visualizar produtos do tenant'),
(gen_random_uuid(), 'tenant.products.create', 'Criar produtos', 'Criar produtos do tenant'),
(gen_random_uuid(), 'tenant.products.update', 'Atualizar produtos', 'Atualizar produtos do tenant'),
(gen_random_uuid(), 'tenant.products.delete', 'Deletar produtos', 'Deletar produtos do tenant'),
(gen_random_uuid(), 'tenant.payment-methods.view', 'Visualizar meios de pagamento', 'Visualizar meios de pagamento do tenant'),
(gen_random_uuid(), 'tenant.payment-methods.create', 'Criar meios de pagamento', 'Criar meios de pagamento do tenant'),
(gen_random_uuid(), 'tenant.payment-methods.update', 'Atualizar meios de pagamento', 'Atualizar meios de pagamento do tenant'),
(gen_random_uuid(), 'tenant.payment-methods.delete', 'Deletar meios de pagamento', 'Deletar meios de pagamento do tenant'),
(gen_random_uuid(), 'tenant.payment-plans.view', 'Visualizar planos de pagamento', 'Visualizar planos de pagamento do tenant'),
(gen_random_uuid(), 'tenant.payment-plans.create', 'Criar planos de pagamento', 'Criar planos de pagamento do tenant'),
(gen_random_uuid(), 'tenant.payment-plans.update', 'Atualizar planos de pagamento', 'Atualizar planos de pagamento do tenant'),
(gen_random_uuid(), 'tenant.payment-plans.delete', 'Deletar planos de pagamento', 'Deletar planos de pagamento do tenant'),
(gen_random_uuid(), 'tenant.orders.view', 'Visualizar pedidos', 'Visualizar pedidos do tenant'),
(gen_random_uuid(), 'tenant.orders.create', 'Criar pedidos', 'Criar pedidos do tenant'),
(gen_random_uuid(), 'tenant.orders.update', 'Atualizar pedidos', 'Atualizar pedidos do tenant'),
(gen_random_uuid(), 'tenant.orders.delete', 'Deletar pedidos', 'Deletar pedidos do tenant'),
(gen_random_uuid(), 'tenant.brands.view', 'Visualizar marcas', 'Visualizar marcas do tenant'),
(gen_random_uuid(), 'tenant.brands.create', 'Criar marcas', 'Criar marcas do tenant'),
(gen_random_uuid(), 'tenant.brands.update', 'Atualizar marcas', 'Atualizar marcas do tenant'),
(gen_random_uuid(), 'tenant.brands.delete', 'Deletar marcas', 'Deletar marcas do tenant'),
(gen_random_uuid(), 'tenant.groups.view', 'Visualizar grupos', 'Visualizar grupos do tenant'),
(gen_random_uuid(), 'tenant.groups.create', 'Criar grupos', 'Criar grupos do tenant'),
(gen_random_uuid(), 'tenant.groups.update', 'Atualizar grupos', 'Atualizar grupos do tenant'),
(gen_random_uuid(), 'tenant.groups.delete', 'Deletar grupos', 'Deletar grupos do tenant'),
(gen_random_uuid(), 'tenant.clients.view', 'Visualizar clientes', 'Visualizar clientes do tenant'),
(gen_random_uuid(), 'tenant.clients.create', 'Criar clientes', 'Criar clientes do tenant'),
(gen_random_uuid(), 'tenant.clients.update', 'Atualizar clientes', 'Atualizar clientes do tenant'),
(gen_random_uuid(), 'tenant.clients.delete', 'Deletar clientes', 'Deletar clientes do tenant'),
(gen_random_uuid(), 'tenant.account-receivable.view', 'Visualizar contas a receber', 'Visualizar contas a receber do tenant'),
(gen_random_uuid(), 'tenant.account-receivable.create', 'Criar contas a receber', 'Criar contas a receber do tenant'),
(gen_random_uuid(), 'tenant.account-receivable.update', 'Atualizar contas a receber', 'Atualizar contas a receber do tenant'),
(gen_random_uuid(), 'tenant.account-receivable.delete', 'Deletar contas a receber', 'Deletar contas a receber do tenant'),
(gen_random_uuid(), 'tenant.account-payable.view', 'Visualizar contas a pagar', 'Visualizar contas a pagar do tenant'),
(gen_random_uuid(), 'tenant.account-payable.create', 'Criar contas a pagar', 'Criar contas a pagar do tenant'),
(gen_random_uuid(), 'tenant.account-payable.update', 'Atualizar contas a pagar', 'Atualizar contas a pagar do tenant'),
(gen_random_uuid(), 'tenant.account-payable.delete', 'Deletar contas a pagar', 'Deletar contas a pagar do tenant'),
(gen_random_uuid(), 'integration-request.view', 'Visualizar solicitações', 'Visualizar solicitações de integração'),
(gen_random_uuid(), 'integration-request.create', 'Criar solicitações', 'Criar solicitações de integração'),
(gen_random_uuid(), 'integration-request.update', 'Atualizar solicitações', 'Atualizar solicitações de integração'),
(gen_random_uuid(), 'integration-request.delete', 'Deletar solicitações', 'Deletar solicitações de integração'),
(gen_random_uuid(), 'integration-request.approve', 'Aprovar solicitações', 'Aprovar solicitações de integração'),
(gen_random_uuid(), 'integration-request.reject', 'Recusar solicitações', 'Recusar solicitações de integração'),
(gen_random_uuid(), 'core.announcement.view', 'Visualizar avisos', 'Visualizar avisos'),
(gen_random_uuid(), 'core.announcement.create', 'Criar avisos', 'Criar avisos'),
(gen_random_uuid(), 'core.announcement.update', 'Atualizar avisos', 'Atualizar avisos'),
(gen_random_uuid(), 'core.announcement.delete', 'Deletar avisos', 'Deletar avisos'),
(gen_random_uuid(), 'tenant.employees.view', 'Visualizar funcionários', 'Visualizar funcionários do tenant'),
(gen_random_uuid(), 'tenant.employees.create', 'Criar funcionários', 'Criar funcionários do tenant'),
(gen_random_uuid(), 'tenant.employees.update', 'Atualizar funcionários', 'Atualizar funcionários do tenant'),
(gen_random_uuid(), 'tenant.employees.delete', 'Deletar funcionários', 'Deletar funcionários do tenant'),
(gen_random_uuid(), 'tenant.suppliers.view', 'Visualizar fornecedores', 'Visualizar fornecedores do tenant'),
(gen_random_uuid(), 'tenant.suppliers.create', 'Criar fornecedores', 'Criar fornecedores do tenant'),
(gen_random_uuid(), 'tenant.suppliers.update', 'Atualizar fornecedores', 'Atualizar fornecedores do tenant'),
(gen_random_uuid(), 'tenant.suppliers.delete', 'Deletar fornecedores', 'Deletar fornecedores do tenant'),
(gen_random_uuid(), 'tenant.service-providers.view', 'Visualizar prestadores', 'Visualizar prestadores do tenant'),
(gen_random_uuid(), 'tenant.service-providers.create', 'Criar prestadores', 'Criar prestadores do tenant'),
(gen_random_uuid(), 'tenant.service-providers.update', 'Atualizar prestadores', 'Atualizar prestadores do tenant'),
(gen_random_uuid(), 'tenant.service-providers.delete', 'Deletar prestadores', 'Deletar prestadores do tenant'),
(gen_random_uuid(), 'tenant.deliveries.view', 'Visualizar entregas', 'Visualizar entregas do tenant'),
(gen_random_uuid(), 'tenant.deliveries.create', 'Criar entregas', 'Criar entregas do tenant'),
(gen_random_uuid(), 'tenant.deliveries.update', 'Atualizar entregas', 'Atualizar entregas do tenant'),
(gen_random_uuid(), 'tenant.deliveries.delete', 'Deletar entregas', 'Deletar entregas do tenant')
ON CONFLICT (key) DO UPDATE SET 
    name = EXCLUDED.name, 
    description = EXCLUDED.description;

-- 3. Vincular todas as permissões ao role Admin
-- Importante: Usar aspas duplas nas colunas CamelCase do Prisma
DELETE FROM role_permissions WHERE "roleId" = (SELECT id FROM roles WHERE name = 'Admin' LIMIT 1);

INSERT INTO role_permissions ("roleId", "permissionId")
SELECT (SELECT id FROM roles WHERE name = 'Admin' LIMIT 1), id FROM permissions;
