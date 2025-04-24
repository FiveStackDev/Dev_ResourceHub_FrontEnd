import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./pages/Login";

// layout  Pages
import AdminLayout from "./Layout/AdminLayout/AdminLayout";
import UserLayout from "./Layout/UserLayout/UserLayout";
import AdminUserLayout from "./Layout/AdminUserLayout/Layout";

// Dashboard Pages
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import DashboardUser from "./pages/User/DashboardUser";

// Admin Pages
import AddMealTime from "./pages/Admin/Meal_Function/AddMealTime";
import AddMealType from "./pages/Admin/Meal_Function/AddMealType";
import { Users } from "./pages/Admin/UserManagement/Users";
import AssetAdmin from "./pages/Admin/Organization_Assets/AssetAdmin";
import AssetMonitoringAdmin from "./pages/Admin/Requested_Assets/AssetMonitoringAdmin";
import MealReport from "./pages/Admin/Reports/MealReport";
import {Settings} from "./pages/Settings";
import ReportHome from "./pages/Admin/Reports/ReportHome"
import AssetReport from "./pages/Admin/Reports/AssetReport"
import AssetHome from "./pages/Admin/Requested_Assets/AssetHome";
import MaintenanceHome from "./pages/Admin/Maintenance/MaintenanceHome";
import MaintenanceDetails from "./pages/Admin/Maintenance/MaintenanceDetails";
import DueAssetAdmin from "./pages/Admin/Requested_Assets/DueAssset" 

// User Pages
import MealCalander from "./pages/User/MealCalander";
import AssetRequestUsers from "./pages/User/AssetRequestUsers";



// PrivateRoute to protect routes
const PrivateRoute = ({ element, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");

  if (!isAuthenticated || !userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}-dashboard${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`} />;
  }

  return element;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/"
          element={<PrivateRoute element={<AdminLayout />} allowedRole="admin" />}
        >
          <Route index element={<DashboardAdmin />} />
          <Route path="admin-DashboardAdmin" element={<DashboardAdmin />} />
          <Route path="admin-addmealtime" element={<AddMealTime />} />
          <Route path="admin-addmealtype" element={<AddMealType />} />
          <Route path="admin-users" element={<Users />} />
          <Route path="admin-asset" element={<AssetAdmin />} />
          <Route path="admin-AssetHome" element={<AssetHome />} />
          <Route path="admin-AssetMonitoring" element={<AssetMonitoringAdmin />} />
          <Route path="admin-AssetMonitoring/:category" element={<AssetMonitoringAdmin />} />
          <Route path="Admin-maintenanceHome" element={<MaintenanceHome />} />
          <Route path="Admin-maintenanceDetails" element={<MaintenanceDetails />} />
          <Route path="MealReport" element={<MealReport />} />
          <Route path="AssetReport" element={<AssetReport />} />
          <Route path="Admin-ReportHome" element={<ReportHome/>}></Route>
          <Route path="Admin-DueAssets" element={<DueAssetAdmin />} />
        </Route>

        {/*Admin User Routes* */}
        <Route path="/" element={<PrivateRoute element={<AdminUserLayout />} allowedRoles={["admin"]} />}>
          <Route index element={<DashboardUser />} />
          <Route path="AdminUser-DashboardUser" element={<DashboardUser />} />
          <Route path="AdminUser-mealcalander" element={<MealCalander />} />
          <Route path="AdminUser-assetrequest" element={<AssetRequestUsers />} />
          <Route path="Settings/*" element={<Settings />} />          
        </Route>

        {/* User Routes */}
        <Route path="/" element={<PrivateRoute element={<UserLayout />} allowedRoles={["user", "admin"]} />}>
          <Route index element={<DashboardUser />} />
          <Route path="User-DashboardUser" element={<DashboardUser />} />
          <Route path="User-mealcalander" element={<MealCalander />} />
          <Route path="User-assetrequest" element={<AssetRequestUsers />} />
          <Route path="Settings/*" element={<Settings />} />          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
