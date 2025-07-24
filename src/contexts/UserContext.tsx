import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URLS } from '../services/api/config';

// Define the shape of user data
export interface UserData {
  name: string;
  role: string;
  avatar: string;
  email?: string;
  profilePicture?: string;
}

interface UserContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  toggleAdminMode: () => void;
  userData: UserData;
  refreshUserData: () => void;
  isAdminView: boolean;
  loading: boolean;
}

// Default fallback user
const defaultUser: UserData = {
  name: 'Guest User',
  role: '',
  avatar: 'GU',
};

const UserContext = createContext<UserContextType>({
  isAdmin: false,
  isSuperAdmin: false,
  toggleAdminMode: () => {},
  userData: defaultUser,
  refreshUserData: () => {},
  isAdminView: false,
  loading: true,
});

export const useUser = () => useContext(UserContext);


// Helper to decode base64url (JWT) payloads
function base64UrlDecode(str: string) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

export function decodeToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) throw new Error('Malformed token');
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();


  // User data state
  const [userData, setUserData] = useState<UserData>(defaultUser);
  const [loading, setLoading] = useState(true);

  // Update userData reactively when token changes
  useEffect(() => {
    setLoading(true);
    const decoded = decodeToken();
    setUserData({
      ...defaultUser,
      name: decoded?.username || defaultUser.name,
      role: decoded?.role || defaultUser.role,
      avatar: decoded?.username?.charAt(0).toUpperCase() || defaultUser.avatar,
      email: decoded?.email || '',
      profilePicture: decoded?.profile_picture || '',
    });
    setLoading(false);
  }, [localStorage.getItem('token')]);


  // Optionally, fetch extra info from API if needed
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const decoded = decodeToken();
    if (!decoded?.id) {
      setUserData(defaultUser);
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URLS.settings}/details/${decoded.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const [profile] = response.data;
      setUserData((prev) => ({
        ...prev,
        name: profile.username || prev.name,
        email: profile.email || prev.email,
        profilePicture: profile.profile_picture_url || prev.profilePicture,
      }));
    } catch (error) {
      // If error (e.g., invalid/expired token), clear token and user data
      localStorage.removeItem('token');
      setUserData(defaultUser);
    } finally {
      setLoading(false);
    }
  }, []);


  const refreshUserData = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  const isUserAdmin = useMemo(
    () => userData.role?.toLowerCase() === 'admin' || userData.role?.toLowerCase() === 'superadmin',
    [userData.role],
  );

  const isSuperAdmin = useMemo(
    () => userData.role?.toLowerCase() === 'superadmin',
    [userData.role],
  );

  const isAdminView = useMemo(() => {
    // If user is on an admin route, they're in admin view
    if (location.pathname.startsWith('/admin')) {
      return true;
    }
    
    // If user is admin/superadmin and on a shared route, they're still in admin view
    // unless they explicitly navigated to a user route
    if ((userData.role === 'Admin' || userData.role === 'SuperAdmin')) {
      const sharedRoutes = ['/settings', '/notifications', '/organization'];
      const isOnSharedRoute = sharedRoutes.some(route => location.pathname.startsWith(route));
      const isOnUserRoute = location.pathname.startsWith('/user');
      
      if (isOnSharedRoute && !isOnUserRoute) {
        return true;
      }
      
      if (isOnUserRoute) {
        return false;
      }
      
      // Default to admin view for admins on other routes
      return true;
    }
    
    return false;
  }, [location.pathname, userData.role]);

  const toggleAdminMode = useCallback(() => {
    if (isAdminView) {
      // If currently in admin view, switch to user view
      navigate('/user-dashboarduser');
    } else {
      // If currently in user view, switch to admin view
      navigate('/admin-dashboardadmin');
    }
  }, [isAdminView, navigate]);

  const value = useMemo(
    () => ({
      isAdmin: isUserAdmin,
      isSuperAdmin,
      toggleAdminMode,
      userData,
      refreshUserData,
      isAdminView,
      loading,
    }),
    [isUserAdmin, isSuperAdmin, toggleAdminMode, userData, refreshUserData, isAdminView, loading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
