import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <NavLink to="/" className="brand-link" onClick={closeMenu}>
              <span className="brand-text">IST Tasks</span>
            </NavLink>
          </div>
          
          <div className="menu-icon" onClick={toggleMenu}>
            {isOpen ? "✕" : "☰"}
          </div>

          <div className={isOpen ? "nav-links active" : "nav-links"}>
            <NavLink 
              to="/" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              My Tasks
            </NavLink>
            <NavLink 
              to="/form" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              Add New Task
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;