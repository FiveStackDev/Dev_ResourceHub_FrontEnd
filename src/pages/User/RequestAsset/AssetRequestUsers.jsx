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
import RequestButton from '../../../components/Asset/AssetRequestingUser/RequestButton';
import EditAssetRequestPopup from '../../../components/Asset/AssetRequestingUser/EditAssetRequestPopup';
import DeleteAssetRequestPopup from '../../../components/Asset/AssetRequestingUser/DeleteAssetRequestPopup';
import UserLayout from '../../../layouts/User/UserLayout';
import { BASE_URLS } from '../../../services/api/config';
import { useUser } from '../../../contexts/UserContext';
import { decodeToken } from '../../../contexts/UserContext';
import { toast } from 'react-toastify';

const AssetRequestUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedCategory = location.state?.category || 'All';

  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState(passedCategory);
  const [assets, setAssets] = useState([]);
  const [requestOpen, setRequestOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [dueFilter, setDueFilter] = useState('All'); // 'All', 'Due', 'Not Due'

  const uniqueCategories = [
    'All',
    ...new Set(assets.map((asset) => asset.category)),
  ];

  // Get user id from context
  const { userData } = useUser();
  // Fallback: decode token directly if userData.id is undefined
  let userId = userData.id;
  if (!userId) {
    const decoded = decodeToken();
    userId = decoded?.id;
    console.log('AssetRequestUsers fallback decoded userId:', userId);
  } else {
    console.log('AssetRequestUsers userId:', userId);
  }

  // Fetch assets
  const fetchAssets = async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `${BASE_URLS.assetRequest}/details/${userId}`,
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

  useEffect(() => {
    fetchAssets(); // Initial fetch when the component mounts
  }, []);

  useEffect(() => {
    setFilterCategory(passedCategory); // Update filter category based on URL state
  }, [passedCategory]);

  const handleCategoryChange = (newCategory) => {
    setFilterCategory(newCategory);
  };

  // Filter by category and search
  let filteredAssets = assets.filter(
    (asset) =>
      (filterCategory === 'All' || asset.category === filterCategory) &&
      (asset.username.toLowerCase().includes(searchText.toLowerCase()) ||
        asset.asset_name.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Filter by due status
  if (dueFilter === 'Due') {
    filteredAssets = filteredAssets.filter(
      (asset) => typeof asset.remaining_days === 'number' && asset.remaining_days < 0 && asset.status=="Accepted" && asset.is_returning==true
    );
  } else if (dueFilter === 'Not Due') {
    filteredAssets = filteredAssets.filter(
      (asset) => typeof asset.remaining_days === 'number' && (asset.is_returning==false || asset.remaining_days > 0) && asset.status=="Accepted"
    );
  }

  const handleRequestOpen = () => setRequestOpen(true);
  const handleRequestClose = () => setRequestOpen(false);

  const handleRequestSubmit = () => {
    // Re-fetch the asset data after the request is made
    fetchAssets(); // Ensure the list is updated
    setRequestOpen(false); // Close the request dialog
  };

  const handleEditAsset = (asset) => {
    setSelectedAsset(asset);
    setEditDialogOpen(true);
  };

  const handleDeleteAsset = (asset) => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async (updatedAsset) => {
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

      if (!response.ok) throw new Error('Failed to update asset request');

      toast.success('Asset request updated successfully!');
      fetchAssets();
      setEditDialogOpen(false);
      setSelectedAsset(null);
    } catch (error) {
      console.error('Error updating asset request:', error);
      toast.error('Failed to update asset request');
    }
  };

  const handleConfirmDelete = async (asset) => {
    try {
      const response = await fetch(
        `${BASE_URLS.assetRequest}/details/${asset.requestedasset_id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        },
      );

      if (!response.ok) throw new Error('Failed to delete asset request');

      toast.success('Asset request deleted successfully!');
      fetchAssets();
      setDeleteDialogOpen(false);
      setSelectedAsset(null);
    } catch (error) {
      console.error('Error deleting asset request:', error);
      toast.error('Failed to delete asset request');
    }
  };

  return (
    <UserLayout>
      <div className="min-h-screen space-y-3 p-2">
        <h1 className="text-2xl font-semibold">Asset Requests</h1>

        <div className="search-filter-section flex items-center justify-between gap-4 mt-4">
          <TextField
            label="Search by Name or Asset"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{ startAdornment: <Search size={20} /> }}
            sx={{ flex: 1 }}
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
          <FormControl variant="outlined" size="small" style={{ minWidth: 160 }}>
            <InputLabel>Due Status</InputLabel>
            <Select
              value={dueFilter}
              onChange={e => setDueFilter(e.target.value)}
              label="Due Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Due">Due</MenuItem>
              <MenuItem value="Not Due">Not Due</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleRequestOpen}
            style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}
          >
            Request Asset
          </Button>
        </div>

        <div className="mt-6">
          <MonitorTable
            assets={filteredAssets}
            onEditAsset={handleEditAsset}
            onDeleteAsset={handleDeleteAsset}
          />
        </div>

        <RequestButton
          open={requestOpen}
          onClose={handleRequestClose}
          onRequest={handleRequestSubmit}
        />

        {/* Edit Dialog */}
        <EditAssetRequestPopup
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedAsset(null);
          }}
          asset={selectedAsset}
          onSave={handleSaveEdit}
        />

        {/* Delete Dialog */}
        <DeleteAssetRequestPopup
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedAsset(null);
          }}
          asset={selectedAsset}
          onDelete={handleConfirmDelete}
        />
      </div>
    </UserLayout>
  );
};

export default AssetRequestUsers;
