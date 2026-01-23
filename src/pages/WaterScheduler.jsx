import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageTemplate.css'

function WaterScheduler() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <Link to="/" className="back-btn">← Back Home</Link>
          <h1>💧 Water Scheduler</h1>
          <p className="page-subtitle">Optimize irrigation schedules based on weather and soil conditions</p>
        </div>
        
        <div className="feature-intro">
          <div className="feature-box">
            <h2>Coming Soon</h2>
            <p>This feature will help you schedule irrigation efficiently based on real-time weather data and soil moisture conditions to save water and improve crop yield.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default WaterScheduler
