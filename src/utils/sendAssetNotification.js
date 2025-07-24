import { BASE_URLS } from '../services/api/config';
import { getAuthHeader } from './authHeader';

export async function sendAssetNotification({
  user_id,
  type,
  reference_id,
  title,
  message,
}) {
  const response = await fetch(
    `${BASE_URLS.notification}/sendAssetNotification`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ user_id, type, reference_id, title, message }),
    },
  );
  if (!response.ok) throw new Error('Failed to send asset notification');
  return await response.json();
}
