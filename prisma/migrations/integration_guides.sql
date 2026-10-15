-- ==============================================================================
-- DDL: Tabela integration_guides
-- ==============================================================================

CREATE TABLE IF NOT EXISTS integration_guides (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    code VARCHAR(50),
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    public_url VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- Inserção do Primeiro Guia: L2.11.1
-- ==============================================================================

INSERT INTO integration_guides (
    id,
    title,
    code,
    description,
    category,
    public_url,
    active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Listagem de Giro de Estoque Físico (Entradas / Saídas)',
    'L2.11.1',
    'Guia técnico e prático demonstrando como recriar com 100% de fidelidade o relatório gerencial L2.11.1 do ERP através da InfoAPI, agregando produtos, estoque físico atual da filial, entradas de compras e saídas de vendas com suporte a variantes de grade (tamanho e cor).',
    'Listagens',
    'https://info-api.infobrasilsistemas.com.br/integration/guides/L2.11.1_guia_relatorio_giro_estoque.pdf',
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;
