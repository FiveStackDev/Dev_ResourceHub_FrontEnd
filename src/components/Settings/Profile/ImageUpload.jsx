import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Upload, Eye, Edit, X, Image } from 'lucide-react';
import { toast } from 'react-toastify';

const ImageUpload = ({ 
  currentImage, 
  onImageChange, 
  uploading, 
  isProfile = true,
  alt = "Image" 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'
  const [urlInput, setUrlInput] = useState(currentImage || '');

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Create portal container for modals
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    // Create or get the portal container
    let container = document.getElementById('modal-portal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-portal';
      container.style.position = 'relative';
      container.style.zIndex = '9000';
      document.body.appendChild(container);
    }
    setPortalContainer(container);

    return () => {
      // Clean up: remove container if it's empty when component unmounts
      if (container && container.childNodes.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, []);

  // Update URL input when currentImage changes
  useEffect(() => {
    setUrlInput(currentImage || '');
  }, [currentImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      onImageChange(file);
      closeModal();
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput && urlInput !== currentImage) {
      // Validate URL format
      try {
        new URL(urlInput);
        onImageChange(null, urlInput);
        closeModal();
      } catch (error) {
        toast.error('Please enter a valid URL');
      }
    }
  };

  const openModal = (mode) => {
    console.log('Opening modal with mode:', mode); // Debug log
    setModalMode(mode);
    setUrlInput(currentImage || '');
    setShowModal(true);
  };

  const closeModal = () => {
    console.log('Closing modal'); // Debug log
    setShowModal(false);
  };

  return (
    <>
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          Modal State: {showModal ? 'OPEN' : 'CLOSED'} | Mode: {modalMode} | Image: {currentImage ? 'YES' : 'NO'}
        </div>
      )}
      
      <div className="image-upload-container">
        <div className="image-display">
          {currentImage ? (
            <div className="image-wrapper">
              <img
                src={currentImage}
                alt={alt}
                className={`uploaded-image ${isProfile ? 'profile-image' : 'org-image'}`}
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                  toast.error('Failed to load image'); 
                }}
              />
              <div className="image-overlay">
                <button 
                  type="button"
                  className="image-action-btn view-btn"
                  onClick={() => openModal('view')}
                  title="View Image"
                >
                  <Eye size={16} />
                </button>
                <button 
                  type="button"
                  className="image-action-btn edit-btn"
                  onClick={() => openModal('edit')}
                  title="Edit Image"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="image-placeholder" onClick={() => openModal('edit')}>
              <div className="placeholder-content">
                <Image size={40} />
                <p>Click to add {isProfile ? 'profile picture' : 'organization logo'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render modals using portal */}
      {portalContainer && showModal && modalMode === 'view' && createPortal(
        <div className="image-view-overlay" onClick={closeModal}>
          <div className="image-view-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className="image-view-close"
              onClick={closeModal}
              title="Close"
            >
              <X size={24} />
            </button>
            <img src={currentImage} alt={alt} className="full-view-image" />
          </div>
        </div>,
        portalContainer
      )}

      {portalContainer && showModal && modalMode === 'edit' && createPortal(
        <div className="professional-modal-overlay" onClick={closeModal}>
          <div className="professional-modal" onClick={(e) => e.stopPropagation()}>
            <div className="professional-modal-header">
              <div className="header-content">
                <div className="header-icon">
                  <Edit size={24} />
                </div>
                <div className="header-text">
                  <h3>Update {isProfile ? 'Profile Picture' : 'Organization Logo'}</h3>
                  <p>Choose a new image or enter an image URL</p>
                </div>
              </div>
              <button 
                className="professional-close-btn"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="professional-modal-content">
              {currentImage && (
                <div className="current-image-section">
                  <label className="section-label">Current Image</label>
                  <div className="current-image-preview">
                    <img src={currentImage} alt={alt} className="preview-image" />
                  </div>
                </div>
              )}
              
              <div className="upload-section">
                <label className="section-label">Upload New Image</label>
                <div className="upload-methods">
                  <div className="upload-method">
                    <label className="professional-file-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <div className="upload-icon">
                        <Upload size={20} />
                      </div>
                      <div className="upload-text">
                        <span className="upload-title">Choose from Device</span>
                        <span className="upload-subtitle">PNG, JPG, GIF up to 5MB</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="method-divider">
                    <span>or</span>
                  </div>
                  
                  <div className="upload-method">
                    <label className="section-sublabel">Image URL</label>
                    <div className="url-input-section">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="professional-url-input"
                      />
                      <button 
                        type="button"
                        className="professional-btn-primary"
                        onClick={handleUrlSubmit}
                        disabled={!urlInput || urlInput === currentImage}
                      >
                        Use URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        portalContainer
      )}

      {/* Fallback: Simple alert for debugging */}
      {showModal && !portalContainer && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          border: '2px solid red',
          zIndex: 99999
        }}>
          Modal Debug: Mode={modalMode}, Container={portalContainer ? 'Ready' : 'Not Ready'}
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
