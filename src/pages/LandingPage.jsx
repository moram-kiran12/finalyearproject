import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Weather from '../components/Weather'
import Features from '../components/Features'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import './LandingPage.css'

function LandingPage() {
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      // If no hash, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.hash])

  return (
    <div className="landing-page">
      <Navbar />
      <main className="landing-content">
        <Hero />
        <Weather />
        <Features />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
