# Plano de Implementação: Gerador de Dossiê Personalizado em PDF

Este plano detalha a implementação de um gerador de dossiês em formato PDF a partir do painel de administração da API Info Vendas. A funcionalidade permitirá a exportação de dois tipos de dossiês com objetivos distintos:

1. **Dossiê Geral Interno:** Consolidado de métricas gerais da API de todos os clientes (ideal para gestão interna, saúde de infraestrutura e tomada de decisões comerciais globais).
2. **Dossiê por Cliente/Empresa:** Relatório específico detalhando o uso da API por um determinado usuário (ideal para reuniões comerciais, faturamento, negociações de cotas e apresentação de valor de integração).

---

## Opções Tecnológicas e Decisões de Arquitetura

### Opção A (HTML para PDF via Puppeteer - Recomendada)
* **Como funciona:** Aproveita a dependência do `puppeteer` já existente em `devDependencies` e implementada no exportador de Swagger.
* **Prós:** Layout flexível utilizando HTML, CSS moderno e geração nativa de PDFs de alta fidelidade visual.
* **Contras:** Exige a instalação do Chromium no container Docker Alpine de produção (`apk add chromium` no `Dockerfile`), o que aumenta o tamanho da imagem de produção e requer mover o `puppeteer` de `devDependencies` para `dependencies` no `package.json`.

### Opção B (Geração programática via `pdfmake`)
* **Como funciona:** Utiliza a biblioteca `pdfmake` (100% JS puro) para construir o documento diretamente no backend via código.
* **Prós:** Extremamente leve, não necessita de Chromium/browser headless no Docker, funcionando perfeitamente em imagens Alpine mínimas.
* **Contras:** Layout mais complexo de desenhar programaticamente se comparado com HTML/CSS tradicionais.

---

## Questões em Aberto (User Review Required)

> [!IMPORTANT]
> **Opção de PDF no Ambiente Docker de Produção:** 
> Deseja que sigamos com a **Opção A (HTML para PDF via Puppeteer)**, atualizando o `Dockerfile` com suporte a Chromium de produção, ou prefere a **Opção B (pdfmake)** para manter a imagem Docker o mais leve possível? *(Abaixo, o plano de implementação foi detalhado adotando a **Opção A**, por ser a mais alinhada com as bibliotecas já presentes no projeto, mas pode ser ajustado).*

---

## 1. Alterações Propostas

### 1.1 Dependências e Docker

#### [MODIFY] [package.json](file:///c:/dev/infoapi/package.json)
- Mover a biblioteca `"puppeteer": "^25.0.4"` da seção `devDependencies` para `dependencies`.

#### [MODIFY] [Dockerfile](file:///c:/dev/infoapi/Dockerfile)
- Adicionar no estágio de `PRODUCTION` a instalação do Chromium e das fontes necessárias para que o Puppeteer funcione de forma headless no Alpine:
  ```dockerfile
  # Instalar chromium e fontes adicionais para suporte a PDF
  RUN apk add --no-cache \
        chromium \
        nss \
        freetype \
        harfbuzz \
        ca-certificates \
        ttf-freefont
  
  # Configurar variáveis de ambiente do Puppeteer para apontar para o Chromium local
  ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
      PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
  ```

---

### 1.2 Modificações no Módulo de Dashboard

#### [MODIFY] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
Generalizar os métodos existentes de consulta de dados para suportar a filtragem opcional por `userId` (essencial para o dossiê por cliente):
- **`getSummary`**: Adicionar parâmetro opcional `userId?: string`. Adicionar filtro `userId` na contagem de requisições e latência.
- **`getTopEndpoints`**: Adicionar parâmetro opcional `userId?: string`. Filtrar requisições pelo `userId` se fornecido.
- **`getStatusDistribution`**: Adicionar parâmetro opcional `userId?: string`. Filtrar requisições pelo `userId` se fornecido.
- **`getTimeSeries`**: Adicionar parâmetro opcional `userId?: string`. Filtrar requisições pelo `userId` se fornecido.
- **`getDossierData`**:
  - Criar um novo método agregador que unifique os retornos de acordo com o tipo de dossiê selecionado.
  - Para `internal`: consolidar `getSummary`, `getTopUsers`, `getTopEndpoints`, `getStatusDistribution`, `getDatabaseLoad` e `getProactiveAlerts`.
  - Para `client`: obter dados do usuário/plano através de `prisma.user.findUnique`, consolidando `getSummary(..., userId)`, `getTopEndpoints(..., userId)`, `getStatusDistribution(..., userId)` e `getTimeSeries(..., userId)`.

