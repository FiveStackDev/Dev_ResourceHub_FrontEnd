import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Login.css';
import { useUser } from '../contexts/UserContext';
import { BASE_URLS } from '../services/api/config';
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
  const { refreshUserData } = useUser();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');

    if (isAuthenticated === 'true' && userRole) {
      const redirectPath =
        userRole.toLowerCase() === 'admin'
          ? '/admin-dashboardadmin'
          : '/user-dashboarduser';
      navigate(redirectPath);
    }
  }, [navigate]);

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

      const userRole =
        data.usertype.charAt(0).toUpperCase() +
        data.usertype.slice(1).toLowerCase();

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('Userid', data.id);

      refreshUserData();

      if (userRole === 'Admin') {
        navigate('/admin-dashboardadmin');
      } else {
        navigate('/user-dashboarduser');
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
          <img src="/logo.png" alt="Logo" />
        </div>
        <h1>Welcome Back!</h1>
      </div>
      <div className="login-right">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Sign In</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}

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
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </label>
          </div>



          <button className='submitbtn' type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'SIGN IN'}
          </button>

          <div className="form-options">
            <label>
              <p>Don't have an account ? <Link to="/register"> Register</Link></p>
            </label>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;
