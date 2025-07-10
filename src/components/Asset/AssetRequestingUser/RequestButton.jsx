import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { toast } from 'react-toastify';
import AssetSearch from './AssetSearch';
import { BASE_URLS } from '../../../services/api/config';
import axios from 'axios';
import { getAuthHeader } from '../../../utils/authHeader';
import { useUser } from '../../../contexts/UserContext';
import { decodeToken } from '../../../contexts/UserContext';

function RequestButton({ open, onClose, onRequest }) {
  const { userData } = useUser();
  // Fallback: decode token directly if userData.id is undefined
  let userId = userData.id;
  if (!userId) {
    const decoded = decodeToken();
    userId = decoded?.id;
    console.log('RequestButton fallback decoded userId:', userId);
  } else {
    console.log('RequestButton userId:', userId);
  }
  const [requestData, setRequestData] = useState({
    userName: '',
    assetName: '',
    assetId: '',
    category: '',
    quantity: '',
    handoverDate: new Date().toISOString().split('T')[0], // Initial date to today's date
    reason: '',
    isAssetReturning: true,
  });

  useEffect(() => {
    if (!open) return;
    setRequestData((prev) => ({
      ...prev,
      userName: userData.name || '',
      handoverDate: new Date().toISOString().split('T')[0],
    }));
  }, [open, userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestAsset = async () => {
    if (
      !requestData.userName ||
      !requestData.assetId ||
      !requestData.quantity ||
      !requestData.reason
    ) {
      toast.error('Please fill in all fields');
      return;
    }
    const assetId = requestData.assetId;
    const borrowedDate = new Date().toISOString().split('T')[0];
    const payload = {
      user_id: parseInt(userId),
      asset_id: parseInt(assetId),
      submitted_date: borrowedDate,
      handover_date: requestData.handoverDate,
      quantity: parseInt(requestData.quantity),
      is_returning: requestData.isAssetReturning,
    };

    try {
      const response = await fetch(`${BASE_URLS.assetRequest}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        onRequest(requestData);
        setRequestData({
          userName: '',
          assetName: '',
          assetId: '',
          category: '',
          quantity: '',
          handoverDate: '',
          reason: '',
          isAssetReturning: true,
        });
        toast.success('Request submitted successfully!');
        onClose();
      } else {
        toast.error('Error: ' + data.message);
      }
    } catch (error) {
      toast.error('Failed to submit request: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Request an Asset</DialogTitle>
      <DialogContent>
        <TextField
          label="Your Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="userName"
          value={requestData.userName}
          onChange={handleInputChange}
          disabled
        />
        <AssetSearch
          value={requestData.assetName}
          onChange={handleInputChange}
          setAssetId={(assetId) =>
            setRequestData((prev) => ({ ...prev, assetId }))
          }
        />
        <TextField
          label="Quantity"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          name="quantity"
          value={requestData.quantity}
          onChange={handleInputChange}
          inputProps={{ min: 0 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={requestData.isAssetReturning}
              onChange={(e) =>
                setRequestData((prev) => ({
                  ...prev,
                  isAssetReturning: e.target.checked,
                }))
              }
              color="primary"
            />
          }
          label="Asset Returning"
        />
        <TextField
          label="Handover Date"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          name="handoverDate"
          value={requestData.handoverDate}
          onChange={handleInputChange}
          disabled={!requestData.isAssetReturning}
        />
        <TextField
          label="Reason for Request"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          name="reason"
          value={requestData.reason}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleRequestAsset}
          variant="contained"
          color="primary"
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RequestButton;
