import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageTemplate.css'

function DiseaseDetection() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <Link to="/" className="back-btn">← Back Home</Link>
          <h1>🔍 Disease Diagnosis & Voice Assistance</h1>
          <p className="page-subtitle">Identify crop diseases with AI and get instant voice guidance</p>
        </div>
        
        <div className="feature-intro">
          <div className="feature-box">
            <h2>Coming Soon</h2>
            <p>This feature will help you identify and diagnose crop diseases using advanced AI technology with voice-guided solutions.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DiseaseDetection
