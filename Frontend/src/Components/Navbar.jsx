import { Link, useNavigate } from "react-router-dom";
import { React, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    showToast("Logged out successfully!", "success");
    navigate("/login");
    setMenuOpen(false);
  };

  const showToast = (message, type = "success") => {
    console.log(`Toast: ${message} (${type})`);
  };

  return (
    <>
      <div className="navbar" id="Navbar">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Task Tracker Logo" className="image" />
            <div className="logo-text">Task Tracker</div>
          </Link>
        </div>
        <div className="manu">
          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
            <li>
              <Link to="/" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" onClick={toggleMenu}>
                Dashboard
              </Link>
            </li>
            {isLoggedIn ? (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={toggleMenu}>
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
