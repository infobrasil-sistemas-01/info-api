# Plano de Implementação: Changelog Humanizado Sistematizado e Portal Visual

## 1. Visão Geral
Este plano visa transformar o histórico técnico de alterações da InfoBrasil API (atualmente em formato cru de *Conventional Commits* gerado por ferramentas de release) em um **Changelog Humanizado em Português**, estruturado por valor de negócio e simplificado para clientes, gestores e desenvolvedores integradores, acompanhado de uma **Página Web Interativa e Sistematizada** servida diretamente pela aplicação.

---

## 2. Decisões Arquiteturais e Padrões Adotados

### 2.1 Modelo e Estrutura de Dados do Changelog
- **Diretório de Persistência:** `docs/changelog/`
- **Artefatos Gerados:**
  1. `docs/changelog/releases.json`: Fonte de verdade estruturada contendo todas as versões, datas, resumos executivos, categorias (`features`, `fixes`, `improvements`, `security`), módulos afetados e impactos amigáveis.
  2. `docs/changelog/CHANGELOG.pt-BR.md`: Versão em Markdown humano consolidado para leitura em repositórios, READMEs ou documentação offline.
- **Estrutura por Versão:**
  - **Identificação:** Versão SemVer e Data da Release.
  - **Destaque / Resumo Executivo:** Frase síntese do valor entregue.
  - **Novidades & Recursos:** Alterações que agregam novas capacidades ao negócio.
  - **Correções & Estabilidade:** Problemas corrigidos e comportamento restabelecido.
  - **Segurança & Infraestrutura:** Otimizações de rede, performance, banco de dados ou credenciais.

### 2.2 Sistematização e Automação (Engine de Geração)
- **Script:** `scripts/generate-human-changelog.ts`
- **Mecanismo:**
  - Extração semântica das versões do `CHANGELOG.md` original.
  - Processamento e humanização em português, traduzindo jargões técnicos para terminologia de negócio InfoBrasil (ex: pedidos, call center, entradas fiscais, credenciais de banco, tolerância a falhas).
  - Suporte a geração em lote (para as mais de 50 versões históricas) e incremental (para novas tags geradas no CI/CD).

### 2.3 Portal Visual do Changelog (`/changelog`)
- **Novo Módulo NestJS:** `src/modules/changelog/`
  - `changelog.module.ts`
  - `changelog.controller.ts` (endpoints `GET /changelog` para o portal web e `GET /changelog/data` para a API JSON)
  - `changelog.service.ts` (leitura otimizada em cache do `releases.json` com fallback gracioso)
  - `templates/changelog.html` (interface web rica, moderna e responsiva)
- **Design & Experiência do Usuário (UI/UX):**
  - Identidade visual alinhada ao ecossistema InfoBrasil (paleta roxo/indigo corporativo, modo escuro elegante).
  - Busca instantânea por texto (módulo, funcionalidade, correção).
  - Filtros por categoria (Novidades, Correções, Infra/Segurança).
  - Timeline interativa com badges de versão, data e links para documentação/Swagger.
  - Botão de compartilhamento e cópia de âncora direta da versão.
- **Roteamento e Acessibilidade:**
  - Rota desvinculada do prefixo `api/v1` em `src/main.ts` (acesso direto em `/changelog`).
  - Botão de atalho integrado à barra superior do Swagger (`src/config/swagger.ts`).

---

## 3. Arquivos Envolvidos

### Novos Arquivos
1. `docs/changelog/releases.json`: Catálogo de releases humanizadas de v0.0.2 até a v1.16.22.
2. `docs/changelog/CHANGELOG.pt-BR.md`: Changelog completo humanizado em Markdown.
3. `scripts/generate-human-changelog.ts`: Script de geração e sincronização contínua.
4. `src/modules/changelog/changelog.module.ts`: Módulo NestJS.
5. `src/modules/changelog/changelog.controller.ts`: Controller de rotas públicas.
6. `src/modules/changelog/changelog.service.ts`: Serviço de dados e cache de releases.
7. `src/modules/changelog/changelog.controller.spec.ts`: Testes unitários do controller.
8. `src/modules/changelog/templates/changelog.html`: Página visual interativa do Changelog.

### Arquivos Modificados
1. `src/app.module.ts`: Registro do `ChangelogModule`.
2. `src/main.ts`: Exclusão de `changelog` e `changelog/*path` do prefixo de API `api/v1`.
3. `src/config/swagger.ts`: Inclusão do botão de acesso ao Changelog na topbar do Swagger UI.
4. `package.json`: Script auxiliar `npm run changelog:human` para execução do gerador.

---

## 4. Plano de Verificação e Testes
- **Compilação e Tipagem:** `npm run build`
- **Testes Unitários:** `npm run test -- changelog`
- **Validação de Sintaxe e Lint:** `npm run lint`
- **Verificação Visual:** Conferência da página `/changelog` e do endpoint `/changelog/data`.
