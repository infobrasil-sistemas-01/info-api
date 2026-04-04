# Info Vendas API

<p align="center">
  <a href="https://www.infobrasilsistemas.com.br/" target="blank"><img src="https://static.wixstatic.com/media/97349f_a4abdfe6f4384c2884ae2228ad3528b9~mv2.png/v1/fill/w_60,h_60,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Cabe%C3%A7alhoSIte_fw.png 1x, https://static.wixstatic.com/media/97349f_a4abdfe6f4384c2884ae2228ad3528b9~mv2.png/v1/fill/w_120,h_120,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Cabe%C3%A7alhoSIte_fw.png 2x" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  API de integração para sistemas de vendas, fornecendo endpoints para autenticação, gerenciamento de produtos e pedidos.
</p>

## 📋 Descrição

A Info Vendas API é uma aplicação backend desenvolvida com NestJS que facilita a integração entre sistemas de vendas e bancos de dados de clientes. Oferece funcionalidades para autenticação de usuários, listagem de produtos e criação de pedidos, com suporte a múltiplas credenciais de banco de dados.

## 🚀 Funcionalidades

- **Autenticação**: Login via Basic Auth para obter tokens JWT
- **Produtos**: Listagem paginada de produtos por credenciais
- **Vendas**: Criação e gerenciamento de Vendas com produtos vendidos
- **Documentação**: Documentação interativa da API via Swagger
- **Validação**: Validação robusta de dados usando Zod
- **Banco de Dados**: Suporte a múltiplos bancos via Prisma e Firebird

## 🛠️ Tecnologias Utilizadas

- **Framework**: [NestJS](https://nestjs.com/)
- **Linguagem**: TypeScript
- **Banco de Dados**: Prisma ORM com suporte a PostgreSQL e Firebird
- **Autenticação**: JWT e Passport
- **Validação**: Zod
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest

## Instruções importantes (à Equipe Técnica InfoBrasil)

- Para a geração de **financeiro fiscal** é necessário que, na tabela `CONFIG_PERFIL_LOJAS`, o perfil de `PFL_CODIGO = 104` tenha sua coluna `CPL_PERFIL = S` (no Banco de Dados do Cliente).

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/infobrasil-sistemas/info-vendas-api
cd info-vendas-api

# Instale as dependências
npm install
```

## ⚙️ Configuração

1. Copie o arquivo de exemplo de configuração de ambiente:

   ```bash
   cp .env.example .env
   ```

2. Configure as variáveis de ambiente no arquivo `.env`:

   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL="postgres://postgres:postgres@localhost:5433/infoapi?schema=public"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="24h"
   REFRESH_TOKEN_DAYS="7"
   P98="encrypted-password-98"
   P99="encrypted-password-98"
   P131="encrypted-password-98"
   P104="encrypted-password-98"
   CRYPTO_ENC="your-encryption-key"
   CRYPTO_IV="your-initialization-vector"
   CRYPTO_ALGO="your-encryption-algorithm"
   ```

3. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   ```

## ▶️ Como Executar

```bash
# Modo desenvolvimento (com hot reload)
npm run start:dev

# Modo produção
npm run start:prod

# Build da aplicação
npm run build
```

A aplicação estará disponível em `http://localhost:3000` (ou a porta configurada).

## 📚 Documentação da API

A documentação completa da API está disponível em duas opções de visualização:

- Via Swagger em: `http://localhost:3000/docs`
- Via Scalar (parecido com Postman) em : `http://localhost:3000/scalar`

### Endpoints Principais

#### Autenticação

- `POST /api/v1/auth/login` - Login do usuário (Basic Auth)

#### Produtos

- `GET /api/v1/products` - Listar produtos (requer JWT)

#### Pedidos

- `POST /api/v1/orders` - Criar novo pedido (requer JWT)

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Testes com watch mode
npm run test:watch

# Cobertura de testes
npm run test:cov

# Testes E2E
npm run test:e2e
```

## 📁 Estrutura do Projeto

```
src/
├── app.module.ts              # Módulo principal
├── main.ts                    # Ponto de entrada da aplicação
├── config/                    # Configurações globais
│   ├── auth.config.ts
│   └── env/
├── modules/                   # Módulos da aplicação
│   ├── auth/                  # Autenticação
│   └── order/                 # Pedidos
│   └── payment-method/        # Métodos de Pagamento
│   ├── product/               # Produtos
├── infra/                     # Infraestrutura
│   ├── database/              # Conexões de banco
│   ├── prisma/                # Cliente Prisma
│   └── firebird/              # Cliente Firebird
├── utils/                     # Utilitários
└── test/                      # Testes
```

## 🔧 Scripts Disponíveis

- `npm run start` - Inicia a aplicação
- `npm run start:dev` - Inicia em modo desenvolvimento
- `npm run start:debug` - Inicia em modo debug
- `npm run start:prod` - Inicia em modo produção
- `npm run build` - Compila a aplicação
- `npm run test` - Executa testes unitários
- `npm run test:e2e` - Executa testes E2E
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença UNLICENSED.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.
