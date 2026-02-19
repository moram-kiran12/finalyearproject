import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../utils/translations'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const { currentLanguage } = useLanguage()
  const t = translations[currentLanguage]
  const [farmLocation, setFarmLocation] = useState('Loading...')
  const [weather, setWeather] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    farmName: ''
  })

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        fetchLocationName(latitude, longitude)
        fetchWeatherData(latitude, longitude)
      }, (error) => {
        console.log('Location access denied, using default')
        setFarmLocation('Current Location')
        setWeather({ temp: 28, humidity: 65, windSpeed: 12, rainfall: 2.5 })
      })
    } else {
      setFarmLocation('Location Unavailable')
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Open edit profile modal
  const handleEditClick = () => {
    setEditFormData({
      fullName: user.fullName || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      farmName: user.farmName || ''
    })
    setIsEditMode(true)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle save profile
  const handleSaveProfile = () => {
    if (!editFormData.fullName.trim() || !editFormData.email.trim()) {
      alert('Please fill in required fields (Name and Email)')
      return
    }
    updateUser(editFormData)
    setIsEditMode(false)
    alert('Profile updated successfully!')
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditFormData({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      farmName: ''
    })
  }

  // Fetch location name from coordinates
  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      const address = data.address?.city || data.address?.town || data.address?.county || 'Your Location'
      setFarmLocation(address)
    } catch (error) {
      console.log('Geocoding error:', error)
      setFarmLocation('Your Location')
    }
  }

  // Fetch weather data
  const fetchWeatherData = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation`
      )
      const data = await response.json()
      const current = data.current
      setWeather({
        temp: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        rainfall: current.precipitation || 0
      })
    } catch (error) {
      console.log('Weather fetch error:', error)
      setWeather({ temp: 28, humidity: 65, windSpeed: 12, rainfall: 2.5 })
    }
  }

  // All modules data
  const modules = [
    {
      id: 1,
      name: t.diseaseDetectionModule,
      icon: '🦠',
      description: t.diseaseDetectionDesc,
      color: '#ef4444',
      path: '/disease-detection',
      features: [t.plantLeafAnalysis, t.diseaseIdentification, t.treatmentSuggestions]
    },
   
    {
      id: 2,
      name: t.waterSchedulerModule,
      icon: '💧',
      description: t.waterSchedulerDesc,
      color: '#3b82f6',
      path: '/water-scheduler',
      features: [t.autoScheduling, t.waterSaving, t.weatherIntegration]
    },
    {
      id: 3,
      name: t.iotWaterControlModule,
      icon: '🚰',
      description: t.iotWaterControlDesc,
      color: '#06b6d4',
      path: '/iot-water-control',
      features: [t.realtimeControl, t.flowMonitoring, t.alertSystem]
    },
    {
      id: 4,
      name: t.cropCostModule,
      icon: '💰',
      description: t.cropCostDesc,
      color: '#f59e0b',
      path: '/crop-cost',
      features: [t.expenseTracking, t.profitAnalysis, t.budgetPlanning]
    },
    {
      id: 5,
      name: t.voiceAssistanceModule,
      icon: '🎤',
      description: t.voiceAssistanceDesc,
      color: '#8b5cf6',
      path: '/voice-assistance',
      features: [t.voiceCommands, t.quickActions, t.informationAccess]
    },
    {
      id: 6,
      name: t.cropRecommendationModule,
      icon: '🌱',
      description: t.cropRecommendationDesc,
      color: '#00897b',
      path: '/crop-recommendation',
      features: [t.soilAnalysis, t.climateMatching, t.bestCropSuggestions]
    }
  ]

  if (!user) {
    return null
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="dashboard-container">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-content">
              <h1>🌾 Welcome, {user.fullName}!</h1>
              <p>Your Smart Agriculture Dashboard</p>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>

          {/* Aesthetic Banner */}
          <div className="aesthetic-banner">
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=200&fit=crop" 
              alt="Agriculture Landscape" 
              className="banner-image"
            />
            <div className="banner-overlay">
              <div className="banner-content">
                <h2 className="banner-title">🌱 Smart Farming for Better Future</h2>
                <p className="banner-subtitle">Sustainable Agriculture • AI-Powered Insights • Better Yields</p>
              </div>
            </div>
          </div>

          {/* User Profile & Farm Info Grid */}
          <div className="dashboard-grid">
            {/* User Profile Card */}
            <div className="dashboard-card profile-card">
              <div className="card-header">
                <h2>👤 Your Profile</h2>
                <span className="verified-badge">✓ Verified</span>
              </div>

              <div className="profile-content">
                <div className="profile-avatar">{user.fullName.charAt(0)}</div>
                <div className="profile-info">
                  <h3>{user.fullName}</h3>
                  <p>@{user.username}</p>
                  <p className="profile-email">{user.email}</p>
                  {user.phone && <p className="profile-phone">📱 {user.phone}</p>}
                  <p className="profile-member">Member since {user.createdAt}</p>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-item">
                  <span>Account ID</span>
                  <strong>#{user.id}</strong>
                </div>
                <div className="detail-item">
                  <span>Status</span>
                  <strong className="status-active">Active</strong>
                </div>
              </div>

              <button onClick={handleEditClick} className="edit-btn">✏️ Edit Profile</button>
            </div>

            {/* Farm Info Card */}
            <div className="dashboard-card farm-info-card">
              <h2>🏞️ Farm Information</h2>
              <div className="farm-details-grid">
                <div className="farm-info-item">
                  <p className="farm-info-label">📍 Location</p>
                  <p className="farm-info-value">{farmLocation}</p>
                </div>
                <div className="farm-info-item">
                  <p className="farm-info-label">🌡️ Temperature</p>
                  <p className="farm-info-value">{weather ? `${weather.temp}°C` : 'Loading...'}</p>
                </div>
                <div className="farm-info-item">
                  <p className="farm-info-label">💧 Humidity</p>
                  <p className="farm-info-value">{weather ? `${weather.humidity}%` : 'Loading...'}</p>
                </div>
                <div className="farm-info-item">
                  <p className="farm-info-label">💨 Wind Speed</p>
                  <p className="farm-info-value">{weather ? `${weather.windSpeed} km/h` : 'Loading...'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Title */}
          <div className="features-section">
            <h2>⚡ All Features & Modules</h2>
            <p>Access all your agricultural tools and management systems</p>
          </div>

          {/* Modules Grid */}
          <div className="modules-grid">
            {modules.map((module, index) => (
              <Link 
                key={module.id} 
                to={module.path} 
                className="module-card" 
                style={{ '--card-color': module.color, '--card-index': index }}
              >
                <div className="module-header">
                  <span className="module-icon">{module.icon}</span>
                  <h3>{module.name}</h3>
                </div>
                <p className="module-description">{module.description}</p>
                <div className="module-features">
                  {module.features.map((feature, idx) => (
                    <span key={idx} className="feature-tag">✓ {feature}</span>
                  ))}
                </div>
                <div className="module-arrow">→</div>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card activity-card">
            <h2>📋 Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">✓</span>
                <div>
                  <p className="activity-title">Water pump started</p>
                  <p className="activity-time">Today at 06:30 AM</p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">📊</span>
                <div>
                  <p className="activity-title">Crop health report generated</p>
                  <p className="activity-time">Today at 02:15 PM</p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">🔔</span>
                <div>
                  <p className="activity-title">Disease alert: Leaf spot detected</p>
                  <p className="activity-time">Yesterday at 04:45 PM</p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">⚙️</span>
                <div>
                  <p className="activity-title">Settings updated</p>
                  <p className="activity-time">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditMode && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Your Profile</h2>
              <button className="modal-close" onClick={handleCancelEdit}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={editFormData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editFormData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your 10-digit phone number"
                  className="form-input"
                  maxLength="10"
                  pattern="[0-9]*"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                  }}
                />
              </div>

              <div className="form-group">
                <label>Farm Name</label>
                <input
                  type="text"
                  name="farmName"
                  value={editFormData.farmName}
                  onChange={handleInputChange}
                  placeholder="Enter your farm name"
                  className="form-input"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleCancelEdit} className="btn-cancel">Cancel</button>
              <button onClick={handleSaveProfile} className="btn-save">Save Profile</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Dashboard
