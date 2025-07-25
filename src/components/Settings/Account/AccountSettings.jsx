// React imports and necessary dependencies

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff, User, Mail, Lock, Phone, Save } from 'lucide-react';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';
import { useUser, decodeToken } from '../../../contexts/UserContext';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import VerificationPopup from './VerificationPopup';
import ConfirmationDialog from '../Shared/ConfirmationDialog';
import '../Styles/SettingsComponents.css';

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

  const { userData } = useUser();
  const { updateCSSVariables } = useThemeStyles();

  // Apply theme variables when component mounts
  React.useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  // Password validation rule
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long, contain one uppercase letter, and one symbol.';
    }
    return '';
  };

  // Fetch user data on component mount
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
          {
            headers: {
              ...getAuthHeader(),
            },
          },
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
        {
          headers: {
            ...getAuthHeader(),
          },
        },
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
          await axios.put(
            `${BASE_URLS.settings}/phone/${userId}`,
            { phone_number: formData.phone },
            {
              headers: {
                ...getAuthHeader(),
              },
            },
          );
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
      // Use the same userId logic as other functions
      let currentUserId = userData.id;
      if (!currentUserId) {
        const decoded = decodeToken();
        currentUserId = decoded?.id;
      }
      if (!currentUserId) throw new Error('User ID not found');
      const { data } = await axios.get(
        `${BASE_URLS.settings}/details/${currentUserId}`,
        {
          headers: {
            ...getAuthHeader(),
          },
        },
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
      await axios.post(
        `${BASE_URLS.settings}/sendEmail/`,
        {
          email,
          code: randomCode,
        },
        {
          headers: {
            ...getAuthHeader(),
          },
        },
      );
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
          await axios.put(
            `${BASE_URLS.settings}/password/${userId}`,
            {
              current_password: formData.currentPassword,
              new_password: formData.newPassword,
            },
            {
              headers: {
                ...getAuthHeader(),
              },
            },
          );
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
      <div className="header">
        <User className="section-icon" size={32} />
        <h2>Account Settings</h2>
        <p
          style={{
            color: 'var(--settings-popup-text-secondary)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Manage your account information and security
        </p>
      </div>

      <div className="form-container">
        {/* Contact Information Section */}
        <div className="form-section">
          <h3 className="section-title">
            <Phone
              size={20}
              style={{ marginRight: '8px', verticalAlign: 'middle' }}
            />
            Contact Information
          </h3>

          {/* Phone update form */}
          <form onSubmit={handlePhoneSubmit} className="form-group">
            <label>
              <Phone
                size={18}
                style={{
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
            <button type="submit" className="section-button">
              <Save size={18} />
              Update Phone
            </button>
          </form>

          {/* Email update section */}
          <div className="form-group">
            <label>
              <Mail
                size={18}
                style={{
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
            <button
              type="button"
              className="section-button"
              onClick={() => handleEmailSubmit(formData.email)}
            >
              <Save size={18} />
              Update Email
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="form-section">
          <h3 className="section-title">
            <Lock
              size={20}
              style={{ marginRight: '8px', verticalAlign: 'middle' }}
            />
            Security Settings
          </h3>

          {/* Password change form */}
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group-password">
            <div className="password-header">
              <Lock
                size={24}
                style={{ color: 'var(--settings-accent-primary)' }}
              />
              <h3>Change Password</h3>
            </div>

            {/* Current password */}
            <div className="password-input-group">
              <label className="password-input-label">Current Password</label>
              <div className="password-input-container">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={handleClickShowCurrentPassword}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="password-input-group">
              <label className="password-input-label">New Password</label>
              <div className="password-input-container">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={handleClickShowNewPassword}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="password-input-group">
              <label className="password-input-label">
                Confirm New Password
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={handleClickShowConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="password-error">
                <Lock size={16} />
                {passwordError}
              </div>
            )}

            <button type="submit" className="passwordsumbit">
              <Lock size={18} />
              Change Password
            </button>
          </div>
        </form>
        </div>
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
