import React from 'react';
import MealEventsTable from '../../../components/Report/MealEventsTable';
import AdminLayout from '../../../layouts/Admin/AdminLayout';

function MealReport() {
  return (
    <AdminLayout>
      <div className="min-h-screen space-y-3 p-2">
        <h1 className="text-2xl font-semibold">Meal Reports</h1>
        <div className="mt-6">
          <MealEventsTable />
        </div>
      </div>
    </AdminLayout>
  );
}

export default MealReport;
