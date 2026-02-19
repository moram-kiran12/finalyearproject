import React, { useState, useEffect } from 'react'
import './Weather.css'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../utils/translations'

function Weather() {
  const { currentLanguage } = useLanguage()
  const t = translations[currentLanguage]
  
  const [weather, setWeather] = useState({
    temp: 28,
    humidity: 65,
    windSpeed: 12,
    rainfall: 2.5,
    location: 'Loading...'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeatherData(latitude, longitude)
          fetchLocationName(latitude, longitude)
        },
        (error) => {
          console.log('Location error:', error)
          setLoading(false)
        }
      )
    } else {
      setLoading(false)
    }
  }, [])

  const fetchWeatherData = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation`
      )
      const data = await response.json()
      const current = data.current
      setWeather((prev) => ({
        ...prev,
        temp: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        rainfall: current.precipitation || 0
      }))
      setLoading(false)
    } catch (error) {
      console.log('Weather fetch error:', error)
      setLoading(false)
    }
  }

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      const address = data.address?.city || data.address?.town || data.address?.county || 'Current Location'
      setWeather((prev) => ({
        ...prev,
        location: address
      }))
    } catch (error) {
      console.log('Location fetch error:', error)
    }
  }
  return (
    <section className="weather-section">
      <div className="weather-header">
        <h2 className="section-title">⛅ {t.weatherTitle}</h2>
        <h3 className="location-name">📍 {weather.location}</h3>
      </div>
      {loading ? (
        <div className="loading-weather">{t.loadingWeather}</div>
      ) : (
        <div className="weather-container">
          <div className="weather-card">
            <div className="weather-icon">🌡️</div>
            <div className="weather-info">
              <h3>{t.temperature}</h3>
              <p className="weather-value">{weather.temp}°C</p>
              <p className="weather-detail">{weather.temp > 30 ? t.hot : weather.temp > 20 ? t.moderate : t.cool}</p>
            </div>
          </div>

          <div className="weather-card">
            <div className="weather-icon">💧</div>
            <div className="weather-info">
              <h3>{t.humidity}</h3>
              <p className="weather-value">{weather.humidity}%</p>
              <p className="weather-detail">{weather.humidity > 70 ? t.high : weather.humidity > 50 ? t.comfortable : t.low}</p>
            </div>
          </div>

          <div className="weather-card">
            <div className="weather-icon">💨</div>
            <div className="weather-info">
              <h3>{t.windSpeed}</h3>
              <p className="weather-value">{weather.windSpeed} km/h</p>
              <p className="weather-detail">{weather.windSpeed > 20 ? t.strongWind : weather.windSpeed > 10 ? t.lightBreeze : t.calm}</p>
            </div>
          </div>

          <div className="weather-card">
            <div className="weather-icon">☔</div>
            <div className="weather-info">
              <h3>{t.rainfall}</h3>
              <p className="weather-value">{weather.rainfall} mm</p>
              <p className="weather-detail">{weather.rainfall > 2 ? t.rainExpected : t.noRain}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Weather
