import React from 'react';
import { Modal, Box } from '@mui/material';
import { AlertTriangle, Check, X } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import './Styles/ConfirmationDialog.css';

// A reusable confirmation dialog component
const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  const { updateCSSVariables } = useThemeStyles();

  // Apply theme variables when component mounts
  React.useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  return (
    <Modal
      open={true}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      BackdropProps={{
        className: 'confirmation-popup-backdrop'
      }}
    >
      <Box className="confirmation-dialog">
        <div className="confirmation-header">
          <div className="confirmation-icon">
            <AlertTriangle className="warning-icon" />
          </div>
          <h3 className="confirmation-title">Confirm Action</h3>
        </div>

        {/* Display the confirmation message */}
        <p className="confirmation-message">{message}</p>

        {/* Buttons to confirm or cancel the action */}
        <div className="confirmation-dialog-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            <Check className="btn-icon" />
            Confirm
          </button>
          <button className="cancel-button" onClick={onCancel}>
            <X className="btn-icon" />
            Cancel
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default ConfirmationDialog;
