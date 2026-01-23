import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageTemplate.css'

function CropRecommendation() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <Link to="/" className="back-btn">← Back Home</Link>
          <h1>🌾 Crop Recommendation</h1>
          <p className="page-subtitle">Get personalized crop suggestions based on your land and climate</p>
        </div>
        
        <div className="feature-intro">
          <div className="feature-box">
            <h2>Coming Soon</h2>
            <p>This feature analyzes your land characteristics, climate conditions, and market trends to recommend the most suitable crops for maximum productivity and profitability.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CropRecommendation
