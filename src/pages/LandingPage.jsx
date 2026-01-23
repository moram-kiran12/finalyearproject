import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Weather from '../components/Weather'
import Features from '../components/Features'
import Footer from '../components/Footer'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <main className="landing-content">
        <Hero />
        <Weather />
        <Features />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
