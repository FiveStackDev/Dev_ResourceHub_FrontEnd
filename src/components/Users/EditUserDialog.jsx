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

import { X, Edit } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { useUser } from '../../contexts/UserContext';
import './UserDialog.css';


export const EditUserDialog = ({ user, open, onClose, onSave }) => {
  const { isSuperAdmin, isAdmin } = useUser();
  const [email, setEmail] = useState(user.email);
  const [userType, setUserType] = useState(user.userType);
  const [additionalDetails, setAdditionalDetails] = useState(
    user.additionalDetails,
  );

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  useEffect(() => {
    setEmail(user.email);
    setUserType(user.userType);
    setAdditionalDetails(user.additionalDetails);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...user,
      email,
      userType,
      additionalDetails,
    });
    onClose();
  };

  // Determine if role dropdown should be disabled for Admins
  const isEditingAdminOrSuperAdmin = isAdmin && (user.userType === 'Admin' || user.userType === 'SuperAdmin');

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
      <div className="user-popup-container">
        <div className="user-popup-header">
          <div className="user-popup-header-content">
            <div className="user-popup-header-icon">
              <Edit size={24} color="#3b82f6" />
            </div>
            <div>
              <h2 className="user-popup-title">Edit User</h2>
              <p className="user-popup-subtitle">Update user information</p>
            </div>
          </div>
          <button onClick={onClose} className="user-popup-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="user-popup-content">
            <div className="user-popup-form">
              <div className="user-popup-input-group">
                <TextField
                  fullWidth
                  label="Email"
                  value={email}
                  disabled
                  required
                  helperText="Email cannot be changed"
                  className="user-popup-textfield"
                />
              </div>

              <div className="user-popup-input-group">
                <FormControl fullWidth className="user-popup-select">
                  <InputLabel>User Type</InputLabel>
                  <Select
                    value={userType}
                    label="User Type"
                    onChange={(e) => setUserType(e.target.value)}
                    disabled={isEditingAdminOrSuperAdmin}
                  >
                    {isSuperAdmin ? (
                      <>
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="User">User</MenuItem>
                      </>
                    ) : (
                      <MenuItem value="User">User</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </div>

              <div className="user-popup-input-group">
                <TextField
                  fullWidth
                  label="Additional Details"
                  multiline
                  rows={4}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="user-popup-textfield"
                  disabled={isEditingAdminOrSuperAdmin}
                />
              </div>
            </div>
          </div>

          <div className="user-popup-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="user-popup-cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="user-popup-submit-btn"
              disabled={isEditingAdminOrSuperAdmin}
            >
              <Edit size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
