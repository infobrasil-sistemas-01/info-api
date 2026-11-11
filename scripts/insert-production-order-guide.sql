-- Script de Inserção do Guia PDF no Banco de Dados PostgreSQL (Tabela: integration_guides)
-- Guia: OP.1.0 - Ordem de Produção

INSERT INTO "integration_guides" (
    "id",
    "title",
    "code",
    "description",
    "category",
    "public_url",
    "active",
    "created_at",
    "updated_at"
) VALUES (
    'e84a2950-a612-4cf0-88d4-539659021910',
    'Guia de Solicitação de Acesso e Integração: Ordens de Produção',
    'OP.1.0',
    'Guia técnico e prático de orientação para solicitação de credenciais e permissões (Produtos [Ver] e Ordens de Produção [Ver/Criar]) no portal da InfoAPI, detalhando a emissão atômica via POST /api/v1/production-order com produtos acabados, insumos consumidos e custeio fiscal automático.',
    'Ordem de Produção',
    'https://info-api.infobrasilsistemas.com.br/integration/guides/guia_solicitacao_integracao_ordens_producao.pdf',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO UPDATE SET
    "title" = EXCLUDED."title",
    "code" = EXCLUDED."code",
    "description" = EXCLUDED."description",
    "category" = EXCLUDED."category",
    "public_url" = EXCLUDED."public_url",
    "active" = EXCLUDED."active",
    "updated_at" = CURRENT_TIMESTAMP;

