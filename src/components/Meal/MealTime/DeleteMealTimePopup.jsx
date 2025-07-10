import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';

function DeletePopup({ open, onClose, onDelete, mealId }) {
  const [error, setError] = useState(null);

  // Handles deleting the meal time via API call
  const handleDelete = async () => {
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
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>

      {/* Display error message if deletion fails */}
      {error && <p style={{ color: 'red', padding: '0 16px' }}>{error}</p>}

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeletePopup;
