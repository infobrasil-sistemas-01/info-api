# Documentação Técnica - Info Vendas API

## 1. Visão Geral
A **Info Vendas API** é uma solução de middleware desenvolvida em NestJS (TypeScript) projetada para unificar a integração entre o ERP InfoBrasil (Firebird) e plataformas de terceiros (E-commerces, Apps de Vendas, BI). A arquitetura prioriza segurança rigorosa, controle de consumo por planos e alta performance em consultas legadas.

---

## 2. Arquitetura de Segurança

O sistema utiliza um modelo de segurança em camadas (Defense in Depth), garantindo que cada requisição passe por múltiplos filtros antes de tocar os dados do ERP.

### 2.1. Autenticação (JWT)
Utilizamos o padrão **JSON Web Token (JWT)** para identificação de sessões.
- **Autenticação Inicial**: Realizada via **Basic Auth** (Base64), enviando `username:password` para a rota de login para obter o primeiro par de tokens.
- **Estratégia JWT**: Autenticação stateless subsequente via Passport-JWT para todas as rotas protegidas.
- **Payload**: O token carrega o `userId`, `storeId` e `credentialsId`, permitindo que o sistema saiba instantaneamente qual banco Firebird deve consultar sem buscar metadados extras.
- **Validação de Ambiente**: O `EnvService` garante que segredos criptográficos e chaves JWT estejam presentes e seguros antes do boot da aplicação.

### 2.2. Autorização (RBAC - Role Based Access Control)
O controle de acesso é granular e baseado em permissões, não apenas em "cargos".
- **PermissionsGuard**: Um interceptor de nível de classe ou método que valida se o usuário possui a chave de permissão necessária (ex: `tenant.products.view`).
- **Decorators**: Uso de `@RequirePermissions({ allOf: [...] })` para uma declaração clara de requisitos de segurança diretamente no Controller.

---

## 3. Gestão de Planos e Limites de Uso

Para garantir a saúde do servidor Firebird e monetizar a API, implementamos o **PlanLimitInterceptor**.

### 3.1. Limites de Frequência (Rate Limiting)
- **Por Minuto**: Protege contra ataques de força bruta ou loops infinitos em integrações mal configuradas.
- **Mensal**: Controla a cota comercial do cliente.
- **Janela de Tempo**: Utiliza janelas fixas (startOfMinute/startOfMonth) para resets automáticos e previsíveis.

### 3.2. Limites de Payload e Range
- **Paginação (PageSize)**: O interceptor valida o parâmetro `limit` ou `pageSize`. Se o plano permitir 50 itens e o cliente pedir 100, a requisição é rejeitada em nível de middleware.
- **Range de Datas**: Limita a busca retroativa (ex: planos básicos só podem consultar pedidos dos últimos 7 dias). Isso evita queries pesadas que travariam o banco de dados legados.

---

## 4. Estrutura de Dados e Integração

O sistema opera com um modelo de **Banco de Dados Híbrido**:

1.  **PostgreSQL (Prisma)**: Gerencia o "Cérebro" da API (Usuários, Planos, Logs, Credenciais de Lojas).
    - *Localização do Client*: O Prisma Client é gerado em `src/generated/prisma` para evitar conflitos de cache do `node_modules`.
2.  **Firebird (Legacy Integration)**: Onde residem os dados reais de vendas e produtos.
    - *Connection Pool*: Gerenciado dinamicamente. A API abre conexões sob demanda usando as credenciais descriptografadas em tempo de execução.

---

## 5. Padrões de Desenvolvimento

### 5.1. Design de Interface (Dashboards)
Os dashboards (Admin e Cliente) são servidos diretamente pelo NestJS como arquivos HTML/JS puros.
- **Aesthetics**: Design premium com Glassmorphism, tipografia `Outfit` e ícones `Boxicons`.
- **Logic**: Comunicação assíncrona via Fetch API, mantendo o front-end leve e extremamente rápido.

### 5.2. Validação de Dados
- **Zod**: Todas as variáveis de ambiente e DTOs de entrada são validados via Zod. O sistema falha propositalmente (Fail-Fast) se encontrar dados inconsistentes.

---

## 6. Deployment e Operação
- **Migrações**: O sistema executa `prisma migrate deploy` automaticamente no CI/CD antes do startup.
- **Logs**: Interceptor global de logs para auditoria de todas as requisições, facilitando o suporte técnico e a análise de consumo dos planos.
