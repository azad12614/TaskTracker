import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
              <Link to="/your-tasks" onClick={toggleMenu}>
                Dashboard
              </Link>
            </li>
            {isAuthenticated ? (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  id="logbtn"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/auth" onClick={toggleMenu} id="logbtn">
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
