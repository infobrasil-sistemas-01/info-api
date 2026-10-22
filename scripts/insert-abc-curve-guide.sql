-- Script de Inserção do Guia PDF no Banco de Dados PostgreSQL (Tabela: integration_guides)
-- Guia: L2.5.2 - Curva ABC Dimensional de Vendas (Princípio de Pareto)

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
    'c72f1830-a612-4cf0-88d4-539659020502',
    'Curva ABC Dimensional de Vendas (Princípio de Pareto)',
    'L2.5.2',
    'Guia técnico e prático demonstrando o consumo do endpoint analítico GET /api/v1/orders/abc-curve da InfoAPI para apuração da Curva ABC em múltiplos eixos (Vendedores, Lojas, Grupos, Marcas, Clientes e Produtos) com cálculo de percentual de quantidade, participação financeira, faturamento acumulado e classes de Pareto (A, B e C).',
    'Listagens',
    'https://info-api.infobrasilsistemas.com.br/integration/guides/L2.5.2_guia_curva_abc_vendas.pdf',
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
