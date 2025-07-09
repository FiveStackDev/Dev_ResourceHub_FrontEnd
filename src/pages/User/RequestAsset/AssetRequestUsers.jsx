
import React, { useState, useEffect } from 'react';
import MonitorTable from '../../../components/Asset/AssetRequestingUser/UserAssetRequestedtable';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Search } from 'lucide-react';
import RequestButton from '../../../components/Asset/AssetRequestingUser/RequestButton';
import UserLayout from '../../../layouts/User/UserLayout';
import { BASE_URLS } from '../../../services/api/config';
import { useUser } from '../../../contexts/UserContext';
import { decodeToken } from '../../../contexts/UserContext';

const AssetRequestUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedCategory = location.state?.category || 'All';

  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState(passedCategory);
  const [assets, setAssets] = useState([]);
  const [requestOpen, setRequestOpen] = useState(false);

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
    const response = await fetch(`${BASE_URLS.assetRequest}/details/${userId}`);
    const data = await response.json();
    setAssets(data);
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

  const filteredAssets = assets.filter(
    (asset) =>
      (filterCategory === 'All' || asset.category === filterCategory) &&
      (asset.username.toLowerCase().includes(searchText.toLowerCase()) ||
        asset.asset_name.toLowerCase().includes(searchText.toLowerCase())),
  );

  const handleRequestOpen = () => setRequestOpen(true);
  const handleRequestClose = () => setRequestOpen(false);

  const handleRequestSubmit = () => {
    // Re-fetch the asset data after the request is made
    fetchAssets(); // Ensure the list is updated
    setRequestOpen(false); // Close the request dialog
  };

  return (
    <UserLayout>
      <div className="min-h-screen space-y-6 p-6">
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
          <MonitorTable assets={filteredAssets} />
        </div>

        <RequestButton
          open={requestOpen}
          onClose={handleRequestClose}
          onRequest={handleRequestSubmit}
        />
      </div>
    </UserLayout>
  );
};

export default AssetRequestUsers;
