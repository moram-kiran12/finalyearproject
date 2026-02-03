import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [farmLocation, setFarmLocation] = useState('Loading...')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    // Get logged-in user from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser')

    if (!loggedInUser) {
      // Redirect to login if not authenticated
      navigate('/login')
      return
    }

    // Parse user data
    setUser(JSON.parse(loggedInUser))

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        // Reverse geocoding (simplified - you can integrate with Google Maps API)
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

    setIsLoading(false)
  }, [navigate])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    navigate('/login')
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

  // Fetch weather data (using Open-Meteo free API - no key needed)
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

  if (isLoading) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="page-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="dashboard-container">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-content">
              <h1>🌾 Welcome, {user.fullName}!</h1>
              <p>Your Farm Management Dashboard</p>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">💧</span>
              <div>
                <p className="stat-label">Water Used</p>
                <p className="stat-value">2,450 L</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🌾</span>
              <div>
                <p className="stat-label">Crops Monitored</p>
                <p className="stat-value">5</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📊</span>
              <div>
                <p className="stat-label">Farm Health</p>
                <p className="stat-value">98%</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🎯</span>
              <div>
                <p className="stat-label">Yield Target</p>
                <p className="stat-value">500 kg</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="dashboard-grid">
            {/* User Credentials */}
            <div className="dashboard-card credentials-card">
              <div className="card-header">
                <h2>👤 Your Credentials</h2>
                <span className="verified-badge">✓ Verified</span>
              </div>

              <div className="credentials-list">
                <div className="credential-item">
                  <span className="credential-label">Full Name</span>
                  <p className="credential-value">{user.fullName}</p>
                </div>

                <div className="credential-item">
                  <span className="credential-label">Username</span>
                  <p className="credential-value">@{user.username}</p>
                </div>

                <div className="credential-item">
                  <span className="credential-label">Email Address</span>
                  <p className="credential-value">{user.email}</p>
                </div>

                <div className="credential-item">
                  <span className="credential-label">Member Since</span>
                  <p className="credential-value">{user.createdAt}</p>
                </div>

                <div className="credential-item">
                  <span className="credential-label">Account ID</span>
                  <p className="credential-value">#{user.id}</p>
                </div>
              </div>

              <button className="edit-btn">✏️ Edit Profile</button>
            </div>

            {/* Quick Access Links */}
            <div className="dashboard-card quick-access-card">
              <h2>⚡ Quick Access</h2>
              <div className="quick-links">
                <Link to="/iot-water-control" className="quick-link">
                  <span>💧</span>
                  <div>
                    <p>Water Control</p>
                    <span>Manage irrigation</span>
                  </div>
                </Link>
                <Link to="/disease-detection" className="quick-link">
                  <span>🦠</span>
                  <div>
                    <p>Disease Detection</p>
                    <span>Check crop health</span>
                  </div>
                </Link>
                <Link to="/crop-recommendation" className="quick-link">
                  <span>🌱</span>
                  <div>
                    <p>Crop Recommendation</p>
                    <span>Smart suggestions</span>
                  </div>
                </Link>
                <Link to="/weather" className="quick-link">
                  <span>🌤️</span>
                  <div>
                    <p>Weather Info</p>
                    <span>Real-time updates</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Farm Details */}
          <div className="dashboard-card farm-details-card">
            <h2>🏞️ Your Farm Details</h2>
            <div className="farm-grid">
              <div className="farm-item">
                <p className="farm-label">📍 Farm Location</p>
                <p className="farm-value">{farmLocation}</p>
              </div>
              <div className="farm-item">
                <p className="farm-label">🌡️ Temperature</p>
                <p className="farm-value">{weather ? `${weather.temp}°C` : 'Loading...'}</p>
              </div>
              <div className="farm-item">
                <p className="farm-label">💧 Humidity</p>
                <p className="farm-value">{weather ? `${weather.humidity}%` : 'Loading...'}</p>
              </div>
              <div className="farm-item">
                <p className="farm-label">💨 Wind Speed</p>
                <p className="farm-value">{weather ? `${weather.windSpeed} km/h` : 'Loading...'}</p>
              </div>
            </div>
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
      <Footer />
    </div>
  )
}

export default Dashboard
