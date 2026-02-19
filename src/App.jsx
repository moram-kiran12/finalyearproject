import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { initializeDemoData } from './utils/demoData'
import LandingPage from './pages/LandingPage'
import DiseaseDetection from './pages/DiseaseDetection'
import VoiceAssistance from './pages/VoiceAssistance'
import CropCost from './pages/CropCost'
import WaterScheduler from './pages/WaterScheduler'
import IoTWaterControl from './pages/IoTWaterControl'
import CropRecommendation from './pages/CropRecommendation'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'


function App() {
  // Initialize demo data on app load
  useEffect(() => {
    initializeDemoData()
  }, [])

  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/disease-detection" element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
            <Route path="/voice-assistance" element={<ProtectedRoute><VoiceAssistance /></ProtectedRoute>} />
            <Route path="/crop-cost" element={<ProtectedRoute><CropCost /></ProtectedRoute>} />
            <Route path="/water-scheduler" element={<ProtectedRoute><WaterScheduler /></ProtectedRoute>} />
            <Route path="/iot-water-control" element={<ProtectedRoute><IoTWaterControl /></ProtectedRoute>} />
            <Route path="/crop-recommendation" element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App
