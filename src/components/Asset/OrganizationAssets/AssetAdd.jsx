import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { Plus, Package } from 'lucide-react';
import { BASE_URLS } from '../../../services/api/config';
import { toast } from 'react-toastify';
import { getAuthHeader } from '../../../utils/authHeader';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import '../AssetComponents.css';

function AssetAdd({ open, onClose, onAdd }) {
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: '',
    quantity: '',
    condition: '',
    location: '',
  });

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAsset = async () => {
    if (
      !newAsset.name ||
      !newAsset.category ||
      !newAsset.quantity ||
      !newAsset.condition ||
      !newAsset.location
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${BASE_URLS.asset}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          asset_name: newAsset.name,
          category: newAsset.category,
          quantity: parseInt(newAsset.quantity),
          condition_type: newAsset.condition,
          location: newAsset.location,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setNewAsset({
        name: '',
        category: '',
        quantity: '',
        condition: '',
        location: '',
      });

      toast.success('Asset added successfully!');
      onAdd(); // Notify parent to refresh or handle after asset addition
      onClose(); // Close the popup after adding the asset
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('Failed to add asset.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        className: 'asset-popup-backdrop',
      }}
      PaperProps={{
        style: {
          borderRadius: '16px',
          overflow: 'visible',
        },
      }}
    >
      <div className="asset-popup-container">
        <div className="asset-popup-header">
          <div className="asset-popup-header-content">
            <div className="asset-popup-header-icon">
              <Plus size={24} color="#3b82f6" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 className="asset-popup-title">Add New Asset</h2>
              <p className="asset-popup-subtitle">
                Create a new asset entry for your organization
              </p>
            </div>
          </div>
        </div>

        <div style={{ overflowY: 'auto', maxHeight: 'calc(100% - 120px)' }}>
          <div className="asset-form-group">
            <label htmlFor="name" className="asset-form-label">
              <Package
                size={16}
                style={{ display: 'inline', marginRight: '8px' }}
              />
              Asset Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={newAsset.name}
              onChange={handleInputChange}
              className="asset-form-input"
              placeholder="Enter asset name"
            />
          </div>

          <div className="asset-form-group">
            <label htmlFor="category" className="asset-form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={newAsset.category}
              onChange={handleInputChange}
              className="asset-form-select"
            >
              <option value="">Select a category</option>
              <option value="Electronics & IT">Electronics & IT</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Furniture">Furniture</option>
              <option value="Electrical Appliances">
                Electrical Appliances
              </option>
              <option value="Machinery & Tools">Machinery & Tools</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <div className="asset-form-group">
            <label htmlFor="quantity" className="asset-form-label">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              value={newAsset.quantity}
              onChange={handleInputChange}
              className="asset-form-input"
              placeholder="Enter quantity"
              min="1"
            />
          </div>

          <div className="asset-form-group">
            <label htmlFor="condition" className="asset-form-label">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              value={newAsset.condition}
              onChange={handleInputChange}
              className="asset-form-select"
            >
              <option value="">Select condition</option>
              <option value="Brand New">Brand New</option>
              <option value="Used">Used</option>
            </select>
          </div>

          <div className="asset-form-group">
            <label htmlFor="location" className="asset-form-label">
              Location
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={newAsset.location}
              onChange={handleInputChange}
              className="asset-form-input"
              placeholder="Enter location"
              required
            />
          </div>
        </div>

        <div className="asset-button-group">
          <button
            className="asset-button asset-button-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="asset-button asset-button-primary"
            onClick={handleAddAsset}
          >
            <Plus size={16} />
            Add Asset
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default AssetAdd;
