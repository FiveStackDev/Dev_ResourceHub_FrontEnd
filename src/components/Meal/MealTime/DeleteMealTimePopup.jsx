import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';
import '../Meal-CSS/DeletePopup.css';
import { useThemeStyles } from '../../../hooks/useThemeStyles';

function DeletePopup({ open, onClose, onDelete, mealId, mealName }) {
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  // Handles deleting the meal time via API call
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${BASE_URLS.mealtime}/details/${mealId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (response.ok) {
        onDelete(mealId);  // Notify parent of deletion
        onClose();         // Close popup
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete meal time');
      }
    } catch (error) {
      setError(`Error deleting meal time: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
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
      <div className="delete-popup-container">
        {/* Header with icon and close button */}
        <div className="delete-popup-header">
          <div className="delete-header-content">
            <div className="delete-icon-container">
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <div>
              <h2 className="delete-title">Delete Meal Time</h2>
              <p className="delete-subtitle">This action cannot be undone</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="delete-close-btn"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <DialogContent className="delete-content">
          <div className="delete-warning-box">
            <Typography variant="body1" className="delete-warning-text">
              Are you sure you want to delete <span className="delete-meal-name">"{mealName}"</span>? 
              This will permanently remove it from the system.
            </Typography>
          </div>

          {/* Display error message if deletion fails */}
          {error && (
            <div className="delete-error-message">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}
        </DialogContent>

        {/* Action buttons */}
        <DialogActions className="delete-actions">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="delete-cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="delete-confirm-btn"
          >
            {isDeleting ? (
              <>
                <div className="delete-loading-spinner"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default DeletePopup;
