# Integration Request Feature

Implement a new module to manage integration requests from clients, including a persistent database table, a submission API, and two premium web interfaces: one for clients to submit requests and another for the support team to manage them.

## Proposed Changes

### [Component] Database (Prisma)

#### [MODIFY] [schema.prisma](file:///c:/dev/infoapi/prisma/schema.prisma)
- Add `IntegrationRequest` model.
- Add `HostingType` enum.
- Fields: `clientName`, `hostingType`, `fixedIp`, `database` (Json), `stores` (Int[]), `scopes` (Json), `objective`, `technicalContact` (Json), `status` (String), and timestamps.

### [Component] Integration Request Module

#### [NEW] [integration-request.module.ts](file:///c:/dev/infoapi/src/modules/integration-request/integration-request.module.ts)
- Standard NestJS module definition.

#### [NEW] [create-integration-request.dto.ts](file:///c:/dev/infoapi/src/modules/integration-request/dto/create-integration-request.dto.ts)
- Zod schema and DTO class using `ZodDto` for validation and Swagger.

#### [NEW] [integration-request.service.ts](file:///c:/dev/infoapi/src/modules/integration-request/integration-request.service.ts)
- `create`: Saves request to database.
- `findAll`: Lists all requests for admin.
- `updateStatus`: Allows admin to approve/reject.

#### [NEW] [integration-request.controller.ts](file:///c:/dev/infoapi/src/modules/integration-request/integration-request.controller.ts)
- `GET /integration/form`: Serves the premium HTML form for clients.
- `GET /integration/admin`: Serves the premium HTML dashboard for support.
- `POST /api/v1/integration-requests`: API endpoint for submission.
- `GET /api/v1/integration-requests`: API endpoint for admin listing.

### [Component] Frontend (Web Interfaces)

#### [NEW] [form.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/form.html)
- A "WOW" client form using modern CSS (Inter font, glassmorphism, smooth transitions).
- Client-side validation and AJAX submission to the API.

#### [NEW] [admin.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/admin.html)
- A premium admin dashboard using a clean, professional design (dark/light mode support, card layout).
- Displays all submitted requests and their status.

## Verification Plan

### Automated Tests
- `npm run test src/modules/integration-request/*.spec.ts` (if implemented).
- Manual verification of the API using Swagger.

### Manual Verification
- Open `http://localhost:3000/integration/form` and submit a request.
- Open `http://localhost:3000/integration/admin` and verify the request is visible.
- Verify database entry via Prisma Studio.

> [!IMPORTANT]
> The HTML files will be served directly by the controller using `@Res()`, avoiding complex static file configuration while maintaining a high-quality "WOW" factor for the UI.
