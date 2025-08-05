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
  CircularProgress,
} from '@mui/material';
import { Search, Plus } from 'lucide-react';
import RequestButton from '../../../components/Asset/AssetRequestingUser/RequestButton';
import EditAssetRequestPopup from '../../../components/Asset/AssetRequestingUser/EditAssetRequestPopup';
import DeleteAssetRequestPopup from '../../../components/Asset/AssetRequestingUser/DeleteAssetRequestPopup';
import UserLayout from '../../../layouts/User/UserLayout';
import { BASE_URLS } from '../../../services/api/config';
import { useUser } from '../../../contexts/UserContext';
import { decodeToken } from '../../../contexts/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [dueFilter, setDueFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const uniqueCategories = [
    'All',
    ...new Set(assets.map((asset) => asset.category)),
  ];

  const { userData } = useUser();
  let userId = userData.id;
  if (!userId) {
    const decoded = decodeToken();
    userId = decoded?.id;
  }

  const fetchAssets = async () => {
    if (!userId) return;
    setLoading(true);
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
      toast.error('Failed to load asset requests!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    setFilterCategory(passedCategory);
  }, [passedCategory]);

  const handleCategoryChange = (newCategory) => {
    setFilterCategory(newCategory);
  };

  let filteredAssets = assets.filter(
    (asset) =>
      (filterCategory === 'All' || asset.category === filterCategory) &&
      (asset.username.toLowerCase().includes(searchText.toLowerCase()) ||
        asset.asset_name.toLowerCase().includes(searchText.toLowerCase())),
  );

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

  const handleRequestOpen = () => setRequestOpen(true);
  const handleRequestClose = () => setRequestOpen(false);

  const handleRequestSubmit = () => {
    fetchAssets();
    setRequestOpen(false);
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

        <div className="p-2">
          {/* Mobile view */}
          <div className="sm:hidden flex flex-col space-y-2">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-2">
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: <Search size={20} className="mr-2" />,
                }}
                sx={{ 
                  width: '140px',
                  flex: '0 0 auto'
                }}
              />
              <FormControl variant="outlined" size="small" sx={{ width: '100px', flex: '0 0 auto' }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  label="Category"
                >
                  {uniqueCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" size="small" sx={{ width: '100px', flex: '0 0 auto' }}>
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
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus size={20} />}
              onClick={handleRequestOpen}
              sx={{ height: '40px' }}
            >
              Request Asset
            </Button>
          </div>

          {/* Desktop view */}
          <div 
            className="hidden sm:flex"
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TextField
                label="Search by Name or Asset"
                variant="outlined"
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: <Search size={20} className="mr-2" />,
                }}
                sx={{ width: '200px' }}
              />
              <FormControl variant="outlined" size="small" sx={{ width: '130px' }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  label="Category"
                >
                  {uniqueCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" size="small" sx={{ width: '130px' }}>
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
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus size={20} />}
              onClick={handleRequestOpen}
              sx={{ height: '40px' }}
            >
              Request Asset
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="mt-6">
            <MonitorTable
              assets={filteredAssets}
              onEditAsset={handleEditAsset}
              onDeleteAsset={handleDeleteAsset}
            />
          </div>
        )}

        <RequestButton
          open={requestOpen}
          onClose={handleRequestClose}
          onRequest={handleRequestSubmit}
        />

        <EditAssetRequestPopup
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedAsset(null);
          }}
          asset={selectedAsset}
          onSave={handleSaveEdit}
        />

        <DeleteAssetRequestPopup
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedAsset(null);
          }}
          asset={selectedAsset}
          onDelete={handleConfirmDelete}
        />

        <ToastContainer />
      </div>
    </UserLayout>
  );
};

export default AssetRequestUsers;