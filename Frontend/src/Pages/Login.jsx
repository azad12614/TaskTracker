import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({ message: "", type: "", show: false });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ message, type, show: true });

    setTimeout(() => {
      setToast({ message: "", type: "", show: false });
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Please enter your email.", "error");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);

    showToast("Login successful!", "success");
    navigate("/dashboard");

    window.location.reload();
  };

  return (
    <div className="auth-wrapper">
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="auth-container">
        <h2 className="auth-headline">Login to TaskTracker</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
