# Implementation Plan - Fix Missing Static Assets in Production

After modularization, the `admin.html` dashboard in the `integration-request` module is unable to load its CSS and JS assets in production. This is because NestJS is only configured to copy `.html` files to the `dist` directory, leaving `.css` and `.js` files behind.

## User Review Required

> [!IMPORTANT]
> This change modifies the build process to include `.css` and `.js` files as assets. If there are other static assets (like images or fonts) in the source tree that should also be included, we should add them to the list as well.

## Proposed Changes

### Build Configuration

#### [MODIFY] [nest-cli.json](file:///c:/dev/infoapi/nest-cli.json)
- Add `**/*.css` and `**/*.js` to the `compilerOptions.assets` array to ensure these files are copied to the `dist` folder during the build process.

## Verification Plan

### Automated Verification
- Run `npm run build` locally and verify that `dist/modules/integration-request/templates/assets/` contains the `.css` and `.js` files.

### Manual Verification
- Deploy to a staging environment (or simulate production locally by running from `dist`) and access `/integration/admin` to verify that the styles and scripts load correctly.
