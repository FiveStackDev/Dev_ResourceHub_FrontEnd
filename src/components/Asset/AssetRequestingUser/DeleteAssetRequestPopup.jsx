import React from 'react';
import { Dialog } from '@mui/material';
import { Trash2, X } from 'lucide-react';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import '../AssetComponents.css';

const DeleteAssetRequestPopup = ({ open, onClose, asset, onDelete }) => {
  const { updateCSSVariables } = useThemeStyles();

  React.useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  const handleDelete = () => {
    onDelete(asset);
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
    >
      <div className="asset-popup-container">
        <div className="asset-popup-header">
          <div className="asset-popup-header-content">
            <div className="asset-popup-header-icon">
              <Trash2 size={24} color="#ef4444" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 className="asset-popup-title">Delete Asset Request</h2>
              <p className="asset-popup-subtitle">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button onClick={onClose} className="asset-popup-close-btn">
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div className="asset-delete-warning-box">
            <p className="asset-delete-warning-text">
              Are you sure you want to delete this asset request?
            </p>
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: 'var(--asset-input-bg)',
                borderRadius: '8px',
                border: '1px solid var(--asset-input-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontWeight: '600',
                    color: 'var(--asset-popup-text-secondary)',
                  }}
                >
                  Asset:
                </span>
                <span style={{ color: 'var(--asset-popup-text-primary)' }}>
                  {asset.asset_name}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontWeight: '600',
                    color: 'var(--asset-popup-text-secondary)',
                  }}
                >
                  Status:
                </span>
                <span style={{ color: 'var(--asset-popup-text-primary)' }}>
                  {asset.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontWeight: '600',
                    color: 'var(--asset-popup-text-secondary)',
                  }}
                >
                  Quantity:
                </span>
                <span style={{ color: 'var(--asset-popup-text-primary)' }}>
                  {asset.quantity}
                </span>
              </div>
            </div>
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
            className="asset-button asset-button-danger"
            onClick={handleDelete}
            style={{
              backgroundColor: '#ef4444',
              borderColor: '#ef4444',
              color: 'white',
            }}
          >
            <Trash2 size={16} />
            Delete Request
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteAssetRequestPopup;
