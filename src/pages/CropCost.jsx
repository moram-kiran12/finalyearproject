import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './CropCost.css'

function CropCost() {
  const [selectedCrop, setSelectedCrop] = useState('Cotton')
  const [landArea, setLandArea] = useState(2)
  const [language, setLanguage] = useState('en')

  const crops = [
    { name: 'Rice', emoji: '🌾', icon: '🍚' },
    { name: 'Wheat', emoji: '🌾', icon: '🌾' },
    { name: 'Banana', emoji: '🍌', icon: '🍌' },
    { name: 'Brinjal', emoji: '🍆', icon: '🍆' },
    { name: 'Cotton', emoji: '🌾', icon: '🌾', selected: true },
    { name: 'Corn', emoji: '🌽', icon: '🌽' },
    { name: 'Sugarcane', emoji: '🍃', icon: '🍃' },
    { name: 'Tomato', emoji: '🍅', icon: '🍅' },
    { name: 'Chilli', emoji: '🌶️', icon: '🌶️' },
  ]

  const costBreakdown = [
    { item: 'Land Preparation', description: 'Ploughing, levelling, etc.', cost: 10000 },
    { item: 'Seeds', description: 'High yielding cotton seeds', cost: 5000 },
    { item: 'Fertilizers', description: 'Urea, DAP, Potash, etc.', cost: 15000 },
    { item: 'Pesticides', description: 'Insecticides, fungicides', cost: 8000 },
    { item: 'Irrigation', description: 'Water charges, pumping, etc.', cost: 12000 },
    { item: 'Weeding', description: 'Manual or mechanical weeding', cost: 6000 },
    { item: 'Harvesting', description: 'Manual labor costs', cost: 15000 },
    { item: 'Ginning & Pressing', description: 'Processing of cotton', cost: 10000 },
    { item: 'Transportation', description: 'To market/processing unit', cost: 4000 },
    { item: 'Labour (general)', description: 'Planting, spraying, etc.', cost: 10000 },
    { item: 'Equipment Rental', description: 'Tractor, sprayer, etc.', cost: 5000 },
    { item: 'Insurance', description: 'Crop insurance', cost: 2000 },
    { item: 'Miscellaneous', description: 'Contingencies, small costs', cost: 3000 },
  ]

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.cost, 0)

  const handleLandAreaChange = (value) => {
    if (value > 0) {
      setLandArea(value)
    }
  }

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  ]

  return (
    <div className="page-container">
      <Navbar />
      <main className="crop-cost-main">
        <div className="back-nav">
          <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
        </div>

        <div className="cost-estimator-container">
          <div className="cost-header">
            <h1 className="cost-title">Crop Cost Estimator</h1>
            <p className="cost-subtitle">Plan your farming budget wisely</p>
          </div>

          {/* Language Selector */}
          <div className="language-selector">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`lang-btn ${language === lang.code ? 'active' : ''}`}
                onClick={() => setLanguage(lang.code)}
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>

          {/* Common Crops Section */}
          <div className="crops-section">
            <h2 className="section-title">Common Crops</h2>
            <div className="crops-grid">
              {crops.map((crop) => (
                <button
                  key={crop.name}
                  className={`crop-card ${selectedCrop === crop.name ? 'selected' : ''}`}
                  onClick={() => setSelectedCrop(crop.name)}
                >
                  <div className="crop-icon">{crop.icon}</div>
                  <div className="crop-name">{crop.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Land Area Section */}
          <div className="land-area-section">
            <h3 className="land-title">Land Area (Acres)</h3>
            <div className="land-area-control">
              <button className="area-btn minus" onClick={() => handleLandAreaChange(landArea - 1)}>−</button>
              <input
                type="number"
                className="area-input"
                value={landArea}
                onChange={(e) => handleLandAreaChange(parseFloat(e.target.value) || 1)}
                min="1"
              />
              <button className="area-btn plus" onClick={() => handleLandAreaChange(landArea + 1)}>+</button>
            </div>
            <div className="land-display">{landArea}</div>
          </div>

          {/* Calculate Button */}
          <button className="calculate-btn">Calculate Estimate</button>

          {/* Estimated Costs Table */}
          <div className="costs-section">
            <h2 className="section-title">Estimated Costs</h2>
            <div className="costs-table-wrapper">
              <table className="costs-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Estimated Cost (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {costBreakdown.map((item, idx) => (
                    <tr key={idx}>
                      <td className="item-name">{item.item}</td>
                      <td className="item-description">{item.description}</td>
                      <td className="item-cost">₹{item.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan="2" className="total-label"><strong>**Total Cost**</strong></td>
                    <td className="total-cost"><strong>₹{totalCost.toLocaleString()}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CropCost
