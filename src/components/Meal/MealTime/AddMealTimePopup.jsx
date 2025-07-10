import { useState } from 'react';
import { Dialog, Input, Button, Typography } from '@mui/material';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import '../Meal-CSS/AddMealPopup.css';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';

export const MealCardPopup = ({ open, onClose, title, subtitle, onSubmit }) => {
  const [mealName, setMealName] = useState('');
  const [mealImageUrl, setMealImageUrl] = useState('');

  // Handles form submission, sends POST request to add meal time
  const handleSubmit = async () => {
    if (mealImageUrl && mealName) {
      try {
        const response = await fetch(`${BASE_URLS.mealtime}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            mealtime_name: mealName,
            mealtime_image_url: mealImageUrl,
          }),
        });

        setMealName('');
        setMealImageUrl('');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Server Response:', result);
        toast.success('Meal added successfully!');
        onClose();
        onSubmit();
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to add meal. Please try again.');
      }
    } else {
      toast.error('Please provide both meal name and an image URL.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="mealtime-popup-container">
        <div className="mealtime-popup-header">
          <div>
            <h2 className="mealtime-title">{title}</h2>
            <p className="mealtime-subtitle">{subtitle}</p>
          </div>
          {/* Close button for the popup */}
          <button onClick={onClose} className="mealtime-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Preview the meal image entered by user */}
        {mealImageUrl && (
          <div className="mealtime-image-preview">
            <Typography variant="h6">Preview:</Typography>
            <img
              src={mealImageUrl}
              alt="Meal Preview"
              className="mealtime-preview-img"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
              }}
              onError={() => toast.error('Invalid image URL')}
            />
          </div>
        )}

        {/* Form inputs for image URL and meal name */}
        <div className="mealtime-form">
          <div className="mealtime-input-group">
            <label className="mealtime-label">Meal Time Image URL</label>
            <Input
              type="text"
              value={mealImageUrl}
              onChange={(e) => setMealImageUrl(e.target.value)}
              fullWidth
              className="mealtime-input"
              placeholder="Enter image URL"
            />
          </div>

          <div className="mealtime-input-group">
            <label className="mealtime-label">Meal Time Name</label>
            <Input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              fullWidth
              className="mealtime-input"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mealtime-buttons">
          <button onClick={onClose} className="mealtime-cancel-btn">
            Cancel
          </button>
          <button onClick={handleSubmit} className="mealtime-submit-btn">
            Submit
          </button>
        </div>
      </div>
    </Dialog>
  );
};
