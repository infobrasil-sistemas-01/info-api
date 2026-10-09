# Plano de Implementação: Correção da Ação de Rotação de Chave no Portal do Cliente

Este plano detalha a correção do botão de rotação de senha/chave de acesso no portal do cliente (`client.html`), restabelecendo o contrato entre os seletores do DOM e o manipulador assíncrono em `client-core.js`.

---

## 1. Problema Identificado

No portal do cliente (`client.html`), o botão da seção de Rotação de Chave possuía a classe `btn-primary`, enquanto a função `UI.confirmRotation()` em `client-core.js` executava:
```javascript
const btn = document.querySelector('.btn-rotate');
btn.disabled = true; // TypeError: Cannot read properties of null
```
Como `.btn-rotate` não existia no DOM, a chamada gerava uma exceção não tratada logo após a confirmação do modal (`confirm()`), impedindo a requisição HTTP `POST /api/v1/users/me/rotate-password` de ser enviada.

---

## 2. Solução Implementada (Abordagem A com Resiliência Defensiva)

1. **Alinhamento do Contrato do DOM:**
   - Adicionar o identificador único `id="btn-rotate-password"` e a classe `.btn-rotate` ao botão em `client.html`.
2. **Atualização do Manipulador (`client-core.js`):**
   - Atualizar a busca pelo elemento priorizando o ID específico (`#btn-rotate-password`) com fallback para `.btn-rotate`.
   - Adicionar verificação defensiva de existência (`if (btn)`), garantindo que mesmo se o elemento sofrer alterações no DOM, a operação de rotação de credenciais não seja abortada.
3. **Invalidação de Cache de Assets:**
   - Adicionar versionamento por query string (`?v=1.17.1`) na importação de `client-core.js` em `client.html`.

---

## 3. Arquivos Modificados

- `src/modules/integration-request/templates/client.html`
- `src/modules/integration-request/templates/assets/client-core.js`
