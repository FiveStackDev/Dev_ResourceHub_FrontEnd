import { getAuthHeader } from './../../utils/authHeader';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URLS } from './../../services/api/config';
import '../css/ForgotPassword.css';
import { Link } from 'react-router-dom';
import CommonVerificationPopup from '../../components/Settings/Account/CommonVerificationPopup';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openVerifyPopup, setOpenVerifyPopup] = useState(false);
  const [code, setCode] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const sendVerificationCode = async (emailAddress) => {
    try {
      const randomCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      setCode(randomCode.toString());

      const response = await fetch(
        `${BASE_URLS.login}/sendForgotPasswordCode`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({ email: emailAddress, code: randomCode }),
        },
      );

      if (response.ok) {
        return { success: true, code: randomCode.toString() };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.message || 'Failed to send verification code. Please check your email address.' 
        };
      }
    } catch (err) {
      console.error('Send verification code error:', err);
      return { 
        success: false, 
        error: 'Failed to send verification code. Please try again later.' 
      };
    }
  };

  const handleResendCode = async () => {
    const result = await sendVerificationCode(email);
    if (result.success) {
      setCode(result.code);
      toast.success('New verification code sent to your email!');
    } else {
      toast.error(result.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await sendVerificationCode(email);
      
      if (result.success) {
        setCode(result.code);
        setOpenVerifyPopup(true);
        setMessage(`Verification code sent to ${email}`);
        toast.success(`Verification code sent to ${email}`);
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      const errorMsg = 'Failed to send verification code. Please try again later.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = async () => {
    setMessage('Verification successful! Sending password reset email...');
    setIsProcessing(true);
    
    try {
      const response = await fetch(
        `${BASE_URLS.login}/resetpassword`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({ email }),
        },
      );
      
      if (response.ok) {
        setMessage('Password reset email sent successfully! Check your inbox.');
        toast.success('Password reset email sent successfully! Check your inbox.');
        setEmail('');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        const errorData = await response.json();
        const errorMsg = errorData.message || 'Failed to send reset email';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      const errorMsg = 'An error occurred. Please try again later.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="forgot-page1">
      <ToastContainer />
      <div className="forgot-page">
        <div className="left-panel">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
          </div>
          <h1>No Worries.!!</h1>
          <a href="/login">
            <button className="back-btn">Take me back.!</button>
          </a>
        </div>

        <div className="form-box">
          <h2>Forgot Password ?</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Enter your email</label>
            <div className="box">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear errors when user starts typing
                  if (error) setError('');
                }}
                required
                disabled={isLoading || isProcessing}
              />
            </div>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <button 
              type="submit" 
              className="reset-btn" 
              disabled={isLoading || isProcessing || !email.trim()}
            >
              {isLoading ? 'Sending...' : isProcessing ? 'Processing...' : 'RESET PASSWORD'}
            </button>
          </form>
          <p>
            Go back to login page? <Link to="/login">Login</Link>
          </p>
        </div>
        {openVerifyPopup && (
          <CommonVerificationPopup
            title="Forgot Password Verification"
            onClose={() => {
              setOpenVerifyPopup(false);
              setMessage('');
              setError('');
            }}
            email={email}
            code={code}
            onVerified={handleVerificationSuccess}
            onResendCode={handleResendCode}
          />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
