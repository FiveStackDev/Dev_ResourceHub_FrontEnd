import React, { useState } from 'react';
import {
  AlertTriangle,
  Database,
  Users,
  FileText,
  Calendar,
  Shield,
  ArrowRight,
} from 'lucide-react';

const ConsequencesStep = ({ onComplete, stepData }) => {
  const [isAccepted, setIsAccepted] = useState(
    stepData.consequencesAccepted || false,
  );

  const consequences = [
    {
      icon: <Database size={20} />,
      title: 'All Organization Data',
      description:
        'Complete removal of your organization account and all associated records',
    },
    {
      icon: <Users size={20} />,
      title: 'All Users',
      description:
        'Every user account in your organization will be permanently deleted',
    },
    {
      icon: <FileText size={20} />,
      title: 'Assets & Inventory',
      description:
        'All asset records, maintenance logs, and inventory data will be lost',
    },
    {
      icon: <Calendar size={20} />,
      title: 'Meal Management',
      description:
        'All meal types, schedules, requests, and historical meal data',
    },
    {
      icon: <Shield size={20} />,
      title: 'Security & Reports',
      description:
        'All notifications, reports, and security logs will be erased',
    },
  ];

  const handleAcceptChange = (e) => {
    setIsAccepted(e.target.checked);
  };

  const handleContinue = () => {
    if (isAccepted) {
      onComplete({ consequencesAccepted: true });
    }
  };

  return (
    <div className="step-container">
      <h2 className="step-title">
        <AlertTriangle
          size={24}
          style={{
            color: 'var(--settings-danger-color)',
            marginRight: '0.5rem',
          }}
        />
        Critical Warning: Organization Deletion
      </h2>

      <div className="step-content">
        <div
          style={{
            background: 'var(--settings-danger-bg)',
            border: '2px solid var(--settings-danger-color)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <h3
            style={{
              color: 'var(--settings-danger-text)',
              margin: '0 0 1rem 0',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertTriangle size={20} />
            This Action is PERMANENT and IRREVERSIBLE
          </h3>
          <p
            style={{
              color: 'red',
              margin: '0',
              fontSize: '1rem',
              lineHeight: '1.5',
            }}
          >
            Once you proceed with organization deletion,{' '}
            <strong>ALL DATA WILL BE PERMANENTLY LOST</strong> and cannot be
            recovered under any circumstances. This includes all users, data,
            and configurations.
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4
            style={{
              color: 'var(--settings-popup-text-primary)',
              marginBottom: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600',
            }}
          >
            The following will be permanently deleted:
          </h4>

          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}
          >
            {consequences.map((consequence, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',

                  borderRadius: '10px',
                  padding: '1rem',
                }}
              >
                <div
                  style={{
                    color: 'var(--settings-danger-color)',
                    flexShrink: 0,
                    marginTop: '0.125rem',
                  }}
                >
                  {consequence.icon}
                </div>
                <div>
                  <h5
                    style={{
                      margin: '0 0 0.25rem 0',
                      color: 'var(--settings-popup-text-primary)',
                      fontSize: '1rem',
                      fontWeight: '600',
                    }}
                  >
                    {consequence.title}
                  </h5>
                  <p
                    style={{
                      margin: '0',
                      color: 'var(--settings-popup-text-secondary)',
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                    }}
                  >
                    {consequence.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: 'var(--settings-warning-bg)',
            border: '2px solid var(--settings-warning-border)',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <h4
            style={{
              color: 'var(--settings-warning-text)',
              margin: '0 0 1rem 0',
              fontSize: '1.1rem',
              fontWeight: '600',
            }}
          >
            Important Security Notes:
          </h4>
          <ul
            style={{
              color: 'var(--settings-warning-text)',
              margin: '0',
              paddingLeft: '1.5rem',
              lineHeight: '1.6',
            }}
          >
            <li>Only Super Administrators can delete organizations</li>
            <li>You will need to verify your password and email</li>
            <li>All users will lose access immediately upon deletion</li>
            <li>No backups or recovery options will be available</li>
            <li>This action affects the entire organization permanently</li>
          </ul>
        </div>

        <div
          style={{
            background: 'var(--settings-input-bg)',
            border: '2px solid var(--settings-input-border)',
            borderRadius: '10px',
            padding: '1.5rem',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              cursor: 'pointer',
              fontSize: '1rem',
              lineHeight: '1.5',
            }}
          >
            <input
              type="checkbox"
              checked={isAccepted}
              onChange={handleAcceptChange}
              style={{
                width: '18px',
                height: '18px',
                marginTop: '0.125rem',
                accentColor: 'var(--settings-danger-color)',
                cursor: 'pointer',
              }}
            />
            <span style={{ color: 'var(--settings-popup-text-primary)' }}>
              <strong>I understand and accept</strong> that this action will
              permanently delete the entire organization and all its data. I
              acknowledge that this action is <strong>irreversible</strong> and
              that no recovery options will be available.
            </span>
          </label>
        </div>
      </div>

      <div className="step-actions">
        <button
          className={`step-button ${isAccepted ? 'danger' : 'secondary'}`}
          onClick={handleContinue}
          disabled={!isAccepted}
        >
          <ArrowRight size={18} />
          {isAccepted
            ? 'I Accept - Continue to Next Step'
            : 'Accept Consequences to Continue'}
        </button>
      </div>
    </div>
  );
};

export default ConsequencesStep;
