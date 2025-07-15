import React, { useEffect } from 'react';
import { Modal, Box } from '@mui/material';
import { Calendar, Clock, BarChart3, X } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import './ReportPopup.css';

function SchedulePopup({ onClose, table, onFrequencySelect }) {
  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  const frequencyOptions = [
    {
      id: 'Weekly',
      title: 'Weekly',
      description: 'Generate every week',
      icon: Calendar
    },
    {
      id: 'Bi-Weekly',
      title: 'Bi-Weekly', 
      description: 'Generate every two weeks',
      icon: Clock
    },
    {
      id: 'Monthly',
      title: 'Monthly',
      description: 'Generate every month',
      icon: BarChart3
    }
  ];

  const handleFrequencySelect = (frequency) => {
    if (onFrequencySelect) {
      onFrequencySelect(frequency);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="schedule-popup-title"
      aria-describedby="schedule-popup-description"
      BackdropProps={{
        className: 'report-popup-backdrop'
      }}
    >
      <Box className="report-popup-container">
        <div className="report-popup-header">
          <div className="report-popup-header-icon">
            <BarChart3 size={28} color="white" />
          </div>
          <h2 className="report-popup-title">Schedule Your {table} Report</h2>
          <p className="report-popup-subtitle">
            Select the frequency for generating the {table} Report
          </p>
          <button onClick={onClose} className="report-popup-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="report-popup-content">
          <div className="report-frequency-options">
            {frequencyOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.id}
                  className="report-frequency-card"
                  onClick={() => handleFrequencySelect(option.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleFrequencySelect(option.id);
                    }
                  }}
                >
                  <div className="report-frequency-icon">
                    <IconComponent size={20} color="white" />
                  </div>
                  <h3 className="report-frequency-title">{option.title}</h3>
                  <p className="report-frequency-description">{option.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default SchedulePopup;
