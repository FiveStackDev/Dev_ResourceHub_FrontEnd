// Helper to decode base64url (JWT) payloads
function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../css/Login.css';
import { useUser } from './../../contexts/UserContext';
import { BASE_URLS } from './../../services/api/config';
import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUserData } = useUser();

  useEffect(() => {
    // Only redirect if on the login page and token is present
    const token = localStorage.getItem('token');
    if (
      token &&
      (location.pathname === '/' || location.pathname === '/login')
    ) {
      try {
        const payload = token.split('.')[1];
        if (!payload) throw new Error('Malformed token');
        const decoded = JSON.parse(base64UrlDecode(payload));
        // console.log('Decoded token:', decoded); // Remove or comment out for production
        const role = decoded.role?.toLowerCase();
        if (role === 'admin' || role === 'superadmin') {
          navigate('/admin-dashboardadmin', { replace: true });
        } else {
          navigate('/user-dashboarduser', { replace: true });
        }
      } catch (e) {
        console.error('Invalid token:', e);
      }
    }
  }, [navigate, location.pathname]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${BASE_URLS.login}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);

      // Decode and log token details for debugging and navigate
      try {
        const payload = data.token.split('.')[1];
        if (!payload) throw new Error('Malformed token');
        const decoded = JSON.parse(base64UrlDecode(payload));
        console.log('Decoded token after login:', {
          id: decoded.id,
          name: decoded.username,
          email: decoded.email,
          role: decoded.role,
          profile_picture: decoded.profile_picture,
        });
        refreshUserData();
        // Use decoded.role for navigation
        const role = decoded.role?.toLowerCase();
        if (role === 'admin' || role === 'superadmin') {
          navigate('/admin-dashboardadmin');
        } else {
          navigate('/user-dashboarduser');
        }
      } catch (e) {
        console.error('Invalid token after login:', e);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="logo">
          <img id="login-logo" src="/logo.png" alt="Logo" />
        </div>
        <h2 id='heading_text'>Welcome Back!</h2>
      </div>
      <div className="login-right">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Sign In</h2>
          {errorMessage && (
            <div className="error-message" style={{ color: 'red' }}>
              {errorMessage}
            </div>
          )}

          {/* Email Field */}
          <TextField
            label="Email Address"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />

          {/* Password Field */}
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="login-password">Password</InputLabel>
            <OutlinedInput
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              required
            />
          </FormControl>

          <div className="form-options">
            <label>
              <Link to="/forgot-password">Forgot Password?</Link>
            </label>
          </div>

          <button className="submitbtn" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'SIGN IN'}
          </button>

          <div className="form-options">
            <label>
              <p>
                Don't have an account ? <Link to="/register"> Register</Link>
              </p>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