#### [NEW] [dossier-pdf.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dossier-pdf.service.ts)
Criar serviço dedicado à compilação de HTML e geração do PDF:
- Implementar método `generateDossierPdf(type: 'internal' | 'client', data: any)`:
  - Gerar a estrutura de HTML/CSS moderna (com layout limpo, logo corporativa, tipografia limpa como Roboto/Inter, cores institucionais do Info Vendas API).
  - Renderizar gráficos de barras ou linhas usando SVG inline puro (calculando os valores diretamente no backend) para evitar chamadas de CDNs externos no Puppeteer.
  - Instanciar o Puppeteer headless com as flags de produção adequadas (`--no-sandbox`, `--disable-setuid-sandbox`).
  - Chamar `page.pdf({ format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }, printBackground: true })` e retornar o Buffer do PDF.

#### [MODIFY] [dashboard.controller.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.controller.ts)
Adicionar rota para exportar o dossiê:
- **`GET /api/v1/dashboard/dossier`**:
  - Aceitar os parâmetros de query: `type` (`'internal' | 'client'`), `userId` (opcional, mas obrigatório se `type = 'client'`), `startDate` (opcional) e `endDate` (opcional).
  - Validar se o `userId` existe caso o tipo seja `client`.
  - Configurar headers HTTP adequados para download de arquivo: `Content-Type: application/pdf` e `Content-Disposition: attachment; filename=dossie-[tipo]-[data].pdf`.
  - Invocar o `DossierPdfService` e escrever o buffer de retorno diretamente no stream de resposta do Express.
  - Protegido pela permissão `core.dashboard.view`.

#### [MODIFY] [dashboard.module.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.module.ts)
- Registrar o novo `DossierPdfService` nos `providers` do módulo.

---

## 2. Plano de Verificação

### 2.1 Testes Automatizados
* Escrever testes unitários em `dossier-pdf.service.spec.ts` validando:
  * A correta geração da estrutura HTML a partir dos dados do mock.
  * O comportamento e tratamento de erros do Puppeteer.
* Atualizar testes unitários em `dashboard.controller.spec.ts` para verificar os novos fluxos de validação de parâmetros e download de arquivo.
* Executar a suíte de testes do dashboard:
  ```bash
  npm run test -- src/modules/dashboard
  ```

### 2.2 Verificação Manual
1. **Dossiê Geral Interno:** Efetuar chamada GET em `/api/v1/dashboard/dossier?type=internal` e validar se o arquivo PDF é baixado com sucesso contendo as métricas unificadas e o ranking de clientes.
2. **Dossiê por Cliente:**
   * Obter o ID de um usuário de testes e efetuar a chamada GET em `/api/v1/dashboard/dossier?type=client&userId=[USER_ID]`.
   * Verificar se o PDF gerado exibe os detalhes específicos do plano contratado, o percentual de consumo da franquia do mês atual e o consumo detalhado daquele usuário.
3. **Validação de Erros:** Tentar emitir dossiê do tipo `client` sem passar `userId` ou passando um ID inexistente, garantindo o retorno de `400 Bad Request` e `404 Not Found` respectivamente.
4. **Verificação do Build Docker:** Executar localmente o build da imagem Docker de produção e validar se o Puppeteer consegue subir o navegador de forma headless e renderizar o PDF sem erros de bibliotecas de fontes ausentes.
