import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, FileText, Save } from 'lucide-react';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';
import { useUser, decodeToken } from '../../../contexts/UserContext';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import ConfirmationDialog from '../Shared/ConfirmationDialog';
import ImageUpload from './ImageUpload';
import '../Styles/SettingsComponents.css';

const ProfileSection = () => {
  // State to store form data
  const [formData, setFormData] = useState({ name: '', picture: '', bio: '' });
  // State for file upload functionality
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Loading and error states for async data fetching
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for confirmation dialog visibility and actions
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    message: '',
    onConfirm: null,
  });

  // Get user id from context
  const { userData } = useUser();
  const { updateCSSVariables } = useThemeStyles();

  // Apply theme variables when component mounts
  React.useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);
  // Fallback: decode token directly if userData.id is undefined
  let userId = userData.id;
  if (!userId) {
    const decoded = decodeToken();
    userId = decoded?.id;
    console.log('ProfileSettings fallback decoded userId:', userId);
  } else {
    console.log('ProfileSettings userId:', userId);
  }

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }
        const { data } = await axios.get(
          `${BASE_URLS.settings}/details/${userId}`,
          {
            headers: {
              ...getAuthHeader(),
            },
          },
        );
        const [profile] = data;
        setFormData({
          name: profile.username || '',
          picture: profile.profile_picture_url || '',
          bio: profile.bio || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  // Handle file selection and create preview URL
  const handleImageChange = (file, url = null) => {
    if (file) {
      setImageFile(file);
      const fileURL = URL.createObjectURL(file); // Preview image
      setFormData({ ...formData, picture: fileURL });
    } else if (url) {
      setImageFile(null);
      setFormData({ ...formData, picture: url });
    }
  };

  // Upload selected image to Cloudinary and return URL
  const uploadImageToCloudinary = async () => {
    if (!imageFile) {
      return formData.picture; // Return existing URL if no new file
    }
    setUploading(true);
    const formData_upload = new FormData();
    formData_upload.append('file', imageFile);
    formData_upload.append(
      'upload_preset',
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );
    formData_upload.append(
      'cloud_name',
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    );

    try {
      const response = await fetch(import.meta.env.VITE_CLOUDINARY_API_URL, {
        method: 'POST',
        body: formData_upload,
      });

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

  // Handle changes in form inputs
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission with confirmation dialog
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!formData.name.trim()) return toast.error('Name is required');
    if (formData.bio.length > 150)
      return toast.error('Bio cannot exceed 150 characters');

    // Trigger confirmation dialog
    setConfirmationDialog({
      open: true,
      message: 'Are you sure you want to update your profile?',
      onConfirm: async () => {
        try {
          // Use fallback userId (from context or decoded token)
          if (!userId) throw new Error('User ID not found');

          // Upload image if file is selected
          const imageUrl = await uploadImageToCloudinary();
          if (imageFile && !imageUrl) return; // Stop if upload failed

          // Send profile update request
          await axios.put(
            `${BASE_URLS.settings}/profile/${userId}`,
            {
              username: formData.name,
              profile_picture_url: imageUrl || formData.picture,
              bio: formData.bio,
            },
            {
              headers: {
                ...getAuthHeader(),
              },
            },
          );

          // Update formData with the uploaded URL
          if (imageUrl) {
            setFormData((prev) => ({ ...prev, picture: imageUrl }));
          }

          // Clear file selection after successful upload
          setImageFile(null);

          toast.success('Profile updated successfully!');
          // Close dialog after successful update
          setConfirmationDialog({ open: false, message: '', onConfirm: null });
        } catch (err) {
          toast.error(`Error: ${err.response?.data?.message || err.message}`);
        }
      },
    });
  };

  // Show loading or error messages before rendering form
  if (loading) return <p className="loading">Loading...</p>;
  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <a href="/login">
          <button style={{ marginTop: '1rem' }}>Go to Login</button>
        </a>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <div className="header">
        <h2>Profile Settings</h2>
        <p
          style={{
            color: 'var(--settings-popup-text-secondary)',
            textAlign: 'center',
            margin: '0 0 16px 0',
          }}
        >
          Customize your profile information and appearance
        </p>
        <ImageUpload
          currentImage={formData.picture}
          onImageChange={handleImageChange}
          uploading={uploading}
          isProfile={true}
          alt="Profile Picture"
        />
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>
            <User
              size={18}
              style={{
                marginRight: '8px',
                verticalAlign: 'middle',
                display: 'inline',
              }}
            />
            Display Name
          </label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your display name"
            required
          />
        </div>
        <div className="form-group">
          <label>
            <FileText
              size={18}
              style={{
                marginRight: '8px',
                verticalAlign: 'middle',
                display: 'inline',
              }}
            />
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about yourself..."
            maxLength={150}
          />
          <small
            style={{
              color: 'var(--settings-popup-text-secondary)',
              fontSize: '13px',
              textAlign: 'right',
              display: 'block',
              marginTop: '4px',
            }}
          >
            {formData.bio.length}/150 characters
          </small>
        </div>
        <button type="submit" disabled={uploading}>
          <Save size={18} />
          {uploading ? 'Uploading...' : 'Save Profile'}
        </button>
      </form>
      {confirmationDialog.open && (
        <ConfirmationDialog
          message={confirmationDialog.message}
          onConfirm={confirmationDialog.onConfirm}
          onCancel={() =>
            setConfirmationDialog({ open: false, message: '', onConfirm: null })
          }
        />
      )}
    </div>
  );
};

export default ProfileSection;
