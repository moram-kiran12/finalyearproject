import React from 'react'
import './Contact.css'

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-card">
        <h3 className="contact-title">Contact Us</h3>
        
        <div className="contact-details">
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <a href="mailto:agrotech@gmail.com" className="contact-link">
              Email: agrotech@gmail.com
            </a>
          </div>

          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <a href="tel:+917798809956" className="contact-link">
              Phone: +91 7798809956
            </a>
          </div>

          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <a href="https://www.google.com/maps?q=Bangalore,India" target="_blank" rel="noopener noreferrer" className="contact-link">
              Location: Bangalore, India
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
