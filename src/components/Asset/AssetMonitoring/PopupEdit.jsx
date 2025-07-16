import React, { useState, useEffect } from 'react';
import { Dialog, Switch } from '@mui/material';
import { Edit, Calendar } from 'lucide-react';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import '../AssetComponents.css';

const PopupEdit = ({ open, handleClose, asset, onSave, onRefresh }) => {
  const [quantity, setQuantity] = useState(asset.quantity);
  const [status, setStatus] = useState(asset.status);
  const [handoverDate, setHandoverDate] = useState(asset.handover_date);
  const [isReturning, setIsReturning] = useState(asset.is_returning);

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  useEffect(() => {
    if (asset) {
      setQuantity(asset.quantity);
      setStatus(asset.status);
      setHandoverDate(asset.handover_date);
      setIsReturning(asset.is_returning);
    }
  }, [asset]);

  const handleSaveClick = () => {
    onSave({
      ...asset,
      quantity: parseInt(quantity),
      status,
      handover_date: handoverDate,
      is_returning: isReturning,
    });
    handleClose();
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      aria-labelledby="edit-asset-modal-title"
      aria-describedby="edit-asset-modal-description"
    >
      <div className="asset-popup-container">
        <div className="asset-popup-header">
          <div className="asset-popup-header-content">
            <div className="asset-popup-header-icon">
              <Edit size={24} color="#3b82f6" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 className="asset-popup-title">Edit Asset Details</h2>
              <p className="asset-popup-subtitle">Update asset information and status</p>
            </div>
          </div>
        </div>

        <div style={{ overflowY: 'auto', maxHeight: 'calc(100% - 120px)' }}>
          <div className="asset-form-group">
            <label className="asset-form-label">Asset Name</label>
            <div style={{ 
              padding: '12px 16px', 
              border: '2px solid var(--asset-input-border)', 
              borderRadius: '8px',
              backgroundColor: 'var(--asset-input-bg)',
              color: 'var(--asset-popup-text-secondary)',
              fontSize: '14px'
            }}>
              {asset.asset_name}
            </div>
          </div>

          <div className="asset-form-group">
            <label className="asset-form-label">Category</label>
            <div style={{ 
              padding: '12px 16px', 
              border: '2px solid var(--asset-input-border)', 
              borderRadius: '8px',
              backgroundColor: 'var(--asset-input-bg)',
              color: 'var(--asset-popup-text-secondary)',
              fontSize: '14px'
            }}>
              {asset.category}
            </div>
          </div>

          <div className="asset-form-group">
            <label htmlFor="quantity" className="asset-form-label">Quantity</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="asset-form-input"
            />
          </div>

          <div className="asset-form-group">
            <label htmlFor="status" className="asset-form-label">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="asset-form-select"
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="asset-form-group">
            <label htmlFor="handoverDate" className="asset-form-label">
              <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
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

          <div className="asset-switch-container">
            <Switch
              checked={isReturning}
              onChange={(e) => setIsReturning(e.target.checked)}
              color="primary"
            />
            <span className="asset-switch-label">Asset Returning</span>
          </div>
        </div>

        <div className="asset-button-group">
          <button className="asset-button asset-button-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="asset-button asset-button-primary" onClick={handleSaveClick}>
            <Edit size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default PopupEdit;
