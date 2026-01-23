import React from 'react'
import { Link } from 'react-router-dom'
import './Features.css'

function Features() {
  const features = [
    {
      id: 1,
      title: 'Disease Diagnosis',
      description: 'Identify crop diseases with AI and get instant voice guidance for treatment',
      icon: '🔍',
      link: '/disease-detection',
      color: '#d32f2f'
    },
    {
      id: 2,
      title: 'Voice Assistance',
      description: 'Get real-time voice guidance for farming tasks and queries',
      icon: '🌾',
      link: '/voice-assistance',
      color: '#7cb342'
    },
    {
      id: 3,
      title: 'Crop Cost Estimator',
      description: 'Calculate accurate production costs for better profit planning',
      icon: '💰',
      link: '/crop-cost',
      color: '#f57c00'
    },
    {
      id: 4,
      title: 'Water Scheduler',
      description: 'Optimize irrigation schedules based on weather and soil conditions',
      icon: '💧',
      link: '/water-scheduler',
      color: '#1976d2'
    },
    {
      id: 5,
      title: 'IoT Water Control',
      description: 'Automated water management using smart IoT sensors',
      icon: '🌐',
      link: '/iot-water-control',
      color: '#388e3c'
    },
    
  ]

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <h2 className="section-title">Our Features</h2>
        <p className="section-subtitle">Smart solutions tailored for modern farming</p>
        
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
