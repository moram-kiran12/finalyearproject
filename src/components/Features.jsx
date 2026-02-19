import React from 'react'
import { Link } from 'react-router-dom'
import './Features.css'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../utils/translations'

function Features() {
  const { currentLanguage } = useLanguage()
  const t = translations[currentLanguage]

  const features = [
    {
      id: 1,
      title: t.feature1Title,
      description: t.feature1Desc,
      icon: '🔍',
      link: '/signup',
      color: '#d32f2f'
    },
    {
      id: 2,
      title: t.feature2Title,
      description: t.feature2Desc,
      icon: '🌾',
      link: '/signup',
      color: '#7cb342'
    },
    {
      id: 3,
      title: t.feature3Title,
      description: t.feature3Desc,
      icon: '💰',
      link: '/signup',
      color: '#f57c00'
    },
    {
      id: 4,
      title: t.feature4Title,
      description: t.feature4Desc,
      icon: '💧',
      link: '/signup',
      color: '#1976d2'
    },
    {
      id: 5,
      title: t.feature5Title,
      description: t.feature5Desc,
      icon: '🌐',
      link: '/login',
      color: '#388e3c'
    },
    {
      id: 6,
      title: t.feature6Title,
      description: t.feature6Desc,
      icon: '🌱',
      link: '/signup',
      color: '#00897b'
    }
  ]

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <h2 className="section-title">{t.sectionTitle}</h2>
        <p className="section-subtitle">{t.sectionSubtitle}</p>
        
        <div className="features-grid">
          {features.map((feature) => (
            <Link to={feature.link} key={feature.id} className="feature-card-link">
              <div className="feature-card" style={{ '--card-color': feature.color }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
