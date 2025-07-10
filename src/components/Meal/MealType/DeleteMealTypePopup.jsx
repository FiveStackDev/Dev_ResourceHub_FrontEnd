import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';

function DeletePopup({ open, onClose, onDelete, mealId }) {
  // State to track any error messages during deletion
  const [error, setError] = useState(null);

  // Handle meal deletion API call
  const handleDelete = async () => {
    try {
      const response = await fetch(`${BASE_URLS.mealtype}/details/${mealId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (response.ok) {
        onDelete(mealId); // Notify parent of deletion
        onClose(); // Close the dialog
      } else {
        // Parse and show error message from server response
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete meal type');
      }
    } catch (error) {
      // Catch network or unexpected errors
      setError(`Error deleting meal type: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      {/* Display error message if any */}
      {error && <p style={{ color: 'red', padding: '0 16px' }}>{error}</p>}
      <DialogActions>
        {/* Cancel button */}
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        {/* Confirm delete button */}
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeletePopup;
