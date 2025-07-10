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
  toggleAdminMode: () => void;
  userData: UserData;
  refreshUserData: () => void;
  isAdminView: boolean;
}

// Default fallback user
const defaultUser: UserData = {
  name: 'Guest User',
  role: '',
  avatar: 'GU',
};

const UserContext = createContext<UserContextType>({
  isAdmin: false,
  toggleAdminMode: () => {},
  userData: defaultUser,
  refreshUserData: () => {},
  isAdminView: false,
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

  // Update userData reactively when token changes
  useEffect(() => {
    const decoded = decodeToken();
    setUserData({
      ...defaultUser,
      name: decoded?.username || defaultUser.name,
      role: decoded?.role || defaultUser.role,
      avatar: decoded?.username?.charAt(0).toUpperCase() || defaultUser.avatar,
      email: decoded?.email || '',
      profilePicture: decoded?.profile_picture || '',
    });
  }, [localStorage.getItem('token')]);


  // Optionally, fetch extra info from API if needed
  const fetchUserData = useCallback(async () => {
    const decoded = decodeToken();
    if (!decoded?.id) {
      setUserData(defaultUser);
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
      setUserData(defaultUser);
    }
  }, []);


  const refreshUserData = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  const isUserAdmin = useMemo(
    () => userData.role?.toLowerCase() === 'admin',
    [userData.role],
  );

  const isAdminView = useMemo(
    () => location.pathname.startsWith('/admin'),
    [location.pathname],
  );

  const toggleAdminMode = useCallback(() => {
    navigate(isAdminView ? '/user-dashboarduser' : '/admin-dashboardadmin');
  }, [isAdminView, navigate]);

  const value = useMemo(
    () => ({
      isAdmin: isUserAdmin,
      toggleAdminMode,
      userData,
      refreshUserData,
      isAdminView,
    }),
    [isUserAdmin, toggleAdminMode, userData, refreshUserData, isAdminView],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
