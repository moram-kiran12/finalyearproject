import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../utils/translations'

function Hero() {
  const { currentLanguage } = useLanguage()
  const t = translations[currentLanguage]

  return (
    <section className="hero" id="hero">
      <video 
        className="hero-video" 
        autoPlay 
        muted 
        loop 
        playsInline
        controls={false}
      >
        <source src="./hero_video.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-subtitle">{t.heroSubtitle}</p>
          <Link to="/signup" className="hero-btn-link">
            <button className="hero-btn">{t.getStarted}</button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
