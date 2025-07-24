import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Login.css';
import { toast } from 'react-toastify';
import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { BASE_URLS } from './../../services/api/config';

function Register() {
  const [credentials, setCredentials] = useState({
    org_name: '',
    email: '',
    username: '',
    confirmPassword: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation rule
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long, contain one uppercase letter, and one symbol.';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (credentials.password !== credentials.confirmPassword) {
      toast.error('Password and Confirm Password do not match.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        org_name: credentials.org_name,
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
      };
      const response = await fetch(`${BASE_URLS.orgsettings}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof getAuthHeader === 'function' ? getAuthHeader() : {}),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Registration successful!');
        setCredentials({
          org_name: '',
          email: '',
          username: '',
          confirmPassword: '',
          password: '',
        });
      } else {
        const errorData = await response.json();
        setErrorMessage( 'Failed to register');
      }
    } catch (err) {
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (e) => e.preventDefault();

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <h1>Welcome!</h1>
      </div>

      <div className="login-right">
        <form onSubmit={handleRegister} className="login-form">
          <h2>Register</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Organization Name */}
          <TextField
            label="Organization Name"
            name="org_name"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={credentials.org_name}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <TextField
            label="Username"
            name="username"
            type="test"
            variant="outlined"
            fullWidth
            margin="normal"
            value={credentials.username}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <TextField
            label="Youer Email Address"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={credentials.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={handleChange}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          {passwordError && <p className="error">{passwordError}</p>}

          {/* Confirm Password */}
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={credentials.confirmPassword}
              onChange={handleChange}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>
          <div className="form-options"></div>
          <button className="submitbtn" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Register'}
          </button>
          <br></br>
          <div className="form-options">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
