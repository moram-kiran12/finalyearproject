import React from 'react'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
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
          <button className="hero-btn">Get Started</button>
        </div>
      </div>
    </section>
  )
}

export default Hero
