import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Signup.css'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
        // Get existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')

        // Check if user already exists
        const userExists = existingUsers.some(user => user.email === formData.email)
        if (userExists) {
          setErrors({ email: 'Email already registered' })
          setIsLoading(false)
          return
        }

        // Create new user object
        const newUser = {
          id: Date.now(),
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password, // In production, never store plain text passwords!
          createdAt: new Date().toLocaleDateString()
        }

        // Add user to localStorage
        existingUsers.push(newUser)
        localStorage.setItem('users', JSON.stringify(existingUsers))

        // Set success message
        setSuccessMessage('Signup successful! Redirecting to login...')

        // Reset form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          fullName: ''
        })

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } catch (error) {
        setErrors({ submit: 'An error occurred during signup' })
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="signup-wrapper">
          <div className="signup-container">
            <div className="signup-header">
              <h1>🚜 Join AgroTech</h1>
              <p>Create your account to manage your farm efficiently</p>
            </div>

            {successMessage && (
              <div className="success-message">
                ✅ {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="signup-form">
              {/* Full Name Field */}
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  <span className="label-icon">👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              {/* Username Field */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <span className="label-icon">👨‍🌾</span>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose your username"
                  className={`form-input ${errors.username ? 'input-error' : ''}`}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

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
                <label htmlFor="password" className="form-label">
                  <span className="label-icon">🔐</span>
                  Password
                </label>
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

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <span className="label-icon">✓</span>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
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
                {isLoading ? '⏳ Creating Account...' : '✨ Create Account'}
              </button>
            </form>

            {/* Login Link */}
            <div className="auth-footer">
              <p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
            </div>
          </div>

          {/* Info Section */}
          <div className="signup-info">
            <h3>🎯 Why Join AgroTech?</h3>
            <ul className="info-list">
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Smart Irrigation</strong>
                  <p>Control water pumps with IoT sensors</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Disease Detection</strong>
                  <p>Identify crop diseases early</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Weather Insights</strong>
                  <p>Get real-time weather updates</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Crop Recommendations</strong>
                  <p>Smart suggestions for better yields</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Signup
