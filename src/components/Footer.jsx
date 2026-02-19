import React from 'react'
import './Footer.css'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../utils/translations'

function Footer() {
  const { currentLanguage } = useLanguage()
  const t = translations[currentLanguage]

  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🌾 AgroTech</h3>
            <p>{t.footerTagline}</p>
          </div>

          <div className="footer-section">
            <h4>{t.quickLinks}</h4>
            <ul>
              <li><a href="#features">{t.navFeatures}</a></li>
              <li><a href="/">{t.navHome}</a></li>
              <li><a href="#footer">{t.navContact}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t.featuresTitle}</h4>
            <ul>
              <li><a href="/disease-detection">{t.diseaseDetection}</a></li>
              <li><a href="/crop-cost">{t.cropCost}</a></li>
              <li><a href="/water-scheduler">{t.waterScheduler}</a></li>
              <li><a href="/iot-water-control">{t.waterControl}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t.connect}</h4>
            <div className="social-links">
              <a href="#" className="social-link">{t.facebook}</a>
              <a href="#" className="social-link">{t.twitter}</a>
              <a href="#" className="social-link">{t.instagram}</a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>{t.copyright}</p>
          <p>{t.builtWith}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
