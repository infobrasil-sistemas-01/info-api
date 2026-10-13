# Plano de Implementação: Header Unificado em /docs e /scalar (Shadow DOM & Standalone)

## 1. Contexto e Objetivo
Integrar o cabeçalho oficial do ecossistema InfoAPI (definido originalmente em `src/modules/integration-request/templates/landing.html`) nas rotas de documentação interativa:
- Swagger UI (`/docs` e versões históricas `/docs/vX.Y.Z`)
- Scalar API Reference (`/scalar` e versões históricas `/scalar/vX.Y.Z`)

O objetivo é proporcionar uma experiência contínua e integrada em todo o ecossistema InfoBrasil, preservando deep linking de endpoints, isolamento rigoroso de estilos via **Shadow DOM** e renderização standalone do Scalar.

## 2. Decisões Arquiteturais

### 2.1. Isolamento com Web Component & Shadow DOM (`<info-api-header>`)
- Criação de um componente web padrão (`info-header.js`) registrado via `customElements.define('info-api-header', InfoApiHeader)`.
- Uso de `this.attachShadow({ mode: 'open' })` para encapsulamento total de CSS e marcação HTML.
- Inclusão de suporte responsivo (mobile drawer e botão hambúrguer), dropdown de documentações, status dot, seletor de versões dinâmico (troca inteligente entre `/docs` ou `/scalar`) e links do ecossistema.

### 2.2. Injeção no Swagger UI (`/docs`)
- O Swagger UI do NestJS utiliza o `SwaggerModule.setup`.
- Injeção do script do Web Component através da propriedade `customJs` e estilização complementar via `customCss` para garantir que o container `#swagger-ui` se ajuste perfeitamente abaixo do header unificado.
- Na inicialização da página do Swagger, o script injeta `<info-api-header active-doc="swagger" ...>` antes de `#swagger-ui`.

### 2.3. Migração do Scalar para Standalone Oficial (`/scalar`)
- Remoção do middleware engessado `@scalar/nestjs-api-reference` para a rota principal e rotas históricas.
- Criação de uma rota Express / NestJS dinâmica que serve o HTML standalone moderno do Scalar (`@scalar/api-reference` Standalone), embutindo:
  1. O componente `<info-api-header active-doc="scalar" ...>`.
  2. O container `#api-reference` apontando para o schema OpenAPI correspondente (`/docs-json` ou `/docs/vX.Y.Z-json`).
  3. Configurações de tema, fontes e metatags consistentes.

## 3. Plano de Ação
1. **Criar o Web Component `info-header.js`**:
   - Salvar em `src/modules/integration-request/templates/assets/info-header.js`.
   - Implementar o template HTML do header do `landing.html`, estilos encapsulados, manipulação do dropdown e seletor de versões e drawer mobile.
2. **Atualizar `src/config/swagger.ts`**:
   - Configurar o endpoint estático para servir `info-header.js` e atualizar `swagger-custom.js` para injetar `<info-api-header>` no Swagger UI.
   - Implementar o gerador de HTML standalone do Scalar para a rota `/scalar` e `/scalar/v:version`.
   - Suporte transparente para a spec atual e specs históricas registradas.
3. **Validação**:
   - Testar sintaxe e build do NestJS (`npm run build`).
   - Validar layout e navegação entre Swagger e Scalar.
