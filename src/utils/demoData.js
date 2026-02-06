// This file initializes demo data in localStorage for development/testing

export const initializeDemoData = () => {
  const existingUsers = localStorage.getItem('users')
  
  // Only initialize if no users exist
  if (!existingUsers) {
    const demoUsers = [
      {
        id: 1,
        fullName: 'Demo Farmer',
        username: 'demo',
        email: 'demo@agrotech.com',
        password: 'demo123',
        createdAt: new Date().toLocaleDateString()
      },
      {
        id: 2,
        fullName: 'John Farmer',
        username: 'john_farm',
        email: 'john@agrotech.com',
        password: 'password123',
        createdAt: new Date().toLocaleDateString()
      }
    ]
    
    localStorage.setItem('users', JSON.stringify(demoUsers))
    console.log('Demo data initialized successfully')
  }
}

export const getDemoCredentials = () => ({
  email: 'demo@agrotech.com',
  password: 'demo123',
  fullName: 'Demo Farmer',
  username: 'demo'
})
