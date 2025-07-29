import { ThemeProvider } from './theme/ThemeProvider';
import { SidebarProvider } from './contexts/SidebarContext';
import { UserProvider } from './contexts/UserContext';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Pages
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Register from './pages/Auth/Register';

// Admin Pages
import AdminDashboard from './pages/Admin/DashboardAdmin';
import AssetHome from './pages/Admin/Requested_Assets/AssetHome';
import AssetMonitoringAdmin from './pages/Admin/Requested_Assets/AssetMonitoringAdmin';
import DueAsset from './pages/Admin/Requested_Assets/DueAssset';
import AssetAdmin from './pages/Admin/Organization_Assets/AssetAdmin';
import MaintenanceHome from './pages/Admin/Maintenance/MaintenanceHome';
import MaintenanceDetails from './pages/Admin/Maintenance/MaintenanceDetails';
import ReportHome from './pages/Admin/Reports/ReportHome';
import AssetReport from './pages/Admin/Reports/AssetReport';
import MealReport from './pages/Admin/Reports/MealReport';
import RequestedMeals from './pages/Admin/Meal_Management/RequestedMeals';
import MaintenanceReport from './pages/Admin/Reports/MaintenanceReport';
import AddMealTime from './pages/Admin/Meal_Management/AddMealTime';
import AddMealType from './pages/Admin/Meal_Management/AddMealType';
import { Users } from './pages/Admin/UserManagement/Users';

// User Pages
import UserDashboard from './pages/User/DashboardUser';
import AssetRequestUsers from './pages/User/RequestAsset/AssetRequestUsers';
import DueAssetUser from './pages/User/RequestAsset/DueAssetUser';
import MealCalender from './pages/User/MealRequest/MealCalander';
import MaintenanceDetailsUser from './pages/User/Maintenance/MaintenanceDetailsUser';

// Shared Pages
import Notification from './pages/Shared/Notification';
import Settings from './pages/Shared/Settings';
import OrganizationDetails from './pages/Shared/OrganizationDetails';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import React from 'react';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <UserProvider>
          <SidebarProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Admin Routes */}
              <Route
                path="/admin-dashboardadmin"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-assethome"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <AssetHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-assetmonitoring"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <AssetMonitoringAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dueassets"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <DueAsset />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-asset"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <AssetAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-maintenancehome"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <MaintenanceHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-maintenance"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <MaintenanceDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-reporthome"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <ReportHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-assetreport"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <AssetReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-mealreport"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <MealReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-maintenancereport"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <MaintenanceReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-mealTimes"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <AddMealTime />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-requestedMeals"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <RequestedMeals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-mealTypes"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <AddMealType />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-users"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <Users />
                  </ProtectedRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/user-dashboarduser"
                element={
                  <ProtectedRoute requiredRole="User">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-assetrequest"
                element={
                  <ProtectedRoute requiredRole="User">
                    <AssetRequestUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-dueassets"
                element={
                  <ProtectedRoute requiredRole="User">
                    <DueAssetUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-mealcalendar"
                element={
                  <ProtectedRoute requiredRole="User">
                    <MealCalender />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-maintenance"
                element={
                  <ProtectedRoute requiredRole="User">
                    <MaintenanceDetailsUser />
                  </ProtectedRoute>
                }
              />

              {/* Shared Routes */}
              <Route path="/notifications" element={<Notification />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/organization" element={<OrganizationDetails />} />
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <ToastContainer />
          </SidebarProvider>
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
