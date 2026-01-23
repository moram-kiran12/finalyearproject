import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageTemplate.css'

function CropCost() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <Link to="/" className="back-btn">← Back Home</Link>
          <h1>💰 Crop Cost Estimator</h1>
          <p className="page-subtitle">Calculate accurate production costs for better profit planning</p>
        </div>
        
        <div className="feature-intro">
          <div className="feature-box">
            <h2>Coming Soon</h2>
            <p>This feature will help you estimate crop production costs including labor, materials, and other expenses for better financial planning.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CropCost
