import { getAuthHeader } from '../utils/authHeader';
import React, { useState } from "react";
import { BASE_URLS } from "../services/api/config";
import "./css/ForgotPassword.css";
import { Link } from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URLS.login}/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Password reset email sent successfully!");
        setEmail("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to send reset email");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-page1">
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
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <button 
              type="submit" 
              className="reset-btn"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "RESET PASSWORD"}
            </button>
          </form>
          <p>
            Go back to login page? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;