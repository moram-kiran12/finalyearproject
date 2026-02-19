import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { ref, get } from 'firebase/database'
import { auth, database } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../utils/translations'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { currentLanguage } = useLanguage()
  const t = translations[currentLanguage]
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
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const firebaseUser = userCredential.user

      // Fetch user profile from Realtime Database
      const userRef = ref(database, `users/${firebaseUser.uid}`)
      const snapshot = await get(userRef)

      if (snapshot.exists()) {
        const userData = snapshot.val()
        // Use AuthContext to login
        login({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          ...userData
        })
      } else {
        // If no profile data exists, create a basic user object
        login({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: firebaseUser.displayName || '',
          username: '',
          phone: '',
          createdAt: new Date().toLocaleDateString()
        })
      }

      // Reset form
      setFormData({
        email: '',
        password: ''
      })

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error.code)
      let errorMessage = 'An error occurred during login'

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Email not registered. Please sign up first.'
          break
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.'
          break
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address'
          break
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled'
          break
        default:
          errorMessage = 'Invalid email or password'
      }

      setErrors({ submit: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="login-wrapper">
          {/* Login Info Section */}
          <div className="login-info">
            <h3>🌾 {t.loginWelcome}</h3>
            <p className="info-intro">{t.loginSubtitle}</p>
            <ul className="info-list">
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>{t.smartIoTControl}</strong>
                  <p>{t.smartIoTDesc}</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>{t.cropHealthMonitoring}</strong>
                  <p>{t.cropHealthDesc}</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>{t.smartRecommendations}</strong>
                  <p>{t.smartRecommendationsDesc}</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>{t.analyticsDashboard}</strong>
                  <p>{t.analyticsDashboardDesc}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Login Container */}
          <div className="login-container">
            <div className="login-header">
              <h1>🔐 {t.loginTitle}</h1>
              <p>{t.loginAccess}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
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
                <div className="password-header">
                  <label htmlFor="password" className="form-label">
                    <span className="label-icon">🔒</span>
                    {t.password}
                  </label>
                  <a href="#" className="forgot-password">{t.forgotPassword}</a>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t.passwordPlaceholder}
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
                {isLoading ? `⏳ ${t.loggingIn}` : `✓ ${t.loginButton}`}
              </button>
            </form>

            {/* Signup Link */}
            <div className="auth-footer">
              <p>{t.dontHaveAccount} <Link to="/signup" className="auth-link">{t.signupHere}</Link></p>
            </div>

            {/* Demo Info */}
            <div className="demo-info">
              <p><strong>{t.demoAccount}</strong></p>
              <p>{t.demoEmail}</p>
              <p>{t.demoPassword}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Login
