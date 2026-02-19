import React, { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, get } from 'firebase/database'
import { auth, database } from '../config/firebase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Listen to Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from Realtime Database
          const userRef = ref(database, `users/${firebaseUser.uid}`)
          const snapshot = await get(userRef)
          
          if (snapshot.exists()) {
            const userData = snapshot.val()
            const userWithAuth = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData
            }
            setUser(userWithAuth)
            setIsAuthenticated(true)
          } else {
            // If no profile data, at least set the authenticated user
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: firebaseUser.displayName || '',
              username: '',
              phone: '',
              createdAt: new Date().toLocaleDateString()
            })
            setIsAuthenticated(true)
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setUser(null)
          setIsAuthenticated(false)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
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
