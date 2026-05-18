# Implementation Plan - Notification Redesign

Redesign the notification system to be larger, more premium, and use modern aesthetics (glassmorphism, better typography, and vibrant icons).

## Proposed Changes

### UI Components

#### [MODIFY] [GenericSnackbar.tsx](file:///c:/dev/InfoBrasil-Frontend/src/components/feedback/GenericSnackbar.tsx)
- **Increase Size**: Increase `maxWidth` and internal padding.
- **Enhanced Icons**: Use larger MUI icons with a soft background circle.
- **Typography**: Upgrade font weights and sizes for better hierarchy.
- **Premium Aesthetics**:
    - Add a subtle border and deeper shadow.
    - Implement a "Progress Bar" at the bottom to show the time remaining before auto-hide.
    - Use a glassmorphism effect (backdrop-filter) on the card itself.
- **Layout**: Center-align or improve the layout for a more balanced look.

#### [MODIFY] [NotificationsProvider.tsx](file:///c:/dev/InfoBrasil-Frontend/src/components/feedback/NotificationsProvider.tsx)
- Ensure the options passed to `GenericSnackbar` reflect the new design capabilities (e.g., passing titles or custom colors if needed, though we'll keep it generic).

## Verification Plan

### Manual Verification
- Trigger different notification types (Success, Error, Info, Warning) from various parts of the app.
- Verify the auto-hide progress bar.
- Check responsiveness on mobile.
