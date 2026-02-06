import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prevState => ({
        ...prevState,
        [name]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    return newErrors
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      try {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]')

        // Find user with matching email and password
        const user = users.find(
          u => u.email === formData.email && u.password === formData.password
        )

        if (!user) {
          setErrors({ submit: 'Invalid email or password' })
          setIsLoading(false)
          return
        }

        // Use AuthContext to login
        login({
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt
        })

        // Reset form
        setFormData({
          email: '',
          password: ''
        })

        // Redirect to dashboard
        navigate('/dashboard')
      } catch (error) {
        setErrors({ submit: 'An error occurred during login' })
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="login-wrapper">
          {/* Login Info Section */}
          <div className="login-info">
            <h3>🌾 Welcome to AgroTech</h3>
            <p className="info-intro">Your trusted platform for smart farming</p>
            <ul className="info-list">
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Smart IoT Control</strong>
                  <p>Manage irrigation & farm equipment remotely</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Crop Health Monitoring</strong>
                  <p>Real-time disease & pest detection</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Smart Recommendations</strong>
                  <p>AI-powered crop & schedule suggestions</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Analytics Dashboard</strong>
                  <p>Track yield & resource usage</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Login Container */}
          <div className="login-container">
            <div className="login-header">
              <h1>🔐 Login</h1>
              <p>Access your farm management dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@gmail.com"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="password" className="form-label">
                    <span className="label-icon">🔒</span>
                    Password
                  </label>
                  <a href="#" className="forgot-password">Forgot?</a>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {errors.submit && (
                <div className="error-message">{errors.submit}</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? '⏳ Logging in...' : '✓ Login'}
              </button>
            </form>

            {/* Signup Link */}
            <div className="auth-footer">
              <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up here</Link></p>
            </div>

            {/* Demo Info */}
            <div className="demo-info">
              <p><strong>Demo Account:</strong></p>
              <p>Email: demo@agrotech.com</p>
              <p>Password: demo123</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Login
