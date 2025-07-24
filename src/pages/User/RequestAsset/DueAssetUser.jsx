import { getAuthHeader } from '../../../utils/authHeader';

import React, { useState, useEffect } from 'react';
import MonitorTable from '../../../components/Asset/AssetRequestingUser/UserAssetRequestedtable';
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
import UserLayout from '../../../layouts/User/UserLayout';
import { BASE_URLS } from '../../../services/api/config';
import { useUser } from '../../../contexts/UserContext';
import { decodeToken } from '../../../contexts/UserContext';

const DueAssetUser = () => {
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

  const { userData } = useUser();
  // Fallback: decode token directly if userData.id is undefined
  let userId = userData.id;
  if (!userId) {
    const decoded = decodeToken();
    userId = decoded?.id;
    console.log('DueAssetUser fallback decoded userId:', userId);
  } else {
    console.log('DueAssetUser userId:', userId);
  }
  useEffect(() => {
    const fetchAssets = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `${BASE_URLS.assetRequest}/dueassets/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader(),
            },
          },
        );
        const data = await response.json();
        // Ensure assets is always an array
        if (Array.isArray(data)) {
          setAssets(data);
        } else if (data && Array.isArray(data.assets)) {
          setAssets(data.assets);
        } else {
          setAssets([]);
        }
      } catch (error) {
        setAssets([]);
        console.error('Failed to fetch assets:', error);
      }
    };
    fetchAssets();
  }, [userId]);

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
    <UserLayout>
      <div className="min-h-screen space-y-3 p-2">
        <h2 className="text-2xl font-semibold">
          Due Assets {filterCategory !== 'All' && `: ${filterCategory}`}
        </h2>

        <div
          className="search-filter-section"
          style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}
        >
          <TextField
            label="Search by Name or Asset"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{ startAdornment: <Search size={20} /> }}
            style={{ flex: 1 }}
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

        <MonitorTable
          assets={filteredAssets}
          handleEditOpen={handleEditOpen}
          handleDeleteOpen={handleDeleteOpen}
        />

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
    </UserLayout>
  );
};

export default DueAssetUser;
