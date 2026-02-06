import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'

function Hero() {
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
          <h1 className="hero-title">Smart Agriculture Platform</h1>
          <p className="hero-subtitle">Get AI-powered crop recommendations, disease detection, and smarter farming solutions</p>
          <Link to="/signup" className="hero-btn-link">
            <button className="hero-btn">Get Started</button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
