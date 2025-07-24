import { BASE_URLS } from '../services/api/config';
import { getAuthHeader } from './authHeader';

export async function getUnreadCount() {
  const response = await fetch(`${BASE_URLS.notification}/unreadCount`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  if (!response.ok) throw new Error('Failed to fetch unread count');
  const data = await response.json();
  return data.unread_count || 0;
}

export async function markNotificationRead(notification_id) {
  const response = await fetch(
    `${BASE_URLS.notification}/markread/${notification_id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    },
  );
  if (!response.ok) throw new Error('Failed to mark notification as read');
  return await response.json();
}

export async function deleteNotification(notification_id) {
  const response = await fetch(
    `${BASE_URLS.notification}/deleteNotification/${notification_id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    },
  );
  if (!response.ok) throw new Error('Failed to delete notification');
  return await response.json();
}
