import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Trash2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URLS } from '../../../../services/api/config';
import { getAuthHeader } from '../../../../utils/authHeader';
import { useUser, decodeToken } from '../../../../contexts/UserContext';

const EmailVerificationStep = ({ orgData, onBack, canGoBack, stepData, onReset }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const { userData } = useUser();

  useEffect(() => {
    if (timeLeft > 0 && !isDeleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isDeleted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    setError('');
  };

  const deleteOrganization = async () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    // Note: In a real implementation, you would verify the code first
    // For this demo, we're proceeding directly to deletion
    setIsDeleting(true);
    setError('');

    try {
      const { userId, orgId } = getUserInfo();
      
      if (!userId || !orgId) {
        throw new Error('User or Organization ID not found. Please log in again.');
      }

      // Call the backend endpoint to delete organization
      const response = await axios.delete(
        `${BASE_URLS.orgsettings}/organization/${orgId}`,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          },
          data: {
            verificationCode: verificationCode
          }
        }
      );

      setIsDeleted(true);
      toast.success('Organization has been permanently deleted!');
      
      // Redirect to login after a delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Organization deletion failed';
      setError(errorMessage);
      toast.error(`Deletion failed: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const { userId } = getUserInfo();
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      await axios.post(
        `${BASE_URLS.orgsettings}/deleteverification`,
        {
          email: orgData.org_email,
          userId: userId,
          code: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
        },
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      setTimeLeft(300); // Reset timer
      toast.success('Verification email resent successfully!');
      
    } catch (err) {
      toast.error('Failed to resend verification email');
    }
  };

  if (isDeleted) {
    return (
      <div className="step-container">
        <div style={{ textAlign: 'center' }}>
          <CheckCircle size={64} style={{ color: 'var(--settings-success-color)', marginBottom: '1rem' }} />
          <h2 style={{ 
            color: 'var(--settings-success-text)', 
            margin: '0 0 1rem 0',
            fontSize: '1.5rem'
          }}>
            Organization Deleted Successfully
          </h2>
          <p style={{ 
            color: 'var(--settings-popup-text-secondary)', 
            fontSize: '1.1rem',
            margin: '0 0 2rem 0'
          }}>
            The organization and all associated data have been permanently removed.
            You will be redirected to the login page shortly.
          </p>
          <div style={{
            background: 'var(--settings-success-bg)',
            border: '2px solid var(--settings-success-color)',
            borderRadius: '10px',
            padding: '1.5rem',
            color: 'var(--settings-success-text)'
          }}>
            <strong>Thank you for using ResourceHub.</strong><br />
            If you need to create a new organization in the future, please contact our support team.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <h2 className="step-title">
        <Mail size={24} style={{ color: 'var(--settings-accent-primary)', marginRight: '0.5rem' }} />
        Email Verification - Final Step
      </h2>
      
      <div className="step-content">
        <div style={{
          background: 'var(--settings-danger-bg)',
          border: '2px solid var(--settings-danger-color)',
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
            <AlertTriangle size={20} style={{ color: 'var(--settings-danger-text)' }} />
            <h4 style={{ 
              color: 'var(--settings-danger-text)', 
              margin: '0',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              FINAL WARNING - Point of No Return
            </h4>
          </div>
          <p style={{ 
            color: 'var(--settings-danger-text)', 
            margin: '0',
            lineHeight: '1.5'
          }}>
            Once you enter the verification code and confirm deletion, 
            <strong> ALL DATA WILL BE IMMEDIATELY AND PERMANENTLY DESTROYED</strong>. 
            This action cannot be undone under any circumstances.
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
            Verification email sent to:
          </h4>
          <div style={{
            background: 'var(--settings-input-bg)',
            border: '2px solid var(--settings-accent-primary)',
            borderRadius: '8px',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '1rem',
            color: 'var(--settings-popup-text-primary)',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            {orgData?.org_email}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontSize: '0.9rem',
            color: 'var(--settings-popup-text-secondary)'
          }}>
            <span>Code expires in: <strong>{formatTime(timeLeft)}</strong></span>
            <button
              onClick={resendVerificationEmail}
              disabled={timeLeft > 240} // Allow resend only in last 1 minute
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--settings-accent-primary)',
                cursor: timeLeft > 240 ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                textDecoration: 'underline',
                opacity: timeLeft > 240 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <RefreshCw size={14} />
              Resend Code
            </button>
          </div>
        </div>

        <div className="step-form-group">
          <label className="step-label">
            <Mail size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Enter 6-digit verification code:
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={handleCodeChange}
            className={`step-input ${error ? 'error' : verificationCode.length === 6 ? 'success' : ''}`}
            placeholder="000000"
            maxLength="6"
            style={{ 
              textAlign: 'center', 
              fontSize: '1.5rem', 
              letterSpacing: '0.5rem',
              fontFamily: 'monospace'
            }}
            disabled={isDeleting || timeLeft === 0}
          />
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

        {timeLeft === 0 && (
          <div style={{
            background: 'var(--settings-warning-bg)',
            border: '2px solid var(--settings-warning-border)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem',
            color: 'var(--settings-warning-text)',
            textAlign: 'center'
          }}>
            <strong>Verification code has expired.</strong><br />
            Please start the deletion process again from the beginning.
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
          <strong>Check your email:</strong> The verification code was sent to your organization email address. 
          Check your inbox and spam folder. The code is valid for 5 minutes for security purposes.
        </div>
      </div>

      <div className="step-actions">
        {canGoBack && !isDeleting && (
          <button
            className="step-button secondary"
            onClick={onBack}
          >
            <ArrowLeft size={18} />
            Back to Password
          </button>
        )}
        
        {timeLeft === 0 ? (
          <button
            className="step-button secondary"
            onClick={onReset}
          >
            <RefreshCw size={18} />
            Start Over
          </button>
        ) : (
          <button
            className={`step-button danger`}
            onClick={deleteOrganization}
            disabled={isDeleting || verificationCode.length !== 6 || timeLeft === 0}
          >
            {isDeleting ? (
              <>
                <div style={{ 
                  width: '18px', 
                  height: '18px', 
                  border: '2px solid transparent', 
                  borderTop: '2px solid currentColor', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }} />
                Deleting Organization...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                PERMANENTLY DELETE ORGANIZATION
              </>
            )}
          </button>
        )}
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

export default EmailVerificationStep;
