# Implementation Plan - Grupos (Products) Module

Implement the `Grupos` module within the `Produtos` category. This module manages product groups with extensive configuration for taxes, commissions, and printing settings.

## User Review Required

> [!IMPORTANT]
> The `Grupos` entity has many relationships (CSTs, Gêneros, Seções, CFOPs). I will implement a multi-section form using **Accordions** to organize these fields logically (General, Fiscal/Tax, Entry/Exit, Commissions, and Technical Settings).

## Proposed Changes

### Feature Layer (`src/features/grupos/`)

#### [NEW] [schemas.ts](file:///c:/dev/InfoBrasil-Frontend/src/features/grupos/schemas.ts)
* Define `grupoModelSchema`, `grupoCreateSchema`, and `grupoUpdateSchema`.
* Handle all 50+ fields provided in the specification, using appropriate types (number, string, nullable).

#### [NEW] [api.ts](file:///c:/dev/InfoBrasil-Frontend/src/features/grupos/api.ts)
* CRUD functions for `/cadastros/GruposPro`.

#### [NEW] [keys.ts](file:///c:/dev/InfoBrasil-Frontend/src/features/grupos/keys.ts)
* Query key factory for `grupos`.

#### [NEW] [hooks/](file:///c:/dev/InfoBrasil-Frontend/src/features/grupos/hooks/)
* Implement `useGruposList`, `useGrupo`, `useCreateGrupo`, `useUpdateGrupo`, and `useDeleteGrupo`.

---

### UI Layer (`src/pages/cadastros/grupos/`)

#### [NEW] [Grupos.tsx](file:///c:/dev/InfoBrasil-Frontend/src/pages/cadastros/grupos/Grupos.tsx)
* Main page with `GenericHeader` and `GenericTable`.
* Columns: Código, Descrição, Comissão, Desconto.

#### [NEW] [GruposForm.tsx](file:///c:/dev/InfoBrasil-Frontend/src/pages/cadastros/grupos/GruposForm.tsx)
* Complex form using `MUI Accordions`.
* **Section 1: Dados Gerais**: Descrição, Gênero, Secção, Tipo Item, NCM.
* **Section 2: Tributação Saída**: CST PIS/COFINS, CST ICMS, Alíquotas (IBS, CBS, IS), MVA, Redução ICMS.
* **Section 3: Tributação Entrada**: CST PIS/COFINS Entrada, CST ICMS Antecipado, CFOP Entrada.
* **Section 4: Comissões e Markup**: Comissões (Pre, Cor, Seguro), Markups 1 e 2.
* **Section 5: Configurações Técnicas**: Impressora, BaudRate, DataBits, Flow Control, etc.

---

### Integration

#### [MODIFY] [App.tsx](file:///c:/dev/InfoBrasil-Frontend/src/App.tsx)
* Register route `produtos/grupos`.

#### [MODIFY] [nav.config.tsx](file:///c:/dev/InfoBrasil-Frontend/src/components/layout/nav.config.tsx)
* Add `Grupos` to the `Produtos` section.

#### [MODIFY] [BreadcrumbsBar.tsx](file:///c:/dev/InfoBrasil-Frontend/src/components/layout/BreadcrumbsBar.tsx)
* Add breadcrumb mapping for `grupos`.

## Verification Plan

### Automated Tests (Manual Check)
* Verify if all dropdowns (CSTs, Gêneros, Seções) load data correctly.
* Test creation of a group with basic fields.
* Test updating tax fields inside accordions.
* Verify double-click on table row opens the edit form.

### Manual Verification
* Ensure the UI looks premium and follows the established ERP pattern.
* Check if accordion expansion/collapsing is smooth.
