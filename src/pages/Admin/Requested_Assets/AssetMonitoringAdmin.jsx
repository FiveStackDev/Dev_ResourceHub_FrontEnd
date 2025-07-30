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
import { sendAssetNotification } from '../../../utils/sendAssetNotification';

const AssetMonitoringAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedCategory = location.state?.category || 'All';

  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState(passedCategory);
  const [assets, setAssets] = useState([]);
  const [dueFilter, setDueFilter] = useState('All'); // 'All', 'Due', 'Not Due'

  const uniqueCategories = [
    'All',
    ...new Set(assets.map((asset) => asset.category)),
  ];

  const fetchAssets = async () => {
    const response = await fetch(`${BASE_URLS.assetRequest}/details`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
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

      if (!response.ok) {
        const errorText = await response.text();

        // Check for quantity-related errors
        if (
          errorText.includes('INSUFFICIENT_QUANTITY_3819') ||
          errorText.includes('CONSTRAINT_VIOLATION_3819') ||
          errorText.includes('Not enough quantity available')
        ) {
          toast.error(
            'Cannot approve request: Not enough quantity available in inventory',
          );
          return;
        }

        throw new Error(errorText || 'Failed to update asset');
      }

      await response.json();

      // Send notification to user if status is approved or rejected
      if (['Accepted', 'Rejected'].includes(updatedAsset.status)) {
        try {
          await sendAssetNotification({
            user_id: updatedAsset.user_id,
            type: 'asset',
            reference_id: updatedAsset.requestedasset_id,
            title: `Asset Request ${updatedAsset.status}`,
            message: `Your asset request for '${updatedAsset.asset_name}' has been ${updatedAsset.status.toLowerCase()}.`,
            priority: 'General', // Always set priority for asset notifications
          });
          toast.success('User notified about asset request status!');
        } catch (err) {
          toast.error('Failed to send asset notification');
        }
      }

      toast.success('Asset updated successfully!');

      // Re-fetch the asset list to ensure it is updated
      fetchAssets();
    } catch (error) {
      console.error('Error updating asset:', error);

      // Check for specific error messages in the error object
      const errorMessage = error.message || error.toString();
      if (
        errorMessage.includes('INSUFFICIENT_QUANTITY_3819') ||
        errorMessage.includes('CONSTRAINT_VIOLATION_3819') ||
        errorMessage.includes('Not enough quantity available')
      ) {
        toast.error(
          'Cannot approve request: Not enough quantity available in inventory',
        );
      } else {
        toast.error(`Error updating asset: ${errorMessage}`);
      }
    }
  };

  // Filter by category and search
  let filteredAssets = assets.filter(
    (asset) =>
      (filterCategory === 'All' || asset.category === filterCategory) &&
      (asset.username.toLowerCase().includes(searchText.toLowerCase()) ||
        asset.asset_name.toLowerCase().includes(searchText.toLowerCase())),
  );

  // Filter by due status
  if (dueFilter === 'Due') {
    filteredAssets = filteredAssets.filter(
      (asset) =>
        typeof asset.remaining_days === 'number' &&
        asset.remaining_days < 0 &&
        asset.status == 'Accepted' &&
        asset.is_returning == true,
    );
  } else if (dueFilter === 'Not Due') {
    filteredAssets = filteredAssets.filter(
      (asset) =>
        typeof asset.remaining_days === 'number' &&
        (asset.is_returning == false || asset.remaining_days > 0) &&
        asset.status == 'Accepted',
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen space-y-3 p-2">
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

            {/* Due Status Filter Dropdown */}
            <FormControl
              variant="outlined"
              size="small"
              style={{ minWidth: 160 }}
            >
              <InputLabel>Due Status</InputLabel>
              <Select
                value={dueFilter}
                onChange={(e) => setDueFilter(e.target.value)}
                label="Due Status"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Due">Due</MenuItem>
                <MenuItem value="Not Due">Not Due</MenuItem>
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
