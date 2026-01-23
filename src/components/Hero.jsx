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
        <button className="hero-btn">Get Started</button>
      </div>
    </section>
  )
}

export default Hero
