import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './CropCost.css'

function CropCost() {
  const [selectedCrop, setSelectedCrop] = useState('Cotton')
  const [landArea, setLandArea] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [costBreakdown, setCostBreakdown] = useState([])
  const [totalCost, setTotalCost] = useState(0)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [isCustomCrop, setIsCustomCrop] = useState(false)
  const [customCropName, setCustomCropName] = useState('')

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

  // Parse markdown table from backend response
  const parseTableData = (tableData, totalCostRow) => {
    const items = tableData.map((row) => {
      // Find the correct column keys
      const keys = Object.keys(row)
      
      // Find item, description, and cost columns by key name
      let itemName = ''
      let description = ''
      let cost = 0

      keys.forEach((key) => {
        const value = row[key] || ''
        const keyLower = key.toLowerCase()
        
        if (keyLower.includes('item')) {
          itemName = value
        } else if (keyLower.includes('description')) {
          description = value
        } else if (keyLower.includes('cost') || keyLower.includes('inr')) {
          // Extract numeric value from cost string
          const numStr = value.toString().replace(/[^\d.]/g, '')
          cost = parseFloat(numStr) || 0
        }
      })

      console.log('Parsed item:', { itemName, description, cost, rawRow: row })

      return {
        item: itemName.trim(),
        description: description.trim(),
        cost: Math.round(cost)
      }
    })

    return items
  }

  // Fetch cost estimate from backend
  const handleCalculate = async () => {
    if (isCustomCrop && !customCropName.trim()) {
      setError('Please enter a crop name')
      return
    }

    setLoading(true)
    setError(null)
    setHasCalculated(false)

    try {
      const cropToSend = isCustomCrop ? customCropName : selectedCrop
      
      const response = await fetch('http://localhost:5002/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop: cropToSend,
          acres: landArea
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to calculate estimate')
      }

      const data = await response.json()
      console.log('Backend response:', data)

      // Parse table data from backend
      const items = parseTableData(data.table, data.total_cost_row)
      setCostBreakdown(items)

      // Extract total cost
      let total = 0
      if (data.total_cost_row) {
        const keys = Object.keys(data.total_cost_row)
        keys.forEach((key) => {
          const keyLower = key.toLowerCase()
          if (keyLower.includes('cost') || keyLower.includes('inr')) {
            const totalStr = data.total_cost_row[key] || '0'
            const numStr = totalStr.toString().replace(/[^\d.]/g, '')
            total = parseFloat(numStr) || 0
          }
        })
      }
      
      if (total === 0) {
        total = items.reduce((sum, item) => sum + item.cost, 0)
      }
      
      console.log('Extracted total:', total)
      setTotalCost(Math.round(total))
      setHasCalculated(true)
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'Error calculating estimate. Make sure backend is running on http://localhost:5002')
      setCostBreakdown([])
      setTotalCost(0)
    } finally {
      setLoading(false)
    }
  }

  const handleLandAreaChange = (value) => {
    if (value > 0) {
      setLandArea(value)
    }
  }

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

          {/* Common Crops Section */}
          <div className="crops-section">
            <h2 className="section-title">Common Crops</h2>
            <div className="crops-grid">
              {crops.map((crop) => (
                <button
                  key={crop.name}
                  className={`crop-card ${selectedCrop === crop.name && !isCustomCrop ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCrop(crop.name)
                    setIsCustomCrop(false)
                  }}
                >
                  <div className="crop-icon">{crop.icon}</div>
                  <div className="crop-name">{crop.name}</div>
                </button>
              ))}
              {/* Custom Crop Button */}
              <button
                className={`crop-card custom-crop-card ${isCustomCrop ? 'selected' : ''}`}
                onClick={() => setIsCustomCrop(true)}
              >
                <div className="crop-icon">➕</div>
                <div className="crop-name">Custom</div>
              </button>
            </div>
          </div>

          {/* Custom Crop Input */}
          {isCustomCrop && (
            <div className="custom-crop-input-section">
              <label className="custom-label">Enter Crop Name</label>
              <input
                type="text"
                className="custom-crop-input"
                placeholder="e.g., Sugarcane, Spinach, Garlic, Turmeric..."
                value={customCropName}
                onChange={(e) => setCustomCropName(e.target.value)}
              />
            </div>
          )}

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
          <button 
            className="calculate-btn"
            onClick={handleCalculate}
            disabled={loading}
          >
            {loading ? '⏳ Calculating...' : '🧮 Calculate Estimate'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Estimated Costs Table */}
          {hasCalculated && costBreakdown.length > 0 && (
            <div className="costs-section">
              <h2 className="section-title">📊 Estimated Costs for {selectedCrop} ({landArea} acres)</h2>
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
                      <td colSpan="2" className="total-label"><strong>Total Cost</strong></td>
                      <td className="total-cost"><strong>₹{totalCost.toLocaleString()}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="cost-summary">
                <div className="summary-card">
                  <div className="summary-label">Per Acre Cost</div>
                  <div className="summary-value">₹{(totalCost / landArea).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Total Investment</div>
                  <div className="summary-value">₹{totalCost.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CropCost
