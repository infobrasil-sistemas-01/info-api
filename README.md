# Info Vendas API

<p align="center">
  <a href="https://www.infobrasilsistemas.com.br/" target="blank"><img src="https://static.wixstatic.com/media/97349f_a4abdfe6f4384c2884ae2228ad3528b9~mv2.png/v1/fill/w_60,h_60,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Cabe%C3%A7alhoSIte_fw.png 1x, https://static.wixstatic.com/media/97349f_a4abdfe6f4384c2884ae2228ad3528b9~mv2.png/v1/fill/w_120,h_120,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Cabe%C3%A7alhoSIte_fw.png 2x" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  API de integração para sistemas de vendas, fornecendo endpoints para autenticação, gerenciamento de produtos e pedidos.
</p>

## 📋 Descrição

A **Info Vendas API (v1.5.0)** é uma aplicação backend desenvolvida com NestJS que facilita a integração entre sistemas de vendas e bancos de dados de clientes. Oferece funcionalidades para autenticação de usuários, listagem de produtos e criação de pedidos, com suporte a múltiplas credenciais de banco de dados.

## 🚀 Funcionalidades

- **Autenticação**: Login via Basic Auth para obter tokens JWT e Refresh Tokens.
- **Gestão de Planos**: Interceptor de limites de uso (mensal, por minuto, range de datas e pageSize).
- **Dashboard do Cliente**: Interface premium para monitoramento de consumo, status de conexão e guia de integração.
- **Painel Administrativo**: Gestão de usuários, cargos, permissões, anúncios e credenciais de banco.
- **Monitoramento de Saúde**: Status em tempo real (Uptime Bars) para API, Postgres e conexões Firebird.
- **Documentação**: Documentação interativa via Swagger e Scalar.
- **Banco de Dados**: Suporte híbrido (PostgreSQL para core, Firebird para dados de ERP).

## 🛠️ Tecnologias Utilizadas

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Linguagem**: TypeScript
- **ORM**: Prisma (com PostgreSQL e Firebird)
- **Segurança**: JWT, Passport, Argon2 (Hashing), Criptografia AES-256 para credenciais.
- **Validação**: Zod
- **Logs & Monitoramento**: Sentry / GlitchTip
- **Design**: HTML/CSS/JS puros com Glassmorphism e Boxicons.

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

2. Configure as variáveis de ambiente no arquivo `.env`. Certifique-se de configurar as chaves de criptografia (`CRYPTO_ENC`, `CRYPTO_IV`) e segredos do JWT.

3. Gere o Prisma Client:
   ```bash
   npx prisma generate
   ```

4. Execute as migrações (Desenvolvimento):
   ```bash
   npx prisma migrate dev
   ```

## ▶️ Como Executar

```bash
# Modo desenvolvimento (com hot reload)
npm run start:dev

# Modo produção (requer build)
npm run build
npm run start:prod
```

## 🚢 Fluxo de Deploy

O deploy da Info Vendas API segue um processo rigoroso para garantir a consistência do banco de dados e a disponibilidade do serviço.

### 1. Preparação (CI/CD)
- Execução de testes unitários: `npm run test`
- Verificação de Lint: `npm run lint`
- Build da aplicação: `npm run build`

### 2. Migração de Banco (Produção)
Antes de iniciar a nova versão, as migrações do Prisma devem ser aplicadas:
```bash
npx prisma migrate deploy
```

### 3. Inicialização
Em ambiente de produção (Docker ou Bare Metal), a aplicação deve ser iniciada a partir do arquivo compilado:
```bash
node dist/src/main.js
```
*Nota: Devido à estrutura do NestJS, o ponto de entrada em produção é `dist/src/main.js`.*

## 📚 Documentação

- **Documentação Técnica**: Veja o arquivo [TECHNICAL_DOC.md](./TECHNICAL_DOC.md) para detalhes de arquitetura.
- **Swagger**: `http://localhost:3000/docs`
- **Scalar**: `http://localhost:3000/scalar`
- **Guia de Integração**: Disponível no Dashboard do Cliente em `/integration`.

## 📄 Licença

Este projeto é de propriedade exclusiva da **InfoBrasil Sistemas**. Uso não autorizado é proibido.
