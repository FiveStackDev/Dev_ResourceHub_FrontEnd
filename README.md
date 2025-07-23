# Resource Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF.svg)](https://vitejs.dev/)

Resource Hub is a comprehensive web application designed for efficient management of organizational resources, including meals, assets, and maintenance tasks. Built with modern React and TypeScript, it provides distinct interfaces and functionalities for Administrators and regular Users with role-based access control.

## 🚀 Demo

> **Note:** Add screenshots or demo links here once available

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Scripts](#-scripts)
- [API Integration](#-api-integration)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 👨‍💼 Admin Features
- **Dashboard:** Comprehensive overview of organizational statistics and activities
- **Meal Management:** 
  - Configure meal types (breakfast, lunch, dinner)
  - Set meal times and availability
  - Monitor meal requests and analytics
- **Asset Management:**
  - Add, edit, and delete organizational assets
  - Monitor asset requests and allocations
  - Track asset status and availability
- **Maintenance Management:**
  - Review and assign maintenance requests
  - Set priorities and track task statuses
  - Manage maintenance workflows
- **User Management:** Create and manage user accounts and roles
- **Advanced Reporting:** Generate detailed reports for meals, assets, and maintenance activities
- **System Settings:** Configure application-wide settings

### 👤 User Features
- **Personal Dashboard:** View personalized statistics and upcoming activities
- **Meal Requests:** 
  - Interactive calendar interface for meal requests
  - View meal schedules and availability
- **Asset Requests:** Submit and track asset requests
- **Maintenance Requests:** Report maintenance issues and track progress
- **Notifications:** Real-time updates on request status and important announcements
- **Profile Settings:** Manage personal information and preferences

### 🔒 Common Features
- **Role-Based Access Control:** Secure, permission-based interface differentiation
- **Responsive Design:** Optimized for desktop and mobile devices
- **Theme Support:** Light and dark mode options
- **Real-time Notifications:** Instant updates and alerts
- **PDF Export:** Generate and download reports

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18.3.1 with TypeScript 5.5.3
- **Build Tool:** Vite (Lightning-fast development and build)
- **UI Framework:** Material-UI (MUI) 5.14.16
- **Styling:** Tailwind CSS 3.4.1 + CSS Modules
- **Routing:** React Router DOM 7.5.2

### State Management & Data Fetching
- **API Client:** Axios 1.9.0
- **Data Fetching:** TanStack React Query 5.74.7
- **Context Management:** React Context API

### UI Components & Libraries
- **Calendar:** FullCalendar 6.1.17 (with React integration)
- **Charts:** Chart.js 4.4.0 + react-chartjs-2 5.2.0, Recharts 2.15.3
- **Icons:** MUI Icons, Lucide React 0.344.0
- **Notifications:** React Hot Toast 2.5.2, React Toastify 11.0.5
- **PDF Generation:** html2pdf.js 0.10.3

### Development Tools
- **Linting:** ESLint 9.9.1 with TypeScript support
- **Formatting:** Prettier 3.5.3
- **CSS Processing:** PostCSS 8.4.35, Autoprefixer 10.4.18

## 📁 Project Structure

```
Resource_Hub-Frontend/
├── public/                         # Static assets
│   ├── *.png                      # Application images and logos  
│   ├── Asset/                     # Asset category icons
│   ├── Maintenance/               # Maintenance-related images
│   └── Report/                    # Report category icons
│
├── src/
│   ├── App.jsx                    # Main application component with routing
│   ├── main.jsx                   # Application entry point
│   ├── index.css                  # Global styles (Tailwind base)
│   │
│   ├── components/                # Reusable UI components
│   │   ├── ProtectedRoute.tsx     # Route protection component
│   │   ├── Asset/                 # Asset management components
│   │   │   ├── AssetMonitoring/   # Asset monitoring features
│   │   │   ├── AssetRequestingUser/ # User asset request components
│   │   │   └── OrganizationAssets/ # Organization asset management
│   │   ├── Calendar/              # Calendar and meal scheduling
│   │   ├── Dashboard/             # Dashboard components
│   │   │   ├── Admin/             # Admin dashboard features
│   │   │   └── User/              # User dashboard features
│   │   ├── Maintenance/           # Maintenance management
│   │   │   ├── Admin/             # Admin maintenance tools
│   │   │   ├── User/              # User maintenance requests
│   │   │   └── shared/            # Shared maintenance components
│   │   ├── Meal/                  # Meal management system
│   │   │   ├── MealTime/          # Meal timing components
│   │   │   └── MealType/          # Meal type management
│   │   ├── Notification/          # Notification system
│   │   ├── Report/                # Reporting and analytics
│   │   ├── Settings/              # Application settings
│   │   ├── Users/                 # User management
│   │   └── shared/                # Shared/common components
│   │
│   ├── contexts/                  # React context providers
│   │   ├── SidebarContext.tsx     # Sidebar state management
│   │   └── UserContext.tsx        # User authentication context
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useNotifications.js    # Notification management hook
│   │   └── useThemeStyles.js      # Theme styling hook
│   │
│   ├── layouts/                   # Page layout structures
│   │   ├── Admin/                 # Admin layout components
│   │   ├── User/                  # User layout components
│   │   └── shared/                # Shared layout components
│   │
│   ├── pages/                     # Top-level page components
│   │   ├── Login.jsx              # Authentication pages
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Admin/                 # Admin-specific pages
│   │   ├── User/                  # User-specific pages
│   │   └── css/                   # Page-specific styles
│   │
│   ├── query/                     # React Query hooks
│   │   ├── adminDashboardQueries.js
│   │   └── userDashboardQueries.js
│   │
│   ├── services/                  # External service integrations
│   │   └── api/                   # API service configurations
│   │
│   ├── theme/                     # MUI theme configuration
│   │   ├── theme.ts               # Theme definitions
│   │   └── ThemeProvider.tsx      # Theme provider component
│   │
│   └── utils/                     # Utility functions
│       ├── authHeader.js          # Authentication utilities
│       ├── dateUtils.js           # Date manipulation helpers
│       ├── notificationApi.js     # Notification API helpers
│       └── sendAssetNotification.js # Asset notification utilities
│
├── eslint.config.js               # ESLint configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── vite.config.ts                 # Vite build configuration
└── package.json                   # Project dependencies and scripts
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16.0 or higher)
- **npm** (version 7.0 or higher) or **yarn** (version 1.22 or higher)
- **Git** (for cloning the repository)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/FiveStackDev/Resource_Hub.git
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
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Resource Hub

# Other configuration variables as needed
```

> **Note:** Replace the API URL with your backend server URL

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

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code using Prettier |

## 🔌 API Integration

This frontend application requires a backend API server to function properly. The application communicates with the backend through RESTful APIs for:

- User authentication and authorization
- Meal management operations
- Asset tracking and management
- Maintenance request handling
- Reporting and analytics data
- Real-time notifications

Ensure your backend server is running and the API endpoints are properly configured in your environment variables.

## 🏗️ Architecture Overview

The application follows a modular architecture with clear separation of concerns:

- **Component-Based Architecture:** Reusable UI components organized by feature
- **Role-Based Routing:** Different routes and components for Admin and User roles
- **Context-Based State Management:** Global state managed through React Context
- **Query-Based Data Fetching:** Efficient data management with React Query
- **Theme-Aware Design:** Consistent theming with Material-UI and Tailwind CSS

## 🤝 Contributing

We welcome contributions to the Resource Hub project! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Ensure all tests pass before submitting
- Run `npm run lint` and `npm run format` before committing

### Issue Reporting

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and version information
- Screenshots (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**FiveStackDev Team**
- Frontend Development
- Backend Integration  
- UI/UX Design
- Testing & Quality Assurance

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation for common solutions

## Database Relational Schema

![Database_Diagram](https://github.com/user-attachments/assets/b6e15acc-67d6-4530-a637-359ac1f70104)
