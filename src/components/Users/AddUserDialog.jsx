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
import { useUser } from '../../contexts/UserContext';
import { X, UserPlus } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import './UserDialog.css';

export const AddUserDialog = ({ open, onClose, onAdd }) => {
  const { isSuperAdmin, isAdmin, userData } = useUser();
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('User');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [emailError, setEmailError] = useState(false);

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }

    // Only Admins should be blocked from submitting Admins
    if (isAdmin && !isSuperAdmin && userType === 'Admin') {
      // Prevent Admin from adding Admins
      return;
    }

    onAdd({
      email,
      userType,
      additionalDetails,
      profilePicture: `https://ui-avatars.com/api/?name=${email.split('@')[0]}`,
    });

    // Clear form after successful submission
    setEmail('');
    setUserType('User');
    setAdditionalDetails('');
    setEmailError(false);
    onClose();
  };

  const handleClose = () => {
    // Clear form when closing
    setEmail('');
    setUserType('User');
    setAdditionalDetails('');
    setEmailError(false);
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
      <div className="user-popup-container">
        <div className="user-popup-header">
          <div className="user-popup-header-content">
            <div className="user-popup-header-icon">
              <UserPlus size={24} color="#3b82f6" />
            </div>
            <div>
              <h2 className="user-popup-title">Add User</h2>
              <p className="user-popup-subtitle">
                Add a new user to the system
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="user-popup-close-btn">
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  error={emailError}
                  helperText={
                    emailError ? 'Please enter a valid email address' : ''
                  }
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
                    disabled={isAdmin && !isSuperAdmin}
                  >
                    <MenuItem value="User">User</MenuItem>
                    {isSuperAdmin && <MenuItem value="Admin">Admin</MenuItem>}
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
                />
              </div>
            </div>
          </div>

          <div className="user-popup-actions">
            <button
              type="button"
              onClick={handleClose}
              className="user-popup-cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="user-popup-submit-btn">
              <UserPlus size={16} />
              Add User
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
