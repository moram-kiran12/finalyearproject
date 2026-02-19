import React, { useState, useRef, useEffect } from 'react'
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
  const [isRecording, setIsRecording] = useState(false)
  const [recordingBlob, setRecordingBlob] = useState(null)
  const [recordingUrl, setRecordingUrl] = useState('')
  const [recordingError, setRecordingError] = useState('')
  const [isPlayingResponse, setIsPlayingResponse] = useState(false)
  const [hasResponseAudio, setHasResponseAudio] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const responseAudioRef = useRef(null)

  const API_BASE_URL = 'http://localhost:5001'

  // Start recording
  const startRecording = async () => {
    try {
      setRecordingError('')
      clearRecording()

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecordingBlob(blob)
        const url = URL.createObjectURL(blob)
        setRecordingUrl(url)

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Recording error:', error)
      if (error.name === 'NotAllowedError') {
        setRecordingError('Microphone permission denied. Please allow access.')
      } else if (error.name === 'NotFoundError') {
        setRecordingError('No microphone found. Please connect a microphone.')
      } else {
        setRecordingError('Failed to start recording. Please try again.')
      }
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Clear recording
  const clearRecording = () => {
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl)
    }
    setRecordingUrl('')
    setRecordingBlob(null)
    setRecordingError('')
  }

  // Send text message
  const sendTextMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const textToSend = inputText
    setInputText('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/process_text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToSend })
      })

      const data = await response.json()

      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response || 'Sorry, I could not process your request.',
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])

        // Auto-play response audio
        if (data.audio) {
          playResponseAudio(`${API_BASE_URL}${data.audio}`)
        }
      } else {
        throw new Error(data.error || 'Failed to process text')
      }
    } catch (error) {
      console.error('Text send error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Failed to send message. Please check your connection.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // Send audio recording
  const sendAudioMessage = async () => {
    if (!recordingBlob) return

    setLoading(true)

    const userMessage = {
      id: Date.now(),
      text: '🎤 Voice message',
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const formData = new FormData()
      formData.append('audio', recordingBlob, 'recording.webm')

      const response = await fetch(`${API_BASE_URL}/process_audio`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        // Show recognized text
        if (data.recognized) {
          const recognizedMessage = {
            id: Date.now() + 1,
            text: `Recognized: "${data.recognized}"`,
            sender: 'user',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, recognizedMessage])
        }

        // Show bot response
        const botMessage = {
          id: Date.now() + 2,
          text: data.response || 'Sorry, I could not process your audio.',
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])

        // Auto-play response audio
        if (data.audio) {
          playResponseAudio(`${API_BASE_URL}${data.audio}`)
        }

        clearRecording()
      } else {
        throw new Error(data.error || 'Failed to process audio')
      }
    } catch (error) {
      console.error('Audio send error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Failed to send audio. Please check your connection.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // Play response audio
  const playResponseAudio = (audioUrl) => {
    if (responseAudioRef.current) {
      responseAudioRef.current.src = audioUrl
      setHasResponseAudio(true)
      responseAudioRef.current.play()
        .then(() => setIsPlayingResponse(true))
        .catch(console.error)
    }
  }

  // Pause response audio
  const pauseResponseAudio = () => {
    if (responseAudioRef.current) {
      responseAudioRef.current.pause()
      setIsPlayingResponse(false)
    }
  }

  // Resume response audio
  const resumeResponseAudio = () => {
    if (responseAudioRef.current) {
      responseAudioRef.current.play()
        .then(() => setIsPlayingResponse(true))
        .catch(console.error)
    }
  }

  // Stop response audio
  const stopResponseAudio = () => {
    if (responseAudioRef.current) {
      responseAudioRef.current.pause()
      responseAudioRef.current.currentTime = 0
      setIsPlayingResponse(false)
    }
  }

  // Handle audio ended
  const handleAudioEnded = () => {
    setIsPlayingResponse(false)
  }

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendTextMessage()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl)
      }
    }
  }, [])

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
          <div className="chat-section">
            {/* Chat Messages */}
            <div className="messages-container">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.sender}`}>
                  <div className="message-bubble">
                    <p>{message.text}</p>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="message bot">
                  <div className="message-bubble typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
            </div>

            {/* Text Input Section */}
            <div className="input-section">
              <div className="text-input-area">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your farming question here..."
                  className="text-input"
                  rows="2"
                  disabled={loading}
                />
                <button
                  onClick={sendTextMessage}
                  disabled={!inputText.trim() || loading}
                  className="send-text-btn"
                  title="Send message"
                >
                  📤
                </button>
              </div>
            </div>
          </div>

          {/* Voice Recording Section */}
          <div className="voice-section">
            <h3>🎙️ Voice Recording</h3>
            
            <div className="recording-controls">
              <button
                onClick={startRecording}
                disabled={isRecording || loading}
                className="record-btn start"
                title="Start recording"
              >
                {isRecording ? 'Recording...' : 'Start Recording'}
              </button>
              
              <button
                onClick={stopRecording}
                disabled={!isRecording || loading}
                className="record-btn stop"
                title="Stop recording"
              >
                Stop
              </button>
              
              <button
                onClick={clearRecording}
                disabled={!recordingUrl || loading}
                className="record-btn clear"
                title="Clear recording"
              >
                Clear
              </button>
            </div>

            {recordingError && (
              <div className="error-message">{recordingError}</div>
            )}

            {recordingUrl && (
              <div className="recording-review">
                <h4>Review Your Recording:</h4>
                <audio controls src={recordingUrl} className="review-audio" />
                <button
                  onClick={sendAudioMessage}
                  disabled={loading}
                  className="send-audio-btn"
                >
                  {loading ? 'Sending...' : 'Send Voice Message'}
                </button>
              </div>
            )}

            {/* Response Audio Controls */}
            {hasResponseAudio && (
              <div className="response-audio-controls">
                <h4>🔊 Bot Response Audio:</h4>
                <div className="audio-control-buttons">
                  {isPlayingResponse ? (
                    <button
                      onClick={pauseResponseAudio}
                      className="audio-control-btn pause"
                      title="Pause"
                    >
                      ⏸️ Pause
                    </button>
                  ) : (
                    <button
                      onClick={resumeResponseAudio}
                      className="audio-control-btn play"
                      title="Play"
                    >
                      ▶️ Play
                    </button>
                  )}
                  <button
                    onClick={stopResponseAudio}
                    className="audio-control-btn stop"
                    title="Stop"
                  >
                    ⏹️ Stop
                  </button>
                </div>
              </div>
            )}

            {/* Audio element for auto-playing responses */}
            <audio 
              ref={responseAudioRef} 
              controls={hasResponseAudio}
              onEnded={handleAudioEnded}
              className={hasResponseAudio ? "response-audio-player" : ""}
              style={{display: hasResponseAudio ? 'block' : 'none'}}
            />

            {/* Tips */}
            <div className="tips-section">
              <h4>💡 Voice Tips:</h4>
              <ul>
                <li>Speak clearly and close to your microphone</li>
                <li>Ask about crops, pests, weather, or market prices</li>
                <li>You can speak in English, Hindi, Telugu, Tamil, or Kannada</li>
                <li>Review your recording before sending</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default VoiceAssistance
