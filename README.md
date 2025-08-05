# Resource Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)

Resource Hub is a comprehensive web application designed for efficient management of organizational resources, including meals, assets, and maintenance tasks. Built with modern React and TypeScript, it provides distinct interfaces and functionalities for Administrators, SuperAdmins, and regular Users with advanced role-based access control.

## 🚀 Demo

> **Note:** Add screenshots or demo links here once available

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Application Routes](#-application-routes)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Scripts](#-scripts)
- [API Integration](#-api-integration)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 👨‍💼 Admin & SuperAdmin Features

- **Dashboard:** Comprehensive overview of organizational statistics and activities with advanced analytics
- **Meal Management:**
  - Configure meal types (breakfast, lunch, dinner) and custom meal categories
  - Set meal times and availability schedules
  - Monitor meal requests and generate analytics reports
  - Manage requested meals with approval workflows
- **Asset Management:**
  - Add, edit, and delete organizational assets across multiple categories
  - Monitor asset requests and allocations in real-time
  - Track asset status, availability, and due dates
  - Comprehensive asset monitoring with category-based filtering
- **Maintenance Management:**
  - Review and assign maintenance requests across multiple categories
  - Set priorities and track task statuses with detailed workflows
  - Manage maintenance services including tech support, general maintenance, cleaning, furniture, safety, and lighting
- **User Management:** Create, edit, and manage user accounts with role-based permissions
- **Advanced Reporting:** Generate detailed PDF reports for meals, assets, and maintenance activities
- **System Settings:** Configure application-wide settings and organization details
- **Role Switching:** SuperAdmins can switch between admin and user views

### 👤 User Features

- **Personal Dashboard:** View personalized statistics, upcoming activities, and quick actions
- **Meal Requests:**
  - Interactive FullCalendar interface for meal booking and management
  - View meal schedules, availability, and personal meal history
- **Asset Requests:**
  - Submit asset requests with category-based filtering
  - Track asset request status and due dates
  - View personal asset allocation history
- **Maintenance Requests:** Report maintenance issues and track progress with detailed status updates
- **Notifications:** Real-time notifications system with unread count indicators
- **Profile Settings:** Manage personal information, account settings, and theme preferences
- **View Organization:** Access organization details and user directory

### 🔒 Common Features

- **Advanced Role-Based Access Control:** Secure, permission-based interface with support for User, Admin, and SuperAdmin roles
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices
- **Advanced Theme Support:** Light and dark mode options with dynamic theme switching
- **Real-time Notifications:** Instant updates, alerts, and notification management system
- **PDF Export:** Generate and download comprehensive reports
- **Protected Routes:** Secure routing with authentication and authorization guards
- **Multi-Layout Architecture:** Separate layouts for Admin and User interfaces
- **Context-Based State Management:** Efficient global state management with React Context

## 🛠 Tech Stack

### Frontend Framework & Core

- **Framework:** React 18.3.1 with TypeScript 5.5.3
- **Build Tool:** Vite 5.4.2 (Lightning-fast development and build)
- **UI Framework:** Material-UI (MUI) 5.14.16
- **Styling:** Tailwind CSS 3.4.1 + PostCSS 8.4.35
- **Routing:** React Router DOM 7.5.2

### State Management & Data Fetching

- **API Client:** Axios 1.9.0
- **Data Fetching:** TanStack React Query 5.74.7
- **Context Management:** React Context API for global state
- **Authentication:** JWT-based authentication with protected routes

### UI Components & Libraries

- **Calendar:** FullCalendar 6.1.17 (with React integration)
- **Charts & Analytics:** Chart.js 4.4.0 + react-chartjs-2 5.2.0, Recharts 2.15.3
- **Icons:** Material-UI Icons, Lucide React 0.344.0
- **Notifications:** React Hot Toast 2.5.2, React Toastify 11.0.5
- **PDF Generation:** html2pdf.js 0.10.3

### Development Tools & Configuration

- **Linting:** ESLint 9.9.1 with TypeScript support and Prettier integration
- **Formatting:** Prettier 3.5.3 with consistent code style
- **CSS Processing:** PostCSS 8.4.35, Autoprefixer 10.4.18
- **Type Checking:** TypeScript with strict configuration

## 📁 Project Structure

```
Resource_Hub-Frontend/
├── public/                         # Static assets and media files
│   ├── *.png                      # Application images and logos
│   ├── Asset/                     # Asset category icons (Electronics, Furniture, etc.)
│   ├── Maintenance/               # Maintenance-related images and categories
│   └── Report/                    # Report category icons and assets
│
├── src/
│   ├── App.jsx                    # Main application component with routing configuration
│   ├── main.jsx                   # Application entry point with providers
│   ├── index.css                  # Global styles (Tailwind base configuration)
│   │
│   ├── components/                # Reusable UI components organized by feature
│   │   ├── ProtectedRoute.tsx     # Route protection with role-based access control
│   │   ├── Asset/                 # Asset management components
│   │   │   ├── AssetMonitoring/   # Asset monitoring and tracking features
│   │   │   ├── AssetRequestingUser/ # User asset request components and dialogs
│   │   │   └── OrganizationAssets/ # Organization asset management tools
│   │   ├── Calendar/              # Calendar and meal scheduling components
│   │   │   ├── CalendarComponents.css # Calendar-specific styling
│   │   │   ├── MealTimeCard.jsx   # Meal time selection components
│   │   │   ├── MealTypeCard.jsx   # Meal type management
│   │   │   └── Calender-CSS/      # Calendar styling directory
│   │   ├── Dashboard/             # Dashboard components for different roles
│   │   │   ├── Admin/             # Admin dashboard features and charts
│   │   │   ├── Common/            # Shared dashboard components
│   │   │   └── User/              # User dashboard features
│   │   ├── Maintenance/           # Maintenance management system
│   │   │   ├── Admin/             # Admin maintenance tools and tables
│   │   │   ├── User/              # User maintenance request components
│   │   │   └── shared/            # Shared maintenance components
│   │   ├── Meal/                  # Meal management system
│   │   │   ├── Meal-CSS/          # Meal-specific styling
│   │   │   ├── MealTime/          # Meal timing components
│   │   │   ├── MealType/          # Meal type management
│   │   │   └── RequestedMeals/    # Meal request management
│   │   ├── Notification/          # Notification system components
│   │   ├── Report/                # Reporting and analytics components
│   │   ├── Settings/              # Application settings management
│   │   │   ├── Account/           # Account settings
│   │   │   ├── Appearance/        # Theme and appearance settings
│   │   │   ├── Organization/      # Organization configuration
│   │   │   ├── Profile/           # Profile management
│   │   │   └── Shared/            # Shared settings components
│   │   └── Users/                 # User management components
│   │
│   ├── contexts/                  # React context providers for global state
│   │   ├── SidebarContext.tsx     # Sidebar state and mobile responsiveness
│   │   └── UserContext.tsx        # User authentication and role management
│   │
│   ├── hooks/                     # Custom React hooks for reusable logic
│   │   ├── useNotifications.js    # Notification management and real-time updates
│   │   └── useThemeStyles.js      # Theme and styling utilities
│   │
│   ├── layouts/                   # Page layout structures for different user roles
│   │   ├── Admin/                 # Admin layout with header and sidebar
│   │   │   ├── AdminLayout.jsx    # Main admin layout wrapper
│   │   │   ├── AdminHeader.jsx    # Admin-specific header with notifications
│   │   │   └── AdminSidebar.jsx   # Admin navigation sidebar
│   │   ├── User/                  # User layout components
│   │   │   ├── UserLayout.jsx     # Main user layout wrapper
│   │   │   ├── UserHeader.jsx     # User-specific header
│   │   │   └── UserSidebar.jsx    # User navigation sidebar
│   │   └── shared/                # Shared layout components
│   │       ├── BaseLayout.jsx     # Base layout structure
│   │       ├── AppHeader.jsx      # Shared header component
│   │       └── SidebarWrapper.jsx # Sidebar wrapper component
│   │
│   ├── pages/                     # Top-level page components organized by role
│   │   ├── Auth/                  # Authentication pages
│   │   │   ├── Login.jsx          # User login with role-based routing
│   │   │   ├── Register.jsx       # User registration
│   │   │   └── ForgotPassword.jsx # Password recovery
│   │   ├── Admin/                 # Admin-specific pages
│   │   │   ├── DashboardAdmin.jsx # Admin dashboard with analytics
│   │   │   ├── Requested_Assets/  # Asset management pages
│   │   │   ├── Organization_Assets/ # Organization asset pages
│   │   │   ├── Maintenance/       # Maintenance management pages
│   │   │   ├── Meal_Management/   # Meal configuration pages
│   │   │   ├── Reports/           # Report generation pages
│   │   │   └── UserManagement/    # User administration pages
│   │   ├── User/                  # User-specific pages
│   │   │   ├── DashboardUser.jsx  # User dashboard
│   │   │   ├── RequestAsset/      # Asset request pages
│   │   │   ├── MealRequest/       # Meal booking pages
│   │   │   ├── Maintenance/       # Maintenance request pages
│   │   │   └── ViewUsers/         # User directory pages
│   │   ├── Shared/                # Pages accessible by multiple roles
│   │   │   ├── Settings.jsx       # Settings management
│   │   │   ├── Notification.jsx   # Notification center
│   │   │   └── OrganizationDetails.jsx # Organization information
│   │   └── css/                   # Page-specific stylesheets
│   │
│   ├── query/                     # React Query hooks for data fetching
│   │   ├── adminDashboardQueries.js # Admin dashboard data queries
│   │   └── userDashboardQueries.js  # User dashboard data queries
│   │
│   ├── services/                  # External service integrations and API management
│   │   └── api/                   # API service configurations
│   │       ├── config.js          # API endpoints and base URLs
│   │       └── notificationService.js # Notification API service
│   │
│   ├── theme/                     # Material-UI theme configuration
│   │   ├── theme.ts               # Theme definitions and color schemes
│   │   └── ThemeProvider.tsx      # Theme provider with context
│   │
│   ├── utils/                     # Utility functions and helpers
│   │   ├── authHeader.js          # Authentication header utilities
│   │   ├── dateUtils.js           # Date manipulation and formatting
│   │   ├── notificationApi.js     # Notification API utilities
│   │   └── sendAssetNotification.js # Asset notification helpers
│   │
│   ├── styles/                    # Additional styling resources
│   └── css/                       # Global CSS files
│
├── Configuration Files/
├── eslint.config.js               # ESLint configuration with TypeScript rules
├── tailwind.config.js             # Tailwind CSS configuration and theme
├── postcss.config.js              # PostCSS configuration for CSS processing
├── vite.config.ts                 # Vite build configuration and optimization
├── vercel.json                    # Vercel deployment configuration
└── package.json                   # Project dependencies and npm scripts
```

## 🚦 Application Routes

### Public Routes

- `/` - Redirects to login page
- `/login` - User authentication
- `/register` - User registration
- `/forgot-password` - Password recovery

### Admin Routes (Admin & SuperAdmin Access)

- `/admin-dashboardadmin` - Admin dashboard with analytics
- `/admin-assethome` - Asset categories overview
- `/admin-assetmonitoring` - Asset monitoring and tracking
- `/admin-dueassets` - Assets due for return
- `/admin-asset` - Organization asset management
- `/admin-maintenance` - Maintenance request management
- `/admin-maintenancehome` - Maintenance categories
- `/admin-reporthome` - Reports dashboard
- `/admin-assetreport` - Asset reports
- `/admin-mealreport` - Meal reports
- `/admin-maintenancereport` - Maintenance reports
- `/admin-mealTimes` - Meal time configuration
- `/admin-mealTypes` - Meal type management
- `/admin-requestedMeals` - Meal request management
- `/admin-users` - User management

### User Routes

- `/user-dashboarduser` - User dashboard
- `/user-users` - User directory
- `/user-assetrequest` - Asset request submission
- `/user-dueassets` - User's due assets
- `/user-mealcalendar` - Meal booking calendar
- `/user-maintenance` - Maintenance request submission

### Shared Routes (All Authenticated Users)

- `/notifications` - Notification center
- `/settings` - Application settings
- `/organization` - Organization details

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16.0 or higher)
- **npm** (version 7.0 or higher) or **yarn** (version 1.22 or higher)
- **Git** (for cloning the repository)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/FiveStackDev/Resource_Hub-Frontend.git
cd Resource_Hub-Frontend
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and configure your environment variables:

```env
# Cloudinary Configuration (for file uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_API_URL=https://api.cloudinary.com/v1_1/your_cloud_name/image/upload

# Optional: Additional configuration variables
VITE_APP_NAME=Resource Hub
```

> **Note:** The application uses Cloudinary for file uploads (profile pictures, asset images, etc.). Get your Cloudinary credentials from your [Cloudinary Dashboard](https://cloudinary.com/console). The API endpoints are configured directly in `src/services/api/config.js` and don't require environment variables for local development.

## 🎯 Usage

### Development Mode

Start the development server:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will open in your browser at `http://localhost:5173` (or the port specified by Vite).

### Production Build

Build the application for production:

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📜 Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build the application for production     |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint to check code quality         |
| `npm run format`  | Format code using Prettier               |

## 🔌 API Integration

This frontend application is designed to work with a microservices architecture and requires multiple backend services to function properly. The application communicates with various backend services through RESTful APIs:

### Microservices Integration

- **Authentication Service (Port 9094):** User login, registration, and JWT token management
- **Asset Management Service (Port 9090):** Asset CRUD operations, asset requests, and monitoring
- **Maintenance Service (Port 9090):** Maintenance request handling and task management
- **User Management Service (Port 9090):** User profile management and organization settings
- **Calendar Service (Port 9090):** Meal scheduling and calendar operations
- **Notification Service (Port 9093):** Real-time notifications and alerts
- **Dashboard Services (Port 9092):** Analytics data for admin and user dashboards

### Configuration

The API endpoints are configured in `src/services/api/config.js`. The application supports both local development and production deployment configurations:

- **Local Development:** Individual microservice URLs on different ports
- **Production:** Unified backend URL with service-specific endpoints

Ensure all required backend services are running and properly configured before starting the frontend application.

## 🏗️ Architecture Overview

The application follows a modern, scalable architecture with clear separation of concerns:

### Component Architecture

- **Modular Component Structure:** Reusable UI components organized by feature and domain
- **Role-Based Layouts:** Separate layout systems for Admin and User interfaces
- **Protected Routing:** Comprehensive route protection with multi-level role authorization
- **Shared Components:** Common UI elements and utilities across different user roles

### State Management

- **Context-Based Global State:** React Context for user authentication, sidebar state, and theme management
- **Query-Based Data Fetching:** TanStack React Query for efficient server state management
- **Local Component State:** React hooks for component-specific state management

### Design Patterns

- **Higher-Order Components:** Protected routes and layout wrappers
- **Custom Hooks:** Reusable logic for notifications, themes, and data fetching
- **Provider Pattern:** Context providers for global state management
- **Compound Components:** Complex UI components with multiple sub-components

### Microservices Integration

- **Service-Oriented Architecture:** Integration with multiple backend microservices
- **API Abstraction:** Centralized API configuration and service management
- **Error Handling:** Comprehensive error handling and user feedback systems

## 🤝 Contributing

We welcome contributions to the Resource Hub project! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes with conventional commit messages (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request with detailed description

### Code Standards

- **TypeScript:** Use TypeScript for type safety where applicable
- **ESLint & Prettier:** Follow the existing code style and formatting rules
- **Component Structure:** Organize components by feature and maintain consistent file structure
- **Naming Conventions:** Use descriptive names for components, hooks, and utilities
- **Comments:** Add JSDoc comments for complex logic and component props
- **Testing:** Ensure all functionality works before submitting (testing framework to be implemented)

### Commit Message Convention

Follow conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or updates

### Issue Reporting

When reporting issues, please include:

- **Clear Description:** Detailed explanation of the problem
- **Reproduction Steps:** Step-by-step instructions to reproduce the issue
- **Expected vs Actual Behavior:** What should happen vs what actually happens
- **Environment Information:** Browser, version, operating system
- **Screenshots/Logs:** Visual evidence or console logs if applicable
- **User Role:** Specify if the issue occurs for Admin, User, or SuperAdmin roles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**FiveStackDev** - Development Team

- GitHub: [@FiveStackDev](https://github.com/FiveStackDev)

### Core Contributors

- **Minul Chathumal** - [@Minulck](https://github.com/Minulck)
- **Theekshana Udara** - [@th33k](https://github.com/th33k)
- **Piumini Tishani** - [@PiuminiTishani](https://github.com/PiuminiTishani)
- **Nethminiwelgama** - [@nethminiwelgama](https://github.com/nethminiwelgama)
- **Sineth Nimhan** - [@SinethNimhan](https://github.com/SinethNimhan)

---

## 📞 Support

For support and questions:

- 📧 **Email**: resourcehub.contact.info@gmail.com
- 📚 **Documentation**: [Project Wiki](https://github.com/FiveStackDev/Resource_Hub-Backend-/wiki)
- 🐛 **Issues**: [GitHub Issues](https://github.com/FiveStackDev/Resource_Hub-Backend-/issues)

---

<div align="center">

## 🚀 Deployment

### Vercel Deployment

The application is configured for Vercel deployment with `vercel.json`. To deploy:

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production API URLs

## 🔧 Development Notes

### Browser Compatibility

- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support:** iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement:** Graceful degradation for older browsers

### Performance Considerations

- **Code Splitting:** Route-based code splitting with React.lazy
- **Bundle Optimization:** Vite optimization for production builds
- **Asset Optimization:** Image optimization and lazy loading
- **Caching Strategy:** Browser caching for static assets

## Database Relational Schema

![Database_Diagram](https://github.com/user-attachments/assets/b6e15acc-67d6-4530-a637-359ac1f70104)

**⭐ Star this repo if you find it helpful! ⭐**
