import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import './UserDialog.css';

export const DeleteConfirmDialog = ({
  open,
  userCount,
  onClose,
  onConfirm,
}) => {
  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

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
      <div className="user-delete-container">
        <div className="user-delete-header">
          <div className="user-delete-header-content">
            <div className="user-delete-icon-container">
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <div>
              <h2 className="user-delete-title">Confirm Deletion</h2>
              <p className="user-delete-subtitle">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button onClick={onClose} className="user-popup-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="user-delete-content">
          <div className="user-delete-warning-box">
            <p className="user-delete-warning-text">
              Are you sure you want to delete{' '}
              <span className="user-delete-count">
                {userCount} user{userCount !== 1 ? 's' : ''}
              </span>
              ? This will permanently remove {userCount !== 1 ? 'them' : 'it'}{' '}
              from the system.
            </p>
          </div>
        </div>

        <div className="user-delete-actions">
          <button onClick={onClose} className="user-delete-cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="user-delete-confirm-btn">
            <Trash2 size={16} />
            Delete {userCount !== 1 ? 'Users' : 'User'}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
