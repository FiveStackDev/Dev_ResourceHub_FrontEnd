import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import { SendHorizontal, Send, X } from 'lucide-react';
import '../shared/MaintenanceDialog.css';

const SendConfirmDialog = ({ open, onClose, onConfirm }) => {
  const [selectedRole, setSelectedRole] = useState('User');
  const roles = [
    { label: 'Users', value: 'User' },
    { label: 'Admins', value: 'Admin' },
    { label: 'All', value: 'All' },
  ];

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  // Pass selectedRole to onConfirm
  const handleConfirm = () => {
    onConfirm(selectedRole);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        style: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
      PaperProps={{
        style: {
          borderRadius: '16px',
          overflow: 'visible',
        },
      }}
    >
      <div className="maintenance-popup-container">
        <div className="maintenance-popup-header">
          <div className="maintenance-popup-header-content">
            <div className="maintenance-popup-header-icon">
              <SendHorizontal size={24} color="#3b82f6" />
            </div>
            <div>
              <h2 className="maintenance-popup-title">Confirm Notification</h2>
              <p className="maintenance-popup-subtitle">
                Send maintenance & service notification to selected roles
              </p>
            </div>
          </div>
          <button onClick={onClose} className="maintenance-popup-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="maintenance-popup-content">
          <div className="maintenance-delete-warning-box">
            <p className="maintenance-delete-warning-text">
              Are you sure you want to send this notification? The selected
              roles will be notified about their request status.
            </p>
          </div>

          <div
            className="maintenance-role-select-box"
            style={{
              margin: '18px 0',
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(59,130,246,0.07)',
              boxShadow: '0 2px 8px rgba(59,130,246,0.08)',
            }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: 16,
                color: '#2563eb',
                fontSize: '1.1rem',
                textAlign: 'center',
              }}
            >
              Select Roles:
            </div>

            <div
              className="roles-container"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              {roles.map((role) => (
                <label
                  key={role.value}
                  className="role-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: selectedRole === role.value ? '#4c80f0ff' : '',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border:
                      selectedRole === role.value
                        ? '1px solid #2564eb54'
                        : '1px solid #d1d5db6e',
                    transition: 'all 0.2s ease',
                    background:
                      selectedRole === role.value
                        ? 'rgba(127, 170, 240, 0.1)'
                        : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    checked={selectedRole === role.value}
                    onChange={() => handleRoleChange(role.value)}
                    style={{
                      accentColor: '#2563eb',
                      width: 18,
                      height: 18,
                      cursor: 'pointer',
                    }}
                  />
                  <span>{role.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="maintenance-popup-actions">
          <button onClick={onClose} className="maintenance-popup-cancel-btn">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="maintenance-popup-submit-btn"
          >
            <Send size={16} />
            Send Notification
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default SendConfirmDialog;
