import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { UserPlus, Search } from 'lucide-react';
import AdminLayout from '../../../layouts/Admin/AdminLayout';
import { UserTable } from '../../../components/Users/UserTable.jsx';
import { AddUserDialog } from '../../../components/Users/AddUserDialog.jsx';
import { EditUserDialog } from '../../../components/Users/EditUserDialog.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URLS } from '../../../services/api/config';

export const Users = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('All');
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
          id: user.user_id.toString(), // ID is stored as a string
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

  const formatUserData = (user) => ({
    username: user.username || user.email.split('@')[0],
    profile_picture_url:
      user.profilePicture ||
      `https://ui-avatars.com/api/?name=${user.email.split('@')[0]}`,
    usertype: user.userType,
    email: user.email,
    phone_number: user.phoneNumber || '',
    bio: user.additionalDetails || '',
    ...(user.id && { user_id: parseInt(user.id) }), // Ensure ID is an integer
    ...(user.created_at
      ? { created_at: user.created_at }
      : !user.id && { created_at: new Date().toISOString() }),
  });

  const handleAddUser = async (newUser) => {
    try {
      const response = await apiRequest(
        `${BASE_URLS.user}/add`,
        'POST',
        formatUserData(newUser),
      );
      await fetchUsers();
      setIsAddUserOpen(false);
      toast.success(response.message || 'User added successfully');
    } catch (error) {
      // Show a simple error if email already exists
      if (
        error?.message?.includes('Email already exists in the organization')
      ) {
        toast.error(
          'Email already exists in the organization. Please use a different email address.',
        );
      } else {
        toast.error(`Failed to add user: ${error.message}`);
      }
    }
  };

  const handleEditUser = async (editedUser) => {
    try {
      const userId = parseInt(editedUser.id); // Convert user ID to integer
      if (isNaN(userId)) {
        throw new Error('Invalid user ID');
      }

      await apiRequest(
        `${BASE_URLS.user}/details/${userId}`,
        'PUT',
        formatUserData(editedUser),
      );

      setUsers((prev) =>
        prev.map((user) => (user.id === editedUser.id ? editedUser : user)),
      );

      toast.success('User updated successfully');
      setIsEditUserOpen(false);
    } catch (error) {
      toast.error(`Failed to update user: ${error.message}`);
      fetchUsers();
    }
  };

  const handleDeleteUsers = async (userIds) => {
    try {
      const deletePromises = userIds.map(
        (userId) =>
          apiRequest(`${BASE_URLS.user}/details/${parseInt(userId)}`, 'DELETE'), // Parse userId for DELETE
      );
      await Promise.allSettled(deletePromises);
      await fetchUsers();
      toast.success(
        `${userIds.length} user${userIds.length !== 1 ? 's' : ''} deleted successfully`,
      );
    } catch (error) {
      toast.error(`Failed to delete users: ${error.message}`);
      await fetchUsers();
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(({ email, additionalDetails, userType }) => {
        const searchMatch = [email, additionalDetails].some((field) =>
          field?.toLowerCase().includes(searchText.toLowerCase()),
        );
        return searchMatch && (filterType === 'All' || userType === filterType);
      }),
    [users, searchText, filterType],
  );

  return (
    <AdminLayout>
      <div className="space-y-3 p-2">
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-semibold">User Management</h1>
        </div>

        <div className="flex items-center justify-between gap-2 w-full">
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              sx={{ 
                flex: 1,
                minWidth: '120px',
                maxWidth: '350px',
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: <Search size={20} className="mr-2" />,
              }}
            />
           <div className="flex items-center gap-8">
             <FormControl 
              variant="outlined" 
              size="small" 
              sx={{ 
                width: '150px'
              }}
            >
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter by Type"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              sx={{ 
                minWidth: 'fit-content',
                height: '40px'
              }}
              startIcon={<UserPlus size={20} />}
              onClick={() => setIsAddUserOpen(true)}
            >
              Add User
            </Button>
           </div>
        </div>

        {loading ? (
          <div>Loading users...</div>
        ) : (
          <UserTable
            users={filteredUsers}
            onDeleteUsers={handleDeleteUsers}
            onEditUser={(user) => {
              setEditingUser(user);
              setIsEditUserOpen(true);
            }}
          />
        )}

        <AddUserDialog
          open={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          onAdd={handleAddUser}
        />

        <EditUserDialog
          open={isEditUserOpen}
          onClose={() => setIsEditUserOpen(false)}
          onSave={handleEditUser}
          user={
            editingUser || {
              email: '',
              userType: 'User',
              additionalDetails: '',
            }
          }
        />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </AdminLayout>
  );
};

export default Users;
