# Optimize Health Checks for Sustainability

The current health check implementation causes significant overhead on Firebird databases because the client dashboard triggers a full system-wide ping of all active pools. We will optimize this by isolating tenant checks and implementing a caching strategy for global status.

## Proposed Changes

### Health Module

#### [MODIFY] [health.service.ts](file:///c:/dev/infoapi/src/modules/health/health.service.ts)
- **Implement Caching**: Cache the results of `checkPostgres()` and the full `check()` for 30 seconds.
- **Granular Access**: Ensure `checkPostgres` is accessible for individual tenant status checks without running the full suite.

### Status Module

#### [MODIFY] [status.controller.ts](file:///c:/dev/infoapi/src/modules/status/status.controller.ts)
- **Isolate Tenant Status**: Refactor `getMyConnection` to call `checkPostgres()` and `checkTenant()` directly, bypassing the expensive `checkFirebird()` (which pings all active pools).

### Database Infrastructure

#### [MODIFY] [tenant-connection.service.ts](file:///c:/dev/infoapi/src/infra/database/tenant-connection.service.ts)
- **Parallelize Pings**: Update `pingActivePools` to use `Promise.all` with a limit or at least run in parallel to avoid sequential blocking timeouts.
- **Add Ping Method**: Ensure a clean public `pingPostgres` or similar if needed (currently using `checkPostgres` in `HealthService`).

## Verification Plan

### Automated Tests
- Run existing tests to ensure no regressions.
- Verify that `getMyConnection` no longer triggers `pingActivePools`.

### Manual Verification
- Monitor API logs when accessing the client dashboard to verify that only the relevant tenant is pinged.
- Verify that multiple refreshes within 30 seconds return cached values for Postgres/API status.
