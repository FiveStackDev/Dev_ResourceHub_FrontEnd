import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import './PopupEdit.css';

const PopupEdit = ({ open, handleClose, asset, onSave, onRefresh }) => {
  const [quantity, setQuantity] = useState(asset.quantity);
  const [status, setStatus] = useState(asset.status);
  const [handoverDate, setHandoverDate] = useState(asset.handover_date);
  const [isReturning, setIsReturning] = useState(asset.is_returning);

  useEffect(() => {
    if (asset) {
      setQuantity(asset.quantity);
      setStatus(asset.status);
      setHandoverDate(asset.handover_date);
      setIsReturning(asset.is_returning);
    }
  }, [asset]);

  const handleSaveClick = () => {
    onSave({
      ...asset,
      quantity: parseInt(quantity),
      status,
      handover_date: handoverDate,
      is_returning: isReturning,
    });
    handleClose();
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      BackdropProps={{ className: 'popup-backdrop' }}
      aria-labelledby="edit-asset-modal-title"
      aria-describedby="edit-asset-modal-description"
    >
      <Box className="popup-box" sx={{ overflowY: 'auto' }}>
        <h2 id="edit-asset-modal-title">Edit Asset Details</h2>
        <p>
          <strong>Asset Name:</strong> {asset.asset_name}
        </p>
        <p>
          <strong>Category:</strong> {asset.category}
        </p>
        <div className="input-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="styled-dropdown"
          >
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="handoverDate">Handover Date</label>
          <input
            id="handoverDate"
            type="date"
            value={handoverDate}
            onChange={(e) => setHandoverDate(e.target.value)}
            disabled={!isReturning}
          />
        </div>
        <div className="input-group">
          <FormControlLabel
            control={
              <Switch
                checked={isReturning}
                onChange={(e) => setIsReturning(e.target.checked)}
                color="primary"
              />
            }
            label="Asset Returning"
          />
        </div>
        <div className="btn-group">
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default PopupEdit;
