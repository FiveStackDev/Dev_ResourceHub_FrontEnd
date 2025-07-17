import { getAuthHeader } from '../utils/authHeader';

import React, { useState, useEffect } from 'react';
import { NotificationCard } from '../components/Notification/NotificationCard';
import NotificationPopup from '../components/Notification/NotificationPopup';
import { markNotificationRead, deleteNotification } from '../utils/notificationApi';
import AdminLayout from '../layouts/Admin/AdminLayout';
import UserLayout from '../layouts/User/UserLayout'; // Adjust path as needed
import { BASE_URLS } from '../services/api/config';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from '../contexts/UserContext';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${BASE_URLS.notification}/notification`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );
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

  // Mark as read
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
        <div className="space-y-4">
          {paginatedNotifications.map((notification, index) => (
            <div key={index} onClick={() => handleOpenPopup(notification)} style={{ cursor: 'pointer' }}>
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
