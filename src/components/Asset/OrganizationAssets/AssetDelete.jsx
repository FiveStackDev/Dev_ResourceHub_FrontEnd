import React, { useEffect } from 'react';
import { Modal } from '@mui/material';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import '../AssetComponents.css';

function DeleteAssetPopup({ open, asset, onClose, onDelete }) {
  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        className: 'asset-popup-backdrop',
      }}
    >
      <div className="asset-delete-container">
        <div className="asset-delete-header">
          <div className="asset-delete-icon">
            <AlertTriangle size={24} color="#dc2626" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 className="asset-delete-title">Delete Asset</h2>
          </div>
        </div>

        <div className="asset-delete-warning">
          <p className="asset-delete-warning-text">
            Are you sure you want to delete <strong style={{ color: 'var(--asset-popup-text-primary)' }}>"{asset.asset_name}"</strong>?
            <br /><br />
            This action cannot be undone and will permanently remove the asset from your organization's inventory.
          </p>
        </div>

        <div className="asset-delete-actions">
          <button className="asset-button asset-button-cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="asset-button asset-button-danger" 
            onClick={() => onDelete(asset.asset_id)}
          >
            <Trash2 size={16} />
            Delete Asset
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteAssetPopup;
