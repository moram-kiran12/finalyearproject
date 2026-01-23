import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DiseaseDetection from './pages/DiseaseDetection'
import CropCost from './pages/CropCost'
import WaterScheduler from './pages/WaterScheduler'
import IoTWaterControl from './pages/IoTWaterControl'
import CropRecommendation from './pages/CropRecommendation'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/crop-cost" element={<CropCost />} />
        <Route path="/water-scheduler" element={<WaterScheduler />} />
        <Route path="/iot-water-control" element={<IoTWaterControl />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
      </Routes>
    </Router>
  )
}

export default App
