# Implementation Plan: Include Supplier Info (CRE_CODIGO, CRE_NOME) in Product Endpoints

## 1. Overview
The user requested adding `CRE_CODIGO` and `CRE_NOME` (from the `credores` table) to the responses of the following product endpoints:
- `GET /products`
- `GET /products/id/:id` (via `getUnique`)
- `GET /products/barcode/:barcode` (via `getUnique`)
- Also aligning `getById` in `ProductService` for internal consistency.

## 2. Database Mapping
- Primary table: `produtos P` has column `CRE_CODIGO`.
- Supplier table: `credores CR` with primary key `CR.CRE_CODIGO` and name `CR.CRE_NOME`.
- Join clause: `LEFT JOIN credores CR ON P.CRE_CODIGO = CR.CRE_CODIGO`.

## 3. Changes in `ProductService`
1. **`get()`**:
   - Add `P.CRE_CODIGO, CR.CRE_NOME` to the SELECT clause.
   - Add `LEFT JOIN credores CR ON P.CRE_CODIGO = CR.CRE_CODIGO` to the query.
2. **`getById()`**:
   - Add `P.CRE_CODIGO, CR.CRE_NOME` to the SELECT clause.
   - Add `LEFT JOIN credores CR ON P.CRE_CODIGO = CR.CRE_CODIGO` to the query.
3. **`getUnique()`**:
   - Add `P.CRE_CODIGO, CR.CRE_NOME` to the SELECT clause.
   - Add `LEFT JOIN credores CR ON P.CRE_CODIGO = CR.CRE_CODIGO` to the query.

## 4. Changes in DTOs (`product-response.dto.ts`)
Add Swagger documentation properties to:
- `ProductResponseDto`: `CRE_CODIGO?: number | null; CRE_NOME?: string | null;`
- `ProductDetailResponseDto`: `CRE_CODIGO?: number | null; CRE_NOME?: string | null;`
- `ProductBarcodeResponseDto`: `CRE_CODIGO?: number | null; CRE_NOME?: string | null;`

## 5. Testing & Validation
- Update `src/modules/product/product.service.spec.ts` to assert inclusion of supplier columns and the `LEFT JOIN credores` clause.
- Run `npm test src/modules/product/`.
- Run `npm run build`.
- Semantic commit in English and `git push`.
