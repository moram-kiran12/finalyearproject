import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageTemplate.css'
import './IoTWaterControl.css'

function IoTWaterControl() {
  const [motorStatus, setMotorStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Turn Motor ON
  const turnMotorOn = async () => {
    setIsLoading(true)
    try {
      // API call simulation - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500))
      setMotorStatus(true)
      console.log('Motor turned ON')
    } catch (error) {
      console.error('Error turning motor on:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Turn Motor OFF
  const turnMotorOff = async () => {
    setIsLoading(true)
    try {
      // API call simulation - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500))
      setMotorStatus(false)
      console.log('Motor turned OFF')
    } catch (error) {
      console.error('Error turning motor off:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle Motor ON/OFF
  const toggleMotor = () => {
    motorStatus ? turnMotorOff() : turnMotorOn()
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <Link to="/" className="back-btn">← Back Home</Link>
          <h1>🌐 IoT Water Control</h1>
          <p className="page-subtitle">Automated water management using smart IoT sensors</p>
        </div>
        
        <div className="feature-intro">
          <div className="feature-box">
            <h2>🚜 Irrigation Control Panel</h2>
            <p className="control-description">
              Manage your farm's water pump efficiently with a single touch. Control the irrigation system to water your fields on demand.
            </p>
            
            {/* Circular Power Button */}
            <div className="power-button-container">
              <button
                className={`power-button ${motorStatus ? 'on' : 'off'}`}
                onClick={toggleMotor}
                disabled={isLoading}
                title={motorStatus ? 'Click to turn irrigation OFF' : 'Click to turn irrigation ON'}
              >
                <span className="power-icon">⏻</span>
              </button>
            </div>

            {/* Status Text */}
            <p className="status-text-info">
              Irrigation is <strong>{motorStatus ? 'ON' : 'OFF'}</strong>
            </p>

            {/* Aesthetic Info Section */}
            <div className="info-section">
              <div className="info-card">
                <span className="info-icon">💧</span>
                <p><strong>Water Supply:</strong> {motorStatus ? 'Actively pumping water to your fields' : 'Water pump is idle'}</p>
              </div>

              <div className="info-card">
                <span className="info-icon">⚡</span>
                <p><strong>Status:</strong> {motorStatus ? 'Irrigation system is running smoothly' : 'Ready to start irrigation when needed'}</p>
              </div>

              <div className="info-card">
                <span className="info-icon">🌾</span>
                <p><strong>Tip:</strong> {motorStatus ? 'Monitor your water usage to avoid wastage' : 'Start irrigation during cooler hours for better results'}</p>
              </div>
            </div>

            <div className="footer-info">
              <p>📌 <strong>Remember:</strong> Turn off the pump when irrigation is complete to save energy and water resources.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default IoTWaterControl
