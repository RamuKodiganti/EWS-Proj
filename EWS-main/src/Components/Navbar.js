import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from './logo512.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [username, setUsername] = useState('User');

  useEffect(() => {
    const storedUsername = localStorage.getItem('currentUser');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const getCurrentPageName = () => {
    const path = location.pathname.slice(1);
    if (!path) return 'Login';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    alert('Logged out successfully');
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <h1 className="navbar-title">MyDashboard</h1>
        </div>

        <div className="navbar-center">
          <div className="page-indicator">
            <span className="page-icon"></span>
            <span className="current-page">{getCurrentPageName()}</span>
          </div>
        </div>

        <div className="navbar-menu">
          <div
            className={`menu-toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`navbar-dropdown ${menuOpen ? 'open' : ''}`}>
            <div className="dropdown-header">
              <div className="user-avatar">
                <span>{username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="user-info">
                <p className="user-name">{username}</p>
                <p className="user-role">User</p>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-menu">
              <Link
                to="/dashboard"
                className={location.pathname === '/dashboard' ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                <i className="menu-icon dashboard-icon"></i>
                Dashboard
              </Link>
              <Link
                to="/workplace"
                className={location.pathname === '/workplace' ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                <i className="menu-icon workplace-icon"></i>
                Workplace
              </Link>
              <Link
                to="/profile"
                className={location.pathname === '/profile' ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                <i className="menu-icon profile-icon"></i>
                Profile
              </Link>

              <div className="dropdown-divider"></div>

              <button className="logout-button" onClick={handleLogout}>
                <i className="menu-icon logout-icon"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
