import React, { useState, useEffect } from 'react';
import { TextField, CircularProgress, Autocomplete } from '@mui/material';
import axios from 'axios';
import { getAuthHeader } from '../../../utils/authHeader';
import { BASE_URLS } from '../../../services/api/config';

function AssetSearch({ value, onChange, setAssetId }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URLS.asset}/details`, { headers: { ...getAuthHeader() } })
      .then((res) => {
        // Filter assets to only show available ones
        const availableAssets = res.data.filter(
          (asset) => asset.is_available === true,
        );
        setAssets(availableAssets);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching asset data:', err);
        setLoading(false);
      });
  }, []);

  const handleAssetChange = (event, newValue) => {
    const asset = assets.find((asset) => asset.asset_name === newValue);
    if (asset) {
      setAssetId(asset.asset_id);
    }
    onChange({ target: { name: 'assetName', value: newValue } });
  };

  return (
    <Autocomplete
      freeSolo
      options={assets.map((asset) => asset.asset_name)}
      loading={loading}
      value={value}
      onInputChange={(event, newInputValue) =>
        onChange({ target: { name: 'assetName', value: newInputValue } })
      }
      onChange={handleAssetChange} // Change here to handle selecting asset
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asset Name"
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={loading}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export default AssetSearch;
