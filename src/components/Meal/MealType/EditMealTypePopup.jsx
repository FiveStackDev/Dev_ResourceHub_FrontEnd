import { useState, useEffect } from 'react';
import * as React from 'react';
import { Dialog, Input, Button, Typography, Autocomplete, TextField, Chip, Box } from '@mui/material';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import '../Meal-CSS/AddMealPopup.css';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';
import { useThemeStyles } from '../../../hooks/useThemeStyles';

function EditPopup({
  open,
  onClose,
  onSave,
  mealName,
  mealImage,
  setMealName,
  setMealImage,
  mealId,
  existingMealTimes = [], // Add prop for existing meal times
}) {
  // State to hold selected file object
  const [imageFile, setImageFile] = useState(null);
  // State to track upload progress
  const [uploading, setUploading] = useState(false);
  // State for image preview URL
  const [previewUrl, setPreviewUrl] = useState(mealImage || '');
  // State for selected meal times
  const [selectedMealTimes, setSelectedMealTimes] = useState([]);
  // State for available meal times
  const [availableMealTimes, setAvailableMealTimes] = useState([]);
  // State for loading meal times
  const [loadingMealTimes, setLoadingMealTimes] = useState(false);
  
  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  // Fetch meal times and set existing selections when popup opens
  useEffect(() => {
    if (open) {
      fetchMealTimes();
      setSelectedMealTimes(existingMealTimes || []);
    }
  }, [open, existingMealTimes]);

  // Fetch meal times from API
  const fetchMealTimes = async () => {
    setLoadingMealTimes(true);
    try {
      const response = await fetch(`${BASE_URLS.mealtime}/details`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch meal times: ${response.status}`);
      }
      
      const data = await response.json();
      setAvailableMealTimes(data);
    } catch (error) {
      console.error('Error fetching meal times:', error);
      toast.error('Failed to fetch meal times');
    } finally {
      setLoadingMealTimes(false);
    }
  };

  // Handle selection of file input and create preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const fileURL = URL.createObjectURL(file); // Preview image
      setPreviewUrl(fileURL);
    }
  };

  // Upload selected image to Cloudinary and return URL
  const uploadImageToCloudinary = async () => {
    if (!imageFile) {
      return null; // No new image selected, keep existing
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

  // Handle save with optional image upload
  const handleSave = async () => {
    if (!mealName.trim()) {
      toast.error('Please provide a meal type name.');
      return;
    }

    let finalImageUrl = mealImage; // Use existing image by default

    // If a new image was selected, upload it
    if (imageFile) {
      const uploadedUrl = await uploadImageToCloudinary();
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
        setMealImage(finalImageUrl); // Update the image state
      } else {
        return; // Stop if upload failed
      }
    }

    onSave(mealId, mealName, finalImageUrl, selectedMealTimes.map(time => time.mealtime_id));
  };

  // Update preview when mealImage prop changes
  React.useEffect(() => {
    setPreviewUrl(mealImage || '');
  }, [mealImage]);
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      maxHeight="90vh"
      BackdropProps={{
        style: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }
      }}
      PaperProps={{
        style: {
          maxHeight: '90vh',
          overflow: 'hidden'
        }
      }}
    >
      <div className="mealtime-popup-container" style={{ maxHeight: '85vh', overflow: 'auto', padding: '20px' }}>
        <div className="mealtime-popup-header" style={{ marginBottom: '16px', paddingBottom: '12px' }}>
          <div>
            <h2 className="mealtime-title">Edit Meal Type</h2>
            <p className="mealtime-subtitle">Update meal type information</p>
          </div>
          {/* Close button for the popup */}
          <button onClick={onClose} className="mealtime-close-btn">
            <X size={20} />
          </button>
        </div>

                  {/* Show image preview if available */}
          {previewUrl && (
            <div className="mealtime-image-preview" style={{ marginBottom: '12px' }}>
              <Typography variant="body2" sx={{ marginBottom: 0.5 }}>Preview:</Typography>
              <img
                src={previewUrl}
                alt="Meal Type Preview"
                className="mealtime-preview-img"
                style={{
                  maxWidth: '100%',
                  maxHeight: '120px',
                  objectFit: 'cover',
                  borderRadius: '6px'
                }}
              />
            </div>
          )}

        <div className="mealtime-form" style={{ marginBottom: '16px' }}>
          <div className="mealtime-input-group" style={{ marginBottom: '16px' }}>
            <label className="mealtime-label">Meal Type Image</label>
            {/* File input for image upload */}
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              fullWidth
            />
          </div>

          <div className="mealtime-input-group" style={{ marginBottom: '16px' }}>
            <label className="mealtime-label">Meal Type Name</label>
            <Input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              fullWidth
              className="mealtime-input"
              placeholder="Enter meal type name"
            />
          </div>

          <div className="mealtime-input-group">
            <label className="mealtime-label">Select Meal Times</label>
            <Autocomplete
              multiple
              options={availableMealTimes}
              getOptionLabel={(option) => option.mealtime_name}
              value={selectedMealTimes}
              onChange={(event, newValue) => setSelectedMealTimes(newValue)}
              loading={loadingMealTimes}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.mealtime_name}
                    {...getTagProps({ index })}
                    key={option.mealtime_id}
                    sx={{
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderColor: '#3b82f6',
                      color: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                      },
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  placeholder="Search and select meal times"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--popup-input-bg)',
                      '& fieldset': {
                        borderColor: 'var(--popup-input-border)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'var(--popup-input-border-hover)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 3px var(--popup-input-focus-shadow)',
                      },
                    },
                  }}
                />
              )}
              sx={{ marginTop: 1 }}
            />
            {selectedMealTimes.length > 0 && (
              <Box sx={{ marginTop: 1.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                  Selected Meal Times ({selectedMealTimes.length}):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {selectedMealTimes.map((time) => (
                    <Chip
                      key={time.mealtime_id}
                      label={time.mealtime_name}
                      onDelete={() => {
                        setSelectedMealTimes(selectedMealTimes.filter(t => t.mealtime_id !== time.mealtime_id));
                      }}
                      color="primary"
                      variant="filled"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mealtime-buttons">
          <button onClick={onClose} className="mealtime-cancel-btn">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="mealtime-submit-btn"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Save'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default EditPopup;
