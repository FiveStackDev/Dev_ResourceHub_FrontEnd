import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import './CalendarComponents.css';

function DeletePopup({ open, handleClose, onDelete, eventTitle }) {
  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      BackdropProps={{
        className: 'calendar-delete-backdrop',
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="calendar-delete-container">
        <div className="calendar-delete-header">
          <div className="calendar-delete-header-content">
            <div className="calendar-delete-icon-container">
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <div>
              <h2 className="calendar-delete-title">Delete Event</h2>
              <p className="calendar-delete-subtitle">This action cannot be undone</p>
            </div>
          </div>
          <button onClick={handleClose} className="calendar-popup-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="calendar-delete-content">
          <div className="calendar-delete-warning-box">
            <Typography className="calendar-delete-warning-text" variant="body1">
              Are you sure you want to delete the event:
              <br />
              <span className="calendar-delete-event-name">"{eventTitle}"</span>?
            </Typography>
          </div>
        </div>

        <div className="calendar-delete-actions">
          <button 
            onClick={handleClose} 
            className="calendar-delete-cancel-btn"
          >
            Cancel
          </button>
          <button 
            onClick={onDelete} 
            className="calendar-delete-confirm-btn"
          >
            <Trash2 size={16} />
            Delete Event
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeletePopup;
