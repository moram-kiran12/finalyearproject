import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageTemplate.css'

function CropRecommendation() {
  const [region, setRegion] = useState('')
  const [season, setSeason] = useState('')
  const [soilType, setSoilType] = useState('')
  const [recommendation, setRecommendation] = useState(null)

  const handleGetRecommendation = async () => {
    if (!region || !season || !soilType) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/crop-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region: region,
          season: season,
          soil_type: soilType
        })
      })

      const data = await response.json()
      setRecommendation(data)
    } catch (err) {
      alert('Error getting recommendation. Make sure backend is running.')
    }
  }

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
            <h2>Smart Crop Selection</h2>
            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '2px solid var(--secondary-color)',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="">Select region</option>
                  <option value="north">North India</option>
                  <option value="south">South India</option>
                  <option value="east">East India</option>
                  <option value="west">West India</option>
                  <option value="northeast">Northeast India</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Season
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '2px solid var(--secondary-color)',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="">Select season</option>
                  <option value="kharif">Kharif (Monsoon)</option>
                  <option value="rabi">Rabi (Winter)</option>
                  <option value="summer">Summer</option>
                </select>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '2px solid var(--secondary-color)',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="">Select soil type</option>
                  <option value="black">Black Soil</option>
                  <option value="red">Red Soil</option>
                  <option value="alluvial">Alluvial Soil</option>
                  <option value="clay">Clay Soil</option>
                  <option value="loamy">Loamy Soil</option>
                </select>
              </div>

              <button
                onClick={handleGetRecommendation}
                style={{
                  background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '50px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
              >
                🌱 Get Recommendations
              </button>
            </div>

            {recommendation && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(85, 139, 47, 0.1)', borderRadius: '8px' }}>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Recommended Crops</h3>
                <p>{recommendation.crops || 'Based on your conditions, these crops are recommended...'}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CropRecommendation
