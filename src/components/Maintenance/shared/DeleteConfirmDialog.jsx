import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import './MaintenanceDialog.css';

export const DeleteConfirmDialog = ({ open, onClose, onConfirm }) => {
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
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }
      }}
      PaperProps={{
        style: {
          borderRadius: '16px',
          overflow: 'visible'
        }
      }}
    >
      <div className="maintenance-delete-container">
        <div className="maintenance-delete-header">
          <div className="maintenance-delete-header-content">
            <div className="maintenance-delete-icon-container">
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <div>
              <h2 className="maintenance-delete-title">Confirm Deletion</h2>
              <p className="maintenance-delete-subtitle">This action cannot be undone</p>
            </div>
          </div>
          <button onClick={onClose} className="maintenance-popup-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="maintenance-delete-content">
          <div className="maintenance-delete-warning-box">
            <p className="maintenance-delete-warning-text">
              Are you sure you want to delete this maintenance request? 
              This will permanently remove it from the system and cannot be recovered.
            </p>
          </div>
        </div>

        <div className="maintenance-delete-actions">
          <button onClick={onClose} className="maintenance-delete-cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="maintenance-delete-confirm-btn">
            <Trash2 size={16} />
            Delete Maintenance
          </button>
        </div>
      </div>
    </Dialog>
  );
};
