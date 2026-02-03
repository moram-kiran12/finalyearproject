import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🌾 AgroTech</h3>
            <p>Empowering farmers with modern agricultural technology</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="/">Home</a></li>
              <li><a href="#footer">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li><a href="/disease-detection">Disease Diagnosis</a></li>
              <li><a href="/crop-cost">Crop Cost</a></li>
              <li><a href="/water-scheduler">Water Scheduler</a></li>
              <li><a href="/iot-water-control">Water Control</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>&copy; 2024 AgroTech. All rights reserved.</p>
          <p>Built with 💚 for modern farmers</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
