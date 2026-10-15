-- CreateTable
CREATE TABLE "integration_guides" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "code" VARCHAR(50),
    "description" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "public_url" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_guides_pkey" PRIMARY KEY ("id")
);

-- Insert Initial L2.11.1 Guide
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
    'b48f6820-a612-4cf0-88d4-539659021111',
    'Listagem de Giro de Estoque Físico (Entradas / Saídas)',
    'L2.11.1',
    'Guia técnico e prático demonstrando como recriar com 100% de fidelidade o relatório gerencial L2.11.1 do ERP através da InfoAPI, agregando produtos, estoque físico atual da filial, entradas de compras e saídas de vendas com suporte a variantes de grade (tamanho e cor).',
    'Listagens',
    'https://info-api.infobrasilsistemas.com.br/integration/guides/L2.11.1_guia_relatorio_giro_estoque.pdf',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;
