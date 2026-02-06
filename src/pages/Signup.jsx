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
    fullName: '',
    phone: ''
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, requirements: [] }
    
    const requirements = []
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[@$!%*?&]/.test(password)
    const isLongEnough = password.length >= 8

    if (hasUpperCase) requirements.push('uppercase')
    if (hasLowerCase) requirements.push('lowercase')
    if (hasNumber) requirements.push('number')
    if (hasSpecialChar) requirements.push('special')
    if (isLongEnough) requirements.push('length')

    const strength = requirements.length

    return { strength, requirements }
  }

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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (formData.phone.length !== 10 || !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      // Strong password regex validation
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      } else if (!strongPasswordRegex.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)'
      }
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
          phone: formData.phone,
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
          fullName: '',
          phone: ''
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

              {/* Phone Number Field */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <span className="label-icon">📱</span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your 10-digit phone number"
                  className={`form-input ${errors.phone ? 'input-error' : ''}`}
                  maxLength="10"
                  pattern="[0-9]*"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                  }}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className={`strength-fill strength-${getPasswordStrength(formData.password).strength}`}
                      ></div>
                    </div>
                    <div className="requirements">
                      <p className="requirements-title">Password must contain:</p>
                      <ul className="requirements-list">
                        <li className={/[A-Z]/.test(formData.password) ? 'met' : ''}>
                          {/[A-Z]/.test(formData.password) ? '✓' : '○'} Uppercase (A-Z)
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? 'met' : ''}>
                          {/[a-z]/.test(formData.password) ? '✓' : '○'} Lowercase (a-z)
                        </li>
                        <li className={/\d/.test(formData.password) ? 'met' : ''}>
                          {/\d/.test(formData.password) ? '✓' : '○'} Number (0-9)
                        </li>
                        <li className={/@$!%*?&/.test(formData.password) ? 'met' : ''}>
                          {/@$!%*?&/.test(formData.password) ? '✓' : '○'} Special (@$!%*?&)
                        </li>
                        <li className={formData.password.length >= 8 ? 'met' : ''}>
                          {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                
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
