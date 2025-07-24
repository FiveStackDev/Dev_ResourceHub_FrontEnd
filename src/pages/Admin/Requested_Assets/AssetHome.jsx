import React from 'react';
import AssetHomeCard from '../../../components/Asset/AssetMonitoring/AssetHomeCard';
import AdminLayout from '../../../layouts/Admin/AdminLayout';
import '../../css/AssetHome.css';
import { useNavigate } from 'react-router-dom';

function AssetHome() {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Electronics & IT',
      label: 'Electronics & IT',
      image: '/Asset/Electronic And IT.png',
    },
    {
      name: 'Office Supplies',
      label: 'Office Supplies',
      image: '/Asset/Stationary Items.png',
    },
    {
      name: 'Furniture',
      label: 'Furniture',
      image: '/Asset/Furniture.png',
    },
    {
      name: 'Electrical Appliances',
      label: 'Electrical Appliances',
      image: '/Asset/Maintenance Tools.png',
    },
    {
      name: 'Machinery & Tools',
      label: 'Machinery & Tools',
      image: '/Asset/Mechanices.png',
    },
    {
      name: 'Miscellaneous',
      label: 'Miscellaneous',
      image: '/Asset/Extra Items.png',
    },
  ];

  const handleCardClick = (category) => {
    navigate('/admin-assetmonitoring', {
      state: { category: category.name },
    });
  };

  return (
    <AdminLayout>
      <div className="min-h-screen space-y-3 p-2">
        <h1 className="text-2xl font-semibold">Asset Categories</h1>
        <div className="asset-home grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {categories.map((category, index) => (
            <div key={index} onClick={() => handleCardClick(category)}>
              <AssetHomeCard name={category.label} image={category.image} />
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AssetHome;
