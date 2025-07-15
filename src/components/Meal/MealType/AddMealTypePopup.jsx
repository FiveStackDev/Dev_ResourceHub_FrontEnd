import { useState, useEffect } from 'react';
import { Dialog, Input, Button, Typography } from '@mui/material';
import { X } from 'lucide-react';
import '../Meal-CSS/AddMealPopup.css';
import { BASE_URLS } from '../../../services/api/config';
import { toast } from 'react-toastify';
import { getAuthHeader } from '../../../utils/authHeader';
import { useThemeStyles } from '../../../hooks/useThemeStyles';

export const MealCardPopup = ({ open, onClose, title, subtitle, onSubmit }) => {
  // State for meal name input
  const [mealName, setMealName] = useState('');
  // State for image preview URL
  const [mealImageUrl, setMealImageUrl] = useState('');
  // State to hold selected file object
  const [imageFile, setImageFile] = useState(null);
  // State to track upload progress
  const [uploading, setUploading] = useState(false);
  
  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  // Function to clear all form fields
  const clearFields = () => {
    setMealName('');
    setMealImageUrl('');
    setImageFile(null);
  };

  // Handle close and clear fields
  const handleClose = () => {
    clearFields();
    onClose();
  };

  // Handle selection of file input and create preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const fileURL = URL.createObjectURL(file); // Preview image
      setMealImageUrl(fileURL);
    }
  };

  // Upload selected image to Cloudinary and return URL
  const uploadImageToCloudinary = async () => {
    if (!imageFile) {
      toast.error('Please select an image to upload');
      return null;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(
        import.meta.env.VITE_CLOUDINARY_API_URL,
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await response.json();
      setUploading(false);
      return data.secure_url; // Return uploaded image URL
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      toast.error('Image upload failed. Please try again.');
      return null;
    }
  };

  // Submit meal name and image URL to backend
  const handleSubmit = async () => {
    const imageUrl = await uploadImageToCloudinary();
    if (!imageUrl) return;

    setMealImageUrl(imageUrl); // Update with Cloudinary URL

    if (imageUrl && mealName) {
      try {
        const response = await fetch(`${BASE_URLS.mealtype}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            mealtype_name: mealName,
            mealtype_image_url: imageUrl, // Use uploaded image URL
          }),
        });



        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Server Response:', result);
        clearFields(); // Clear fields after successful submission
        onClose();
        onSubmit(); // Refresh meal types list
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to add meal type. Please try again.');
      }
    } else {
      toast.error('Please provide both meal name and an image.');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      BackdropProps={{
        style: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }
      }}
    >
      <div className="mealtime-popup-container">
        <div className="mealtime-popup-header">
          <div>
            {/* Popup title */}
            <h2 className="mealtime-title">{title}</h2>
            {/* Popup subtitle */}
            <p className="mealtime-subtitle">{subtitle}</p>
          </div>
          {/* Close button */}
          <button onClick={handleClose} className="mealtime-close-btn">
            <X size={20} />
          </button>
        </div>

                  {/* Show image preview if available */}
          {mealImageUrl && (
            <div className="mealtime-image-preview">
              <Typography variant="h6">Preview:</Typography>
              <img
                src={mealImageUrl}
                alt="Meal Type Preview"
                className="mealtime-preview-img"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

        <div className="mealtime-form">
          <div className="mealtime-input-group">
            <label className="mealtime-label">Meal Type Image</label>
            {/* File input for image upload */}
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              fullWidth
            />
          </div>

          <div className="mealtime-input-group">
            <label className="mealtime-label">Meal Type Name</label>
            {/* Text input for meal name */}
            <Input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              fullWidth
              className="mealtime-input"
            />
          </div>
        </div>

        <div className="mealtime-buttons">
          {/* Cancel button */}
          <button onClick={handleClose} className="mealtime-cancel-btn">
            Cancel
          </button>
          {/* Submit button disabled while uploading */}
          <button
            onClick={handleSubmit}
            className="mealtime-submit-btn"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
