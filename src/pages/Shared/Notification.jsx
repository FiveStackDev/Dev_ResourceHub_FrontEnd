import { getAuthHeader } from './../../utils/authHeader';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { X } from 'lucide-react';
import { NotificationCard } from './../../components/Notification/NotificationCard';
import NotificationPopup from './../../components/Notification/NotificationPopup';
import {
  markNotificationRead,
  deleteNotification,
} from './../../utils/notificationApi';
import AdminLayout from './../../layouts/Admin/AdminLayout';
import UserLayout from './../../layouts/User/UserLayout'; // Adjust path as needed
import { BASE_URLS } from './../../services/api/config';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from './../../contexts/UserContext';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BASE_URLS.notification}/notification`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }
      const data = await response.json();
      // Map API data to match card props
      const mappedData = data.map((item) => ({
        ...item,
        name: item.username,
        date: item.submitted_date,
        priorityLevel: item.priorityLevel,
      }));
      setNotifications(mappedData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle opening popup
  const handleOpenPopup = (notification) => {
    setSelectedNotification(notification);
    setPopupOpen(true);
  };

  // Handle closing popup
  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedNotification(null);
  };


  // Mark as read (single)
  const handleMarkRead = async (notification_id) => {
    try {
      await markNotificationRead(notification_id);
      toast.success('Notification marked as read');
      fetchNotifications();
      handleClosePopup();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    if (notifications.length === 0) return;
    setConfirmAllOpen(true);
  };

  const handleConfirmAll = async () => {
    setConfirmAllOpen(false);
    try {
      await Promise.all(
        notifications.map((n) => markNotificationRead(n.notification_id))
      );
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  // Delete notification
  const handleDelete = async (notification_id) => {
    try {
      await deleteNotification(notification_id);
      toast.success('Notification deleted');
      fetchNotifications();
      handleClosePopup();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Get user role from context
  const { userData } = useUser();
  const userRole = userData.role;

  // Conditional layout rendering
  const renderContent = (
    <section className="relative flex flex-col justify-start overflow-hidden antialiased">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6">
        <h2 className="text-xl font-bold mb-6">Notifications</h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={notifications.length === 0}
          >
            Mark All as Read
          </button>
        </div>
        <Dialog
          open={confirmAllOpen}
          onClose={() => setConfirmAllOpen(false)}
          maxWidth="xs"
          fullWidth
          BackdropProps={{
            style: {
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            },
          }}
          PaperProps={{
            style: {
              borderRadius: '18px',
              overflow: 'visible',
              boxShadow: '0 8px 32px rgba(59,130,246,0.18)',
              border: '1px solid #e5e7eb',
            },
          }}
        >
          <div style={{ padding: '36px 28px', position: 'relative', minWidth: 340 }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ background: '#e0e7ff', borderRadius: '50%', padding: 4 }}>
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#2563eb', margin: 0 }}>Confirm Mark All as Read</h2>
            </div>
            <p style={{ marginBottom: 28, fontSize: '1.05rem', textAlign: 'left', fontWeight: 500 }}>
              Are you sure you want to mark &nbsp;-&nbsp;<span style={{ fontWeight: 700,color:'#2563eb' }}>{notifications.length} new</span> notifications as read? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14 }}>
              <button
                onClick={() => setConfirmAllOpen(false)}
                style={{ padding: '10px 22px', borderRadius: 10, background: '#f3f4f6', color: '#2563eb', fontWeight: 600, border: '1px solid #e0e7ff', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#e0e7ff'}
                onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAll}
                style={{ padding: '10px 22px', borderRadius: 10, background: 'linear-gradient(90deg, #2563eb 80%, #60a5fa 100%)', color: '#fff', fontWeight: 600, border: 'none', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(59,130,246,0.12)', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1d4ed8 80%, #2563eb 100%)'}
                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 80%, #60a5fa 100%)'}
              >
                Confirm
              </button>
            </div>
          </div>
        </Dialog>
        <div className="space-y-4">
          {paginatedNotifications.map((notification, index) => (
            <div
              key={index}
              onClick={() => handleOpenPopup(notification)}
              style={{ cursor: 'pointer' }}
            >
              <NotificationCard notification={notification} />
            </div>
          ))}
        </div>
        <NotificationPopup
          open={popupOpen}
          onClose={handleClosePopup}
          notification={selectedNotification}
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav aria-label="Page navigation">
              <ul className="inline-flex -space-x-px text-sm">
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-gray-500 border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li key={page}>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border ${
                          currentPage === page
                            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                            : 'text-gray-500 bg-white hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  ),
                )}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <>
      {userRole == 'Admin' || userRole == 'SuperAdmin' ? (
        <AdminLayout>{renderContent}</AdminLayout>
      ) : userRole == 'User' ? (
        <UserLayout>{renderContent}</UserLayout>
      ) : (
        // Fallback for invalid or no role (e.g., not logged in)
        <div>Please log in to view this page.</div>
      )}
      <ToastContainer />
    </>
  );
}

export default Notification;
