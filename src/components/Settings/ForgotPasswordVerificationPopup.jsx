import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog } from '@mui/material';
import { Shield, Mail, Check, X } from 'lucide-react';
import './Styles/VerifyPopup.css';

function ForgotPasswordVerificationPopup({ onClose, email, code, onVerified }) {
  const [inputcode, setInputCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputcode === code) {
      if (onVerified) onVerified();
      onClose();
    } else {
      toast.error('Invalid verification code. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="verification-popup-title"
      aria-describedby="verification-popup-description"
      BackdropProps={{ className: 'verify-popup-backdrop' }}
      PaperProps={{ style: { borderRadius: '20px', overflow: 'visible' } }}
    >
      <ToastContainer />
      <div className="verify-inner">
        <div className="verify-header">
          <div className="verify-icon">
            <Shield className="shield-icon" />
          </div>
          <h1 className="verify-title">Forgot Password Verification</h1>
          <p className="verify-subtitle">
            Enter the code sent to your email to continue
          </p>
        </div>
        <form className="verify-form" onSubmit={handleSubmit}>
          <div className="verify-email-info">
            <Mail className="mail-icon" />
            <div className="email-text">
              <span className="verify-label">Verification code sent to:</span>
              <span className="email-address">{email}</span>
            </div>
          </div>
          <div className="verify-input-group">
            <label htmlFor="verifycode" className="verify-input-label">
              Enter Verification Code
            </label>
            <input
              type="text"
              name="verifycode"
              id="verifycode"
              placeholder="Enter 6-digit verification code"
              className="verify-input"
              value={inputcode}
              onChange={(e) => setInputCode(e.target.value)}
              maxLength={6}
              autoComplete="one-time-code"
              required
            />
          </div>
          <div className="verify-buttons">
            <button type="submit" className="verify-submit-btn">
              <Check className="btn-icon" />
              Verify Code
            </button>
            <button
              type="button"
              className="verify-cancel-btn"
              onClick={onClose}
            >
              <X className="btn-icon" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

export default ForgotPasswordVerificationPopup;
