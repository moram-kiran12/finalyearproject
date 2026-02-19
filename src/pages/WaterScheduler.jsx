import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { initializeApp, getApps } from 'firebase/app'
import { getDatabase, ref, onValue, push, remove } from 'firebase/database'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './WaterScheduler.css'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqhBhLHYthEYyXIdhkPgBi-jvvq4PRqa8",
  authDomain: "water-c492d.firebaseapp.com",
  databaseURL: "https://water-c492d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "water-c492d",
  storageBucket: "water-c492d.firebasestorage.app",
  messagingSenderId: "920828005428",
  appId: "1:920828005428:web:605086ba4f7dc845714e61"
}

// Initialize Firebase
let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}
const db = getDatabase(app)

function WaterScheduler() {
  const [crops, setCrops] = useState([])
  const [borewells, setBorewells] = useState('2')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scheduleResult, setScheduleResult] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    crop_name: '',
    crop_stage: '',
    season: '',
    acres: '',
    last_watered_date: ''
  })

  // Fetch crops from Firebase on mount
  useEffect(() => {
    const cropsRef = ref(db, 'crops')
    onValue(cropsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const cropList = Object.entries(data).map(([id, crop]) => ({ id, ...crop }))
        setCrops(cropList)
      } else {
        setCrops([])
      }
    })
  }, [])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Add crop to Firebase
  const handleAddCrop = async () => {
    if (!formData.crop_name.trim() || !formData.crop_stage.trim() || !formData.season.trim() || !formData.acres.trim() || !formData.last_watered_date.trim()) {
      setError('Please fill all fields')
      return
    }

    try {
      const cropsRef = ref(db, 'crops')
      await push(cropsRef, {
        ...formData,
        acres: parseFloat(formData.acres),
        date_registered: new Date().toISOString()
      })
      
      setFormData({
        crop_name: '',
        crop_stage: '',
        season: '',
        acres: '',
        last_watered_date: ''
      })
      setShowAddForm(false)
      setError(null)
    } catch (err) {
      setError('Failed to add crop: ' + err.message)
    }
  }

  // Delete crop from Firebase
  const handleDeleteCrop = async (id) => {
    try {
      const cropRef = ref(db, `crops/${id}`)
      await remove(cropRef)
    } catch (err) {
      setError('Failed to delete crop: ' + err.message)
    }
  }

  // Generate schedule by calling backend
  const handleGenerateSchedule = async () => {
    if (crops.length === 0) {
      setError('Please add at least one crop')
      return
    }

    if (!borewells || parseInt(borewells) <= 0) {
      setError('Please enter valid number of borewells')
      return
    }

    setLoading(true)
    setError(null)
    setScheduleResult(null)

    try {
      const payload = {
        borewells: parseInt(borewells),
        crops: crops.map(c => ({
          crop_name: c.crop_name,
          crop_stage: c.crop_stage,
          season: c.season,
          acres: parseFloat(c.acres),
          last_watered_date: c.last_watered_date
        }))
      }

      const response = await fetch('http://localhost:5003/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      setScheduleResult(data)
    } catch (err) {
      setError('Failed to generate schedule. Make sure Flask backend is running on http://localhost:5003')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="water-scheduler-header">
          <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
          <h1>💧 Water Scheduler</h1>
          <p className="page-subtitle">Manage crops and generate optimal watering schedules</p>
        </div>

        <div className="water-scheduler-container">
          {/* Smart Tips Section */}
          <div className="tips-section">
            <h3>🌱 Smart Irrigation Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-icon">🌅</span>
                <p>Morning irrigation (6-10 AM) is most effective</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🌆</span>
                <p>Evening watering (4-6 PM) reduces evaporation</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">💧</span>
                <p>Check soil moisture before irrigation</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🌦️</span>
                <p>Consider weather forecast before scheduling</p>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="settings-section">
            <h2>Settings</h2>
            <div className="setting-item">
              <label>Number of Borewells</label>
              <div className="borewells-control">
                <button 
                  className="control-btn"
                  onClick={() => setBorewells(Math.max(1, parseInt(borewells) - 1).toString())}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={borewells}
                  onChange={(e) => setBorewells(e.target.value)}
                  className="borewell-input"
                />
                <button 
                  className="control-btn"
                  onClick={() => setBorewells((parseInt(borewells) + 1).toString())}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-alert">
              <span>⚠️ {error}</span>
              <button className="close-btn" onClick={() => setError(null)}>✕</button>
            </div>
          )}

          {/* Crops Section */}
          <div className="crops-management">
            <div className="section-header">
              <h2>Registered Crops</h2>
              <button 
                className={`add-crop-btn ${showAddForm ? 'active' : ''}`}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? '✕ Cancel' : '➕ Add Crop'}
              </button>
            </div>

            {/* Add Crop Form */}
            {showAddForm && (
              <div className="add-crop-form">
                <div className="form-group">
                  <label>Crop Name</label>
                  <input
                    type="text"
                    name="crop_name"
                    value={formData.crop_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Paddy, Tomato, Brinjal"
                  />
                </div>

                <div className="form-group">
                  <label>Growth Stage</label>
                  <input
                    type="text"
                    name="crop_stage"
                    value={formData.crop_stage}
                    onChange={handleInputChange}
                    placeholder="e.g., Seedling, Flowering, Fruiting"
                  />
                </div>

                <div className="form-group">
                  <label>Season</label>
                  <input
                    type="text"
                    name="season"
                    value={formData.season}
                    onChange={handleInputChange}
                    placeholder="e.g., Kharif, Rabi, Summer"
                  />
                </div>

                <div className="form-group">
                  <label>Area (Acres)</label>
                  <input
                    type="number"
                    name="acres"
                    value={formData.acres}
                    onChange={handleInputChange}
                    placeholder="e.g., 1.5"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label>Last Watered Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    name="last_watered_date"
                    value={formData.last_watered_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_watered_date: e.target.value }))}
                  />
                </div>

                <button className="submit-btn" onClick={handleAddCrop}>
                  Save Crop
                </button>
              </div>
            )}

            {/* Crops List */}
            {crops.length > 0 ? (
              <div className="crops-list">
                {crops.map((crop, index) => (
                  <div key={crop.id} className="crop-card">
                    <div className="crop-info">
                      <h3>🌾 Crop {index + 1}</h3>
                      <div className="crop-details">
                        <p><strong>Name:</strong> {crop.crop_name}</p>
                        <p><strong>Stage:</strong> {crop.crop_stage}</p>
                        <p><strong>Season:</strong> {crop.season}</p>
                        <p><strong>Area:</strong> {crop.acres} acres</p>
                        <p><strong>Last Watered:</strong> {crop.last_watered_date}</p>
                      </div>
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteCrop(crop.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No crops added yet. Click "Add Crop" to get started.</p>
            )}
          </div>

          {/* Generate Schedule Button */}
          <button 
            className="generate-btn"
            onClick={handleGenerateSchedule}
            disabled={loading || crops.length === 0}
          >
            {loading ? '⏳ Generating...' : '🚀 Generate Watering Schedule'}
          </button>

          {/* Schedule Result */}
          {scheduleResult && (
            <div className="schedule-result">
              <h2>📋 Watering Schedule</h2>
              
              {scheduleResult.message && (
                <div className={`result-message ${scheduleResult.message.includes('successfully') ? 'success' : 'warning'}`}>
                  {scheduleResult.message}
                </div>
              )}

              {scheduleResult.schedule && (
                <div className="schedule-content">
                  <div className="schedule-summary">
                    <div className="summary-card">
                      <span className="label">Total Watering Time</span>
                      <span className="value">{scheduleResult.total_watering_time} mins</span>
                    </div>
                    <div className="summary-card">
                      <span className="label">Borewell Capacity</span>
                      <span className="value">{scheduleResult.borewell_capacity} mins</span>
                    </div>
                  </div>

                  <div className="borewells-schedule">
                    {scheduleResult.schedule.map((bore, idx) => (
                      <div key={idx} className="borewell-card">
                        <h3>🚿 Borewell {bore.borewell}</h3>
                        <p className="total-time">⏱️ Total Time: <strong>{bore.total_time} minutes</strong></p>
                        <div className="crops-in-borewell">
                          {bore.crops.map((crop, cIdx) => (
                            <div key={cIdx} className="crop-entry">
                              <p><strong>{crop.crop_name}</strong></p>
                              <p>Stage: {crop.crop_stage} | Season: {crop.season}</p>
                              <p>Area: {crop.acres} acres | Time: {crop.total_time} mins</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {scheduleResult.removed_crops && (
                <div className="warning-section">
                  <h3>⚠️ Capacity Exceeded</h3>
                  <p>The following crops need to be removed due to borewell capacity:</p>
                  <ul>
                    {scheduleResult.removed_crops.map((crop, idx) => (
                      <li key={idx}>{crop.crop_name} - {crop.total_time} mins</li>
                    ))}
                  </ul>
                  <p>Total time after removal: {scheduleResult.new_total_time} mins</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default WaterScheduler
