import React from 'react'
import './Weather.css'

function Weather() {
  return (
    <section className="weather-section">
      <h2 className="section-title">Current Weather</h2>
      <div className="weather-container">
        <div className="weather-card">
          <div className="weather-icon">🌡️</div>
          <div className="weather-info">
            <h3>Temperature</h3>
            <p className="weather-value">28°C</p>
            <p className="weather-detail">Moderate</p>
          </div>
        </div>

        <div className="weather-card">
          <div className="weather-icon">💧</div>
          <div className="weather-info">
            <h3>Humidity</h3>
            <p className="weather-value">65%</p>
            <p className="weather-detail">Comfortable</p>
          </div>
        </div>

        <div className="weather-card">
          <div className="weather-icon">💨</div>
          <div className="weather-info">
            <h3>Wind Speed</h3>
            <p className="weather-value">12 km/h</p>
            <p className="weather-detail">Light Breeze</p>
          </div>
        </div>

        <div className="weather-card">
          <div className="weather-icon">☔</div>
          <div className="weather-info">
            <h3>Rainfall</h3>
            <p className="weather-value">2.5 mm</p>
            <p className="weather-detail">No Rain Expected</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Weather
