# Plano de Implementação: Melhorias nos Dossiês (Glossário e Formatação)

Este plano detalha as melhorias a serem introduzidas nos dossiês em formato PDF (Dossiê Interno e Dossiê por Cliente) gerados pela API Info Vendas. Como o documento é consumido tanto por perfis técnicos quanto comerciais, o objetivo é aumentar a clareza através de um glossário de termos e padronizar a exibição numérica de milhares com ponto (`.`).

## Proposed Changes

### Dashboard Module

---

#### [MODIFY] [dossier-pdf.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dossier-pdf.service.ts)

- **Substituir todas as chamadas de `.toLocaleString()`** por `.toLocaleString('pt-BR')` para garantir que o separador de milhares seja o ponto (`.`).
- **Adicionar uma nova página de Glossário** no final de `renderClientHtml` e `renderInternalHtml` contendo os termos comerciais e técnicos usados no relatório.

##### Glossário para Dossiê de Cliente:
- **Requisição (Request):** Qualquer chamada de API realizada pelos sistemas do cliente para consultar ou enviar informações ao Info Vendas.
- **Taxa de Sucesso / Disponibilidade:** Percentual de requisições que retornaram resposta bem-sucedida (códigos HTTP da família 2xx/3xx), sem erros do servidor.
- **Latência Média:** Tempo médio que a API leva para processar uma requisição e enviar a resposta de volta ao cliente, medido em milissegundos (ms).
- **Latência p95:** Métrica estatística que representa o tempo de resposta máximo observado em 95% das requisições mais rápidas. Indica a experiência de uso na maioria absoluta das chamadas.
- **Bloqueios de Limite (Rate Limit / Hit Limit):** Ocorrências em que o cliente ultrapassa o limite contratado de requisições por minuto ou segundo, resultando em bloqueios temporários (HTTP 429) para preservar a estabilidade da infraestrutura.
- **Franquia Mensal (Limite de Contrato):** Volume máximo de requisições mensais acordado no plano comercial do cliente. Consumos acima de 80% requerem atenção para expansão de franquia.
- **Status HTTP (Códigos de Retorno):** Respostas padronizadas que indicam o resultado do processamento:
  - *2xx (Sucesso)*: A operação foi realizada corretamente.
  - *4xx (Erro do Cliente)*: Inconsistência nos parâmetros enviados ou dados não encontrados.
  - *429 (Too Many Requests)*: Limite de taxa de requisições excedido.
  - *5xx (Erro do Servidor)*: Falha interna na infraestrutura ou sistema.

##### Termos Adicionais para Dossiê Geral Interno:
- **Log Processor:** Mecanismo interno automatizado responsável pelo processamento de logs em tempo real para alimentação das métricas deste dashboard e dos dossiês.
- **Banco de Dados (Tenant / Host):** Distribuição de carga de consultas diretamente nos bancos de dados locais dos clientes/empresas, medindo a integridade e impacto operacional de sincronização.

---

#### [MODIFY] [dossier-pdf.service.spec.ts](file:///c:/dev/infoapi/src/modules/dashboard/dossier-pdf.service.spec.ts)

- Atualizar e enriquecer os testes unitários existentes para verificar que o HTML injetado no Puppeteer contém:
  - O cabeçalho "Glossário de Termos".
  - A formatação de milhares com ponto (por exemplo, buscando `10.000` em vez de `10,000` ou `10000` nas strings renderizadas).

## Verification Plan

### Automated Tests
- Executar os testes unitários do serviço:
  ```bash
  cmd /c npx jest modules/dashboard/dossier-pdf.service.spec.ts
  ```
- Validar a compilação do projeto:
  ```bash
  npm run build
  ```

### Manual Verification
- O Puppeteer compilará o PDF corretamente sem erros de renderização ou estilização.
