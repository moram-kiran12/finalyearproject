import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './DiseaseDetection.css'

function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setError(null)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze image')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Error analyzing image. Make sure backend is running on http://localhost:5000')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="disease-header">
          <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
          <h1>🔍 Disease Diagnosis & Voice Assistance</h1>
          <p className="page-subtitle">Identify crop diseases with AI-powered analysis</p>
        </div>

        <div className="disease-container">
          <div className="upload-section">
            <h2>Upload Crop Image</h2>
            <div className="upload-area">
              <label htmlFor="image-input" className="upload-label">
                <div className="upload-icon">📸</div>
                <p>Click to select image or drag and drop</p>
                <span className="upload-hint">Supported: JPG, PNG, WebP</span>
              </label>
              <input 
                id="image-input"
                type="file" 
                accept="image/*" 
                onChange={handleImageSelect}
                className="image-input"
              />
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️ {error}</span>
              </div>
            )}

            {imagePreview && (
              <div className="preview-section">
                <h3>Image Preview</h3>
                <img src={imagePreview} alt="Selected" className="preview-image" />
                <div className="button-group">
                  <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="analyze-btn"
                  >
                    {loading ? 'Analyzing...' : '🚀 Analyze Image'}
                  </button>
                  <button 
                    onClick={handleClear}
                    className="clear-btn"
                  >
                    ✕ Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {result && (
            <div className="result-section">
              <h2>Analysis Results</h2>
              <div className="result-card">
                <div className="result-header">
                  <h3>🌾 {result.predicted_class || 'Disease Detected'}</h3>
                  <span className={`confidence ${result.confidence > 70 ? 'high' : result.confidence > 50 ? 'medium' : 'low'}`}>
                    {result.confidence ? `${result.confidence}% Confidence` : 'Analyzing...'}
                  </span>
                </div>
                
                {result.medication && (
                  <div className="result-detail medication-advice">
                    <h4>💊 Medication & Treatment Advice</h4>
                    <div className="medication-text">
                      {result.medication.split('\n').map((line, index) => (
                        <p key={index} className={line.trim() === '' ? 'empty-line' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {result.error && (
                  <div className="error-detail">
                    <p>⚠️ {result.error}</p>
                  </div>
                )}

                <button 
                  onClick={handleClear}
                  className="analyze-btn new-analysis"
                >
                  🔄 Analyze Another Image
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DiseaseDetection
