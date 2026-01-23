import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageTemplate.css'

function IoTWaterControl() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <Link to="/" className="back-btn">← Back Home</Link>
          <h1>🌐 IoT Water Control</h1>
          <p className="page-subtitle">Automated water management using smart IoT sensors</p>
        </div>
        
        <div className="feature-intro">
          <div className="feature-box">
            <h2>Coming Soon</h2>
            <p>This feature provides automated irrigation control through IoT sensors, allowing you to monitor and manage water distribution remotely in real-time.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default IoTWaterControl
