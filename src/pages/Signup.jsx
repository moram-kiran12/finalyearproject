import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { auth, database } from '../config/firebase'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../utils/translations'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Signup.css'

function Signup() {
  const navigate = useNavigate()
  const { currentLanguage } = useLanguage()
  const t = translations[currentLanguage]
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
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const firebaseUser = userCredential.user

      // Update user profile with display name
      await updateProfile(firebaseUser, {
        displayName: formData.fullName
      })

      // Store user profile in Realtime Database
      const userNode = ref(database, `users/${firebaseUser.uid}`)
      await set(userNode, {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: '',
        createdAt: new Date().toLocaleDateString()
      })

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
      console.error('Signup error:', error.code)
      let errorMessage = 'An error occurred during signup'

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already registered. Please login or use another email.'
          setErrors({ email: errorMessage })
          break
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address'
          setErrors({ email: errorMessage })
          break
        case 'auth/weak-password':
          errorMessage = 'Password is too weak'
          setErrors({ password: errorMessage })
          break
        default:
          setErrors({ submit: errorMessage })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="signup-wrapper">
          <div className="signup-container">
            <div className="signup-header">
              <h1>🚜 {t.joinAgrotech}</h1>
              <p>{t.signupSubtitle}</p>
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
                  {t.fullName}
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t.fullNamePlaceholder}
                  className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              {/* Username Field */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <span className="label-icon">👨‍🌾</span>
                  {t.username}
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={t.usernamePlaceholder}
                  className={`form-input ${errors.username ? 'input-error' : ''}`}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="label-icon">📧</span>
                  {t.emailAddress}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.emailPlaceholder}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
             </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span className="label-icon">🔐</span>
                  {t.password}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t.passwordPlaceholder}
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
                  {t.confirmPassword}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t.confirmPasswordPlaceholder}
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
                {isLoading ? `⏳ ${t.creatingAccount}` : `✨ ${t.createAccount}`}
              </button>
            </form>

            {/* Login Link */}
            <div className="auth-footer">
              <p>{t.alreadyHaveAccount} <Link to="/login" className="auth-link">{t.loginHere}</Link></p>
            </div>
          </div>

          {/* Info Section */}
          <div className="signup-info">
            <h3>� Why Join AgroTech?</h3>
            <ul className="info-list">
              <li style={{'--item-index': 0}}>
                <span className="check-icon">💧</span>
                <div>
                  <strong>AI-Powered Smart Irrigation</strong>
                  <p>Automate water management with IoT sensors and reduce water consumption by up to 40%</p>
                </div>
              </li>
              <li style={{'--item-index': 1}}>
                <span className="check-icon">🦠</span>
                <div>
                  <strong>Early Disease Detection</strong>
                  <p>Identify plant diseases using advanced AI models before they spread across your farm</p>
                </div>
              </li>
              <li style={{'--item-index': 2}}>
                <span className="check-icon">🌤️</span>
                <div>
                  <strong>Real-Time Weather Analytics</strong>
                  <p>Make data-driven decisions with hyper-local weather forecasts and climate insights</p>
                </div>
              </li>
              <li style={{'--item-index': 3}}>
                <span className="check-icon">🌱</span>
                <div>
                  <strong>Crop Yield Optimization</strong>
                  <p>Get personalized crop recommendations and maximize yields with precision farming</p>
                </div>
              </li>
              <li style={{'--item-index': 4}}>
                <span className="check-icon">📊</span>
                <div>
                  <strong>Farm Analytics Dashboard</strong>
                  <p>Monitor your entire farm operation from a single, comprehensive control center</p>
                </div>
              </li>
              <li style={{'--item-index': 5}}>
                <span className="check-icon">🤖</span>
                <div>
                  <strong>Voice Assistant Support</strong>
                  <p>Control your farm operations hands-free with multilingual AI voice commands</p>
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
