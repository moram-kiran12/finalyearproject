import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌾</span>
          AgroTech
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <a href="#features" className="nav-link">Features</a>
          </li>
          <li className="nav-item">
            <a href="#footer" className="nav-link">Contact</a>
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
