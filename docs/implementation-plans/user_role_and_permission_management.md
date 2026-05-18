# Implementation Plan - User, Role, and Permission Management

This plan outlines the creation of management modules for Users, Roles, and Permissions in the Info Vendas API, including RBAC protection and an updated admin interface.

## Proposed Changes

### 1. User Management Module
Create a new module to handle User CRUD operations.

#### [NEW] [user.module.ts](file:///c:/dev/infoapi/src/modules/user/user.module.ts)
- Standard NestJS module.

#### [NEW] [user.service.ts](file:///c:/dev/infoapi/src/modules/user/user.service.ts)
- `create`: Hashes password using `argon2`, associates with role and db credentials.
- `findAll`: Returns all users (excluding sensitive data like password hashes).
- `findOne`: Returns a single user with role details.
- `update`: Updates user data, status, and handles password reset.
- `remove`: Deletes a user.

#### [NEW] [user.controller.ts](file:///c:/dev/infoapi/src/modules/user/user.controller.ts)
- Protect all endpoints with `RequirePermissions`.
- `POST /users`: `core.users.create`
- `GET /users`: `core.users.view`
- `GET /users/:id`: `core.users.view`
- `PATCH /users/:id`: `core.users.update`
- `DELETE /users/:id`: `core.users.delete`

---

### 2. Role & Permission Management Module
Create modules to handle Roles and Permissions.

#### [NEW] [role.module.ts](file:///c:/dev/infoapi/src/modules/role/role.module.ts)
#### [NEW] [role.service.ts](file:///c:/dev/infoapi/src/modules/role/role.service.ts)
- `create`: Creates a role with associated permissions.
- `findAll`: Lists roles.
- `findOne`: Gets role with its permissions.
- `update`: Updates role name/description and syncs permissions.
- `remove`: Deletes a role.

#### [NEW] [role.controller.ts](file:///c:/dev/infoapi/src/modules/role/role.controller.ts)
- Protect all endpoints with `RequirePermissions`.
- `POST /roles`: `core.roles.create`
- `GET /roles`: `core.roles.view`
- `PATCH /roles/:id`: `core.roles.update`
- `DELETE /roles/:id`: `core.roles.delete`

#### [NEW] [permission.controller.ts](file:///c:/dev/infoapi/src/modules/permission/permission.controller.ts)
- `GET /permissions`: `core.roles.view` (Lists all available permissions in the system).

---

### 3. Application Integration
#### [MODIFY] [app.module.ts](file:///c:/dev/infoapi/src/app.module.ts)
- Register the new modules.

#### [MODIFY] [admin.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/admin.html)
- Add a "Usuários" tab.
- Implement conditional rendering based on `core.users.view` (using server-side or client-side logic as established in the project).

## Verification Plan

### Automated Tests
- Create unit tests for `UserService` and `RoleService`.
- Verify password hashing and permission syncing.

### Manual Verification
- Test all endpoints via Swagger/Insomnia.
- Verify that a user without `core.users.view` cannot see the tab or access the API.
- Verify that permissions are correctly resolved after updating a role.
