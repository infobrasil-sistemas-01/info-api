# Plan: Admin VPN Restriction

Restricting administrative access to a specific VPN IP range (172.26.0.xxx) and local loopback addresses (127.0.0.1, ::1).

## User Review Required

> [!IMPORTANT]
> The restriction will be applied to all administrative controllers. Ensure your VPN IP remains within the `172.26.0.` prefix when accessing the production environment.

## Proposed Changes

### Infrastructure

#### [NEW] [vpn.guard.ts](file:///c:/dev/infoapi/src/infra/guards/vpn.guard.ts)
- Implement `VpnGuard` to validate `request.ip`.
- Whitelist: `127.0.0.1`, `::1`, `::ffff:127.0.0.1` and `172.26.0.*`.

#### [MODIFY] [env.schema.ts](file:///c:/dev/infoapi/src/config/env/env.schema.ts)
- Add `ALLOWED_VPN_PREFIX` (default: `172.26.0.`).

### Modules (Controllers)

#### [MODIFY] [user.controller.ts](file:///c:/dev/infoapi/src/modules/user/user.controller.ts)
#### [MODIFY] [role.controller.ts](file:///c:/dev/infoapi/src/modules/role/role.controller.ts)
#### [MODIFY] [permission.controller.ts](file:///c:/dev/infoapi/src/modules/permission/permission.controller.ts)
#### [MODIFY] [db-credentials.controller.ts](file:///c:/dev/infoapi/src/modules/db-credentials/db-credentials.controller.ts)
#### [MODIFY] [integration-request.controller.ts](file:///c:/dev/infoapi/src/modules/integration-request/integration-request.controller.ts)
- Apply `@UseGuards(VpnGuard)` to sensitive endpoints, especially the `/integration/admin` route that serves `admin.html`.
- Ensure the public form route remains accessible.

## Verification Plan

### Automated Tests
- Create a temporary test route with `VpnGuard` and verify access from different mocked IPs.

### Manual Verification
- Access the admin panel from localhost (should be allowed).
- Simulate an external IP access (should be blocked with 403).
- Connect to VPN and verify access.
