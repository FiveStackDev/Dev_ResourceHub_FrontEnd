import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { X, Wrench, Plus } from 'lucide-react';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import '../shared/MaintenanceDialog.css';

export const AddMaintenancePopup = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('Low');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameError(!name.trim());
    setDescriptionError(!description.trim());

    if (!name.trim() || !description.trim()) {
      return;
    }

    onAdd({ name, priorityLevel, description });
    // Clear form after successful submission
    setName('');
    setPriorityLevel('Low');
    setDescription('');
    setNameError(false);
    setDescriptionError(false);
    onClose();
  };

  const handleClose = () => {
    // Clear form when closing
    setName('');
    setPriorityLevel('Low');
    setDescription('');
    setNameError(false);
    setDescriptionError(false);
    onClose();
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
      <div className="maintenance-popup-container">
        <div className="maintenance-popup-header">
          <div className="maintenance-popup-header-content">
            <div className="maintenance-popup-header-icon">
              <Wrench size={24} color="#f59e0b" />
            </div>
            <div>
              <h2 className="maintenance-popup-title">Add Maintenance</h2>
              <p className="maintenance-popup-subtitle">Create a new maintenance request</p>
            </div>
          </div>
          <button onClick={handleClose} className="maintenance-popup-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="maintenance-popup-content">
            <div className="maintenance-popup-form">
              <div className="maintenance-popup-input-group">
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={nameError}
                  helperText={nameError ? 'Please enter a name' : ''}
                  className="maintenance-popup-textfield"
                />
              </div>
              
              <div className="maintenance-popup-input-group">
                <FormControl fullWidth className="maintenance-popup-select">
                  <InputLabel>Priority Level</InputLabel>
                  <Select
                    value={priorityLevel}
                    label="Priority Level"
                    onChange={(e) => setPriorityLevel(e.target.value)}
                  >
                     <MenuItem value="Low">🟡 Low </MenuItem>
                    <MenuItem value="Medium">🟠 Medium </MenuItem>
                    <MenuItem value="High">🔴 High </MenuItem>
                  </Select>
                </FormControl>
              </div>
              
              <div className="maintenance-popup-input-group">
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={descriptionError}
                  helperText={descriptionError ? 'Please enter a description' : ''}
                  className="maintenance-popup-textfield"
                />
              </div>
            </div>
          </div>

          <div className="maintenance-popup-actions">
            <button 
              type="button" 
              onClick={handleClose} 
              className="maintenance-popup-cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="maintenance-popup-submit-btn"
            >
              <Plus size={16} />
              Add Maintenance
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
