import React, { useState } from 'react';
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
} from '@mui/material';
import { BASE_URLS } from '../../../services/api/config';
import { toast } from 'react-toastify';
import { getAuthHeader } from '../../../utils/authHeader';

function AssetAdd({ open, onClose, onAdd }) {
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: '',
    quantity: '',
    condition: '',
    location: '',
  });

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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Asset</DialogTitle>
      <DialogContent>
        <TextField
          label="Asset Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="name"
          value={newAsset.name}
          onChange={handleInputChange}
        />
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={newAsset.category}
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
          value={newAsset.quantity}
          onChange={handleInputChange}
        />
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Condition</InputLabel>
          <Select
            name="condition"
            value={newAsset.condition}
            onChange={handleInputChange}
            label="Condition"
          >
            <MenuItem value="Brand New">Brand New</MenuItem>
            <MenuItem value="Used">Used</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          margin="normal"
          name="location"
          value={newAsset.location}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddAsset} color="primary">
          Add Asset
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssetAdd;
