import { useState, useEffect } from 'react';
import { Dialog, Input, Button, Typography, Autocomplete, TextField, Chip, Box } from '@mui/material';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import '../Meal-CSS/AddMealPopup.css';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';
import { useThemeStyles } from '../../../hooks/useThemeStyles';

export const MealCardPopup = ({ open, onClose, title, subtitle, onSubmit }) => {
  const [mealName, setMealName] = useState('');
  const [mealImageUrl, setMealImageUrl] = useState('');
  // State to hold selected file object
  const [imageFile, setImageFile] = useState(null);
  // State to track upload progress
  const [uploading, setUploading] = useState(false);
  // State for selected meal types
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);
  // State for available meal types
  const [availableMealTypes, setAvailableMealTypes] = useState([]);
  // State for loading meal types
  const [loadingMealTypes, setLoadingMealTypes] = useState(false);
  
  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  // Fetch available meal types when popup opens
  useEffect(() => {
    if (open) {
      fetchMealTypes();
    }
  }, [open]);

  // Fetch meal types from API
  const fetchMealTypes = async () => {
    setLoadingMealTypes(true);
    try {
      const response = await fetch(`${BASE_URLS.mealtype}/details`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch meal types: ${response.status}`);
      }
      
      const data = await response.json();
      setAvailableMealTypes(data);
    } catch (error) {
      console.error('Error fetching meal types:', error);
      toast.error('Failed to fetch meal types');
    } finally {
      setLoadingMealTypes(false);
    }
  };

    // Function to clear all form fields
    const clearFields = () => {
      setMealName('');
      setMealImageUrl('');
      setImageFile(null);
      setSelectedMealTypes([]);
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
    // Validate required fields
    if (!mealName.trim()) {
      toast.error('Please provide a meal time name.');
      return;
    }
    
    if (!imageFile) {
      toast.error('Please select an image.');
      return;
    }

    const imageUrl = await uploadImageToCloudinary();
    if (!imageUrl) return;

    setMealImageUrl(imageUrl); // Update with Cloudinary URL

    try {
      const response = await fetch(`${BASE_URLS.mealtime}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          mealtime_name: mealName,
          mealtime_image_url: imageUrl,
          mealtype_ids: selectedMealTypes.map(type => type.mealtype_id), // Send selected meal type IDs
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
      toast.success('Meal time added successfully!');
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to add meal time. Please try again.');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
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
            <h2 className="mealtime-title">{title}</h2>
            <p className="mealtime-subtitle">{subtitle}</p>
          </div>
          {/* Close button for the popup */}
          <button onClick={handleClose} className="mealtime-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Show image preview if available */}
        {mealImageUrl && (
          <div className="mealtime-image-preview" style={{ marginBottom: '12px' }}>
            <Typography variant="body2" sx={{ marginBottom: 0.5 }}>Preview:</Typography>
            <img
              src={mealImageUrl}
              alt="Meal Time Preview"
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
            <label className="mealtime-label">Meal Time Image</label>
            {/* File input for image upload */}
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              fullWidth
            />
          </div>

          <div className="mealtime-input-group" style={{ marginBottom: '16px' }}>
            <label className="mealtime-label">Meal Time Name</label>
            <Input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              fullWidth
              className="mealtime-input"
              placeholder="Enter meal time name"
            />
          </div>

         <div className="mealtime-input-group" style={{ marginBottom: '16px' }}>
            <label className="mealtime-label">Select Meal Types</label>
            <Autocomplete
              multiple
              options={availableMealTypes}
              getOptionLabel={(option) => option.mealtype_name}
              value={selectedMealTypes}
              onChange={(event, newValue) => setSelectedMealTypes(newValue)}
              loading={loadingMealTypes}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.mealtype_name}
                    {...getTagProps({ index })}
                    key={option.mealtype_id}
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
                  placeholder="Search and select meal types"
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
            {selectedMealTypes.length > 0 && (
              <Box sx={{ marginTop: 1.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                  Selected Meal Types ({selectedMealTypes.length}):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {selectedMealTypes.map((type) => (
                    <Chip
                      key={type.mealtype_id}
                      label={type.mealtype_name}
                      onDelete={() => {
                        setSelectedMealTypes(selectedMealTypes.filter(t => t.mealtype_id !== type.mealtype_id));
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
          <button onClick={handleClose} className="mealtime-cancel-btn">
            Cancel
          </button>
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
