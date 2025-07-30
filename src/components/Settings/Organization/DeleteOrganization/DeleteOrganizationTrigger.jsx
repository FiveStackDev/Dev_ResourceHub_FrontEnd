import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteOrganizationTrigger = ({ onOpenDelete, orgData }) => {
  const handleClick = () => {
    console.log('Delete trigger clicked!');
    onOpenDelete();
  };

  return (
    <div className="delete-organization-trigger">
      <div className="delete-trigger-header">
        <div className="danger-icon">
          <AlertTriangle size={24} />
        </div>
        <div className="delete-trigger-info">
          <h3>Danger Zone</h3>
          <p>Permanently delete this organization and all its data</p>
        </div>
        <button
          className="delete-trigger-button"
          onClick={handleClick}
          disabled={!orgData?.org_name}
        >
          <Trash2 size={18} />
          Delete Organization
        </button>
      </div>
    </div>
  );
};

export default DeleteOrganizationTrigger;
