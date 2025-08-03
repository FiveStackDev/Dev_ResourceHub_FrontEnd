import React, { useState, useEffect } from 'react';
import { Dialog, Switch } from '@mui/material';
import { Edit, Calendar, FileText } from 'lucide-react';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import '../AssetComponents.css';

const EditAssetRequestPopup = ({ open, onClose, asset, onSave }) => {
  const [quantity, setQuantity] = useState('');
  const [handoverDate, setHandoverDate] = useState('');
  const [isReturning, setIsReturning] = useState(false);

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  useEffect(() => {
    if (asset) {
      setQuantity(asset.quantity || '');
      setHandoverDate(asset.handover_date || '');
      setIsReturning(asset.is_returning || false);
    }
  }, [asset]);

  const handleSave = () => {
    if (!quantity) {
      alert('Please fill in all required fields');
      return;
    }

    onSave({
      ...asset,
      quantity: parseInt(quantity),
      handover_date: handoverDate,
      is_returning: isReturning,
    });
  };

  if (!asset) return null;

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
          overflow: 'visible',
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          '@media (max-width: 600px)': {
            margin: '16px',
            width: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 32px)',
          },
        },
      }}
    >
      <div className="asset-popup-container">
        <div className="asset-popup-header">
          <div className="asset-popup-header-content">
            <div className="asset-popup-header-icon">
              <Edit size={24} color="#3b82f6" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 className="asset-popup-title">Edit Asset Request</h2>
              <p className="asset-popup-subtitle">
                Update your asset request details
              </p>
            </div>
          </div>
        </div>

        <div className="asset-popup-content">
          <div className="asset-form-group">
            <label className="asset-form-label">Asset Name</label>
            <div
              style={{
                padding: '12px 16px',
                border: '2px solid var(--asset-input-border)',
                borderRadius: '8px',
                backgroundColor: 'var(--asset-input-bg)',
                color: 'var(--asset-popup-text-secondary)',
                fontSize: '14px',
              }}
            >
              {asset.asset_name}
            </div>
          </div>

          <div className="asset-form-group">
            <label className="asset-form-label">Category</label>
            <div
              style={{
                padding: '12px 16px',
                border: '2px solid var(--asset-input-border)',
                borderRadius: '8px',
                backgroundColor: 'var(--asset-input-bg)',
                color: 'var(--asset-popup-text-secondary)',
                fontSize: '14px',
              }}
            >
              {asset.category}
            </div>
          </div>

          <div className="asset-form-group">
            <label htmlFor="quantity" className="asset-form-label">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="asset-form-input"
              min="1"
              placeholder="Enter quantity needed"
            />
          </div>

          <div className="asset-switch-container">
            <Switch
              checked={isReturning}
              onChange={(e) => setIsReturning(e.target.checked)}
              color="primary"
            />
            <span className="asset-switch-label">Asset Returning</span>
          </div>

          <div className="asset-form-group">
            <label htmlFor="handoverDate" className="asset-form-label">
              <Calendar
                size={16}
                style={{ display: 'inline', marginRight: '8px' }}
              />
              Handover Date
            </label>
            <input
              id="handoverDate"
              type="date"
              value={handoverDate}
              onChange={(e) => setHandoverDate(e.target.value)}
              disabled={!isReturning}
              className="asset-form-input"
            />
          </div>
        </div>

        <div className="asset-button-group">
          <button
            className="asset-button asset-button-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="asset-button asset-button-primary"
            onClick={handleSave}
          >
            <Edit size={16} />
            Update Request
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditAssetRequestPopup;
