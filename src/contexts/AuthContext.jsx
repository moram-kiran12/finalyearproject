import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser))
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('loggedInUser')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    localStorage.setItem('loggedInUser', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('loggedInUser')
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData }
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
