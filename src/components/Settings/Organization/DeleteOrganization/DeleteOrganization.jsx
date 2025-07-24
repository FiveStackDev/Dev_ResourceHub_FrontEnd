import React, { useState } from 'react';
import { AlertTriangle, Trash2, Shield, Check, X } from 'lucide-react';
import { Dialog, Stepper, Step, StepLabel, Box } from '@mui/material';
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

  // Debug logging
  React.useEffect(() => {
    console.log('DeleteOrganization rendered - isOpen:', isOpen, 'orgData:', orgData, 'theme:', mode);
    if (isOpen) {
      console.log('POPUP SHOULD BE VISIBLE NOW!');
    }
  }, [isOpen, orgData, mode]);

  if (!isOpen) {
    console.log('Popup not open, returning null');
    return null;
  }

  console.log('Rendering popup - isOpen is true');

  const steps = [
    'Consequences Warning',
    'Organization Name',
    'Password Verification', 
    'Email Verification'
  ];

  const stepComponents = [
    ConsequencesStep,
    NameConfirmationStep,
    PasswordVerificationStep,
    EmailVerificationStep
  ];

  const stepDescriptions = [
    'Understand what will be deleted',
    'Confirm organization name',
    'Verify your password',
    'Enter verification code'
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

  const CurrentStepComponent = stepComponents[currentStep];

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
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="delete-organization-popup-title"
      aria-describedby="delete-organization-popup-description"
      BackdropProps={{
        className: 'delete-organization-backdrop',
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)'
        }
      }}
      PaperProps={{
        style: {
          borderRadius: '16px',
          border: '2px solid #dc2626',
          maxWidth: '900px',
          overflow: 'visible',
          background: themeColors.background
        }
      }}
    >
      <div className="delete-organization-inner">
        <div className="delete-popup-header" style={{
          background: mode === 'dark' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 2rem',
          borderBottom: '2px solid #f87171'
        }}>
          <div className="delete-popup-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={24} style={{ color: '#dc2626' }} />
            <h2 id="delete-organization-popup-title" style={{ margin: 0, color: '#dc2626', fontSize: '1.5rem', fontWeight: 700 }}>Delete Organization</h2>
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

        <div className="delete-popup-content" style={{ 
          padding: '2rem',
          background: themeColors.background,
          maxHeight: 'calc(90vh - 120px)',
          overflowY: 'auto'
        }}>
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

          <Box sx={{ width: '100%', marginBottom: '2rem' }}>
            <Stepper 
              activeStep={currentStep} 
              alternativeLabel
              sx={{
                '& .MuiStepLabel-root': {
                  color: mode === 'dark' ? themeColors.textSecondary : '#64748b',
                },
                '& .MuiStepLabel-label': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
                '& .MuiStepLabel-label.Mui-active': {
                  color: mode === 'dark' ? '#60a5fa' : '#3b82f6',
                  fontWeight: 600,
                },
                '& .MuiStepLabel-label.Mui-completed': {
                  color: mode === 'dark' ? '#34d399' : '#059669',
                  fontWeight: 600,
                },
                '& .MuiStepIcon-root': {
                  color: mode === 'dark' ? '#4b5563' : '#e2e8f0',
                  fontSize: '1.5rem',
                },
                '& .MuiStepIcon-root.Mui-active': {
                  color: mode === 'dark' ? '#60a5fa' : '#3b82f6',
                },
                '& .MuiStepIcon-root.Mui-completed': {
                  color: mode === 'dark' ? '#34d399' : '#059669',
                },
                '& .MuiStepConnector-line': {
                  borderColor: mode === 'dark' ? '#4b5563' : '#e2e8f0',
                },
                '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                  borderColor: mode === 'dark' ? '#60a5fa' : '#3b82f6',
                },
                '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                  borderColor: mode === 'dark' ? '#34d399' : '#059669',
                }
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    optional={
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: themeColors.textSecondary,
                        display: 'block',
                        marginTop: '4px'
                      }}>
                        {stepDescriptions[index]}
                      </span>
                    }
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

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
    </Dialog>
  );
};

export default DeleteOrganization;
