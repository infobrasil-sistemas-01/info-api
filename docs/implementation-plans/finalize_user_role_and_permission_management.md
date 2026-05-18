# Implementation Plan - Finalize User, Role and Permission Management

This plan outlines the steps to finalize the RBAC (Role-Based Access Control) system and integrate user/role management into the Admin dashboard.

## User Review Required

> [!IMPORTANT]
> The "Gestão de Usuários e Roles" tab will be visible only to users with the `core.users.view` permission.
> Role assignment to users is currently 1-to-1 (one role per user).

## Proposed Changes

### Backend - Database & RBAC

#### [MODIFY] [auth.service.ts](file:///c:/dev/infoapi/src/modules/auth/auth.service.ts)
- Update `login` method to return the user's permissions. This allows the frontend to dynamically show/hide UI elements.
- Inject `PermissionResolver` to fetch permissions during login.

#### [MODIFY] [auth.controller.ts](file:///c:/dev/infoapi/src/modules/auth/auth.controller.ts)
- Add a `/api/v1/auth/me` endpoint to return the current user's profile and permissions.

#### [MODIFY] [user.dto.ts](file:///c:/dev/infoapi/src/modules/user/dto/user.dto.ts)
- Fix the DTO file with proper Zod schemas for `CreateUserDto` and `UpdateUserDto`.

---

### Frontend - Admin Dashboard

#### [MODIFY] [admin.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/admin.html)
- Implement a tabbed interface: "Solicitações" and "Usuários & Roles".
- Add logic to check permissions and display the "Usuários & Roles" tab only if the user has `core.users.view`.
- **Users Management Section**:
  - List users with their roles and status.
  - Modal to create/edit users (name, password, role, store, status).
  - Delete user functionality.
- **Roles Management Section**:
  - List roles with user counts.
  - Modal to create/edit roles (name, description, permissions checklist).
  - Delete role functionality.

---

### Infrastructure

#### [MODIFY] [main.ts](file:///c:/dev/infoapi/src/main.ts)
- Ensure global guards or configurations are set up if needed (though already done via global modules).

## Verification Plan

### Automated Tests
- Run `npm run test` to ensure no regressions in existing service tests.

### Manual Verification
1. Login as a user with `core.users.view` and verify the new tab appears.
2. Login as a user WITHOUT `core.users.view` and verify the tab is hidden.
3. Create a new Role, assign some permissions, and then assign this role to a user.
4. Verify the user now has the assigned permissions (try accessing restricted endpoints).
5. Update a Role's permissions and verify the change takes effect (may require re-login or check if guard handles it live).
6. Delete a Role and verify it's not possible if users are linked.
