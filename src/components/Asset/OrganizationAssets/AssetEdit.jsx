import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { BASE_URLS } from '../../../services/api/config';
import { toast } from 'react-toastify';
import { getAuthHeader } from '../../../utils/authHeader';

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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Asset</DialogTitle>
      <DialogContent>
        <TextField
          label="Asset Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="name"
          value={editedAsset.name}
          onChange={handleInputChange}
        />
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={editedAsset.category}
            onChange={handleInputChange}
            label="Category"
          >
            <MenuItem value="Electronics & IT">Electronics & IT</MenuItem>
            <MenuItem value="Office Supplies">Office Supplies</MenuItem>
            <MenuItem value="Furniture">Furniture</MenuItem>
            <MenuItem value="Electrical Appliances">
              Electrical Appliances
            </MenuItem>
            <MenuItem value="Machinery & Tools">Machinery & Tools</MenuItem>
            <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Quantity"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          name="quantity"
          value={editedAsset.quantity}
          onChange={handleInputChange}
        />
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Condition</InputLabel>
          <Select
            name="condition"
            value={editedAsset.condition}
            onChange={handleInputChange}
            label="Condition"
          >
            <MenuItem value="Brand New">Brand New</MenuItem>
            <MenuItem value="Used">Used</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
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
          }
          label="Available"
        />

        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          margin="normal"
          name="location"
          value={editedAsset.location}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Update Asset
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditAssetPopup;
