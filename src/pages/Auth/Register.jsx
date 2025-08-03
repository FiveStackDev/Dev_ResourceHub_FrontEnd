import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Login.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { getAuthHeader } from '../../utils/authHeader';
import CommonVerificationPopup from '../../components/Settings/Account/CommonVerificationPopup';

function Register() {
  const [credentials, setCredentials] = useState({
    org_name: '',
    email: '',
    username: '',
    confirmPassword: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openVerifyPopup, setOpenVerifyPopup] = useState(false);
  const [code, setCode] = useState('');

  // Password validation rule
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long, contain one uppercase letter, and one symbol.';
    }
    return '';
  };

  // Email validation rule
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous errors when user starts typing
    if (name === 'password') {
      const error = validatePassword(value);
      setPasswordError(error);
    }

    if (name === 'email') {
      const error = validateEmail(value);
      setEmailError(error);
    }

    // Clear general errors when user makes changes
    if (error) setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    // Validate email before proceeding
    const emailErr = validateEmail(credentials.email);
    if (emailErr) {
      setEmailError(emailErr);
      setIsLoading(false);
      return;
    }

    // Validate password before proceeding
    const passError = validatePassword(credentials.password);
    if (passError) {
      setPasswordError(passError);
      setIsLoading(false);
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      toast.error('Password and Confirm Password do not match.');
      setIsLoading(false);
      return;
    }

    // Validate all required fields
    if (!credentials.org_name.trim()) {
      toast.error('Organization name is required.');
      setIsLoading(false);
      return;
    }

    if (!credentials.username.trim()) {
      toast.error('Username is required.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await sendVerificationCode(credentials.email);

      if (result.success) {
        setCode(result.code);
        setOpenVerifyPopup(true);
        setMessage(`Verification code sent to ${credentials.email}`);
        toast.success(`Verification code sent to ${credentials.email}`);
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg =
        'Failed to send verification code. Please try again later.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const sendVerificationCode = async (email) => {
    try {
      const randomCode =
        Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      setCode(randomCode.toString());

      const response = await fetch(
        `${BASE_URLS.orgsettings}/registerVerificationCode`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({ email, code: randomCode }),
        },
      );

      if (response.ok) {
        return { success: true, code: randomCode.toString() };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Failed to send verification code.',
        };
      }
    } catch (err) {
      console.error('Send verification code error:', err);
      return {
        success: false,
        error: 'Failed to send verification code. Please try again later.',
      };
    }
  };

  const handleResendCode = async () => {
    const result = await sendVerificationCode(credentials.email);
    if (result.success) {
      setCode(result.code);
      toast.success('New verification code sent to your email!');
    } else {
      toast.error(result.error);
    }
  };

  const handleVerificationSuccess = async () => {
    setMessage('Verification successful! Creating your account...');
    setIsVerifying(true);

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
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Check if the response contains an error message even with OK status
        if (responseData.error) {
          setError(responseData.error);
          toast.error(responseData.error);
        } else {
          // Successful registration
          setMessage(
            'Registration successful! You can now login with your credentials.',
          );
          toast.success('Registration successful! Redirecting to login...');

          // Clear form
          setCredentials({
            org_name: '',
            email: '',
            username: '',
            confirmPassword: '',
            password: '',
          });

          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } else {
        const errorMsg =
          responseData.message ||
          responseData.error ||
          'Failed to register. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Registration submission error:', err);
      const errorMsg =
        'An error occurred during registration. Please try again later.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login-left">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <h1>Welcome!</h1>
      </div>

      <div className="login-right">
        <form onSubmit={handleRegister} className="login-form">
          <h2>Register</h2>
          {/* Error message is shown below the form fields, not here */}

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
            label="Your Email Address"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={credentials.email}
            onChange={handleChange}
            error={!!emailError}
            helperText={emailError}
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

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <button
            type="submit"
            className="submit-btn"
            disabled={
              isLoading || isVerifying || !!passwordError || !!emailError
            }
          >
            {isLoading
              ? 'Sending Verification Code...'
              : isVerifying
                ? 'Creating Account...'
                : 'Register'}
          </button>
          <br></br><br></br>
          <div className="form-options">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>

        {openVerifyPopup && (
          <CommonVerificationPopup
            title="Register Email Verification"
            onClose={() => {
              setOpenVerifyPopup(false);
              setMessage('');
              setError('');
            }}
            email={credentials.email}
            code={code}
            onVerified={handleVerificationSuccess}
            onResendCode={handleResendCode}
          />
        )}
      </div>
    </div>
  );
}

export default Register;
