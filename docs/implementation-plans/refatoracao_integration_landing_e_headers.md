# Plano de Implementação: Refatoração da Página Promocional e Header Unificado do Ecossistema InfoAPI

Este documento detalha o planejamento e a execução da refatoração visual e funcional da página promocional (`landing.html`), servida na raiz (`/`) e em `/integration`, integrando um **Header Unificado e Flutuante com Glassmorphism** que conecta todos os portais e ferramentas públicas disponíveis no ecossistema (e documentadas no Swagger).

---

## 1. Visão Geral e Requisitos

1. **Header Unificado do Ecossistema:**
   - Deve conter navegação fluida para todas as páginas e ferramentas do sistema referenciadas no Swagger:
     - **Início:** `/` ou `/integration`
     - **Documentação da API:** `/docs` (Swagger UI) e `/scalar` (Scalar API Reference)
     - **Página de Status:** `/status` (com indicador visual de disponibilidade)
     - **Changelog:** `/changelog` (Notas de versão e novidades)
     - **Área do Cliente:** `/integration/client` (Acesso e auditoria do integrador)
     - **Painel Administrativo:** `/integration/admin` (Gestão operacional)
     - **Solicitar Acesso (CTA):** `/integration/form` (ou âncora `#solicitar-acesso`)
   - O header deve ser *sticky*, com transição suave ao rolar a página (`scrolled`), efeito *glassmorphism* e suporte a menu mobile responsivo.

2. **Página Promocional na Raiz (`/`) e em `/integration`:**
   - A página principal deve ser visualmente impressionante (paleta moderna escura com toques esmeralda `#10b981`), contendo as seguintes seções estruturadas:
     1. **Hero Section:** Apresentação da InfoAPI, proposta de valor para ERPs, badges de métricas (99.9% uptime, latência reduzida, PostgreSQL + Firebird) e botões de chamada primária ("Solicitar Acesso" e "Explorar Swagger").
     2. **Diagrama Visual de Integração (`#arquitetura`):** Apresentação do diagrama de ecossistema (`api_ecosystem_diagram_1778182878593.png`) com destaques dos 4 pilares: Automação (n8n/Make), IA & Agentes, Conexão Segura ao ERP Retaguarda, e E-commerce / Mobile.
     3. **Funcionalidades da API (`#funcionalidades`):** Slider/grid com cartões de endpoints para Produtos, Vendas/Pedidos, Clientes, Financeiro, Funcionários, Entregas, Fornecedores e Lojas, com tags de métodos HTTP (GET/POST/PATCH) e link direto para o Swagger.
     4. **Planos Comerciais (`#planos`):** Grade dinâmica carregando os planos da API (`/api/v1/plans`) com destaque no plano recomendado, limites de cota mensal/minuto, range de dias, paginação e botões de contratação.
     5. **Seção de Solicitação de Acesso (`#solicitar-acesso`):** Fluxo explicativo do onboarding (1. Cadastro de credenciais e CNPJ, 2. Confirmação instantânea por e-mail, 3. Rotação de chaves e acesso imediato) com CTA para o formulário.
     6. **Footer Rico:** Colunas de links rápidos, status do UptimeRobot e direitos autorais.

3. **Roteamento no Backend:**
   - Garantir que a raiz (`/`) e `/integration` sirvam a landing page diretamente, sem redirecionamentos desnecessários e com alta performance.

---

## 2. Arquivos Modificados

1. `src/modules/integration-request/templates/landing.html`:
   - Reestruturação completa do layout, estilos CSS modernos, header unificado com dropdown e mobile menu, seções enriquecidas e footer.
2. `src/app.controller.ts`:
   - Atualização do método raiz `@Get()` para servir `landing.html` diretamente quando requisitado na raiz `/`.
3. `src/modules/integration-request/integration-request.controller.ts`:
   - Manutenção de `@Get('/')` servindo `landing.html` para `/integration` e `/integration/`.

---

## 3. Plano de Verificação

1. **Testes Unitários:** Execução de `npm.cmd test` para garantir integridade dos controllers e módulos.
2. **Navegação de Links:** Validação manual de todos os links do header para `/docs`, `/scalar`, `/status`, `/changelog`, `/integration/client`, `/integration/admin` e `/integration/form`.
3. **Responsividade:** Verificação de abertura do menu mobile e scroll suave até as seções âncora (`#funcionalidades`, `#arquitetura`, `#planos`, `#solicitar-acesso`).
