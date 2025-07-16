import React, { useState, useEffect } from 'react';
import { Dialog, Switch } from '@mui/material';
import { Send, User, Calendar, FileText, ToggleLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import AssetSearch from './AssetSearch';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';
import { useUser, decodeToken } from '../../../contexts/UserContext';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import '../AssetComponents.css';

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

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        className: 'asset-popup-backdrop',
      }}
      PaperProps={{
        style: {
          borderRadius: '16px',
          overflow: 'visible'
        }
      }}
    >
      <div className="asset-popup-container">
        <div className="asset-popup-header">
          <div className="asset-popup-header-content">
            <div className="asset-popup-header-icon">
              <Send size={24} color="#3b82f6" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 className="asset-popup-title">Request an Asset</h2>
              <p className="asset-popup-subtitle">Submit a request for organizational assets</p>
            </div>
          </div>
        </div>

        <div style={{ overflowY: 'auto', maxHeight: 'calc(80vh - 200px)' }}>


          <div className="asset-form-group">
            <label className="asset-form-label">Asset Name</label>
            <AssetSearch
              value={requestData.assetName}
              onChange={handleInputChange}
              setAssetId={(assetId) =>
                setRequestData((prev) => ({ ...prev, assetId }))
              }
            />
          </div>

          <div className="asset-form-group">
            <label htmlFor="quantity" className="asset-form-label">Quantity</label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              value={requestData.quantity}
              onChange={handleInputChange}
              className="asset-form-input"
              min="1"
              placeholder="Enter quantity needed"
            />
          </div>

          <div className="asset-switch-container">
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
            <span className="asset-switch-label">
              <ToggleLeft size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Asset Returning
            </span>
          </div>

          <div className="asset-form-group">
            <label htmlFor="handoverDate" className="asset-form-label">
              <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Handover Date
            </label>
            <input
              id="handoverDate"
              type="date"
              name="handoverDate"
              value={requestData.handoverDate}
              onChange={handleInputChange}
              disabled={!requestData.isAssetReturning}
              className="asset-form-input"
            />
          </div>

          <div className="asset-form-group">
            <label htmlFor="reason" className="asset-form-label">
              <FileText size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Reason for Request
            </label>
            <textarea
              id="reason"
              name="reason"
              value={requestData.reason}
              onChange={handleInputChange}
              className="asset-form-textarea"
              placeholder="Please explain why you need this asset..."
              rows={3}
            />
          </div>
        </div>

        <div className="asset-button-group">
          <button className="asset-button asset-button-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="asset-button asset-button-primary" onClick={handleRequestAsset}>
            <Send size={16} />
            Submit Request
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default RequestButton;
