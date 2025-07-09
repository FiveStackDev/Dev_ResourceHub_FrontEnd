
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styles/ProfileSection.css';
import { BASE_URLS } from '../../services/api/config';
import ConfirmationDialog from './ConfirmationDialog';
import { toast } from 'react-toastify';
import { useUser } from '../../contexts/UserContext';
import { decodeToken } from '../../contexts/UserContext';

const ProfileSection = () => {
  // State to store form data
  const [formData, setFormData] = useState({ name: '', picture: '', bio: '' });

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

          // Send profile update request
          await axios.put(`${BASE_URLS.settings}/profile/${userId}`, {
            username: formData.name,
            profile_picture_url: formData.picture,
            bio: formData.bio,
          });

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
          <button style={{marginTop: '1rem'}}>Go to Login</button>
        </a>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <div className="header">
        <h2>Profile</h2>
        {formData.picture && (
          <img
            src={formData.picture}
            alt="Profile"
            onError={() => toast.error('Invalid image URL')}
          />
        )}
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Name</label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Profile Picture URL</label>
          <input
            className="form-input"
            type="url"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          />
        </div>
        <button type="submit">Save Profile</button>
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
