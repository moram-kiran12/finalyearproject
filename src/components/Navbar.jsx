import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../utils/translations'

function Navbar() {
  const { currentLanguage, changeLanguage } = useLanguage()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const t = translations[currentLanguage]

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
  ]

  const currentLangObj = languages.find(lang => lang.code === currentLanguage)

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setShowLanguageMenu(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/#hero" className="navbar-logo">
          <span className="logo-icon">🌾</span>
          AgroTech
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/#hero" className="nav-link">{t.navHome}</Link>
          </li>
          <li className="nav-item">
            <Link to="/#features" className="nav-link">{t.navFeatures}</Link>
          </li>
          <li className="nav-item">
            <Link to="/#footer" className="nav-link">{t.navContact}</Link>
          </li>
          <li className="nav-item language-selector">
            <button 
              className="language-btn" 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              {currentLangObj.flag} {currentLangObj.name}
            </button>
            {showLanguageMenu && (
              <div className="language-dropdown">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            )}
          </li>
          <li className="nav-item auth-item">
            <Link to="/signup" className="signup-btn">{t.signUp}</Link>
          </li>
          <li className="nav-item auth-item">
            <Link to="/login" className="login-btn">{t.login}</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
