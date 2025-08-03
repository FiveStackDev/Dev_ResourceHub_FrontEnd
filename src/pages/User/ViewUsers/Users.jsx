import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Search } from 'lucide-react';
import UserLayout from '../../../layouts/User/UserLayout';
import { ViewAdminsTable } from '../../../components/Users/UserTable/AdminViewTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URLS } from '../../../services/api/config';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  const apiRequest = async (url, method, body = null) => {
    // Try both 'authToken' and 'token' for compatibility
    const token =
      localStorage.getItem('authToken') || localStorage.getItem('token');
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body && { body: JSON.stringify(body) }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `${response.status}: ${errorText || response.statusText}`,
        );
      }

      if (
        method !== 'DELETE' &&
        response.headers.get('content-length') !== '0' &&
        response.headers.get('content-type')?.includes('application/json')
      ) {
        return await response.json();
      }
      return true;
    } catch (error) {
      console.error(`API Request Error (${method} ${url}):`, error);
      throw error;
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`${BASE_URLS.user}/details`, 'GET');
      setUsers(
        data.map((user) => ({
          id: user.user_id.toString(),
          email: user.email,
          userType: user.usertype,
          additionalDetails: user.bio,
          profilePicture:
            user.profile_picture_url ||
            `https://ui-avatars.com/api/?name=${user.username || user.email.split('@')[0]}`,
          username: user.username,
          phoneNumber: user.phone_number,
          createdAt: user.created_at,
        })),
      );
    } catch (error) {
      toast.error(`Failed to load users`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(
    () =>
      users.filter(({ email, additionalDetails, userType }) => {
        const isAdmin = userType === 'Admin' || userType === 'SuperAdmin';
        const searchMatch = [email, additionalDetails].some((field) =>
          field?.toLowerCase().includes(searchText.toLowerCase()),
        );
        return isAdmin && searchMatch;
      }),
    [users, searchText],
  );

  return (
    <UserLayout>
      <div className="space-y-3 p-1 sm:p-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-semibold">View Users</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: <Search size={20} className="mr-2" />,
              }}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <ViewAdminsTable users={filteredUsers} />
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Users;
