# Implementação da Aba "Perfis dos Módulos"

Vamos adicionar uma nova aba ao painel do "Sistema" e criar uma integração direta entre as abas.

## Proposed Changes

### Componente Principal
#### [MODIFY] src/pages/configuracoes/Sistema.tsx
- Alterar o controle de aba (activeTab) para usar a URL (`useSearchParams`), permitindo links profundos (`?tab=perfis&moduloId=123`).
- Adicionar o item "Perfis dos Módulos" com a key `perfis` na propriedade `tabs`.
- Renderizar dinamicamente `<ModulosSistemaTab />` ou `<PerfisModuloSistemaTab />`.

### Aba Módulos de Sistema
#### [MODIFY] src/pages/configuracoes/modulosSistema/ModulosSistemaTab.tsx
- Adicionar uma "TableAction" customizada à `GenericTable` utilizando um ícone (ex: `AssignmentIcon`).
- Essa ação pegará a linha clicada e atualizará a URL para `?tab=perfis&moduloId=<ID_DO_MODULO>`, redirecionando e forçando a aba de Perfis a abrir focada nesse módulo.

### Aba Perfis de Módulos (Nova)
#### [NEW] src/pages/configuracoes/perfisModuloSistema/PerfisModuloSistemaTab.tsx
- Criação completa da listagem e grid de perfis.
- Adição de um `<TextField select>` para escolher o Módulo acima da tabela. As opções para o select virão de `useModulosSistema`.
- Sincronização desse select com o parâmetro `moduloId` na URL.
- O ID selecionado será repassado ativamente para o `usePerfisModuloSistema` (passando no GET).
- Ao clicar em "Novo Perfil", o ID que estiver selecionado no filtro será automaticamente inserido no formulário de inclusão.

#### [NEW] src/pages/configuracoes/perfisModuloSistema/PerfisModuloSistemaForm.tsx
- Formulário simples integrado ao RHF para criação/edição.
- O campo "Módulo" (`moduloSistemaId`) virá preenchido através da prop `defaultValues` enviada pela Tab.
- Inclusão dos selects para os enums (S/N) de `perfil` e `livre`, além de texto livre para `definicoes`.

### Refatoração Técnica
#### [MODIFY] src/features/perfisModuloSistema/hooks/
- Consertar nome dos arquivos que o usuário copiou com nomes de 'modulos', como `useUpdateModulo.ts` para `useUpdatePerfil.ts` garantindo coesão semântica.

## User Review Required
> [!IMPORTANT]
> O uso de search params (`?tab=perfis&moduloId=ID`) mudará um pouco como a página reage, a favor de ser mais resiliente e permitir que você envie um link direto de uma aba e um módulo filtrado para outro usuário sem problemas. Está de acordo com essa abordagem em vez de usar apenas um `useState` interno oculto?
