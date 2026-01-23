import React from 'react'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Welcome to AgroTech</h1>
        <p className="hero-subtitle">Smart Farming Solutions for Modern Farmers</p>
        <button className="hero-btn">Get Started</button>
      </div>
      <div className="hero-image">
        <div className="hero-illustration">
          <span className="farm-emoji">🚜</span>
          <span className="field-emoji">🌾</span>
          <span className="crop-emoji">🌱</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
