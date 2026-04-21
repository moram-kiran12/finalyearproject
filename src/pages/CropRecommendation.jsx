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
  const [loading, setLoading] = useState(false)

  const GEMINI_API_KEY = 'AIzaSyAPgacFRxZQaFlPo5u_c6Egmma0RSh3o_c' // Replace with your API key

  const handleGetRecommendation = async () => {
    if (!region || !season || !soilType) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const prompt = `You are an agricultural expert. Based on the following conditions, recommend the best crops to plant:
      
Region: ${region}
Season: ${season}
Soil Type: ${soilType}

Please provide:
1. Top 3-5 recommended crops
2. Why these crops are suitable for these conditions
3. Key care tips for each crop
4. Expected yield duration

Keep the response concise and practical.`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get recommendation from Gemini')
      }

      const data = await response.json()
      const recommendationText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No recommendation generated'
      setRecommendation({
        crops: recommendationText
      })
    } catch (err) {
      alert('Error: ' + err.message + '\n\nMake sure to add your Gemini API key in the code.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
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
                disabled={loading}
                style={{
                  background: loading ? '#ccc' : 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '50px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? '⏳ Getting Recommendations...' : '🌱 Get Recommendations'}
              </button>
            </div>

            {recommendation && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(85, 139, 47, 0.1)', borderRadius: '8px' }}>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Recommended Crops</h3>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#333' }}>
                  {recommendation.crops}
                </div>
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
