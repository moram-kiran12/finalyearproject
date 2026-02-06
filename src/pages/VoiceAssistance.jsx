import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './VoiceAssistance.css'

function VoiceAssistance() {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I am your farming assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setInputText('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/voice-assistance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputText })
      })

      const data = await response.json()

      const botMessage = {
        id: messages.length + 2,
        text: data.response || 'Sorry, I could not process that request.',
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])

      if (data.response) {
        speakText(data.response)
      }
    } catch (err) {
      const errorMessage = {
        id: messages.length + 2,
        text: 'Error connecting to backend. Make sure the server is running.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text)
    speech.rate = 1
    speech.pitch = 1
    window.speechSynthesis.speak(speech)
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser')
      return
    }

    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setInputText(transcript)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="voice-header">
          <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
          <h1>🎤 Voice Assistance</h1>
          <p className="page-subtitle">Get real-time voice guidance for your farming questions</p>
        </div>

        <div className="voice-container">
          <div className="chat-box">
            <div className="messages-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sender}`}
                >
                  <div className="message-bubble">
                    <p>{message.text}</p>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message bot">
                  <div className="message-bubble typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>

            <div className="input-section">
              <div className="input-group">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask your farming question..."
                  className="message-input"
                  disabled={loading}
                />
                <button
                  onClick={handleVoiceInput}
                  disabled={loading}
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  title="Click to speak"
                >
                  🎤
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !inputText.trim()}
                  className="send-btn"
                >
                  {loading ? '⏳' : '📤'}
                </button>
              </div>
              <p className="input-hint">💡 Tip: Ask about crop diseases, irrigation, pesticides, weather, or anything farming-related!</p>
            </div>
          </div>

          <div className="info-panel">
            <h3>Quick Tips</h3>
            <div className="tips-list">
              <div className="tip">
                <span className="tip-icon">💧</span>
                <div className="tip-content">
                  <h4>Watering Tips</h4>
                  <p>Ask about optimal irrigation schedules</p>
                </div>
              </div>
              <div className="tip">
                <span className="tip-icon">🌾</span>
                <div className="tip-content">
                  <h4>Crop Care</h4>
                  <p>Get guidance on crop diseases and treatment</p>
                </div>
              </div>
              <div className="tip">
                <span className="tip-icon">☀️</span>
                <div className="tip-content">
                  <h4>Weather Info</h4>
                  <p>Ask about weather forecasts and impacts</p>
                </div>
              </div>
              <div className="tip">
                <span className="tip-icon">🌱</span>
                <div className="tip-content">
                  <h4>Soil Health</h4>
                  <p>Learn about soil management and nutrients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default VoiceAssistance
