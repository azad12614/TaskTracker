import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";

import "./index.css";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
      setIsCheckingAuth(false);
    };

    checkAuthStatus();

    window.addEventListener("storage", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
