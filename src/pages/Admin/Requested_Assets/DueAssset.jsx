import { getAuthHeader } from '../../../utils/authHeader';
import React, { useState, useEffect } from 'react';
import MonitorTable from '../../../components/Asset/AssetMonitoring/MonitorTable';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Search } from 'lucide-react';
import EditAssetPopup from '../../../components/Asset/OrganizationAssets/AssetEdit';
import DeleteAssetPopup from '../../../components/Asset/OrganizationAssets/AssetDelete';
import AdminLayout from '../../../layouts/Admin/AdminLayout';
import { BASE_URLS } from '../../../services/api/config';

const AssetMonitoringAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedCategory = location.state?.category || 'All';

  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState(passedCategory);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const uniqueCategories = [
    'All',
    ...new Set(assets.map((asset) => asset.category)),
  ];

  useEffect(() => {
    const fetchAssets = async () => {
      const response = await fetch(`${BASE_URLS.assetRequest}/dueassets`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      const data = await response.json();
      setAssets(data);
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    setFilterCategory(passedCategory);
  }, [passedCategory]);

  const handleCategoryChange = (newCategory) => {
    setFilterCategory(newCategory);
    if (newCategory === 'All') {
      navigate('/admin-AssetMonitoring', { state: { category: 'All' } });
    } else {
      navigate('/admin-AssetMonitoring', { state: { category: newCategory } });
    }
  };

  const filteredAssets = assets.filter(
    (asset) =>
      (filterCategory === 'All' || asset.category === filterCategory) &&
      (asset.username.toLowerCase().includes(searchText.toLowerCase()) ||
        asset.asset_name.toLowerCase().includes(searchText.toLowerCase())),
  );

  const handleEditOpen = (asset) => {
    setSelectedAsset(asset);
    setEditOpen(true);
  };

  const handleDeleteOpen = (asset) => {
    setSelectedAsset(asset);
    setDeleteOpen(true);
  };

  const handleUpdateAsset = (updatedAsset) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === updatedAsset.id ? updatedAsset : asset,
      ),
    );
    setEditOpen(false);
  };

  const handleDeleteAsset = () => {
    setAssets((prev) => prev.filter((asset) => asset.id !== selectedAsset.id));
    setDeleteOpen(false);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen space-y-6 p-6">
        <h1 className="text-2xl font-semibold">
          Due Assets {filterCategory !== 'All' && `: ${filterCategory}`}
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
          <MonitorTable
            assets={filteredAssets}
            handleEditOpen={handleEditOpen}
            handleDeleteOpen={handleDeleteOpen}
          />
        </div>

        {selectedAsset && (
          <>
            <EditAssetPopup
              open={editOpen}
              asset={selectedAsset}
              onClose={() => setEditOpen(false)}
              onUpdate={handleUpdateAsset}
            />
            <DeleteAssetPopup
              open={deleteOpen}
              asset={selectedAsset}
              onClose={() => setDeleteOpen(false)}
              onDelete={handleDeleteAsset}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AssetMonitoringAdmin;
