// React imports and necessary dependencies

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styles/AccountSection.css';
import { BASE_URLS } from '../../services/api/config';
import VerificationPopup from './VerificationPopup';
import ConfirmationDialog from './ConfirmationDialog';
import { toast } from 'react-toastify';
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useUser } from '../../contexts/UserContext';
import { decodeToken } from '../../contexts/UserContext';

const AccountSection = () => {
  // Form data state and UI state
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openVerifyPopup, setOpenVerifyPopup] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [code, setCode] = useState('');
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    message: '',
    onConfirm: null,
  });
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation rule
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long, contain one uppercase letter, and one symbol.';
    }
    return '';
  };

  // Fetch user data on component mount

  const { userData } = useUser();
  // Fallback: decode token directly if userData.id is undefined
  let userId = userData.id;
  if (!userId) {
    const decoded = decodeToken();
    userId = decoded?.id;
    console.log('AccountSettings fallback decoded userId:', userId);
  } else {
    console.log('AccountSettings userId:', userId);
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) throw new Error('User ID not found');

        const { data } = await axios.get(
          `${BASE_URLS.settings}/details/${userId}`,
        );
        const [profile] = data;

        setFormData((prev) => ({
          ...prev,
          email: profile.email || '',
          phone: profile.phone_number || '',
        }));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userData.id]);

  // Handle input changes and password validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'newPassword') {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  // Handle phone update with confirmation
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^0?\d{9}$/;

    if (formData.phone.length < 9) {
      toast.error('Phone number must be at least 9 digits long.');
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Invalid phone number format.');
      return;
    }

    try {
      if (!userId) throw new Error('User ID not found');

      const { data } = await axios.get(
        `${BASE_URLS.settings}/details/${userId}`,
      );
      const existingPhone = data[0]?.phone_number;

      if (formData.phone === existingPhone) {
        toast.error('This phone number is already in use.');
        return;
      }

      setConfirmationDialog({
        open: true,
        message: 'Are you sure you want to update your phone number?',
        onConfirm: async () => {
          await axios.put(`${BASE_URLS.settings}/phone/${userId}`, {
            phone_number: formData.phone,
          });
          toast.success('Phone updated successfully!');
          setConfirmationDialog({ open: false, message: '', onConfirm: null });
        },
      });
    } catch (err) {
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  // Handle email update and trigger verification popup
  const handleEmailSubmit = async (email) => {
    try {
      const userId = userData.id;
      if (!userId) throw new Error('User ID not found');

      const { data } = await axios.get(
        `${BASE_URLS.settings}/details/${userId}`,
      );
      const existingEmail = data[0]?.email;

      if (email === existingEmail) {
        toast.error('This email is already in use.');
        return;
      }

      setSelectedEmail(email);
      setOpenVerifyPopup(true);

      const randomCode =
        Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      setCode(randomCode.toString());

      await axios.post(`${BASE_URLS.settings}/sendEmail/`, {
        email,
        code: randomCode,
      });
      toast.success(`Verification code sent to ${email} successfully!`);
    } catch (error) {
      toast.error(
        `Failed to send verification code: ${error.response?.data?.message || error.message}`,
      );
    }
  };

  // Handle password change with confirmation
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.currentPassword === formData.newPassword &&
      formData.newPassword === formData.confirmPassword
    ) {
      toast.error('New password cannot be the same as the old password.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    setConfirmationDialog({
      open: true,
      message: 'Are you sure you want to update your password?',
      onConfirm: async () => {
        try {
          if (!userId) throw new Error('User ID not found');

          await axios.put(`${BASE_URLS.settings}/password/${userId}`, {
            current_password: formData.currentPassword,
            new_password: formData.newPassword,
          });

          toast.success('Password updated successfully!');
          setFormData((prev) => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }));
          setConfirmationDialog({ open: false, message: '', onConfirm: null });
        } catch (err) {
          toast.error(`Error: ${err.response?.data?.message || err.message}`);
        }
      },
    });
  };

  // Toggle visibility of password fields
  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  // Show loading or error states
  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  // Main UI rendering
  return (
    <div className="account-section">
      <h2>Account</h2>
      <div className="form-container">
        {/* Phone update form */}
        <form onSubmit={handlePhoneSubmit} className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <button type="submit">Update Phone</button>
        </form>

        {/* Email update section */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            onClick={() => handleEmailSubmit(formData.email)}
          >
            Update Email
          </button>
        </div>

        {/* Password change form */}
        <form onSubmit={handlePasswordSubmit}>
          <label>Change Password</label>
          <div className="form-group-password">
            {/* Current password */}
            <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-current-password">
                Current Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle current password visibility"
                      onClick={handleClickShowCurrentPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Current Password"
              />
            </FormControl>

            {/* New password */}
            <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-new-password">
                New Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-new-password"
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="New Password"
              />
            </FormControl>
            {/* Password error message */}
            {passwordError && <p className="error">{passwordError}</p>}

            {/* Confirm new password */}
            <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-confirm-password">
                Confirm New Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm New Password"
              />
            </FormControl>
            <button
              className="passwordsumbit"
              type="submit"
              disabled={!!passwordError}
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Email verification popup */}
      {openVerifyPopup && (
        <VerificationPopup
          onClose={() => setOpenVerifyPopup(false)}
          email={selectedEmail}
          code={code}
        />
      )}

      {/* Confirmation dialog for phone/password updates */}
      {confirmationDialog.open && (
        <ConfirmationDialog
          message={confirmationDialog.message}
          onConfirm={confirmationDialog.onConfirm}
          onCancel={() =>
            setConfirmationDialog({ open: false, message: '', onConfirm: null })
          }
        />
      )}
    </div>
  );
};

export default AccountSection;
