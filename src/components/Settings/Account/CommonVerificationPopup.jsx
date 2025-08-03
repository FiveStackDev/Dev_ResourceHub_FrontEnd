import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog } from '@mui/material';
import { Shield, Mail, Check, X, RefreshCw } from 'lucide-react';
import '../Styles/VerifyPopup.css';

function CommonVerificationPopup({ title, onClose, email, code, onVerified, onResendCode }) {
  const [inputcode, setInputCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputcode.trim()) {
      toast.error('Please enter the verification code.');
      return;
    }

    if (inputcode.length !== 6) {
      toast.error('Verification code must be 6 digits.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (inputcode === code) {
        if (onVerified) await onVerified();
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
    } catch (error) {
      toast.error('An error occurred during verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = () => {
    if (onResendCode && canResend) {
      onResendCode();
      setCountdown(60);
      setCanResend(false);
      setInputCode('');
      toast.info('New verification code sent to your email.');
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
          <h1 className="verify-title">{title}</h1>
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                setInputCode(value);
              }}
              maxLength={6}
              autoComplete="one-time-code"
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="verify-buttons">
            <button 
              type="submit" 
              className="verify-submit-btn"
              disabled={isSubmitting || !inputcode.trim()}
            >
              <Check className="btn-icon" />
              {isSubmitting ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              type="button"
              className="verify-cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X className="btn-icon" />
              Cancel
            </button>
          </div>

          {onResendCode && (
            <div className="verify-resend">
              <button
                type="button"
                className={`verify-resend-btn ${!canResend ? 'disabled' : ''}`}
                onClick={handleResendCode}
                disabled={!canResend || isSubmitting}
              >
                <RefreshCw className="btn-icon" />
                {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
              </button>
            </div>
          )}
        </form>
      </div>
    </Dialog>
  );
}

export default CommonVerificationPopup;
