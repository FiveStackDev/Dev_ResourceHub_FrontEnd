import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Building,
  MapPin,
  Mail,
  Save,
  Globe,
  Phone,
  Calendar,
  Info,
} from 'lucide-react';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';
import { useUser, decodeToken } from '../../../contexts/UserContext';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import VerificationPopup from './OrgVerificationPopup';
import ConfirmationDialog from '../Shared/ConfirmationDialog';
import ImageUpload from '../Profile/ImageUpload';
import DeleteOrganization, {
  DeleteOrganizationTrigger,
} from './DeleteOrganization';
import '../Styles/SettingsComponents.css';

const OrganizationSection = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    org_name: '',
    org_logo: '',
    org_address: '',
    org_email: '',
    org_about: '',
    org_website: '',
    org_phone: '',
    org_founded: '',
  });
  const [openVerifyPopup, setOpenVerifyPopup] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [code, setCode] = useState('');
  // State for file upload functionality
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Loading and error states for async data fetching
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for delete organization popup
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

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
  let orgId = null;
  if (!userId) {
    const decoded = decodeToken();
    userId = decoded?.id;
    orgId = decoded?.org_id;
    console.log(
      'ProfileSettings fallback decoded userId:',
      userId,
      'orgId:',
      orgId,
    );
  } else {
    const decoded = decodeToken();
    orgId = decoded?.org_id;
    console.log('ProfileSettings userId:', userId, 'orgId:', orgId);
  }

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId || !orgId) {
          setError('User or Organization ID not found. Please log in again.');
          setLoading(false);
          return;
        }
        const { data } = await axios.get(
          `${BASE_URLS.orgsettings}/details/${orgId}`,
          {
            headers: {
              ...getAuthHeader(),
            },
          },
        );
        const [organization] = data;
        setFormData({
          org_name: organization.org_name || '',
          org_logo: organization.org_logo || '',
          org_address: organization.org_address || '',
          org_email: organization.org_email || '',
          org_about: organization.org_about || '',
          org_website: organization.org_website || '',
          org_phone: organization.org_phone || '',
          org_founded: organization.org_founded || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId, orgId]);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    let key = name;
    if (name === 'name') key = 'org_name';
    if (name === 'picture') key = 'org_logo';
    if (name === 'address') key = 'org_address';
    if (name === 'email') key = 'org_email';
    if (name === 'about') key = 'org_about';
    if (name === 'website') key = 'org_website';
    if (name === 'phone') key = 'org_phone';
    if (name === 'founded') key = 'org_founded';
    setFormData({ ...formData, [key]: value });
  };

  // Handle file selection and create preview URL
  const handleImageChange = (file, url = null) => {
    if (file) {
      setImageFile(file);
      const fileURL = URL.createObjectURL(file); // Preview image
      setFormData({ ...formData, org_logo: fileURL });
    } else if (url) {
      setImageFile(null);
      setFormData({ ...formData, org_logo: url });
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

  // Handle form submission with confirmation dialog
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!formData.org_name.trim())
      return toast.error('Organization name is required');
    if (formData.org_address.length > 255)
      return toast.error('Address cannot exceed 255 characters');
    if (formData.org_about.length > 500)
      return toast.error('About section cannot exceed 500 characters');
    if (formData.org_website && !formData.org_website.match(/^https?:\/\/.+/))
      return toast.error(
        'Website must be a valid URL (include http:// or https://)',
      );
    if (
      formData.org_phone &&
      !formData.org_phone.match(/^[\+]?[0-9\s\-\(\)]+$/)
    )
      return toast.error('Please enter a valid phone number');
    if (
      formData.org_founded &&
      (isNaN(formData.org_founded) ||
        formData.org_founded < 1800 ||
        formData.org_founded > new Date().getFullYear())
    )
      return toast.error('Please enter a valid founding year');

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
            `${BASE_URLS.orgsettings}/profile/${orgId}`,
            {
              org_name: formData.org_name,
              org_logo: imageUrl || formData.org_logo,
              org_address: formData.org_address,
              org_about: formData.org_about,
              org_website: formData.org_website,
              org_phone: formData.org_phone,
              org_founded: formData.org_founded,
            },
            {
              headers: {
                ...getAuthHeader(),
              },
            },
          );

          // Update formData with the uploaded URL
          if (imageUrl) {
            setFormData((prev) => ({ ...prev, org_logo: imageUrl }));
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
          <button style={{ marginTop: '1rem' }}>Go to Login</button>
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
        `${BASE_URLS.orgsettings}/details/${orgId}`,
        {
          headers: {
            ...getAuthHeader(),
          },
        },
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
        },
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
        <Building
          size={32}
          style={{
            marginBottom: '16px',
            color: 'var(--settings-accent-primary)',
          }}
        />
        <h2>Organization Settings</h2>
        <p
          style={{
            color: 'var(--settings-popup-text-secondary)',
            textAlign: 'center',
            margin: '0 0 16px 0',
          }}
        >
          Manage your organization profile and information
        </p>
        <ImageUpload
          currentImage={formData.org_logo || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'} 
          onImageChange={handleImageChange}
          uploading={uploading}
          isProfile={false}
          alt="Organization Logo"
          defaultImage="https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg"
        />
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        {/* Basic Information Section */}
        <div className="form-section">
          <h3 className="section-title">
            <Building
              size={20}
              style={{ marginRight: '8px', verticalAlign: 'middle' }}
            />
            Basic Information
          </h3>

          <div className="form-group">
            <label>
              <Building
                size={18}
                style={{
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              />
              Organization Name *
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
              <Info
                size={18}
                style={{
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              />
              About Organization
            </label>
            <textarea
              className="form-input"
              name="about"
              value={formData.org_about}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your organization..."
              maxLength="500"
            />
            <small
              style={{
                color: 'var(--settings-popup-text-secondary)',
                fontSize: '0.85rem',
              }}
            >
              {formData.org_about.length}/500 characters
            </small>
          </div>

          <div className="form-group">
            <label>
              <Calendar
                size={18}
                style={{
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              />
              Founded Year
            </label>
            <input
              className="form-input"
              type="number"
              name="founded"
              value={formData.org_founded}
              onChange={handleChange}
              placeholder="e.g., 2020"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="form-section">
          <h3 className="section-title">
            <Mail
              size={20}
              style={{ marginRight: '8px', verticalAlign: 'middle' }}
            />
            Contact Information
          </h3>

          <div className="form-group">
            <label>
              <MapPin
                size={18}
                style={{
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              />
              Organization Address
            </label>
            <textarea
              className="form-input"
              name="address"
              value={formData.org_address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter complete address..."
              maxLength="255"
            />
            <small
              style={{
                color: 'var(--settings-popup-text-secondary)',
                fontSize: '0.85rem',
              }}
            >
              {formData.org_address.length}/255 characters
            </small>
          </div>

          <div className="form-group">
            <label>
              <Phone
                size={18}
                style={{
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              />
              Phone Number
            </label>
            <input
              className="form-input"
              type="tel"
              name="phone"
              value={formData.org_phone}
              onChange={handleChange}
              placeholder="e.g., +1 (555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label>
              <Globe
                size={18}
                style={{
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              />
              Website URL
            </label>
            <input
              className="form-input"
              type="url"
              name="website"
              value={formData.org_website}
              onChange={handleChange}
              placeholder="https://www.yourcompany.com"
            />
          </div>

          <div className="form-group">
            <label>
              <Mail
                size={18}
                style={{
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              />
              Organization Email
            </label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={formData.org_email}
              onChange={handleChange}
              placeholder="Enter organization email"
              required
            />
            <button
              type="button"
              className="section-button"
              onClick={() => handleEmailSubmit(formData.org_email)}
            >
              <Save size={18} />
              Update Email
            </button>
          </div>
        </div>

        <button type="submit" disabled={uploading} className="submit-button">
          <Save size={18} />
          {uploading ? 'Uploading...' : 'Save Organization Profile'}
        </button>
      </form>

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

      {/* Delete Organization Section - Danger Zone */}
      <DeleteOrganizationTrigger
        orgData={formData}
        onOpenDelete={() => {
          console.log(
            'Opening delete popup, current state:',
            isDeletePopupOpen,
          );
          setIsDeletePopupOpen(true);
          console.log('Delete popup state set to true');
        }}
      />

      {/* Delete Organization Popup */}
      {console.log(
        'Rendering DeleteOrganization with isOpen:',
        isDeletePopupOpen,
      )}
      <DeleteOrganization
        orgData={formData}
        isOpen={isDeletePopupOpen}
        onClose={() => {
          console.log('Closing delete popup');
          setIsDeletePopupOpen(false);
        }}
      />
    </div>
  );
};

export default OrganizationSection;
