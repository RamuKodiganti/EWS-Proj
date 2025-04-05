import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Registration from './Components/Registration';
import Login from './Components/Login';
import Blank from './Components/Blank';
import Dashboard from './Components/Dashboard';
import Workplace from './Components/Workplace';
import Profile from './Components/Profile';
import './App.css'; // Add this for global styles

// App component with routes
function App() {
  const location = useLocation();
  
  // Define pages where the navbar should not be displayed
  const noNavbarPages = ['/login', '/register', '/'];

  // Check if navbar should be displayed
  const showNavbar = !noNavbarPages.includes(location.pathname);

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <main className={`main-content ${showNavbar ? 'with-navbar' : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workplace" element={<Workplace />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

// Wrapper to provide router context
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;