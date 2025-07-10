import { getAuthHeader } from '../../../utils/authHeader';
import React, { useState, useEffect } from 'react';
import MonitorTable from '../../../components/Asset/AssetMonitoring/MonitorTable';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Search } from 'lucide-react';
import AdminLayout from '../../../layouts/Admin/AdminLayout';
import { BASE_URLS } from '../../../services/api/config';
import { toast, ToastContainer } from 'react-toastify';

const AssetMonitoringAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedCategory = location.state?.category || 'All';

  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState(passedCategory);
  const [assets, setAssets] = useState([]);

  const uniqueCategories = [
    'All',
    ...new Set(assets.map((asset) => asset.category)),
  ];

  const fetchAssets = async () => {
    const response = await fetch(
      `${BASE_URLS.assetRequest}/details`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      }
    );
    const data = await response.json();
    setAssets(data);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    setFilterCategory(passedCategory);
  }, [passedCategory]);

  const handleCategoryChange = (newCategory) => {
    setFilterCategory(newCategory);
    navigate('/admin-AssetMonitoring', { state: { category: newCategory } });
  };

  const handleSave = async (updatedAsset) => {
    try {
      const response = await fetch(
        `${BASE_URLS.assetRequest}/details/${updatedAsset.requestedasset_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify(updatedAsset),
        },
      );

      if (!response.ok) throw new Error('Failed to update asset');

      await response.json();

      toast.success('Asset updated successfully!');

      // Re-fetch the asset list to ensure it is updated
      fetchAssets();
    } catch (error) {
      console.error('Error updating asset:', error);
      toast.error('Error updating asset:', error);
    }
  };

  const filteredAssets = assets.filter(
    (asset) =>
      (filterCategory === 'All' || asset.category === filterCategory) &&
      (asset.username.toLowerCase().includes(searchText.toLowerCase()) ||
        asset.asset_name.toLowerCase().includes(searchText.toLowerCase())),
  );

  return (
    <AdminLayout>
      <div className="min-h-screen space-y-6 p-6">
        <h1 className="text-2xl font-semibold">
          Asset Monitoring {filterCategory !== 'All' && `: ${filterCategory}`}
        </h1>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <TextField
              label="Search by Name or Asset"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{ startAdornment: <Search size={20} /> }}
              className="min-w-[240px] flex-1"
            />

            <FormControl
              variant="outlined"
              size="small"
              style={{ minWidth: 200 }}
            >
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                label="Filter by Category"
              >
                {uniqueCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="mt-6">
          <MonitorTable assets={filteredAssets} onSave={handleSave} />
        </div>
        <ToastContainer />
      </div>
    </AdminLayout>
  );
};

export default AssetMonitoringAdmin;
