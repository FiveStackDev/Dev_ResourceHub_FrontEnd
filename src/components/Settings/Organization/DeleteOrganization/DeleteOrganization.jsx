import React, { useState } from 'react';
import { AlertTriangle, Trash2, Shield, Check, X } from 'lucide-react';
import { useThemeStyles } from '../../../../hooks/useThemeStyles';
import { useThemeContext } from '../../../../theme/ThemeProvider';
import ConsequencesStep from './ConsequencesStep';
import NameConfirmationStep from './NameConfirmationStep';
import PasswordVerificationStep from './PasswordVerificationStep';
import EmailVerificationStep from './EmailVerificationStep';
import './DeleteOrganization.css';

const DeleteOrganization = ({ orgData, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({
    consequencesAccepted: false,
    organizationName: '',
    password: '',
    emailVerificationCode: ''
  });

  const { updateCSSVariables } = useThemeStyles();
  const { mode } = useThemeContext();

  React.useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  // Apply theme class to body when popup is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.setAttribute('data-theme', mode);
    }
  }, [isOpen, mode]);

  // Debug logging
  React.useEffect(() => {
    console.log('DeleteOrganization rendered - isOpen:', isOpen, 'orgData:', orgData, 'theme:', mode);
  }, [isOpen, orgData, mode]);

  const steps = [
    {
      title: 'Consequences Warning',
      description: 'Understand what will be deleted',
      component: ConsequencesStep
    },
    {
      title: 'Organization Name',
      description: 'Confirm organization name',
      component: NameConfirmationStep
    },
    {
      title: 'Password Verification',
      description: 'Verify your password',
      component: PasswordVerificationStep
    },
    {
      title: 'Email Verification',
      description: 'Enter verification code',
      component: EmailVerificationStep
    }
  ];

  const handleStepComplete = (stepIndex, data) => {
    setStepData(prev => ({ ...prev, ...data }));
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetProcess = () => {
    setCurrentStep(0);
    setStepData({
      consequencesAccepted: false,
      organizationName: '',
      password: '',
      emailVerificationCode: ''
    });
    onClose();
  };

  const handleClose = () => {
    resetProcess();
  };

  const CurrentStepComponent = steps[currentStep].component;

  if (!isOpen) return null;

  // Theme-aware colors
  const themeColors = {
    background: mode === 'dark' ? '#1f2937' : '#ffffff',
    overlayBg: mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
    cardBg: mode === 'dark' ? '#374151' : '#ffffff',
    textPrimary: mode === 'dark' ? '#f9fafb' : '#1e293b',
    textSecondary: mode === 'dark' ? '#d1d5db' : '#64748b',
    warningBg: mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
    warningText: mode === 'dark' ? '#fbbf24' : '#d97706',
    warningBorder: mode === 'dark' ? '#f59e0b' : '#f59e0b'
  };

  return (
    <div 
      className="delete-organization-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: themeColors.overlayBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div 
        className="delete-organization-popup"
        style={{
          background: themeColors.background,
          border: '2px solid #dc2626',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="delete-popup-header" style={{
          background: mode === 'dark' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.02)'
        }}>
          <div className="delete-popup-title">
            <AlertTriangle size={24} style={{ color: '#dc2626' }} />
            <h2 style={{ margin: 0, color: '#dc2626', fontSize: '1.5rem', fontWeight: 700 }}>Delete Organization</h2>
          </div>
          <button
            className="delete-popup-close"
            onClick={handleClose}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-popup-content" style={{ padding: '2rem', background: themeColors.background }}>
          <div className="warning-banner" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: themeColors.warningBg,
            color: themeColors.warningText,
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            borderLeft: `4px solid ${themeColors.warningBorder}`
          }}>
            <AlertTriangle size={20} />
            <span>This action cannot be undone. Please proceed with extreme caution.</span>
          </div>

          <div className="steps-progress">
            {steps.map((step, index) => (
              <div key={index} className={`step-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}>
                <div className="step-number">
                  {index < currentStep ? <Check size={14} /> : index + 1}
                </div>
                <div className="step-info">
                  <span className="step-title" style={{ color: themeColors.textPrimary }}>{step.title}</span>
                  <span className="step-description" style={{ color: themeColors.textSecondary }}>{step.description}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="current-step" style={{
            background: themeColors.cardBg,
            border: mode === 'dark' ? '2px solid #4b5563' : '2px solid #e2e8f0',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '1.5rem'
          }}>
            <CurrentStepComponent
              orgData={orgData}
              stepData={stepData}
              onComplete={(data) => handleStepComplete(currentStep, data)}
              onBack={handleStepBack}
              canGoBack={currentStep > 0}
              onReset={resetProcess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrganization;
