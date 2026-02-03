import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/voice-assistance" element={<VoiceAssistance />} />
        <Route path="/crop-cost" element={<CropCost />} />
        <Route path="/water-scheduler" element={<WaterScheduler />} />
        <Route path="/iot-water-control" element={<IoTWaterControl />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
