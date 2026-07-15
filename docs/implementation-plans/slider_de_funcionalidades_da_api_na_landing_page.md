# Plano de Implementação: Slider de Funcionalidades da API na Landing Page

Implementar um slider de setas interativo e responsivo na página de pouso (`landing.html`) para apresentar de forma moderna e organizada todos os grupos e endpoints reais disponíveis na InfoAPI.

---

## 1. Alterações Propostas

### 1.1 Landing Page (`src/modules/integration-request`)

#### [MODIFY] [landing.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/landing.html)
- Adicionar estilos CSS customizados para o container do slider, os botões de controle de setas (anterior/próximo) e os cards dos endpoints com cores e temas modernos (tags GET em verde, POST em azul, fontes mono, efeitos hover).
- Substituir a seção antiga `#params` pelo novo layout de slider de setas contendo 6 categorias/grupos de endpoints reais:
  1. **Produtos & Estoque** (`/products`, `/products/groups`, `/products/brands`)
  2. **Vendas & Pedidos** (`/orders`, `/order-items`, `/orders/{id}/receipt`)
  3. **Financeiro & Contas** (`/account-payable`, `/account-receivable`, `/payment-methods`, `/payment-plans`)
  4. **Clientes & Fornecedores** (`/clients`, `/suppliers`)
  5. **Funcionários & Cargos** (`/employees`, `/employee-roles`)
  6. **Entregas & Lojas** (`/deliveries`, `/stores`)
- Inserir script JavaScript para navegação por setas (scroll suave com suporte para desativação dos botões ao chegar nos limites das extremidades).

---

## 2. Plano de Verificação

### 2.1 Verificação Manual
1. Abrir a página de pouso da integração no navegador.
2. Interagir com as setas para deslizar os cards de endpoints para a direita e esquerda.
3. Verificar a responsividade em telas menores (tablet e mobile).
