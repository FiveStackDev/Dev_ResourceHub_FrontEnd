import React, { useState, useEffect } from 'react';
import { Dialog, Switch } from '@mui/material';
import { Edit, Package, MapPin, ToggleLeft } from 'lucide-react';
import { BASE_URLS } from '../../../services/api/config';
import { toast } from 'react-toastify';
import { getAuthHeader } from '../../../utils/authHeader';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import '../AssetComponents.css';

function EditAssetPopup({ open, asset, onClose, onUpdate }) {
  const [editedAsset, setEditedAsset] = useState({
    id: '',
    name: '',
    category: '',
    quantity: '',
    condition: '',
    location: '',
    is_available: false,
  });

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  useEffect(() => {
    if (asset) {
      setEditedAsset({
        id: asset.asset_id,
        name: asset.asset_name,
        category: asset.category,
        quantity: asset.quantity,
        condition: asset.condition_type,
        location: asset.location,
        is_available: asset.is_available ?? false,
      });
    }
  }, [asset]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAsset((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (
      !editedAsset.name ||
      !editedAsset.category ||
      !editedAsset.quantity ||
      !editedAsset.condition ||
      !editedAsset.location
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URLS.asset}/details/${editedAsset.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify({
            asset_id: editedAsset.id,
            asset_name: editedAsset.name,
            category: editedAsset.category,
            quantity: parseInt(editedAsset.quantity),
            condition_type: editedAsset.condition,
            location: editedAsset.location,
            is_available: editedAsset.is_available,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedAsset = await response.json();
      onUpdate(updatedAsset);
      toast.success('Asset updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating asset:', error);
      toast.error('Failed to update asset.');
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
              <Edit size={24} color="#3b82f6" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 className="asset-popup-title">Edit Asset</h2>
              <p className="asset-popup-subtitle">
                Update asset information and availability
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
              value={editedAsset.name}
              onChange={handleInputChange}
              className="asset-form-input"
            />
          </div>

          <div className="asset-form-group">
            <label htmlFor="category" className="asset-form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={editedAsset.category}
              onChange={handleInputChange}
              className="asset-form-select"
            >
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
              value={editedAsset.quantity}
              onChange={handleInputChange}
              className="asset-form-input"
            />
          </div>

          <div className="asset-form-group">
            <label htmlFor="condition" className="asset-form-label">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              value={editedAsset.condition}
              onChange={handleInputChange}
              className="asset-form-select"
            >
              <option value="Brand New">Brand New</option>
              <option value="Used">Used</option>
            </select>
          </div>

          <div className="asset-switch-container">
            <Switch
              checked={editedAsset.is_available}
              onChange={(e) =>
                setEditedAsset((prev) => ({
                  ...prev,
                  is_available: e.target.checked,
                }))
              }
              color="primary"
            />
            <span className="asset-switch-label">
              <ToggleLeft
                size={16}
                style={{ display: 'inline', marginRight: '8px' }}
              />
              Available for Request
            </span>
          </div>

          <div className="asset-form-group">
            <label htmlFor="location" className="asset-form-label">
              <MapPin
                size={16}
                style={{ display: 'inline', marginRight: '8px' }}
              />
              Location
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={editedAsset.location}
              onChange={handleInputChange}
              className="asset-form-input"
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
            onClick={handleUpdate}
          >
            <Edit size={16} />
            Update Asset
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default EditAssetPopup;
