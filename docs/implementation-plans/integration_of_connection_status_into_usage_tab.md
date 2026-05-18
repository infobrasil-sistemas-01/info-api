# Integration of Connection Status into Usage Tab

The goal is to simplify the Client Portal by removing the dedicated "Status da Conexão" tab and moving its core information (API, Postgres, and Firebird status) into the "Meu Plano e Uso" tab as three new summary cards.

## Proposed Changes

### [Component Name] Client Portal Template

#### [MODIFY] [client.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/client.html)

1.  **Navigation**: Remove the "Status da Conexão" tab button.
2.  **Usage Tab Content**: Add 3 new cards to the `usage-grid`:
    -   **API Status**: Displays the health of the Core API.
    -   **Database Status (PG)**: Displays the health of the global PostgreSQL database.
    -   **Your Database (FB)**: Displays the health and latency of the client's Firebird database.
3.  **Status Tab Removal**: Delete the entire `<section id="tab-status">` block.
4.  **JavaScript Update**:
    -   Update `refreshTenantStatus` to target the new element IDs in the Usage tab.
    -   Update the `setInterval` logic to refresh status when the Usage tab is active.
    -   Update the `UI.switchTab` interceptor to trigger a refresh when switching to the 'usage' tab.

## Verification Plan

### Manual Verification
- Open the Client Portal.
- Verify that the "Status da Conexão" tab is gone.
- Verify that the "Meu Plano e Uso" tab now contains 6 cards (3 existing + 3 new status cards).
- Verify that the status indicators correctly show "ONLINE"/"ESTÁVEL" (green) or "INDISPONÍVEL"/"OFFLINE" (red).
- Verify that the Firebird card shows the connection latency.
- Verify that the status updates periodically while on the Usage tab.
