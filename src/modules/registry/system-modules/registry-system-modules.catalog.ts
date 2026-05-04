export const SYSTEM_MODULES = [
  { key: 'core', nome: 'Core', descricao: 'Base do sistema' },
  {
    key: 'tenant',
    nome: 'Tenant',
    descricao: 'Tenant do sistema',
  },
  {
    key: 'integration-request',
    nome: 'Solicitações de Integração',
    descricao: 'Solicitações de integração',
  },
] as const;

export type SystemModuleKey = (typeof SYSTEM_MODULES)[number]['key'];

export const SYSTEM_MODULES_KEYS = SYSTEM_MODULES.map((m) => m.key) as [
  SystemModuleKey,
  ...SystemModuleKey[],
];
