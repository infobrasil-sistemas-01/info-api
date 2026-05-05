import { SystemModuleKey } from 'src/modules/registry/system-modules/registry-system-modules.catalog';

export type PermissionDefinition = {
  key: string;
  descricao: string;
  module: SystemModuleKey;
};

export const PERMISSIONS = [
  // ========= USUÁRIOS E ROLES =========
  {
    key: 'core.user.create',
    descricao: 'Criar usuário/role',
    module: 'core',
  },
  {
    key: 'core.user.view',
    descricao: 'Visualizar usuários/roles',
    module: 'core',
  },
  {
    key: 'core.user.update',
    descricao: 'Atualizar usuário/role',
    module: 'core',
  },
  {
    key: 'core.user.delete',
    descricao: 'Deletar usuário/role',
    module: 'core',
  },
  // ========= TENANT =========
  {
    key: 'tenant.products.view',
    descricao: 'Visualizar produtos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.products.create',
    descricao: 'Criar produtos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.products.update',
    descricao: 'Atualizar produtos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.products.delete',
    descricao: 'Deletar produtos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.payment-methods.view',
    descricao: 'Visualizar meios de pagamento do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.payment-methods.create',
    descricao: 'Criar meios de pagamento do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.payment-methods.update',
    descricao: 'Atualizar meios de pagamento do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.payment-methods.delete',
    descricao: 'Deletar meios de pagamento do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.orders.view',
    descricao: 'Visualizar pedidos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.orders.create',
    descricao: 'Criar pedidos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.orders.update',
    descricao: 'Atualizar pedidos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.orders.delete',
    descricao: 'Deletar pedidos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.brands.view',
    descricao: 'Visualizar marcas do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.brands.create',
    descricao: 'Criar marcas do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.brands.update',
    descricao: 'Atualizar marcas do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.brands.delete',
    descricao: 'Deletar marcas do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.groups.view',
    descricao: 'Visualizar grupos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.groups.create',
    descricao: 'Criar grupos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.groups.update',
    descricao: 'Atualizar grupos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.groups.delete',
    descricao: 'Deletar grupos do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.clients.create',
    descricao: 'Criar clientes do tenant',
    module: 'tenant'
  },
  {
    key: 'tenant.clients.update',
    descricao: 'Atualizar clientes do tenant',
    module: 'tenant'
  },
  {
    key: 'tenant.clients.delete',
    descricao: 'Deletar clientes do tenant',
    module: 'tenant'
  },
  {
    key: 'tenant.clients.view',
    descricao: 'Visualizar clientes do tenant',
    module: 'tenant'
  },
  {
    key: 'tenant.account-receivable.view',
    descricao: 'Visualizar contas a receber do tenant',
    module: 'tenant'
  },
  {
    key: 'tenant.account-receivable.create',
    descricao: 'Criar contas a receber do tenant',
    module: 'tenant'
  },
  {
    key: 'tenant.account-receivable.update',
    descricao: 'Atualizar contas a receber do tenant',
    module: 'tenant'
  },
  {
    key: 'tenant.account-receivable.delete',
    descricao: 'Deletar contas a receber do tenant',
    module: 'tenant'
  },

  // ========= SOLICITAÇÕES =========
  {
    key: 'integration-request.view',
    descricao: 'Visualizar solicitações de integração',
    module: 'integration-request'
  },
  {
    key: 'integration-request.create',
    descricao: 'Criar solicitações de integração',
    module: 'integration-request'
  },
  {
    key: 'integration-request.update',
    descricao: 'Atualizar solicitações de integração',
    module: 'integration-request'
  },
  {
    key: 'integration-request.delete',
    descricao: 'Deletar solicitações de integração',
    module: 'integration-request'
  },
  {
    key: 'integration-request.approve',
    descricao: 'Aprovar solicitações de integração',
    module: 'integration-request'
  },
  {
    key: 'integration-request.reject',
    descricao: 'Recusar solicitações de integração',
    module: 'integration-request'
  },
] as const satisfies readonly PermissionDefinition[];

export type PermissionKey = (typeof PERMISSIONS)[number]['key'];
