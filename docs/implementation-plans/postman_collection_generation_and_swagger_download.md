# Plano de Implementação: Geração de Postman Collection e Download no Swagger/Scalar

## 1. Visão Geral
Disponibilizar uma Postman Collection oficial da InfoAPI gerada a partir da especificação OpenAPI (Swagger) na versão mais recente (*latest*), com URL fixa de produção (`https://info-api.infobrasilsistemas.com.br`), servida estaticamente e acessível diretamente pelo header da documentação (Swagger UI / Scalar). Além disso, garantir que os DTOs contenham exemplos representativos (`@ApiProperty({ example: ... })`) para que a collection gerada seja rica em payloads funcionais.

---

## 2. Decisões Arquiteturais
1. **Abordagem B (Script Desacoplado / Build-time):**
   - O script `scripts/generate-postman.ts` não inicializa o NestJS (`NestFactory`), evitando dependências de conexões com banco de dados (Prisma/Firebird) ou validação rígida de variáveis de ambiente (`EnvService`).
   - Ele consome diretamente o arquivo `swagger-spec.json` (ou `docs/swagger/swagger-${version}.json`).
   - Converte usando a biblioteca oficial `openapi-to-postmanv2`.
   - Gera o arquivo estático da collection em `public/docs/infoapi-postman-collection.json` (e também em `docs/swagger/infoapi-postman-collection.json`).
2. **Serviço do Arquivo Estático:**
   - Expor endpoint ou rota estática (ex: `GET /docs/postman` ou servir via assets estáticos) retornando o arquivo com headers `Content-Disposition: attachment; filename="infoapi-postman-collection.json"` e `Content-Type: application/json`.
3. **Header do Swagger / Scalar:**
   - Adicionar link/botão "Baixar Coleção Postman" no Web Component unificado `INFO_HEADER_JS` em `src/config/info-header.component.ts`.
4. **Enriquecimento dos DTOs:**
   - Fazer varredura em `src/modules/**/dto` para identificar campos essenciais que ainda não possuem decorators com `example:` e complementá-los.

---

## 3. Etapas de Execução
1. **Instalação de Dependência:**
   - Instalar `openapi-to-postmanv2` (como `devDependencies`).
2. **Criação do Script de Conversão:**
   - Criar `scripts/generate-postman.ts`.
   - Adicionar script no `package.json`: `"postman:generate": "npx ts-node --transpile-only -r tsconfig-paths/register scripts/generate-postman.ts"`.
   - Integrar ao fluxo de build e geração (`swagger:generate`).
3. **Exposição do Endpoint / Arquivo para Download:**
   - Ajustar `src/config/swagger.ts` ou criar um controller/handler para servir o arquivo `infoapi-postman-collection.json` de forma confiável no NestJS em `/docs/postman` e `/docs/postman.json`.
4. **Atualização do Header (`src/config/info-header.component.ts`):**
   - Inserir a opção de download da Postman Collection em português no menu de Documentação e na barra de ações.
5. **Varredura e Enriquecimento de DTOs:**
   - Verificar DTOs das principais rotas (Auth, Client, Product, Order, etc.) e preencher exemplos faltantes.
6. **Validação e Testes:**
   - Executar o script, gerar a collection e validar a sintaxe e conformidade com o schema do Postman v2.1.
   - Executar testes unitários e de build (`npm run build`).

