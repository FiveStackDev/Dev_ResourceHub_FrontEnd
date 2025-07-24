import React from 'react';
import ReportHomeCard from '../../../components/Report/ReportHomeCard';
import AdminLayout from '../../../layouts/Admin/AdminLayout';
import '../../css/ReportHome.css';

function ReportHome() {
  return (
    <AdminLayout>
      <div className="min-h-screen space-y-3 p-2">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="outerreport">
          <div className="Report grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <ReportHomeCard
              name="Meals"
              image="/Report/meal.png"
              route={'../Admin-MealReport'}
            />

            <ReportHomeCard
              name="Assets"
              image="/Report/asset.png"
              route={'../Admin-AssetReport'}
            />

            <ReportHomeCard
              name="Maintenance"
              image="/Report/maintenance.png"
              route={'../Admin-MaintenanceReport'}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ReportHome;
