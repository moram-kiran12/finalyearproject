import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageTemplate.css'

function WaterScheduler() {
  const [cropType, setCropType] = useState('')
  const [soilMoisture, setSoilMoisture] = useState(50)
  const [temperature, setTemperature] = useState(25)
  const [schedule, setSchedule] = useState(null)

  const handleGenerateSchedule = async () => {
    if (!cropType) {
      alert('Please select a crop type')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/water-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop_type: cropType,
          soil_moisture: soilMoisture,
          temperature: temperature
        })
      })

      const data = await response.json()
      setSchedule(data)
    } catch (err) {
      alert('Error generating schedule. Make sure backend is running.')
    }
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
          <h1>💧 Water Scheduler</h1>
          <p className="page-subtitle">Optimize irrigation schedules based on weather and soil conditions</p>
        </div>
        
        <div className="feature-intro">
          <div className="feature-box">
            <h2>Smart Irrigation Planning</h2>
            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Crop Type
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '2px solid var(--secondary-color)',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="">Select a crop</option>
                  <option value="rice">Rice</option>
                  <option value="wheat">Wheat</option>
                  <option value="corn">Corn</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Soil Moisture Level: {soilMoisture}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Temperature: {temperature}°C
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <button
                onClick={handleGenerateSchedule}
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
                📅 Generate Schedule
              </button>
            </div>

            {schedule && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(85, 139, 47, 0.1)', borderRadius: '8px' }}>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Your Schedule</h3>
                <p>{schedule.schedule || 'Schedule generated successfully'}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default WaterScheduler
