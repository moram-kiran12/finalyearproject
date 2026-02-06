import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/#hero" className="navbar-logo">
          <span className="logo-icon">🌾</span>
          AgroTech
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/#hero" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/#features" className="nav-link">Features</Link>
          </li>
          <li className="nav-item">
            <Link to="/#footer" className="nav-link">Contact</Link>
          </li>
          <li className="nav-item auth-item">
            <Link to="/signup" className="signup-btn">✨ Sign Up</Link>
          </li>
          <li className="nav-item auth-item">
            <Link to="/login" className="login-btn">🔐 Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
