import React, { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, get, set } from 'firebase/database'
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
          // First check if profile exists in localStorage
          const savedProfile = localStorage.getItem(`userProfile_${firebaseUser.uid}`)
          
          if (savedProfile) {
            // Load from localStorage
            const userData = JSON.parse(savedProfile)
            setUser(userData)
            setIsAuthenticated(true)
          } else {
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
              localStorage.setItem(`userProfile_${firebaseUser.uid}`, JSON.stringify(userWithAuth))
              setIsAuthenticated(true)
            } else {
              // If no profile data, at least set the authenticated user
              const defaultUser = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                fullName: firebaseUser.displayName || '',
                username: '',
                phone: '',
                farmName: '',
                createdAt: new Date().toLocaleDateString()
              }
              setUser(defaultUser)
              localStorage.setItem(`userProfile_${firebaseUser.uid}`, JSON.stringify(defaultUser))
              setIsAuthenticated(true)
            }
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

  const updateUser = async (profileData) => {
    try {
      if (!user || !user.id) {
        throw new Error('User not authenticated')
      }

      // Prepare update data
      const updateData = {
        fullName: profileData.fullName,
        username: profileData.username,
        email: profileData.email,
        phone: profileData.phone,
        farmName: profileData.farmName,
        lastUpdated: new Date().toISOString()
      }

      // Update local state
      const updatedUser = {
        ...user,
        ...updateData
      }
      
      setUser(updatedUser)

      // Save to localStorage
      localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(updatedUser))

      return true
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, updateUser }}
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
