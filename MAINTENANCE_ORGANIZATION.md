# Maintenance Components Organization

## Overview

The maintenance components have been reorganized into a more structured hierarchy based on user roles and functionality.

## New Structure

```
src/components/Maintenance/
├── Admin/
│   ├── MaintenanceTable.jsx          # Admin table with edit/delete capabilities
│   ├── EditMaintenancePopup.jsx      # Admin-only edit popup
│   └── index.js                      # Admin components exports
├── User/
│   ├── AddMaintenancePopup.jsx       # User create maintenance popup
│   ├── MaintenanceTableUser.jsx      # User read-only table
│   └── index.js                      # User components exports
├── shared/
│   ├── DeleteConfirmDialog.jsx       # Shared delete confirmation
│   ├── MaintenanceHomeCard.jsx       # Navigation card component
│   ├── MaintenanceNotificationCard.jsx # Notification display card
│   ├── PaginationComponent.jsx       # Pagination utility component
│   ├── MaintenanceDialog.css         # Shared dialog styles
│   ├── MaintenancePopup.css          # Shared popup styles (empty)
│   └── index.js                      # Shared components exports
└── index.js                          # Main exports file
```

## Component Categories

### Admin Components

- **MaintenanceTable.jsx**: Full-featured table with edit, delete, and notification capabilities
- **EditMaintenancePopup.jsx**: Modal for editing maintenance requests with status updates

### User Components

- **AddMaintenancePopup.jsx**: Modal for users to create new maintenance requests
- **MaintenanceTableUser.jsx**: Read-only table view for users to see their requests

### Shared Components

- **DeleteConfirmDialog.jsx**: Reusable confirmation dialog for delete operations
- **MaintenanceHomeCard.jsx**: Card component for maintenance category navigation
- **MaintenanceNotificationCard.jsx**: Component for displaying maintenance notifications
- **PaginationComponent.jsx**: Pagination utility for maintenance notification lists
- **MaintenanceDialog.css**: Shared styling for all maintenance dialogs
- **MaintenancePopup.css**: Additional popup styles (currently empty)

## Updated Import Paths

### Before:

```javascript
import { MaintenanceTable } from '../../../components/Maintenance/MaintenanceTable.jsx';
import { AddMaintenancePopup } from '../../../components/Maintenance/AddMaintenancePopup.jsx';
import MaintenenHomeCard from '../../../components/Maintenance/MaintenanceHomeCard';
```

### After (using index exports):

```javascript
import { MaintenanceTable } from '../../../components/Maintenance/Admin';
import { AddMaintenancePopup } from '../../../components/Maintenance/User';
import { MaintenanceHomeCard } from '../../../components/Maintenance/shared';
```

### Alternative (direct imports):

```javascript
import { MaintenanceTable } from '../../../components/Maintenance/Admin/MaintenanceTable.jsx';
import { AddMaintenancePopup } from '../../../components/Maintenance/User/AddMaintenancePopup.jsx';
import { MaintenanceHomeCard } from '../../../components/Maintenance/shared/MaintenanceHomeCard.jsx';
```

## Files Updated

### Components Moved:

- `MaintenanceTable.jsx` → `Admin/MaintenanceTable.jsx`
- `EditMaintenancePopup.jsx` → `Admin/EditMaintenancePopup.jsx`
- `AddMaintenancePopup.jsx` → `User/AddMaintenancePopup.jsx`
- `MaintenanceTableUser.jsx` → `User/MaintenanceTableUser.jsx`
- `DeleteConfirmDialog.jsx` → `shared/DeleteConfirmDialog.jsx`
- `MaintenanceHomeCard.jsx` → `shared/MaintenanceHomeCard.jsx`
- `MaintenanceNotificationCard.jsx` → `shared/MaintenanceNotificationCard.jsx`
- `PaginationComponent.jsx` → `shared/PaginationComponent.jsx`
- `MaintenanceDialog.css` → `shared/MaintenanceDialog.css`
- `MaintenancePopup.css` → `shared/MaintenancePopup.css`

### Import Paths Updated:

- `src/pages/User/Maintenance/MaintenanceDetailsUser.jsx`
- `src/pages/Admin/Maintenance/MaintenanceHome.jsx`
- `src/pages/Admin/Maintenance/MaintenanceDetails.jsx`
- `src/components/Maintenance/Admin/MaintenanceTable.jsx`
- `src/components/Maintenance/Admin/EditMaintenancePopup.jsx`
- `src/components/Maintenance/User/AddMaintenancePopup.jsx`
- `src/components/Maintenance/shared/DeleteConfirmDialog.jsx`

### Index Files Created:

- `src/components/Maintenance/index.js` - Main exports
- `src/components/Maintenance/Admin/index.js` - Admin component exports
- `src/components/Maintenance/User/index.js` - User component exports
- `src/components/Maintenance/shared/index.js` - Shared component exports

## Benefits

1. **Clear Separation of Concerns**: Components are organized by user role and functionality
2. **Better Maintainability**: Related components are grouped together
3. **Cleaner Imports**: Index files provide cleaner import statements
4. **Scalability**: New components can be easily added to appropriate folders
5. **Role-based Access**: Clear distinction between admin and user components
6. **Shared Resources**: Common components and styles are properly shared
