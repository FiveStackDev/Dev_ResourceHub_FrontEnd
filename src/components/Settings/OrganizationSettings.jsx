
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Building, Upload, MapPin, Mail, Save, Image } from 'lucide-react';
import { BASE_URLS } from '../../services/api/config';
import { getAuthHeader } from '../../utils/authHeader';
import { useUser, decodeToken } from '../../contexts/UserContext';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import VerificationPopup from './OrgVerificationPopup';
import ConfirmationDialog from './ConfirmationDialog';
import './Styles/SettingsComponents.css';

const OrganizationSection = () => {
  // State to store form data
  const [formData, setFormData] = useState({ org_name: '', org_logo: '', org_address: '',org_email:'' });
  const [openVerifyPopup, setOpenVerifyPopup] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [code, setCode] = useState('');
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
          `${BASE_URLS.orgsettings}/details/1`,
          {
            headers: {
              ...getAuthHeader(),
            },
          }
        );
        const [organization] = data;
        setFormData({
         org_name: organization.org_name || '',
         org_logo: organization.org_logo || '',
         org_address: organization.org_address || '',
          org_email: organization.org_email || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    let key = name;
    if (name === 'name') key = 'org_name';
    if (name === 'picture') key = 'org_logo';
    if (name === 'bio') key = 'org_address';
    if (name === 'email') key = 'org_email';
    setFormData({ ...formData, [key]: value });
  };

  // Handle file selection and create preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const fileURL = URL.createObjectURL(file); // Preview image
      setFormData({ ...formData, org_logo: fileURL });
    }
  };

  // Upload selected image to Cloudinary and return URL
  const uploadImageToCloudinary = async () => {
    if (!imageFile) {
      return formData.org_logo; // Return existing URL if no new file
    }

    setUploading(true);
    const formData_upload = new FormData();
    formData_upload.append('file', imageFile);
    formData_upload.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData_upload.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(
        import.meta.env.VITE_CLOUDINARY_API_URL,
        {
          method: 'POST',
          body: formData_upload,
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

  // Handle form submission with confirmation dialog
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!formData.org_name.trim()) return toast.error('Name is required');
    if (formData.org_address.length > 150)
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
            `${BASE_URLS.orgsettings}/profile/1`,
            {
              org_name: formData.org_name,
              org_logo: imageUrl || formData.org_logo,
              org_address: formData.org_address,
            },
            {
              headers: {
                ...getAuthHeader(),
              },
            }
          );
          
          // Update formData with the uploaded URL
          if (imageUrl) {
            setFormData(prev => ({ ...prev, org_logo: imageUrl }));
          }
          
          // Clear file selection after successful upload
          setImageFile(null);
          
          toast.success('Organization Profile updated successfully!');
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
          <button style={{marginTop: '1rem'}}>Go to Login</button>
        </a>
      </div>
    );
  }

   // Handle email update and trigger verification popup
  const handleEmailSubmit = async (email) => {
    try {
      // Use the same userId logic as other functions
      let currentUserId = userData.id;
      if (!currentUserId) {
        const decoded = decodeToken();
        currentUserId = decoded?.id;
      }
      if (!currentUserId) throw new Error('User ID not found');
      const { data } = await axios.get(
        `${BASE_URLS.orgsettings}/details/1`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      const existingEmail = data[0]?.org_email;
      if (email === existingEmail) {
        toast.error('This email is already in use.');
        return;
      }
      setSelectedEmail(email);
      setOpenVerifyPopup(true);
      const randomCode =
        Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      setCode(randomCode.toString());
      await axios.post(
        `${BASE_URLS.orgsettings}/sendEmail/`,
        {
          email,
          code: randomCode,
        },
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      toast.success(`Verification code sent to ${email} successfully!`);
    } catch (error) {
      toast.error(
        `Failed to send verification code: ${error.response?.data?.message || error.message}`,
      );
    }
  };

  return (
    <div className="profile-section">
      <div className="header">
        <Building size={32} style={{ marginBottom: '16px', color: 'var(--settings-accent-primary)' }} />
        <h2>Organization Settings</h2>
        <p style={{ color: 'var(--settings-popup-text-secondary)', textAlign: 'center', margin: '0 0 16px 0' }}>
          Manage your organization profile and information
        </p>
        {formData.org_logo && (
          <div style={{ marginTop: '10px' }}>
            <img
              src={formData.org_logo}
              alt="Organization Logo"
              style={{
                maxWidth: '150px',
                maxHeight: '150px',
                objectFit: 'cover',
                border: '4px solid var(--settings-accent-primary)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(147, 51, 234, 0.2)',
              }}
              onError={(e) => { 
                e.target.style.display = 'none'; 
                toast.error('Invalid image URL or failed to load image'); 
              }}
            />
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>
            <Building size={18} style={{ marginRight: '8px', verticalAlign: 'middle',display:'inline' }} />
            Organization Name
          </label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={formData.org_name}
            onChange={handleChange}
            placeholder="Enter organization name"
            required
          />
        </div>
        <div className="form-group">
          <label>
            <Image size={18} style={{ marginRight: '8px', verticalAlign: 'middle',display:'inline' }} />
            Organization Logo
          </label>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Upload size={16} style={{ color: 'var(--settings-accent-primary)' }} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ flex: 1 }}
            />
          </div>
          <label style={{ fontSize: '14px', color: 'var(--settings-popup-text-secondary)' }}>
            Or enter logo URL directly:
          </label>
          <input
            className="form-input"
            type="url"
            name="picture"
            value={formData.org_logo}
            onChange={handleChange}
            placeholder="https://example.com/logo.jpg"
          />
        </div>
        <div className="form-group">
          <label>
            <MapPin size={18} style={{ marginRight: '8px', verticalAlign: 'middle',display:'inline' }} />
            Organization Address
          </label>
          <textarea
            name="bio"
            value={formData.org_address}
            onChange={handleChange}
            rows="4"
            placeholder="Enter organization address..."
          />
        </div>
        <button type="submit" disabled={uploading}>
          <Save size={18} />
          {uploading ? 'Uploading...' : 'Save Organization'}
        </button>
      </form>
      
      <hr />
      
      <div className="form-group" style={{ marginTop: '24px' }}>
        <label>
          <Mail size={18} style={{ marginRight: '8px', verticalAlign: 'middle',display:'inline' }} />
          Organization Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.org_email}
          onChange={handleChange}
          placeholder="Enter organization email"
          required
        />
        <button
          type="button"
          onClick={() => handleEmailSubmit(formData.org_email)}
        >
          <Save size={18} />
          Update Email
        </button>
      </div>


        {openVerifyPopup && (
        <VerificationPopup
          onClose={() => setOpenVerifyPopup(false)}
          email={selectedEmail}
          code={code}
        />
      )}

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

export default OrganizationSection;
