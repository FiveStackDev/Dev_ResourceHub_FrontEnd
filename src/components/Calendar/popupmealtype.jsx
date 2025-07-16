import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ShoppingCart, X } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import MealTypeSelect from './MealTypeSelect';
import './CalendarComponents.css';

function Popupmealtype({ open, handleClose, onAddEvent }) {
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
        className: 'calendar-popup-backdrop',
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="calendar-popup-container">
        <div className="calendar-popup-header">
          <div className="calendar-popup-header-content">
            <div className="calendar-popup-header-icon">
              <ShoppingCart size={24} color="#3b82f6" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 className="calendar-popup-title">Choose Meal Type</h2>
              <p className="calendar-popup-subtitle">Select your preferred meal option</p>
            </div>
          </div>
          <button onClick={handleClose} className="calendar-popup-close-btn">
            <X size={20} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', maxHeight: 'calc(100% - 120px)' }}>
          <MealTypeSelect onSelect={onAddEvent} />
        </div>
      </div>
    </Modal>
  );
}

export default Popupmealtype;
