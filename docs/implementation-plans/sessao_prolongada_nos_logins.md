# Plano de Implementação: Sessão Prolongada nos Logins

Este plano detalha a inclusão de um checkbox "Sessão prolongada" nas telas de login (Administrador e Cliente) e a implementação do mecanismo de silent refresh de tokens de acesso usando o Refresh Token.

---

## 1. Alterações Propostas

### 1.1 Frontend (HTML & JavaScript)

#### [MODIFY] [admin.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/admin.html)
- Adicionar o checkbox "Sessão prolongada" no formulário de login (`#login-form`), abaixo do campo de senha e antes do botão de entrar.

#### [MODIFY] [client.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/client.html)
- Adicionar o checkbox "Sessão prolongada" no formulário de login (`#login-form`), abaixo do campo de senha e antes do botão de entrar.

#### [MODIFY] [admin-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-core.js)
1. **Fetch Interceptor**:
   - Inserir um interceptor global para `window.fetch` no topo do arquivo.
   - Ao receber status `401 Unauthorized` de chamadas da API (que não sejam de login/refresh), se houver um `refresh_token` em `localStorage`, realizar chamada ao endpoint `/auth/refresh`.
   - Se a renovação der certo, salvar o novo `access_token` no `localStorage`, atualizar o header de autorização e refazer a requisição original.
2. **Auth.login**:
   - Ler o valor do checkbox `remember-me` ("Sessão prolongada").
   - Se marcado, salvar o `refresh_token` recebido no `localStorage`. Caso contrário, garantir sua remoção do `localStorage`.
3. **Auth.logout**:
   - Limpar também o `refresh_token` do `localStorage` no momento do logout.

#### [MODIFY] [client-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/client-core.js)
1. **Fetch Interceptor**:
   - Inserir o mesmo interceptor global de `window.fetch` no topo do arquivo.
2. **Login Submit Listener**:
   - Ler o valor do checkbox `remember-me` ("Sessão prolongada").
   - Se marcado, salvar o `refresh_token` recebido no `localStorage`. Caso contrário, garantir sua remoção.
3. **Auth.logout**:
   - Limpar o `refresh_token` do `localStorage`.

---

## 2. Plano de Verificação

### 2.1 Testes Automatizados
- Executar os testes unitários do sistema (`npm.cmd run test`) para certificar que as modificações não causaram regressões.

### 2.2 Verificação Manual
1. Acessar a tela de login admin/cliente sem marcar "Sessão prolongada". Verificar se o login funciona e se `refresh_token` não é salvo no `localStorage`.
2. Fazer login marcando "Sessão prolongada". Verificar se o `refresh_token` é gravado no `localStorage`.
3. Simular expiração do access token (alterando ou removendo o token no localStorage temporariamente ou aguardando expiração) e realizar qualquer ação no painel para verificar se o refresh automático ocorre sem deslogar o usuário.
4. Clicar em "Sair" e confirmar se ambos os tokens são limpos do `localStorage`.
