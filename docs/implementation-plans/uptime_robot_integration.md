# Implementation Plan - Uptime Robot Integration

This plan outlines the steps to integrate Uptime Robot monitor status into the InfoAPI dashboard footers.

## Proposed Changes

### Backend (NestJS)

#### [NEW] [uptime.service.ts](file:///c:/dev/infoapi/src/modules/uptime/uptime.service.ts)
- Create a service that uses `axios` to fetch the status of a specific monitor from Uptime Robot v3 API.
- Use `UPTIMEROBOT_APIKEY`, `UPTIMEROBOT_MONITOR_ID`, and `UPTIMEROBOT_APIURL` from `EnvService`.
- Map the response to return only the `status`.

#### [NEW] [uptime.controller.ts](file:///c:/dev/infoapi/src/modules/uptime/uptime.controller.ts)
- Expose a `GET /api/v1/uptime/status` endpoint.
- Protect the endpoint with `JwtAuthGuard`.

#### [NEW] [uptime.module.ts](file:///c:/dev/infoapi/src/modules/uptime/uptime.module.ts)
- Define the `UptimeModule` and import `EnvModule`.

#### [MODIFY] [app.module.ts](file:///c:/dev/infoapi/src/app.module.ts)
- Register `UptimeModule` in the `AppModule` imports.

### Frontend (HTML/JS)

#### [MODIFY] [admin.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/admin.html)
- Add a span with ID `uptime-status` in the footer to display the status.

#### [MODIFY] [client.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/client.html)
- Add a span with ID `uptime-status` in the footer to display the status.

#### [MODIFY] [admin-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-core.js)
- Add `fetchUptimeStatus` method to the `Data` object.
- Call `Data.fetchUptimeStatus` within `UI.setup`.
- Update the UI based on the status (2 = Online, others = Offline).

#### [MODIFY] [client-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/client-core.js)
- Add `loadUptimeStatus` method to the `UI` object.
- Call `UI.loadUptimeStatus` within `UI.initApp`.
- Update the UI based on the status.

## Verification Plan

### Automated Tests
- Create a unit test for `UptimeService` to verify it calls the correct API and returns the status.

### Manual Verification
- Log in as Admin and verify the footer shows "Online" (assuming the monitor is up).
- Log in as Client and verify the same.
- (Optional) Temporarily change the monitor ID to an invalid one or mock a failure to see the "Offline" status.
