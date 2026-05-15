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

### 4.1 Configuração Crítica do Firebird (Prevenção de Crashes)
Para garantir a compatibilidade com o driver `node-firebird` e evitar erros fatais de conexão do tipo `TypeError: Cannot read properties of undefined (reading 'readUInt16LE')`, é **estritamente necessário** configurar o arquivo `firebird.conf` do servidor do cliente com os seguintes parâmetros:
- `WireCrypt = Disabled`
- `AuthServer = Legacy_Auth, Srp, Srp256`

> **Importante:** Sem essas configurações de autenticação e criptografia, a API não conseguirá estabelecer o handshake inicial com o banco, derrubando o processo Node.js.

---

## 5. Padrões de Desenvolvimento

### 5.1. Estrutura e Padrões de Backend
A aplicação NestJS segue uma arquitetura fortemente modularizada e orientada a domínio:
- **Organização de Diretórios**:
  - `src/modules/`: Regras de negócio e endpoints. Cada pasta contém seu `Controller`, `Service`, `Module` e diretório de `dto/`.
  - `src/infra/`: Camada de infraestrutura e conectores externos (PrismaService, TenantConnectionService do Firebird, Guards de RBAC).
  - `src/config/`: Configurações globais e de ambiente (`EnvService`).
- **Convenções Importantes**:
  - O Prisma Client não é importado do `node_modules`, mas sim gerado no caminho customizado `src/generated/prisma/client` para isolamento.
  - Todas as rotas de API obedecem obrigatoriamente a um prefixo global (ex: `api/v1`).
- **Estratégia de Testes**: Padrão rigoroso de testes unitários (`*.spec.ts`) localizados na mesma pasta do arquivo fonte. Empregamos o `TestingModule` do NestJS para isolar o escopo com forte uso de Mocks (`jest.mock` e `useValue`) para simular os retornos de banco de dados e evitar I/O desnecessário.

### 5.2. Design de Interface (Dashboards)
Os dashboards (Admin e Cliente) são servidos diretamente pelo NestJS como arquivos HTML/JS puros.
- **Aesthetics**: Design premium com Glassmorphism, tipografia `Outfit` e ícones `Boxicons`.
- **Logic**: Comunicação assíncrona via Fetch API, mantendo o front-end leve e extremamente rápido.

### 5.3. Validação de Dados
- **Zod**: Todas as variáveis de ambiente e DTOs de entrada são validados via Zod. O sistema falha propositalmente (Fail-Fast) se encontrar dados inconsistentes.

### 5.4. Documentação e Versionamento da API
- **Swagger / OpenAPI**: A API possui documentação interativa e detalhada. O retorno de sucesso (`200 OK`) das rotas de integração (como `products`, `service-providers`, `employees`, `suppliers` e `clients`) é rigorosamente estruturado através de *Response DTOs* específicos, garantindo exemplos e tipagens ricas na documentação gerada.
- **Release Automatizado**: Utilizamos a ferramenta `commit-and-tag-version`. O arquivo `.versionrc` está configurado com `"commitAll": true` para garantir que os schemas do Swagger (`swagger-spec.json` e `docs/swagger/*.json`), criados no hook de `postbump`, sejam incluídos no commit de release de forma nativa e não fiquem órfãos (untracked).

---

## 6. Deployment e Operação
- **Migrações**: O sistema executa `prisma migrate deploy` automaticamente no CI/CD antes do startup.
- **Logs**: Interceptor global de logs para auditoria de todas as requisições, facilitando o suporte técnico e a análise de consumo dos planos.
