import React, { useState, useEffect } from 'react';
import { Building, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';

const NameConfirmationStep = ({
  orgData,
  onComplete,
  onBack,
  canGoBack,
  stepData,
}) => {
  const [organizationName, setOrganizationName] = useState(
    stepData.organizationName || '',
  );
  const [confirmationName, setConfirmationName] = useState('');
  const [error, setError] = useState('');

  const requiredOrgName = orgData?.org_name || '';

  useEffect(() => {
    setError('');
  }, [organizationName, confirmationName]);

  const validateNames = () => {
    if (!organizationName.trim()) {
      setError('Please enter the organization name');
      return false;
    }
    if (!confirmationName.trim()) {
      setError('Please re-enter the organization name for confirmation');
      return false;
    }
    if (organizationName.trim() !== requiredOrgName) {
      setError(`Organization name must match exactly: "${requiredOrgName}"`);
      return false;
    }
    if (organizationName.trim() !== confirmationName.trim()) {
      setError(
        'Organization names do not match. Please ensure both entries are identical.',
      );
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateNames()) {
      onComplete({ organizationName: organizationName.trim() });
    }
  };

  const isValid =
    organizationName.trim() === requiredOrgName &&
    organizationName.trim() === confirmationName.trim();

  return (
    <div className="step-container">
      <h2 className="step-title">
        <Building
          size={24}
          style={{
            color: 'var(--settings-accent-primary)',
            marginRight: '0.5rem',
          }}
        />
        Confirm Organization Name
      </h2>

      <div className="step-content">
        <div
          style={{
            background: 'var(--settings-warning-bg)',
            border: '2px solid var(--settings-warning-border)',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <AlertTriangle
              size={20}
              style={{ color: 'var(--settings-warning-text)' }}
            />
            <h4
              style={{
                color: 'var(--settings-warning-text)',
                margin: '0',
                fontSize: '1.1rem',
                fontWeight: '600',
              }}
            >
              Security Verification Required
            </h4>
          </div>
          <p
            style={{
              color: 'var(--settings-warning-text)',
              margin: '0',
              lineHeight: '1.5',
            }}
          >
            To prevent accidental deletion, you must type the exact organization
            name <strong>twice</strong>. This ensures you are intentionally
            deleting the correct organization.
          </p>
        </div>

        <div
          style={{
            background: 'var(--settings-card-bg)',
            border: '2px solid var(--settings-card-border)',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <h4
            style={{
              color: 'var(--settings-popup-text-primary)',
              margin: '0 0 1rem 0',
              fontSize: '1rem',
              fontWeight: '600',
            }}
          >
            Organization to be deleted:
          </h4>
          <div
            style={{
              background: 'var(--settings-input-bg)',
              border: '2px solid var(--settings-accent-primary)',
              borderRadius: '8px',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--settings-popup-text-primary)',
              textAlign: 'center',
              letterSpacing: '0.5px',
            }}
          >
            {requiredOrgName}
          </div>
        </div>

        <div className="step-form-group">
          <label className="step-label">
            <Building
              size={16}
              style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
            />
            Enter organization name exactly as shown above:
          </label>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className={`step-input ${error && organizationName ? 'error' : isValid ? 'success' : ''}`}
            placeholder={`Type "${requiredOrgName}" exactly`}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div className="step-form-group">
          <label className="step-label">
            <Building
              size={16}
              style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
            />
            Re-enter organization name to confirm:
          </label>
          <input
            type="text"
            value={confirmationName}
            onChange={(e) => setConfirmationName(e.target.value)}
            className={`step-input ${error && confirmationName ? 'error' : isValid ? 'success' : ''}`}
            placeholder={`Type "${requiredOrgName}" again`}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {error && (
          <div
            style={{
              background: 'var(--settings-danger-bg)',
              border: '2px solid var(--settings-danger-color)',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem',
              color: 'var(--settings-danger-text)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {isValid && (
          <div
            style={{
              background: 'var(--settings-success-bg)',
              border: '2px solid var(--settings-success-color)',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem',
              color: 'var(--settings-success-text)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Building size={16} />
            Organization name confirmed successfully
          </div>
        )}

        <div
          style={{
            background: 'var(--settings-input-bg)',
            border: '2px solid var(--settings-input-border)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1.5rem',
            fontSize: '0.9rem',
            color: 'var(--settings-popup-text-secondary)',
          }}
        >
          <strong>Note:</strong> The organization name is case-sensitive and
          must match exactly, including any spaces, special characters, or
          punctuation.
        </div>
      </div>

      <div className="step-actions">
        {canGoBack && (
          <button className="step-button secondary" onClick={onBack}>
            <ArrowLeft size={18} />
            Back to Consequences
          </button>
        )}
        <button
          className={`step-button ${isValid ? 'primary' : 'secondary'}`}
          onClick={handleContinue}
          disabled={!isValid}
        >
          <ArrowRight size={18} />
          Continue to Password Verification
        </button>
      </div>
    </div>
  );
};

export default NameConfirmationStep;
