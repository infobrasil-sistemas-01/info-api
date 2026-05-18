# Email Validation for Integration Requests

This plan outlines the implementation of an email verification step for new integration requests. Requests will start in an `AWAITING_CONFIRMATION` state and only move to `PENDING` after the user clicks a verification link sent to their email.

## User Review Required

> [!IMPORTANT]
> The admin operations (approve/reject) will be explicitly blocked for requests in `AWAITING_CONFIRMATION` status.

## Proposed Changes

### Integration Request Module

#### [MODIFY] [schema.prisma](file:///c:/dev/infoapi/prisma/schema.prisma)
- No changes strictly needed as `status` is a string, but we will define the logic in code.

#### [MODIFY] [integration-request.service.ts](file:///c:/dev/infoapi/src/modules/integration-request/integration-request.service.ts)
- Update `create`:
    - Set initial status to `AWAITING_CONFIRMATION`.
    - Send a "Verification Required" email with a link to `/api/v1/integration/confirm/:id`.
    - Remove immediate notifications to support and the "Request Received" client email.
- Add `confirm(id: string)`:
    - Verify if request exists and is in `AWAITING_CONFIRMATION` status.
    - Update status to `PENDING`.
    - Trigger notifications: "Request Received" to client and "New Request" to support.
- Update `updateStatus`:
    - Add guard: `if (currentStatus === 'AWAITING_CONFIRMATION') throw ForbiddenException(...)`.

#### [MODIFY] [integration-request.controller.ts](file:///c:/dev/infoapi/src/modules/integration-request/integration-request.controller.ts)
- Add `GET /confirm/:id` endpoint.
- This endpoint will return a simple HTML success message (or a new template).

#### [NEW] [confirmed.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/confirmed.html)
- A simple, branded page confirming the email was validated and the request is now under analysis.

### Frontend (Admin Dashboard)

#### [MODIFY] [admin-components.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-components.js)
- Update `translateStatus` to include `AWAITING_CONFIRMATION`.
- Update `RequestCard` to disable "Aprovar" and "Recusar" buttons when status is `AWAITING_CONFIRMATION`.

#### [MODIFY] [admin.css](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin.css)
- Add styling for the `awaiting_confirmation` status badge (e.g., orange/yellow).

## Verification Plan

### Automated Tests
- Test that `create` sets status to `AWAITING_CONFIRMATION`.
- Test that `updateStatus` fails for `AWAITING_CONFIRMATION` requests.
- Test that `confirm` changes status to `PENDING` and triggers emails.

### Manual Verification
1. Submit a new integration request.
2. Check email for verification link.
3. Verify that the request appears in the Admin Panel as "Aguardando Confirmação" and buttons are disabled.
4. Click the link in the email.
5. Verify status changes to "Pendente" and buttons are now enabled.
6. Verify that support receives the notification only after confirmation.
