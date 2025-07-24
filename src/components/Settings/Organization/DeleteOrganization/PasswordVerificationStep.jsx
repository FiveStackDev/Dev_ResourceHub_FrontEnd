import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowRight, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URLS } from '../../../../services/api/config';
import { getAuthHeader } from '../../../../utils/authHeader';
import { useUser, decodeToken } from '../../../../contexts/UserContext';

const PasswordVerificationStep = ({ orgData, onComplete, onBack, canGoBack, stepData }) => {
  const [password, setPassword] = useState(stepData.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const { userData } = useUser();

  const getUserInfo = () => {
    let userId = userData.id;
    let orgId = null;
    
    if (!userId) {
      const decoded = decodeToken();
      userId = decoded?.id;
      orgId = decoded?.org_id;
    } else {
      const decoded = decodeToken();
      orgId = decoded?.org_id;
    }
    
    return { userId, orgId };
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
    setIsVerified(false);
  };

  const verifyPassword = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
    
      // Call the backend endpoint to verify password and send email
      const verificationCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      
      const requestData = {
        email: orgData.org_email,
        code: verificationCode,
        password: password
      };

      console.log('Sending delete verification request:', { ...requestData, password: '[HIDDEN]' });
      
      const response = await axios.post(
        `${BASE_URLS.orgsettings}/deleteverification`,
        requestData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      setIsVerified(true);
      toast.success('Password verified! Verification email sent successfully.');
      
      // Auto-proceed after successful verification
      setTimeout(() => {
        onComplete({ 
          password: password,
          emailSent: true,
          verificationCode: verificationCode
        });
      }, 1500);

    } catch (err) {
      console.error('Delete verification error:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error response status:', err.response?.status);
      
      let errorMessage = 'Password verification failed';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(`Verification failed: ${errorMessage}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContinue = () => {
    if (isVerified) {
      onComplete({ 
        password: password,
        emailSent: true
      });
    } else {
      verifyPassword();
    }
  };

  return (
    <div className="step-container">
      <h2 className="step-title">
        <Shield size={24} style={{ color: 'var(--settings-accent-primary)', marginRight: '0.5rem' }} />
        Password Verification
      </h2>
      
      <div className="step-content">
        <div style={{
          background: 'var(--settings-warning-bg)',
          border: '2px solid var(--settings-warning-border)',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '0.75rem' 
          }}>
            <Shield size={20} style={{ color: 'var(--settings-warning-text)' }} />
            <h4 style={{ 
              color: 'var(--settings-warning-text)', 
              margin: '0',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Security Authentication Required
            </h4>
          </div>
          <p style={{ 
            color: 'var(--settings-warning-text)', 
            margin: '0',
            lineHeight: '1.5'
          }}>
            Please enter your current password to verify your identity. Once verified, 
            a verification code will be sent to the organization email address.
          </p>
        </div>

        <div style={{
          background: 'var(--settings-card-bg)',
          border: '2px solid var(--settings-card-border)',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h4 style={{ 
            color: 'var(--settings-popup-text-primary)', 
            margin: '0 0 1rem 0',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            Verification email will be sent to:
          </h4>
          <div style={{
            background: 'var(--settings-input-bg)',
            border: '2px solid var(--settings-accent-primary)',
            borderRadius: '8px',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '1rem',
            color: 'var(--settings-popup-text-primary)',
            textAlign: 'center'
          }}>
            {orgData?.org_email || 'No email configured'}
          </div>
        </div>

        <div className="step-form-group">
          <label className="step-label">
            <Shield size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Enter your current password:
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              className={`step-input ${error ? 'error' : isVerified ? 'success' : ''}`}
              placeholder="Enter your account password"
              autoComplete="current-password"
              disabled={isVerifying || isVerified}
              style={{ paddingRight: '3rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isVerifying || isVerified}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--settings-popup-text-secondary)',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'var(--settings-danger-bg)',
            border: '2px solid var(--settings-danger-color)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem',
            color: 'var(--settings-danger-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {isVerified && (
          <div style={{
            background: 'var(--settings-success-bg)',
            border: '2px solid var(--settings-success-color)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem',
            color: 'var(--settings-success-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle size={16} />
            Password verified successfully! Verification email sent.
          </div>
        )}

        <div style={{
          background: 'var(--settings-input-bg)',
          border: '2px solid var(--settings-input-border)',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--settings-popup-text-secondary)'
        }}>
          <strong>Security Note:</strong> Your password is encrypted and never stored in plain text. 
          This verification ensures that only authorized personnel can delete the organization.
        </div>
      </div>

      <div className="step-actions">
        {canGoBack && !isVerified && (
          <button
            className="step-button secondary"
            onClick={onBack}
            disabled={isVerifying}
          >
            <ArrowLeft size={18} />
            Back to Name Confirmation
          </button>
        )}
        <button
          className={`step-button ${isVerified ? 'primary' : password.trim() ? 'danger' : 'secondary'}`}
          onClick={handleContinue}
          disabled={isVerifying || !password.trim()}
        >
          {isVerifying ? (
            <>
              <div style={{ 
                width: '18px', 
                height: '18px', 
                border: '2px solid transparent', 
                borderTop: '2px solid currentColor', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }} />
              Verifying Password...
            </>
          ) : isVerified ? (
            <>
              <ArrowRight size={18} />
              Continue to Email Verification
            </>
          ) : (
            <>
              <Shield size={18} />
              Verify Password & Send Email
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PasswordVerificationStep;
