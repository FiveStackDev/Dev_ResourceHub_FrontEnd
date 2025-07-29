import React from 'react';
import { Dialog } from '@mui/material';
import { X, Trash2 } from 'lucide-react';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import '../shared/MaintenanceDialog.css';

export const DeleteMaintenancePopup = ({
  open,
  onClose,
  maintenance,
  onDelete,
}) => {
  const { updateCSSVariables } = useThemeStyles();

  React.useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  const handleDelete = () => {
    onDelete(maintenance);
  };

  if (!maintenance) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        style: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
      PaperProps={{
        style: {
          borderRadius: '16px',
          overflow: 'visible',
        },
      }}
    >
      <div className="maintenance-delete-container">
        <div className="maintenance-popup-header">
          <div className="maintenance-popup-header-content">
            <div className="maintenance-popup-header-icon">
              <Trash2 size={24} color="#ef4444" />
            </div>
            <div>
              <h2 className="maintenance-popup-title">Delete Request</h2>
              <p className="maintenance-popup-subtitle">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button onClick={onClose} className="maintenance-popup-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="maintenance-popup-content">
          <div className="maintenance-delete-warning-box">
            <p className="maintenance-delete-warning-text">
              Are you sure you want to delete this request?
            </p>
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: 'var(--maintenance-popup-input-bg)',
                borderRadius: '8px',
                border: '1px solid var(--maintenance-popup-input-border)',
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
                    color: 'var(--maintenance-popup-text-secondary)',
                  }}
                >
                  Name:
                </span>
                <span
                  style={{ color: 'var(--maintenance-popup-text-primary)' }}
                >
                  {maintenance.name}
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
                    color: 'var(--maintenance-popup-text-secondary)',
                  }}
                >
                  Priority:
                </span>
                <span
                  style={{ color: 'var(--maintenance-popup-text-primary)' }}
                >
                  {maintenance.priorityLevel}
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
                    color: 'var(--maintenance-popup-text-secondary)',
                  }}
                >
                  Status:
                </span>
                <span
                  style={{ color: 'var(--maintenance-popup-text-primary)' }}
                >
                  {maintenance.status}
                </span>
              </div>
              <div style={{ marginTop: '12px' }}>
                <span
                  style={{
                    fontWeight: '600',
                    color: 'var(--maintenance-popup-text-secondary)',
                  }}
                >
                  Description:
                </span>
                <p
                  style={{
                    color: 'var(--maintenance-popup-text-primary)',
                    marginTop: '4px',
                    fontSize: '0.9rem',
                  }}
                >
                  {maintenance.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="maintenance-popup-actions">
          <button onClick={onClose} className="maintenance-popup-cancel-btn">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="maintenance-delete-confirm-btn"
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
